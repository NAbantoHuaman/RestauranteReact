import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    nav: {
      home: 'Inicio',
      menu: 'Carta',
      tables: 'Mesas',
      reservations: 'Reservas'
    },
    home: {
      hero: {
        title: 'Bella Vista',
        subtitle: 'Experiencia gastronómica excepcional en el corazón de la ciudad',
        reserveButton: 'Reservar Mesa',
        menuButton: 'Ver Carta'
      },
      welcome: {
        title: 'Bienvenidos a Bella Vista',
        description: 'Descubre nuestra propuesta gastronómica que combina técnicas tradicionales con toques contemporáneos, creando platos memorables que deleitan todos los sentidos'
      },
      features: {
        quality: {
          title: 'Calidad Premium',
          description: 'Ingredientes frescos y de la más alta calidad, seleccionados cuidadosamente por nuestros chefs.'
        },
        experience: {
          title: 'Experiencia Única',
          description: 'Cada visita es una experiencia memorable con atención personalizada y ambiente acogedor.'
        },
        atmosphere: {
          title: 'Ambiente Exclusivo',
          description: 'Un espacio elegante y sofisticado, perfecto para cualquier ocasión especial.'
        }
      },
      history: {
        title: 'Nuestra Historia',
        description1: 'Desde 2010, Bella Vista ha sido sinónimo de excelencia culinaria. Nuestro chef ejecutivo, con más de 20 años de experiencia internacional, lidera un equipo apasionado por crear experiencias gastronómicas únicas.',
        description2: 'Cada plato cuenta una historia, fusionando sabores tradicionales con técnicas innovadoras, utilizando ingredientes frescos de productores locales cuidadosamente seleccionados.'
      },
      info: {
        title: 'Información',
        address: {
          label: 'Dirección',
          value: 'Av. Principal 123, Miraflores'
        },
        hours: {
          label: 'Horario',
          value: 'Lun - Dom: 12:00 PM - 11:00 PM'
        },
        phone: {
          label: 'Teléfono',
          value: '+51 902291058'
        }
      }
    },
    menu: {
      title: 'Nuestra Carta',
      subtitle: 'Descubre nuestra selección de platos cuidadosamente preparados con ingredientes de primera calidad',
      categories: {
        all: 'Todo',
        entradas: 'Entradas',
        principales: 'Platos Principales',
        postres: 'Postres',
        bebidas: 'Bebidas'
      },
      items: {
        carpaccio: {
          name: 'Carpaccio de Res',
          description: 'Finas láminas de res con parmesano, rúcula y reducción de balsámico'
        },
        ceviche: {
          name: 'Ceviche Clásico',
          description: 'Pescado fresco marinado en limón con cebolla, ají y camote'
        },
        caesar: {
          name: 'Ensalada César Premium',
          description: 'Lechuga romana, croutons artesanales, parmesano y aderezo César'
        },
        lomo: {
          name: 'Lomo Saltado Premium',
          description: 'Jugoso lomo fino salteado con papas fritas y arroz blanco'
        },
        risotto: {
          name: 'Risotto de Hongos',
          description: 'Arroz arborio cremoso con hongos silvestres y trufa negra'
        },
        salmon: {
          name: 'Salmón a la Plancha',
          description: 'Filete de salmón con vegetales asados y salsa de alcaparras'
        },
        ossobuco: {
          name: 'Ossobuco',
          description: 'Osobuco de res braseado con puré de papas y gremolata'
        },
        tiramisu: {
          name: 'Tiramisú Clásico',
          description: 'Postre italiano tradicional con mascarpone y café'
        },
        volcano: {
          name: 'Volcán de Chocolate',
          description: 'Bizcocho de chocolate con centro fundido y helado de vainilla'
        },
        cheesecake: {
          name: 'Cheesecake de Frutos Rojos',
          description: 'Suave cheesecake con coulis de frutos del bosque'
        },
        wine: {
          name: 'Vino Tinto Reserva',
          description: 'Copa de vino tinto selección especial'
        },
        pisco: {
          name: 'Pisco Sour',
          description: 'Cóctel peruano tradicional con pisco acholado'
        }
      }
    },
    tables: {
      title: 'Gestión de Mesas',
      updateButton: 'Actualizar Estado',
      filters: {
        title: 'Filtros',
        specificDate: 'Fecha específica:',
        showAll: 'Mostrar todas las reservas (incluidas pasadas)',
        clearFilters: 'Limpiar filtros'
      },
      locations: {
        interior: 'Salón Interior',
        terraza: 'Terraza',
        patio: 'Patio',
        privado: 'Salón Privado'
      },
      status: {
        available: 'Disponible',
        occupied: 'Ocupada',
        reserved: 'Reservada',
        unknown: 'Desconocido'
      },
      table: 'Mesa',
      capacity: 'Capacidad',
      location: 'Ubicación',
      people: 'personas',
      reservations: 'Reservas',
      noReservations: 'Sin reservas',
      upcoming: 'próximas',
      forSelectedDate: 'para la fecha seleccionada',
      summary: {
        title: 'Resumen de Estado',
        available: 'Disponibles',
        occupied: 'Ocupadas',
        reserved: 'Reservadas',
        total: 'Total'
      }
    },
    reservations: {
      title: 'Sistema de Reservas',
      subtitle: 'Gestiona las reservas del restaurante y evita conflictos de horarios',
      updateButton: 'Actualizar',
      newReservation: 'Nueva Reserva',
      statistics: 'Estadísticas',
      totalReservations: 'Total Reservas',
      availableTables: 'Mesas Disponibles',
      upcomingReservations: 'Próximas Reservas',
      calendar: 'Calendario de Reservas',
      noReservations: 'No hay reservas registradas. Crea tu primera reserva.',
      table: 'Mesa',
      people: 'personas',
      form: {
        date: 'Fecha',
        time: 'Hora',
        selectTime: 'Seleccionar hora',
        notAvailable: '(No disponible)',
        table: 'Mesa',
        selectTable: 'Seleccionar mesa',
        tableOption: 'Mesa {{number}} (Capacidad: {{capacity}} personas)',
        customerName: 'Nombre del Cliente',
        customerNamePlaceholder: 'Ej: Juan Pérez',
        email: 'Email',
        emailPlaceholder: 'juan@ejemplo.com',
        phone: 'Teléfono',
        phonePlaceholder: '999 888 777',
        cancel: 'Cancelar',
        createReservation: 'Crear Reserva'
      },
      errors: {
        allFieldsRequired: 'Todos los campos son obligatorios',
        tableNotFound: 'Mesa no encontrada',
        capacityExceeded: 'La mesa {{tableNumber}} solo tiene capacidad para {{capacity}} personas',
        alreadyReserved: 'Esta mesa ya está reservada para la fecha y hora seleccionadas'
      }
    },
    footer: {
      rights: '© 2024 Bella Vista. Todos los derechos reservados.',
      contact: 'Contacto',
      hours: 'Horarios',
      follow: 'Síguenos',
      phone: 'Teléfono',
      email: 'Email',
      location: 'Ubicación',
      viewOnMaps: 'Ver en Google Maps',
      hoursTitle: 'HORARIO DE ATENCIÓN',
      mondayToSaturday: 'Lunes a Sábado',
      sunday: 'Domingo',
      closed: 'Cerrado',
      note: 'Recomendamos hacer reservas con anticipación, especialmente para fines de semana.',
      restaurantName: 'Restaurante Bella Vista',
      description: 'Experiencia culinaria nikkei auténtica en el corazón de Miraflores',
      premiumCuisine: 'Cocina Nikkei Premium',
      freshIngredients: 'Ingredientes Frescos Diarios',
      familyAtmosphere: 'Ambiente Familiar',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio'
    }
  },
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      tables: 'Tables',
      reservations: 'Reservations'
    },
    home: {
      hero: {
        title: 'Bella Vista',
        subtitle: 'Exceptional gastronomic experience in the heart of the city',
        reserveButton: 'Reserve Table',
        menuButton: 'View Menu'
      },
      welcome: {
        title: 'Welcome to Bella Vista',
        description: 'Discover our gastronomic proposal that combines traditional techniques with contemporary touches, creating memorable dishes that delight all the senses'
      },
      features: {
        quality: {
          title: 'Premium Quality',
          description: 'Fresh ingredients of the highest quality, carefully selected by our chefs.'
        },
        experience: {
          title: 'Unique Experience',
          description: 'Each visit is a memorable experience with personalized attention and cozy atmosphere.'
        },
        atmosphere: {
          title: 'Exclusive Atmosphere',
          description: 'An elegant and sophisticated space, perfect for any special occasion.'
        }
      },
      history: {
        title: 'Our Story',
        description1: 'Since 2010, Bella Vista has been synonymous with culinary excellence. Our executive chef, with over 20 years of international experience, leads a passionate team to create unique gastronomic experiences.',
        description2: 'Each dish tells a story, fusing traditional flavors with innovative techniques, using fresh ingredients from carefully selected local producers.'
      },
      info: {
        title: 'Information',
        address: {
          label: 'Address',
          value: 'Av. Principal 123, Miraflores'
        },
        hours: {
          label: 'Hours',
          value: 'Mon - Sun: 12:00 PM - 11:00 PM'
        },
        phone: {
          label: 'Phone',
          value: '+51 902291058'
        }
      }
    },
    menu: {
      title: 'Our Menu',
      subtitle: 'Discover our selection of carefully prepared dishes with premium quality ingredients',
      categories: {
        all: 'All',
        entradas: 'Appetizers',
        principales: 'Main Courses',
        postres: 'Desserts',
        bebidas: 'Beverages'
      },
      items: {
        carpaccio: {
          name: 'Beef Carpaccio',
          description: 'Thin slices of beef with parmesan, arugula and balsamic reduction'
        },
        ceviche: {
          name: 'Classic Ceviche',
          description: 'Fresh fish marinated in lime with onion, chili and sweet potato'
        },
        caesar: {
          name: 'Premium Caesar Salad',
          description: 'Romaine lettuce, artisanal croutons, parmesan and Caesar dressing'
        },
        lomo: {
          name: 'Premium Lomo Saltado',
          description: 'Juicy fine beef stir-fried with french fries and white rice'
        },
        risotto: {
          name: 'Mushroom Risotto',
          description: 'Creamy arborio rice with wild mushrooms and black truffle'
        },
        salmon: {
          name: 'Grilled Salmon',
          description: 'Salmon fillet with roasted vegetables and caper sauce'
        },
        ossobuco: {
          name: 'Ossobuco',
          description: 'Braised beef ossobuco with mashed potatoes and gremolata'
        },
        tiramisu: {
          name: 'Classic Tiramisu',
          description: 'Traditional Italian dessert with mascarpone and coffee'
        },
        volcano: {
          name: 'Chocolate Volcano',
          description: 'Chocolate sponge cake with molten center and vanilla ice cream'
        },
        cheesecake: {
          name: 'Berry Cheesecake',
          description: 'Smooth cheesecake with forest berry coulis'
        },
        wine: {
          name: 'Reserve Red Wine',
          description: 'Glass of special selection red wine'
        },
        pisco: {
          name: 'Pisco Sour',
          description: 'Traditional Peruvian cocktail with acholado pisco'
        }
      }
    },
    tables: {
      title: 'Table Management',
      updateButton: 'Update Status',
      filters: {
        title: 'Filters',
        specificDate: 'Specific date:',
        showAll: 'Show all reservations (including past)',
        clearFilters: 'Clear filters'
      },
      locations: {
        interior: 'Interior Hall',
        terraza: 'Terrace',
        patio: 'Patio',
        privado: 'Private Hall'
      },
      status: {
        available: 'Available',
        occupied: 'Occupied',
        reserved: 'Reserved',
        unknown: 'Unknown'
      },
      table: 'Table',
      capacity: 'Capacity',
      location: 'Location',
      people: 'people',
      reservations: 'Reservations',
      noReservations: 'No reservations',
      upcoming: 'upcoming',
      forSelectedDate: 'for selected date',
      summary: {
        title: 'Status Summary',
        available: 'Available',
        occupied: 'Occupied',
        reserved: 'Reserved',
        total: 'Total'
      }
    },
    reservations: {
      title: 'Reservation System',
      subtitle: 'Manage restaurant reservations and avoid scheduling conflicts',
      updateButton: 'Update',
      newReservation: 'New Reservation',
      statistics: 'Statistics',
      totalReservations: 'Total Reservations',
      availableTables: 'Available Tables',
      upcomingReservations: 'Upcoming Reservations',
      calendar: 'Reservation Calendar',
      noReservations: 'No reservations registered. Create your first reservation.',
      table: 'Table',
      people: 'people',
      form: {
        date: 'Date',
        time: 'Time',
        selectTime: 'Select time',
        notAvailable: '(Not available)',
        table: 'Table',
        selectTable: 'Select Table',
        tableOption: 'Table {{number}} (Capacity: {{capacity}} people)',
        customerName: 'Customer Name',
        customerNamePlaceholder: 'e.g: John Doe',
        email: 'Email',
        emailPlaceholder: 'john@example.com',
        phone: 'Phone',
        phonePlaceholder: '999 888 777',
        cancel: 'Cancel',
        createReservation: 'Create Reservation'
      },
      errors: {
        allFieldsRequired: 'All fields are required',
        tableNotFound: 'Table not found',
        capacityExceeded: 'Table {{tableNumber}} only has capacity for {{capacity}} people',
        alreadyReserved: 'This table is already reserved for the selected date and time'
      }
    },
    footer: {
      rights: '© 2024 Bella Vista. All rights reserved.',
      contact: 'Contact',
      hours: 'Hours',
      follow: 'Follow Us',
      phone: 'Phone',
      email: 'Email',
      location: 'Location',
      viewOnMaps: 'View on Google Maps',
      hoursTitle: 'OPENING HOURS',
      mondayToSaturday: 'Monday to Saturday',
      sunday: 'Sunday',
      closed: 'Closed',
      note: 'We recommend making reservations in advance, especially for weekends.',
      restaurantName: 'Bella Vista Restaurant',
      description: 'Authentic nikkei culinary experience in the heart of Miraflores',
      premiumCuisine: 'Premium Nikkei Cuisine',
      freshIngredients: 'Fresh Daily Ingredients',
      familyAtmosphere: 'Family Atmosphere',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service'
    }
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string, variables?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    if (typeof value === 'string' && variables) {
      // Replace variables in the format {{variableName}}
      return value.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        return variables[variableName] !== undefined ? String(variables[variableName]) : match;
      });
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}