import { useState, useEffect, useCallback } from 'react';

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  location: 'interior' | 'patio' | 'terraza' | 'privado';
}

export interface Reservation {
  id: number;
  tableId: number;
  tableNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  adults: number;
  children: number;
  babies: number;
  zone?: string;
  table?: string;
  consumptionType?: string;
  specialRequests?: string;
}

// Configuración inicial de mesas
const INITIAL_TABLES: Table[] = [
  { id: 1, number: 1, capacity: 2, status: 'available', location: 'interior' },
  { id: 2, number: 2, capacity: 4, status: 'available', location: 'interior' },
  { id: 3, number: 3, capacity: 4, status: 'available', location: 'patio' },
  { id: 4, number: 4, capacity: 6, status: 'available', location: 'patio' },
  { id: 5, number: 5, capacity: 8, status: 'available', location: 'terraza' },
  { id: 6, number: 6, capacity: 2, status: 'available', location: 'terraza' },
  { id: 7, number: 7, capacity: 4, status: 'available', location: 'privado' },
  { id: 8, number: 8, capacity: 6, status: 'available', location: 'privado' },
  { id: 9, number: 9, capacity: 10, status: 'available', location: 'privado' },
  { id: 10, number: 10, capacity: 12, status: 'available', location: 'privado' },
];

// Mapeo de zonas del wizard a ubicaciones de mesas
const ZONE_TO_LOCATION_MAP: Record<string, string> = {
  'terraza': 'terraza',
  'interior': 'interior',
  'privado': 'privado',
  'patio': 'patio'
};

// Mapeo de IDs de mesas del wizard a IDs reales
const WIZARD_TABLE_TO_REAL_TABLE: Record<string, number> = {
  // Terraza
  'T1': 5,
  'T2': 6,
  // Interior
  'I1': 1,
  'I2': 2,
  'I3': 7,  // Mesa 7 (interior/privado)
  'I4': 8,  // Mesa 8 (interior/privado)
  'I5': 1,  // Volver a mesa 1 si es necesario
  // Privado
  'P1': 9,
  'P2': 10,
  // Patio
  'PT1': 3,
  'PT2': 4,
};

