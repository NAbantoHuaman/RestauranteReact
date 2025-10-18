// Configuración centralizada del restaurante para evitar duplicaciones

export interface Zone {
  id: string;
  name: string;
  description: string;
  icon: string;
  tables: Table[];
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  type: string;
  realId: number | string;
}

export interface ConsumptionType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Configuración de zonas del restaurante
export const RESTAURANT_ZONES: Zone[] = [
  {
    id: 'terraza',
    name: 'Terraza',
    description: 'Ambiente al aire libre con vista panorámica',
    icon: '🌿',
    tables: [
      { id: 'T1', name: 'Mesa T1', capacity: 4, type: 'Cuadrada', realId: 5 },
      { id: 'T2', name: 'Mesa T2', capacity: 2, type: 'Redonda', realId: 6 }
    ]
  },
  {
    id: 'interior',
    name: 'Salón Interior',
    description: 'Ambiente climatizado y acogedor',
    icon: '🏠',
    tables: [
      { id: 'I1', name: 'Mesa I1', capacity: 2, type: 'Redonda', realId: 1 },
      { id: 'I2', name: 'Mesa I2', capacity: 4, type: 'Cuadrada', realId: 2 }
    ]
  },
  {
    id: 'patio',
    name: 'Patio',
    description: 'Espacio semi-abierto con ambiente natural',
    icon: '🌳',
    tables: [
      { id: 'PT1', name: 'Mesa PT1', capacity: 4, type: 'Cuadrada', realId: 3 },
      { id: 'PT2', name: 'Mesa PT2', capacity: 6, type: 'Rectangular', realId: 4 }
    ]
  },
  {
    id: 'privado',
    name: 'Salón Privado',
    description: 'Espacio exclusivo para eventos especiales',
    icon: '👑',
    tables: [
      { id: 'P1', name: 'Mesa P1', capacity: 10, type: 'Ovalada', realId: 9 },
      { id: 'P2', name: 'Mesa P2', capacity: 12, type: 'Rectangular', realId: 10 }
    ]
  }
];

// Configuración de tipos de consumo
export const CONSUMPTION_TYPES: ConsumptionType[] = [
  { id: 'almuerzo', name: 'Almuerzo', description: 'Menú del día y carta completa', icon: '🍽️' },
  { id: 'cena', name: 'Cena', description: 'Carta completa y menú degustación', icon: '🌙' },
  { id: 'bebidas', name: 'Solo Bebidas', description: 'Cócteles, vinos y aperitivos', icon: '🍷' },
  { id: 'evento', name: 'Evento Especial', description: 'Celebraciones y ocasiones especiales', icon: '🎉' }
];

// Función helper para obtener el nombre de una zona
export const getZoneName = (zoneId: string): string => {
  const zone = RESTAURANT_ZONES.find(z => z.id === zoneId);
  return zone?.name || 'Zona desconocida';
};

// Función helper para obtener el nombre de un tipo de consumo
export const getConsumptionTypeName = (typeId: string): string => {
  const type = CONSUMPTION_TYPES.find(t => t.id === typeId);
  return type?.name || 'Tipo desconocido';
};