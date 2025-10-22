import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Phone, Mail, User, Plus, Minus, Check, ChevronLeft, ChevronRight, Info, CheckCircle } from 'lucide-react';
import { useTablesManager } from '../hooks/useTablesManager';
import { RESTAURANT_ZONES, CONSUMPTION_TYPES, getZoneName, getConsumptionTypeName } from '../config/restaurantConfig';

interface ReservationData {
  adults: number;
  children: number;
  babies: number;
  date: string;
  time: string;
  zone: string;
  table: string;
  consumptionType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  acceptTerms: boolean;
}

const STEPS = [
  { id: 'personas', title: 'Personas', description: 'Número de comensales' },
  { id: 'fecha', title: 'Fecha', description: 'Día de la reserva' },
  { id: 'hora', title: 'Hora', description: 'Horario preferido' },
  { id: 'zona', title: 'Zona', description: 'Mesa y ambiente' },
  { id: 'datos', title: 'Datos', description: 'Información personal' }
];

export default function ReservationForm() {
  const navigate = useNavigate();
  const { addReservation } = useTablesManager();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({
    adults: 2,
    children: 0,
    babies: 0,
    date: '',
    time: '',
    zone: '',
    table: '',
    consumptionType: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
    acceptTerms: false
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateReservationData = (data: Partial<ReservationData>) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'personas':
        return reservationData.adults > 0;
      case 'fecha':
        return reservationData.date !== '';
      case 'hora':
        return reservationData.time !== '';
      case 'zona':
        return reservationData.zone !== '' && reservationData.table !== '' && reservationData.consumptionType !== '';
      case 'datos':
        return reservationData.customerName !== '' && 
               reservationData.customerEmail !== '' && 
               reservationData.customerPhone !== '' &&
               reservationData.acceptTerms;
      default:
        return false;
    }
  };

  const getValidationMessage = () => {
    switch (STEPS[currentStep].id) {
      case 'personas':
        return reservationData.adults === 0 ? 'Debe seleccionar al menos 1 adulto' : '';
      case 'fecha':
        return reservationData.date === '' ? 'Debe seleccionar una fecha' : '';
      case 'hora':
        return reservationData.time === '' ? 'Debe seleccionar una hora' : '';
      case 'zona':
        if (reservationData.zone === '') return 'Debe seleccionar una zona';
        if (reservationData.table === '') return 'Debe seleccionar una mesa';
        if (reservationData.consumptionType === '') return 'Debe seleccionar un tipo de consumo';
        return '';
      case 'datos':
        if (reservationData.customerName === '') return 'Debe ingresar su nombre';
        if (reservationData.customerEmail === '') return 'Debe ingresar su email';
        if (reservationData.customerPhone === '') return 'Debe ingresar su teléfono';
        if (!reservationData.acceptTerms) return 'Debe aceptar los términos y condiciones';
        return '';
      default:
        return '';
    }
  };

  const handleComplete = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!reservationData.date || !reservationData.time || !reservationData.zone || 
        !reservationData.table || !reservationData.customerName || 
        !reservationData.customerEmail || !reservationData.customerPhone || 
        !reservationData.acceptTerms) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Intentar crear la reserva
      const success = addReservation(reservationData);
      
      if (success) {
        setShowSuccess(true);
        
        // Mostrar notificación de éxito por 2 segundos y luego redirigir
        setTimeout(() => {
          navigate('/reservations');
        }, 2000);
      } else {
        alert('Error al crear la reserva. Por favor intenta nuevamente.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Error al crear la reserva. Por favor intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case 'personas':
        return <StepPersonas data={reservationData} onUpdate={updateReservationData} />;
      case 'fecha':
        return <StepFecha data={reservationData} onUpdate={updateReservationData} />;
      case 'hora':
        return <StepHora data={reservationData} onUpdate={updateReservationData} />;
      case 'zona':
        return <StepZona data={reservationData} onUpdate={updateReservationData} />;
      case 'datos':
        return <StepDatos data={reservationData} onUpdate={updateReservationData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/reservations" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4"
          >
            ← Volver a Reservas
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Nueva Reserva</h1>
          <p className="text-neutral-600">Completa los siguientes pasos para realizar tu reserva</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-amber-600 border-amber-600 text-white' 
                    : 'bg-white border-neutral-300 text-neutral-400'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-amber-600' : 'text-neutral-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-neutral-500">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-amber-600' : 'bg-neutral-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0 || isSubmitting
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-600 text-white hover:bg-neutral-700'
            }`}
          >
            Anterior
          </button>

          {/* Validation Message */}
          <div className="flex-1 text-center">
            {!canProceed() && (
              <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-2 inline-block">
                {getValidationMessage()}
              </p>
            )}
          </div>
          
          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleComplete}
              disabled={isSubmitting || !canProceed()}
              className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isSubmitting || !canProceed()
                  ? 'bg-neutral-400 text-white cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Confirmar Reserva</span>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={isSubmitting || !canProceed()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting || !canProceed()
                  ? 'bg-neutral-400 text-white cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              Siguiente
            </button>
          )}
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
              <div className="mb-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">¡Reserva Confirmada!</h3>
              <p className="text-neutral-600 mb-4">
                Tu reserva ha sido creada exitosamente. Recibirás un email de confirmación en breve.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-green-900 mb-2">Detalles de tu reserva:</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p><span className="font-medium">Fecha:</span> {reservationData.date}</p>
                  <p><span className="font-medium">Hora:</span> {reservationData.time}</p>
                  <p><span className="font-medium">Personas:</span> {reservationData.adults + reservationData.children + reservationData.babies}</p>
                  <p><span className="font-medium">Mesa:</span> {reservationData.table}</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                Redirigiendo a la página de reservas...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step Components
function StepPersonas({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const updateGuests = (type: 'adults' | 'children' | 'babies', increment: boolean) => {
    const currentValue = data[type] || 0;
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    
    // Asegurar que siempre haya al menos 1 adulto
    if (type === 'adults' && newValue < 1) return;
    
    onUpdate({ [type]: newValue });
  };

  const PersonCounter = ({ 
    title, 
    description, 
    icon, 
    count, 
    onIncrement, 
    onDecrement, 
    minValue = 0 
  }: {
    title: string;
    description: string;
    icon: string;
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
    minValue?: number;
  }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <h4 className="font-semibold text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-600">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onDecrement}
          disabled={count <= minValue}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
            count <= minValue
              ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
              : 'border-amber-600 text-amber-600 hover:bg-amber-50'
          }`}
        >
          -
        </button>
        <span className="w-8 text-center font-semibold text-neutral-900">{count}</span>
        <button
          onClick={onIncrement}
          className="w-8 h-8 rounded-full border-2 border-amber-600 text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );

  const totalGuests = (data.adults || 1) + (data.children || 0) + (data.babies || 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">¿Cuántas personas?</h3>
        <p className="text-neutral-600">Selecciona el número de comensales para tu reserva</p>
      </div>

      <div className="space-y-4 mb-8">
        <PersonCounter
          title="Adultos"
          description="13 años en adelante"
          icon="👤"
          count={data.adults || 1}
          onIncrement={() => updateGuests('adults', true)}
          onDecrement={() => updateGuests('adults', false)}
          minValue={1}
        />
        
        <PersonCounter
          title="Niños"
          description="3-12 años"
          icon="👶"
          count={data.children || 0}
          onIncrement={() => updateGuests('children', true)}
          onDecrement={() => updateGuests('children', false)}
        />
        
        <PersonCounter
          title="Bebés"
          description="0-2 años"
          icon="🍼"
          count={data.babies || 0}
          onIncrement={() => updateGuests('babies', true)}
          onDecrement={() => updateGuests('babies', false)}
        />
      </div>

      {/* Resumen */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-amber-800">
          <span className="font-semibold">Total: {totalGuests} persona{totalGuests !== 1 ? 's' : ''}</span>
        </p>
        {totalGuests > 8 && (
          <p className="text-sm text-amber-700 mt-2">
            Para grupos de más de 8 personas, te recomendamos contactar directamente al restaurante
          </p>
        )}
      </div>
    </div>
  );
}

function StepFecha({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  // Generar fechas disponibles (próximos 30 días)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return formatDisplayDate(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Elige la fecha</h3>
        <p className="text-neutral-600">Selecciona el día para tu reserva</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {availableDates.map((date) => {
          const dateString = formatDate(date);
          const isSelected = data.date === dateString;
          
          return (
            <button
              key={dateString}
              onClick={() => onUpdate({ date: dateString })}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                isSelected
                  ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-md'
                  : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-300 hover:shadow-md'
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${
                isSelected ? 'text-amber-700' : 'text-neutral-600'
              }`}>
                {getDateLabel(date)}
              </div>
              <div className={`text-lg font-bold ${
                isSelected ? 'text-amber-900' : 'text-neutral-900'
              }`}>
                {date.getDate()}
              </div>
              <div className={`text-xs ${
                isSelected ? 'text-amber-600' : 'text-neutral-500'
              }`}>
                {date.toLocaleDateString('es-ES', { month: 'short' })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fecha seleccionada */}
      {data.date && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800">
            <span className="font-semibold">Fecha seleccionada: </span>
            {new Date(data.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}
    </div>
  );
}

function StepHora({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const { tables, isTableAvailableForDateTime } = useTablesManager();
  
  const timeSlots = {
    lunch: [
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
    ],
    dinner: [
      '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
    ]
  };

  // Verificar disponibilidad real basada en reservas existentes
  const isTimeAvailable = (time: string) => {
    // Si no hay fecha seleccionada, mostrar todos los horarios como disponibles
    if (!data.date) return true;
    
    // Verificar si hay alguna mesa disponible para esta fecha y hora
    // Si al menos una mesa está disponible, el horario está disponible
    const availableTablesForTime = tables.filter(table => 
      isTableAvailableForDateTime(table.id, data.date!, time)
    );
    
    return availableTablesForTime.length > 0;
  };

  const TimeSlotButton = ({ time, available }: { time: string; available: boolean }) => {
    const isSelected = data.time === time;
    
    return (
      <button
        onClick={() => available && onUpdate({ time })}
        disabled={!available}
        className={`p-3 rounded-lg border-2 transition-all text-center ${
          !available
            ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : isSelected
              ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-md'
              : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-300 hover:shadow-md'
        }`}
      >
        <div className={`font-semibold ${
          !available ? 'text-neutral-400' : isSelected ? 'text-amber-900' : 'text-neutral-900'
        }`}>
          {time}
        </div>
        {!available && (
          <div className="text-xs text-red-500 mt-1">Ocupado</div>
        )}
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">Selecciona la hora</h3>
        <p className="text-neutral-600">Elige el horario que prefieras para tu reserva</p>
      </div>

      <div className="space-y-8">
        {/* Horarios de Almuerzo */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🍽️</span>
            Almuerzo
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.lunch.map((time) => (
              <TimeSlotButton
                key={time}
                time={time}
                available={isTimeAvailable(time)}
              />
            ))}
          </div>
        </div>

        {/* Horarios de Cena */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🌙</span>
            Cena
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.dinner.map((time) => (
              <TimeSlotButton
                key={time}
                time={time}
                available={isTimeAvailable(time)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hora seleccionada */}
      {data.time && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800">
            <span className="font-semibold">Hora seleccionada: </span>
            {data.time}
          </p>
        </div>
      )}
    </div>
  );
}

function StepZona({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const { isTableAvailableForDateTime } = useTablesManager();

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