export function useTablesManager() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const updateTablesStatus = useCallback((baseTables: Table[], currentReservations: Reservation[]): Table[] => {
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];
    const currentTime = currentDate.toTimeString().slice(0, 5);

    return baseTables.map(table => {
      // Buscar reservas para esta mesa
      const tableReservations = currentReservations.filter(res => res.tableId === table.id);
      
      // Verificar si hay reserva activa (hoy y en horario actual o futuro)
      const hasActiveReservation = tableReservations.some(res => {
        const resDate = res.date;
        const resTime = res.time;
        
        if (resDate === today) {
          return resTime >= currentTime;
        } else if (resDate > today) {
          return true;
        }
        return false;
      });

      // Verificar si hay reserva para hoy en horario pasado (mesa ocupada)
      const hasCurrentReservation = tableReservations.some(res => {
        const resDate = res.date;
        const resTime = res.time;
        
        if (resDate === today) {
          const resDateTime = new Date(`${resDate}T${resTime}`);
          const currentDateTime = new Date();
          const timeDiff = (currentDateTime.getTime() - resDateTime.getTime()) / (1000 * 60);
          
          // Si la reserva fue hace menos de 2 horas, considerar mesa ocupada
          return timeDiff >= 0 && timeDiff <= 120;
        }
        return false;
      });

      if (hasCurrentReservation) {
        return { ...table, status: 'occupied' as const };
      } else if (hasActiveReservation) {
        return { ...table, status: 'reserved' as const };
      } else {
        return { ...table, status: 'available' as const };
      }
    });
  }, []);

  const loadTablesAndReservations = useCallback(() => {
    // Cargar reservas del localStorage
    const storedReservations = localStorage.getItem('reservations');
    const loadedReservations: Reservation[] = storedReservations ? JSON.parse(storedReservations) : [];
    setReservations(loadedReservations);

    // Actualizar estado de mesas basado en reservas
    const updatedTables = updateTablesStatus(INITIAL_TABLES, loadedReservations);
    setTables(updatedTables);

    // Guardar mesas actualizadas
    localStorage.setItem('tables', JSON.stringify(updatedTables));
  }, [updateTablesStatus]);

  // Cargar datos iniciales
  useEffect(() => {
    loadTablesAndReservations();
  }, [loadTablesAndReservations]);

  // Escuchar cambios en localStorage para sincronizar entre páginas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'reservations' || e.key === 'tables') {
        loadTablesAndReservations();
      }
    };

    const handleReservationUpdate = (e: CustomEvent) => {
      setReservations(e.detail.reservations);
      setTables(e.detail.tables);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('reservationUpdated', handleReservationUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reservationUpdated', handleReservationUpdate as EventListener);
    };
  }, [loadTablesAndReservations]);

  // Obtener mesas disponibles para una zona específica y número de huéspedes
  const getAvailableTablesForZone = useCallback((zone: string, guestCount: number, selectedDate: string, selectedTime: string): Table[] => {
    const location = ZONE_TO_LOCATION_MAP[zone];
    if (!location) return [];

    return tables.filter(table => {
      // Filtrar por ubicación
      if (table.location !== location) return false;
      
      // Filtrar por capacidad
      if (table.capacity < guestCount) return false;
      
      // Verificar disponibilidad para la fecha y hora específica
      return isTableAvailableForDateTime(table.id, selectedDate, selectedTime);
    });
  }, [tables]);

  // Verificar si una mesa está disponible para una fecha y hora específica
  const isTableAvailableForDateTime = useCallback((tableId: number, date: string, time: string): boolean => {
    const tableReservations = reservations.filter(res => res.tableId === tableId);
    
    return !tableReservations.some(res => {
      if (res.date !== date) return false;
      
      // Verificar conflicto de horarios (asumiendo 2 horas por reserva)
      const resTime = res.time;
      const resDateTime = new Date(`${date}T${resTime}`);
      const newDateTime = new Date(`${date}T${time}`);
      
      const timeDiff = Math.abs(newDateTime.getTime() - resDateTime.getTime()) / (1000 * 60); // en minutos
      
      // Si hay menos de 2 horas de diferencia, hay conflicto
      return timeDiff < 120;
    });
  }, [reservations]);

  // Convertir ID de mesa del wizard a ID real
  const getTableIdFromWizardId = useCallback((wizardTableId: string): number | null => {
    return WIZARD_TABLE_TO_REAL_TABLE[wizardTableId] || null;
  }, []);

  // Agregar nueva reserva y actualizar estado de mesas
  const addReservation = useCallback((reservationData: any) => {
    // Si viene directamente con tableId (desde página de Reservations)
    let tableId = reservationData.tableId;
    
    // Si viene con table (ID del wizard), convertir
    if (!tableId && reservationData.table) {
      tableId = getTableIdFromWizardId(reservationData.table);
    }
    
    if (!tableId) {
      console.error('No se pudo encontrar la mesa:', reservationData.table || reservationData.tableId);
      return false;
    }

    const table = tables.find(t => t.id === tableId);
    if (!table) {
      console.error('Mesa no encontrada:', tableId);
      return false;
    }

    const newReservation: Reservation = {
      id: Date.now(),
      tableId: tableId,
      tableNumber: table.number,
      customerName: reservationData.customerName,
      customerEmail: reservationData.customerEmail,
      customerPhone: reservationData.customerPhone,
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests || (reservationData.adults + reservationData.children + reservationData.babies),
      adults: reservationData.adults,
      children: reservationData.children,
      babies: reservationData.babies,
      zone: reservationData.zone,
      table: reservationData.table,
      consumptionType: reservationData.consumptionType,
      specialRequests: reservationData.specialRequests
    };

    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    
    // Actualizar estado de mesas
    const updatedTables = updateTablesStatus(INITIAL_TABLES, updatedReservations);
    setTables(updatedTables);
    
    // Guardar en localStorage
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    localStorage.setItem('tables', JSON.stringify(updatedTables));
    
    // Disparar evento personalizado para notificar a otras páginas
    window.dispatchEvent(new CustomEvent('reservationUpdated', { 
      detail: { reservations: updatedReservations, tables: updatedTables } 
    }));
    
    return true;
  }, [tables, reservations, updateTablesStatus, getTableIdFromWizardId]);

  // Eliminar reserva y actualizar estado de mesas
  const removeReservation = useCallback((reservationId: number) => {
    const updatedReservations = reservations.filter(res => res.id !== reservationId);
    setReservations(updatedReservations);
    
    // Actualizar estado de mesas
    const updatedTables = updateTablesStatus(INITIAL_TABLES, updatedReservations);
    setTables(updatedTables);
    
    // Guardar en localStorage
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    localStorage.setItem('tables', JSON.stringify(updatedTables));
  }, [reservations, updateTablesStatus]);

  // Refrescar datos (útil para actualizaciones periódicas)
  const refreshData = useCallback(() => {
    loadTablesAndReservations();
  }, [loadTablesAndReservations]);

  return {
    tables,
    reservations,
    getAvailableTablesForZone,
    getAvailableTablesForDateTime: (date: string, time: string, guestCount: number) => {
      return tables.filter(table => {
        if (table.capacity < guestCount) return false;
        return isTableAvailableForDateTime(table.id, date, time);
      });
    },
    isTableAvailableForDateTime,
    getTableIdFromWizardId,
    addReservation,
    removeReservation,
    refreshReservations: refreshData
  };
}