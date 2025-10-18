import { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Calendar, Clock, MapPin, User } from 'lucide-react';
import { useTablesManager } from '../hooks/useTablesManager';

interface WizardProps {
  onClose: () => void;
  onComplete: (reservationData: any) => void;
}

interface ReservationData {
  adults: number;
  children: number;
  babies: number;
  date: string;
  time: string;
  tableId: string;
  zone?: string;
  table?: string;
  consumptionType?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  acceptTerms?: boolean;
}

const STEPS = [
  { id: 1, title: 'Personas', icon: Users, description: 'Elige la cantidad de personas' },
  { id: 2, title: 'Fecha', icon: Calendar, description: 'Selecciona la fecha' },
  { id: 3, title: 'Hora', icon: Clock, description: 'Elige el horario' },
  { id: 4, title: 'Zona y Tipo de consumo', icon: MapPin, description: 'Selecciona tu mesa' },
  { id: 5, title: 'Tus datos', icon: User, description: 'Información de contacto' }
];

export default function ReservationWizard({ onClose, onComplete }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState<ReservationData>({
    adults: 1,
    children: 0,
    babies: 0,
    date: '',
    time: '',
    tableId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  // Integrar el hook de gestión de mesas
  const { 
    tables, 
    getAvailableTablesForZone, 
    isTableAvailableForDateTime, 
    addReservation 
  } = useTablesManager();

  const updateReservationData = (data: Partial<ReservationData>) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return reservationData.adults > 0;
      case 2:
        return reservationData.date !== '';
      case 3:
        return reservationData.time !== '';
      case 4:
        return reservationData.zone !== '' && reservationData.table !== '' && reservationData.consumptionType !== '';
      case 5:
          return reservationData.customerName !== '' && 
                 reservationData.customerEmail !== '' && 
                 reservationData.customerPhone !== '' &&
                 (reservationData.acceptTerms || false);
      default:
        return false;
    }
  };

  const handleComplete = () => {
    if (canProceed()) {
      // Usar el hook para agregar la reserva
      const success = addReservation(reservationData);
      if (success) {
        onComplete(reservationData);
      } else {
        alert('Error al crear la reserva. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl shadow-2xl max-h-[95vh] flex flex-col mx-2 sm:mx-4">
        {/* Header con progreso */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Nueva Reserva</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Indicador de progreso */}
          <div className="flex items-center space-x-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : isCompleted 
                        ? 'bg-white bg-opacity-10 text-white' 
                        : 'text-white text-opacity-60'
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-white text-opacity-60" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contenido del paso actual */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 min-h-[500px]">
            {currentStep === 1 && (
              <StepPersonas 
                data={reservationData} 
                onUpdate={updateReservationData} 
              />
            )}
            {currentStep === 2 && (
              <StepFecha 
                data={reservationData} 
                onUpdate={updateReservationData} 
              />
            )}
            {currentStep === 3 && (
              <StepHora 
                data={reservationData} 
                onUpdate={updateReservationData}
                tables={tables}
                isTableAvailableForDateTime={isTableAvailableForDateTime}
              />
            )}
            {currentStep === 4 && (
              <StepZona 
                data={reservationData} 
                onUpdate={updateReservationData}
                getAvailableTablesForZone={getAvailableTablesForZone}
                isTableAvailableForDateTime={isTableAvailableForDateTime}
              />
            )}
            {currentStep === 5 && (
              <StepDatos 
                data={reservationData} 
                onUpdate={updateReservationData} 
              />
            )}
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-t border-neutral-200 flex-shrink-0 bg-white">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="text-xs sm:text-sm text-neutral-500">
            Paso {currentStep} de {STEPS.length}
          </div>

          {currentStep < STEPS.length ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all ${
                canProceed()
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span className="sm:hidden">Sig.</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed()}
              className={`px-4 sm:px-8 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                canProceed()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span className="hidden sm:inline">Confirmar Reserva</span>
              <span className="sm:hidden">Confirmar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componentes para cada paso
function StepPersonas({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const totalGuests = data.adults + data.children + data.babies;
  const maxGuests = 8;

  const updateCount = (type: 'adults' | 'children' | 'babies', increment: boolean) => {
    const currentValue = data[type];
    let newValue = increment ? currentValue + 1 : currentValue - 1;
    
    // Validaciones
    if (type === 'adults' && newValue < 1) newValue = 1; // Mínimo 1 adulto
    if (newValue < 0) newValue = 0;
    
    // Verificar límite total
    const newTotal = type === 'adults' 
      ? newValue + data.children + data.babies
      : type === 'children'
        ? data.adults + newValue + data.babies
        : data.adults + data.children + newValue;
    
    if (newTotal > maxGuests) return;
    
    onUpdate({ [type]: newValue });
  };

  const PersonCounter = ({ 
    title, 
    subtitle, 
    count, 
    type 
  }: { 
    title: string; 
    subtitle: string; 
    count: number; 
    type: 'adults' | 'children' | 'babies' 
  }) => (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h4 className="text-lg font-semibold text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-600">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => updateCount(type, false)}
            disabled={(type === 'adults' && count <= 1) || count <= 0}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
              (type === 'adults' && count <= 1) || count <= 0
                ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                : 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
            }`}
          >
            −
          </button>
          <span className="text-xl font-bold text-neutral-900 w-8 text-center">{count}</span>
          <button
            onClick={() => updateCount(type, true)}
            disabled={totalGuests >= maxGuests}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
              totalGuests >= maxGuests
                ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                : 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
            }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Elige la cantidad de personas</h3>
        <p className="text-neutral-600">* Bebés y niños deben ser incluidos en la cantidad de personas</p>
      </div>

      <div className="space-y-4 mb-8">
        <PersonCounter
          title="Adultos"
          subtitle="13 años en adelante"
          count={data.adults}
          type="adults"
        />
        <PersonCounter
          title="Niños"
          subtitle="2-12 años"
          count={data.children}
          type="children"
        />
        <PersonCounter
          title="Bebés"
          subtitle="0-23 meses"
          count={data.babies}
          type="babies"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-amber-800">
          <span className="font-semibold">Total: {totalGuests} persona{totalGuests !== 1 ? 's' : ''}</span>
          {totalGuests >= maxGuests && (
            <span className="block text-sm mt-1">Máximo {maxGuests} personas por reserva</span>
          )}
        </p>
      </div>
    </div>
  );
}

function StepFecha({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2); // Permitir reservas hasta 2 meses adelante

  // Generar fechas disponibles (próximos 60 días, excluyendo algunos días como ejemplo)
  const generateAvailableDates = () => {
    const dates = [];
    const current = new Date(today);
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(current);
      date.setDate(current.getDate() + i);
      
      // Excluir algunos días como ejemplo (puedes personalizar esta lógica)
      const dayOfWeek = date.getDay();
      const isAvailable = dayOfWeek !== 1; // Excluir lunes como ejemplo
      
      if (isAvailable) {
        dates.push({
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }),
          dayNumber: date.getDate(),
          monthName: date.toLocaleDateString('es-ES', { month: 'long' }),
          isToday: date.toDateString() === today.toDateString(),
          isTomorrow: date.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString()
        });
      }
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  const formatDateDisplay = (dateInfo: any) => {
    if (dateInfo.isToday) return 'Hoy';
    if (dateInfo.isTomorrow) return 'Mañana';
    return `${dateInfo.dayName.charAt(0).toUpperCase() + dateInfo.dayName.slice(1)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Selecciona la fecha</h3>
        <p className="text-neutral-600">Elige el día para tu reserva</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {availableDates.map((dateInfo) => (
          <button
            key={dateInfo.date}
            onClick={() => onUpdate({ date: dateInfo.date })}
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
              data.date === dateInfo.date
                ? 'border-amber-600 bg-amber-50 text-amber-900'
                : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-300'
            }`}
          >
            <div className="text-center">
              <div className={`text-sm font-medium mb-1 ${
                data.date === dateInfo.date ? 'text-amber-700' : 'text-neutral-600'
              }`}>
                {formatDateDisplay(dateInfo)}
              </div>
              <div className={`text-2xl font-bold mb-1 ${
                data.date === dateInfo.date ? 'text-amber-900' : 'text-neutral-900'
              }`}>
                {dateInfo.dayNumber}
              </div>
              <div className={`text-xs ${
                data.date === dateInfo.date ? 'text-amber-700' : 'text-neutral-500'
              }`}>
                {dateInfo.monthName}
              </div>
            </div>
          </button>
        ))}
      </div>

      {data.date && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800">
            <span className="font-semibold">Fecha seleccionada: </span>
            {availableDates.find(d => d.date === data.date)?.dayName} {' '}
            {availableDates.find(d => d.date === data.date)?.dayNumber} de {' '}
            {availableDates.find(d => d.date === data.date)?.monthName}
          </p>
        </div>
      )}
    </div>
  );
}

