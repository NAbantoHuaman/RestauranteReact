# 🍽️ Sistema de Reservas - Restaurante Bella Vista

Una aplicación web moderna para la gestión de reservas de restaurante, desarrollada con React, TypeScript y Tailwind CSS.

## 📋 Descripción

**Bella Vista** es un sistema completo de gestión de reservas para restaurantes que permite a los clientes realizar reservas online y al personal administrar las mesas y reservas de manera eficiente. La aplicación ofrece una experiencia de usuario intuitiva con un diseño moderno y responsivo.

## ✨ Características Principales

### 🎯 Para Clientes
- **Reservas Online**: Sistema de reservas paso a paso con wizard intuitivo
- **Selección de Zona**: 4 ambientes diferentes (Interior, Terraza, Patio, Salón Privado)
- **Gestión de Comensales**: Soporte para adultos, niños y bebés
- **Verificación en Tiempo Real**: Disponibilidad de mesas actualizada automáticamente
- **Tipos de Consumo**: Almuerzo, Cena, Solo Bebidas, Eventos Especiales
- **Interfaz Multiidioma**: Español e Inglés

### 🏪 Para el Restaurante
- **Dashboard de Reservas**: Vista completa de todas las reservas
- **Gestión de Mesas**: 10 mesas distribuidas en 4 zonas diferentes
- **Estados de Mesa**: Disponible, Ocupada, Reservada
- **Estadísticas en Tiempo Real**: Métricas de ocupación y reservas
- **Sistema de Conflictos**: Prevención automática de dobles reservas
- **Actualización Automática**: Sincronización cada 30 segundos

### 🍽️ Configuración del Restaurante
- **4 Zonas Disponibles**:
  - 🏠 **Salón Interior**: Ambiente climatizado (Mesas 1-2)
  - 🌳 **Patio**: Espacio semi-abierto (Mesas 3-4)
  - 🌿 **Terraza**: Vista panorámica (Mesas 5-6)
  - 👑 **Salón Privado**: Eventos especiales (Mesas 7-10)

- **Capacidades**: Desde 2 hasta 12 personas por mesa
- **Horarios**: Almuerzo (12:00-15:30) y Cena (19:00-22:30)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.5.3** - Tipado estático
- **Vite 7.1.10** - Herramienta de construcción y desarrollo
- **Tailwind CSS 3.4.1** - Framework de CSS utilitario
- **React Router DOM 7.9.4** - Enrutamiento

### Iconos y UI
- **Lucide React 0.344.0** - Iconos modernos
- **Diseño Responsivo** - Optimizado para móviles y desktop

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **TypeScript ESLint** - Reglas específicas para TypeScript
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📁 Estructura del Proyecto

```
Restaurante/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ReservationWizard.tsx
│   │   └── PersonSelector.tsx
│   ├── pages/              # Páginas principales
│   │   ├── Home.tsx        # Página de inicio
│   │   ├── Menu.tsx        # Carta del restaurante
│   │   ├── Tables.tsx      # Gestión de mesas
│   │   ├── Reservations.tsx # Dashboard de reservas
│   │   └── ReservationForm.tsx # Formulario de reservas
│   ├── hooks/              # Hooks personalizados
│   │   └── useTablesManager.ts # Lógica de gestión de mesas
│   ├── contexts/           # Contextos de React
│   │   └── LanguageContext.tsx # Internacionalización
│   ├── config/             # Configuraciones
│   │   └── restaurantConfig.ts # Config del restaurante
│   ├── styles/             # Estilos globales
│   ├── img/               # Imágenes y assets
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Punto de entrada
├── public/                # Archivos públicos
├── dist/                  # Build de producción
└── package.json           # Dependencias y scripts
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd RestauranteReact/Restaurante
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Vista previa del build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run typecheck    # Verifica tipos de TypeScript
```

## 🎨 Características de la UI

### Diseño Moderno
- **Gradientes y Sombras**: Efectos visuales modernos
- **Animaciones Suaves**: Transiciones de 300-500ms
- **Iconografía Consistente**: Lucide React icons
- **Tipografía Jerárquica**: Tamaños y pesos bien definidos