function StepHora({ data, onUpdate, tables, isTableAvailableForDateTime }: { 
  data: ReservationData; 
  onUpdate: (data: Partial<ReservationData>) => void;
  tables: any[];
  isTableAvailableForDateTime: (tableId: number, date: string, time: string) => boolean;
}) {
  const timeSlots = [
    { time: '12:00', label: '12:00 PM', period: 'Almuerzo' },
    { time: '12:30', label: '12:30 PM', period: 'Almuerzo' },
    { time: '13:00', label: '1:00 PM', period: 'Almuerzo' },
    { time: '13:30', label: '1:30 PM', period: 'Almuerzo' },
    { time: '14:00', label: '2:00 PM', period: 'Almuerzo' },
    { time: '14:30', label: '2:30 PM', period: 'Almuerzo' },
    { time: '19:00', label: '7:00 PM', period: 'Cena' },
    { time: '19:30', label: '7:30 PM', period: 'Cena' },
    { time: '20:00', label: '8:00 PM', period: 'Cena' },
    { time: '20:30', label: '8:30 PM', period: 'Cena' },
    { time: '21:00', label: '9:00 PM', period: 'Cena' },
    { time: '21:30', label: '9:30 PM', period: 'Cena' },
    { time: '22:00', label: '10:00 PM', period: 'Cena' }
  ];

  // Verificar disponibilidad real basada en reservas existentes
  const getAvailability = (time: string) => {
    // Si no hay fecha seleccionada, mostrar todos los horarios como disponibles
    if (!data.date) return true;
    
    // Verificar si hay alguna mesa disponible para esta fecha y hora
    // Si al menos una mesa está disponible, el horario está disponible
    const availableTablesForTime = tables.filter(table => 
      isTableAvailableForDateTime(table.id, data.date!, time)
    );
    
    return availableTablesForTime.length > 0;
  };

  const lunchSlots = timeSlots.filter(slot => slot.period === 'Almuerzo');
  const dinnerSlots = timeSlots.filter(slot => slot.period === 'Cena');

  const TimeSlotButton = ({ slot }: { slot: any }) => {
    const isAvailable = getAvailability(slot.time);
    const isSelected = data.time === slot.time;

    return (
      <button
        onClick={() => isAvailable && onUpdate({ time: slot.time })}
        disabled={!isAvailable}
        className={`p-4 rounded-xl border-2 transition-all ${
          !isAvailable
            ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : isSelected
              ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-md'
              : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-300 hover:shadow-md'
        }`}
      >
        <div className="text-center">
          <div className={`text-lg font-bold mb-1 ${
            !isAvailable ? 'text-neutral-400' : isSelected ? 'text-amber-900' : 'text-neutral-900'
          }`}>
            {slot.label}
          </div>
          {!isAvailable && (
            <div className="text-xs text-red-500">No disponible</div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Elige el horario</h3>
        <p className="text-neutral-600">Selecciona la hora para tu reserva</p>
      </div>

      <div className="space-y-8">
        {/* Horarios de Almuerzo */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            Almuerzo
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {lunchSlots.map((slot) => (
              <TimeSlotButton key={slot.time} slot={slot} />
            ))}
          </div>
        </div>

        {/* Horarios de Cena */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
            Cena
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {dinnerSlots.map((slot) => (
              <TimeSlotButton key={slot.time} slot={slot} />
            ))}
          </div>
        </div>
      </div>

      {data.time && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800">
            <span className="font-semibold">Horario seleccionado: </span>
            {timeSlots.find(slot => slot.time === data.time)?.label} - {' '}
            {timeSlots.find(slot => slot.time === data.time)?.period}
          </p>
        </div>
      )}
    </div>
  );
}

import { RESTAURANT_ZONES, CONSUMPTION_TYPES, getZoneName, getConsumptionTypeName } from '../config/restaurantConfig';

function StepZona({ 
  data, 
  onUpdate, 
  getAvailableTablesForZone, 
  isTableAvailableForDateTime 
}: { 
  data: ReservationData; 
  onUpdate: (data: Partial<ReservationData>) => void;
  getAvailableTablesForZone: (zone: string, guestCount: number, selectedDate: string, selectedTime: string) => any[];
  isTableAvailableForDateTime: (tableId: number, date: string, time: string) => boolean;
}) {

  const totalGuests = (data.adults || 1) + (data.children || 0) + (data.babies || 0);
  const selectedZone = RESTAURANT_ZONES.find(zone => zone.id === data.zone);
  
  // Obtener mesas disponibles usando el hook real
  const availableTables = selectedZone?.tables.filter(table => {
    // Verificar capacidad
    if (table.capacity < totalGuests) return false;
    
    // Verificar disponibilidad real si tenemos fecha y hora
    if (data.date && data.time && table.realId) {
      return isTableAvailableForDateTime(table.realId as number, data.date, data.time);
    }
    
    return true;
  }) || [];

  // Función para verificar disponibilidad de mesa específica
  const getTableAvailability = (table: any) => {
    if (!data.date || !data.time || !table.realId) {
      return true; // Si no hay fecha/hora seleccionada, mostrar como disponible
    }
    return isTableAvailableForDateTime(table.realId, data.date, data.time);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Elige zona y tipo de consumo</h3>
        <p className="text-neutral-600">Selecciona el ambiente y el tipo de experiencia que prefieres</p>
      </div>

      <div className="space-y-8">
        {/* Selección de Zona */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4">Zona del restaurante</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RESTAURANT_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => onUpdate({ zone: zone.id, table: '' })}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  data.zone === zone.id
                    ? 'border-amber-600 bg-amber-50 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="text-3xl mb-3">{zone.icon}</div>
                <h5 className={`text-lg font-bold mb-2 ${
                  data.zone === zone.id ? 'text-amber-900' : 'text-neutral-900'
                }`}>
                  {zone.name}
                </h5>
                <p className={`text-sm ${
                  data.zone === zone.id ? 'text-amber-700' : 'text-neutral-600'
                }`}>
                  {zone.description}
                </p>
                <div className={`text-xs mt-2 ${
                  data.zone === zone.id ? 'text-amber-600' : 'text-neutral-500'
                }`}>
                  {zone.tables.length} mesas disponibles
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selección de Mesa */}
        {data.zone && (
          <div>
            <h4 className="text-xl font-semibold text-neutral-900 mb-4">
              Mesas disponibles en {selectedZone?.name}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableTables.map((table) => {
                const isAvailable = getTableAvailability(table);
                const isSelected = data.table === table.id;
                
                return (
                  <button
                    key={table.id}
                    onClick={() => isAvailable && onUpdate({ table: table.id })}
                    disabled={!isAvailable}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      !isAvailable
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : isSelected
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-md'
                          : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`font-bold mb-1 ${
                        !isAvailable ? 'text-neutral-400' : isSelected ? 'text-amber-900' : 'text-neutral-900'
                      }`}>
                        {table.name}
                      </div>
                      <div className={`text-xs mb-1 ${
                        !isAvailable ? 'text-neutral-400' : isSelected ? 'text-amber-700' : 'text-neutral-600'
                      }`}>
                        {table.type}
                      </div>
                      <div className={`text-xs ${
                        !isAvailable ? 'text-neutral-400' : isSelected ? 'text-amber-600' : 'text-neutral-500'
                      }`}>
                        Hasta {table.capacity} personas
                      </div>
                      {!isAvailable && (
                        <div className="text-xs text-red-500 mt-1">Ocupada</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {availableTables.length === 0 && (
              <div className="text-center py-8 text-neutral-500">
                No hay mesas disponibles para {totalGuests} personas en esta zona.
                <br />
                Por favor, selecciona otra zona.
              </div>
            )}
          </div>
        )}

        {/* Tipo de Consumo */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4">Tipo de consumo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONSUMPTION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onUpdate({ consumptionType: type.id })}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  data.consumptionType === type.id
                    ? 'border-amber-600 bg-amber-50 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <h5 className={`font-bold mb-1 ${
                  data.consumptionType === type.id ? 'text-amber-900' : 'text-neutral-900'
                }`}>
                  {type.name}
                </h5>
                <p className={`text-xs ${
                  data.consumptionType === type.id ? 'text-amber-700' : 'text-neutral-600'
                }`}>
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de selección */}
      {(data.zone || data.consumptionType) && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h5 className="font-semibold text-amber-900 mb-2">Selección actual:</h5>
          <div className="text-amber-800 space-y-1">
            {data.zone && (
              <p><span className="font-medium">Zona:</span> {selectedZone?.name}</p>
            )}
            {data.table && (
              <p><span className="font-medium">Mesa:</span> {availableTables.find(t => t.id === data.table)?.name} ({availableTables.find(t => t.id === data.table)?.type})</p>
            )}
            {data.consumptionType && (
              <p><span className="font-medium">Tipo de consumo:</span> {CONSUMPTION_TYPES.find(t => t.id === data.consumptionType)?.name}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StepDatos({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'customerName':
        if (!value.trim()) {
          newErrors.customerName = 'El nombre es obligatorio';
        } else if (value.trim().length < 2) {
          newErrors.customerName = 'El nombre debe tener al menos 2 caracteres';
        } else {
          delete newErrors.customerName;
        }
        break;
      case 'customerEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.customerEmail = 'El email es obligatorio';
        } else if (!emailRegex.test(value)) {
          newErrors.customerEmail = 'Ingresa un email válido';
        } else {
          delete newErrors.customerEmail;
        }
        break;
      case 'customerPhone':
        if (!value.trim()) {
          newErrors.customerPhone = 'El teléfono es obligatorio';
        } else if (value.trim().length < 8) {
          newErrors.customerPhone = 'El teléfono debe tener al menos 8 dígitos';
        } else {
          delete newErrors.customerPhone;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
    validateField(field, value);
  };

  const totalGuests = (data.adults || 1) + (data.children || 0) + (data.babies || 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Tus datos</h3>
        <p className="text-neutral-600">Completa la información para confirmar tu reserva</p>
      </div>

      {/* Resumen de la reserva */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-amber-900 mb-4">Resumen de tu reserva</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-amber-800">
              <span className="font-medium">Personas:</span> {totalGuests} 
              {data.adults && ` (${data.adults} adultos`}
              {data.children && data.children > 0 && `, ${data.children} niños`}
              {data.babies && data.babies > 0 && `, ${data.babies} bebés`}
              {data.adults && ')'}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Fecha:</span> {data.date ? new Date(data.date).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'No seleccionada'}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Hora:</span> {data.time || 'No seleccionada'}
            </p>
          </div>
          <div>
            <p className="text-amber-800">
              <span className="font-medium">Zona:</span> {getZoneName(data.zone || '')}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Mesa:</span> {data.table || 'No seleccionada'}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">Tipo:</span> {getConsumptionTypeName(data.consumptionType || '')}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de datos */}
      <div className="space-y-6">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-neutral-700 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="customerName"
            value={data.customerName || ''}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.customerName ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder="Ingresa tu nombre completo"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-neutral-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="customerEmail"
            value={data.customerEmail || ''}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.customerEmail ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder="tu@email.com"
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-neutral-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            id="customerPhone"
            value={data.customerPhone || ''}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.customerPhone ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder="+1 234 567 8900"
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
          )}
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-neutral-700 mb-2">
            Solicitudes especiales (opcional)
          </label>
          <textarea
            id="specialRequests"
            value={data.specialRequests || ''}
            onChange={(e) => onUpdate({ specialRequests: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
            placeholder="Alergias, celebraciones especiales, preferencias de mesa, etc."
          />
        </div>

        {/* Términos y condiciones */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={data.acceptTerms || false}
            onChange={(e) => onUpdate({ acceptTerms: e.target.checked })}
            className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-neutral-300 rounded"
          />
          <label htmlFor="acceptTerms" className="text-sm text-neutral-700">
            Acepto los{' '}
            <a href="#" className="text-amber-600 hover:text-amber-700 underline">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-amber-600 hover:text-amber-700 underline">
              política de privacidad
            </a>
            *
          </label>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <ul className="space-y-1 text-xs">
              <li>• Recibirás un email de confirmación en los próximos minutos</li>
              <li>• Las reservas se confirman sujetas a disponibilidad</li>
              <li>• Puedes cancelar o modificar tu reserva hasta 2 horas antes</li>
              <li>• Para grupos de más de 8 personas, contacta directamente al restaurante</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}