### Responsividad
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid Adaptativo**: Layouts que se ajustan automáticamente
- **Touch Friendly**: Botones y elementos táctiles optimizados

### Accesibilidad
- **Contraste Adecuado**: Cumple estándares WCAG
- **Navegación por Teclado**: Soporte completo
- **Etiquetas Semánticas**: HTML semántico
- **Estados de Focus**: Indicadores visuales claros

## 💾 Gestión de Datos

### LocalStorage
- **Persistencia Local**: Datos guardados en el navegador
- **Sincronización**: Actualización automática entre pestañas
- **Estructura de Datos**:
  ```typescript
  // Reservas
  reservations: Reservation[]
  
  // Mesas
  tables: Table[]
  ```

### Tipos de Datos Principales
```typescript
interface Reservation {
  id: number;
  tableId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  adults: number;
  children: number;
  babies: number;
}

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  location: 'interior' | 'patio' | 'terraza' | 'privado';
}
```

## 🔧 Configuración del Restaurante

### Zonas y Mesas
El archivo `src/config/restaurantConfig.ts` contiene toda la configuración:

```typescript
// Zonas disponibles
RESTAURANT_ZONES = [
  { id: 'interior', name: 'Salón Interior', ... },
  { id: 'patio', name: 'Patio', ... },
  { id: 'terraza', name: 'Terraza', ... },
  { id: 'privado', name: 'Salón Privado', ... }
]

// Tipos de consumo
CONSUMPTION_TYPES = [
  { id: 'almuerzo', name: 'Almuerzo', ... },
  { id: 'cena', name: 'Cena', ... },
  { id: 'bebidas', name: 'Solo Bebidas', ... },
  { id: 'evento', name: 'Evento Especial', ... }
]
```

## 🌐 Internacionalización

### Idiomas Soportados
- **Español (es)**: Idioma principal
- **Inglés (en)**: Idioma secundario

### Cambio de Idioma
```typescript
const { language, setLanguage, t } = useLanguage();

// Cambiar idioma
setLanguage('en');

// Usar traducciones
t('nav.home') // "Home" o "Inicio"
```

## 📱 Funcionalidades Avanzadas

### Sistema de Reservas Inteligente
- **Prevención de Conflictos**: No permite reservas en horarios ocupados
- **Margen de Seguridad**: 2 horas entre reservas de la misma mesa
- **Validación en Tiempo Real**: Verificación instantánea de disponibilidad

### Gestión de Estados
- **Estados Automáticos**: Las mesas cambian de estado según las reservas
- **Actualización Periódica**: Refresh cada 30 segundos
- **Sincronización**: Cambios reflejados en todas las pestañas abiertas

### Experiencia de Usuario
- **Wizard de Reservas**: Proceso guiado paso a paso
- **Feedback Visual**: Indicadores de estado y progreso
- **Validación de Formularios**: Mensajes de error claros
- **Confirmación de Acciones**: Modales de confirmación

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Archivos Generados
- `dist/index.html` - Página principal
- `dist/assets/` - CSS y JS optimizados
- Archivos con hash para cache busting

### Hosting Recomendado
- **Netlify**: Deploy automático desde Git
- **Vercel**: Optimizado para React
- **GitHub Pages**: Hosting gratuito
- **Firebase Hosting**: Integración con otros servicios

## 🤝 Contribución

### Guías de Desarrollo
1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Estándares de Código
- **ESLint**: Seguir las reglas configuradas
- **TypeScript**: Tipado estricto
- **Commits**: Mensajes descriptivos en español
- **Componentes**: Funcionales con hooks

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Restaurante Bella Vista**
- 📍 Dirección: Av. Principal 123, Miraflores
- 📞 Teléfono: +51 902291058
- 🕒 Horario: Lun - Dom: 12:00 PM - 11:00 PM

---

**Desarrollado con ❤️ para ofrecer la mejor experiencia gastronómica**