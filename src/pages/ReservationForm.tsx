import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Phone, Mail, User, Plus, Minus, Check, ChevronLeft, ChevronRight, Info, CheckCircle } from 'lucide-react';
import { useTablesManager } from '../hooks/useTablesManager';
import { RESTAURANT_ZONES, CONSUMPTION_TYPES, getZoneName, getConsumptionTypeName } from '../config/restaurantConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { formatTimeLabel } from '../utils/dateTime';

// import { createReservationICS, downloadICS } from '../utils/ics';
import { createReservationReceiptHTML, downloadReceipt } from '../utils/receipt';

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

// Eliminado STEPS estático: se usa LOCALIZED_STEPS dentro del componente

export default function ReservationForm() {
  const navigate = useNavigate();
  const { addReservation, tables, getTableIdFromWizardId } = useTablesManager();
  const { t, language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-PE';
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

  // Localizar títulos de pasos con i18n
  const LOCALIZED_STEPS = [
    { id: 'personas', title: t('reservations.choosePeopleTitle') },
    { id: 'fecha', title: t('reservations.selectDateTitle') },
    { id: 'hora', title: t('reservations.selectTimeTitle') },
    { id: 'zona', title: t('reservations.chooseZoneTypeTitle') },
    { id: 'datos', title: t('reservations.yourDetailsTitle') }
  ];

  // Subtítulos localizados por paso
  const getStepSubtitle = (id: string) => {
    switch (id) {
      case 'personas':
        return t('reservations.childrenNote');
      case 'fecha':
        return t('reservations.selectDateSubtitle');
      case 'hora':
        return t('reservations.selectTimeSubtitle');
      case 'zona':
        return t('reservations.chooseZoneTypeSubtitle');
      case 'datos':
        return t('reservations.yourDetailsSubtitle');
      default:
        return '';
    }
  };
  const nextStep = () => {
    if (currentStep < LOCALIZED_STEPS.length - 1) {
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

  const handleDownloadICS = () => { /* deprecated: usando boleta HTML */ };
  const handleDownloadReceipt = () => {
    const language = localStorage.getItem("language") || "es";
    const labels = {
      title: language === "en" ? "Reservation Receipt" : "Boleta de Reserva",
      date: language === "en" ? "Date" : "Fecha",
      time: language === "en" ? "Time" : "Hora",
      customer: language === "en" ? "Customer" : "Cliente",
      guests: language === "en" ? "Guests" : "Comensales",
      table: language === "en" ? "Table" : "Mesa",
      zone: language === "en" ? "Zone" : "Zona",
      consumption: language === "en" ? "Consumption" : "Consumo",
      phone: language === "en" ? "Phone" : "Teléfono",
      email: language === "en" ? "Email" : "Correo",
      notes: language === "en" ? "Notes" : "Notas",
      location: language === "en" ? "Location" : "Ubicación",
      qr: language === "en" ? "QR Code" : "Código QR",
    };

    const dateStr = date;
    const timeStr = time;
    const tableLabel = `${labels.table} ${tableLabelFromSelection ?? ""}`;
    const zoneLabel = zoneName ?? undefined;
    const consumptionTypeLabel = consumptionType ?? undefined;
    const location = `${t('footer.restaurantName')}, ${t('home.info.address.value')}`;

    const qrPayloadObj = {
      type: "reservation",
      date: dateStr,
      time: timeStr,
      customer: customerName,
      guests,
      table: tableLabelFromSelection ?? "",
      zone: zoneName ?? "",
    };

    const payloadBase64 = btoa(JSON.stringify(qrPayloadObj));
    const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;
    const qrUrl = `${baseUrl}/reservation-view?data=${encodeURIComponent(payloadBase64)}`;

    const html = createReservationReceiptHTML(
      {
        date: dateStr,
        time: timeStr,
        customerName,
        guests,
        tableLabel,
        zoneLabel,
        consumptionTypeLabel,
        phone,
        email,
        specialRequests: specialRequests ?? "",
        location,
        qrUrl,
      },
      labels
    );

    const fileName = `${labels.title.replace(/\s+/g, "_")}_${dateStr}_${timeStr}_${tableLabelFromSelection ?? ""}.html`;
    downloadReceipt(fileName, html);
  };
  const canProceed = () => {
    switch (LOCALIZED_STEPS[currentStep].id) {
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
    switch (LOCALIZED_STEPS[currentStep].id) {
      case 'personas':
        return reservationData.adults === 0 ? t('reservations.errors.mustSelectAdults') : '';
      case 'fecha':
        return reservationData.date === '' ? t('reservations.errors.mustSelectDate') : '';
      case 'hora':
        return reservationData.time === '' ? t('reservations.errors.mustSelectTime') : '';
      case 'zona':
        if (reservationData.zone === '') return t('reservations.errors.mustSelectZone');
        if (reservationData.table === '') return t('reservations.errors.mustSelectTable');
        if (reservationData.consumptionType === '') return t('reservations.errors.mustSelectConsumptionType');
        return '';
      case 'datos':
        if (reservationData.customerName === '') return t('reservations.errors.customerNameRequired');
        if (reservationData.customerEmail === '') return t('reservations.errors.customerEmailRequired');
        if (reservationData.customerPhone === '') return t('reservations.errors.customerPhoneRequired');
        if (!reservationData.acceptTerms) return t('reservations.errors.acceptTermsRequired');
        return '';
      default:
        return '';
    }
  };

  const handleComplete = () => {
    if (canProceed()) {
      if (reservationData.date && reservationData.time && reservationData.zone && 
          reservationData.table && reservationData.customerName && 
          reservationData.customerEmail && reservationData.customerPhone && 
          reservationData.acceptTerms) {
        
        setIsSubmitting(true);
        
        try {
          const guests = (reservationData.adults || 0) + (reservationData.children || 0) + (reservationData.babies || 0);
          const ok = addReservation({
            ...reservationData,
            guests,
          });
          
          if (!ok) {
            setIsSubmitting(false);
            return;
          }
          
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/reservations');
          }, 8000);
        } catch (error) {
          console.error('Error al crear la reserva:', error);
          setIsSubmitting(false);
        }
      }
    }
  };

  const renderStepContent = () => {
    switch (LOCALIZED_STEPS[currentStep].id) {
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
            ← {t('nav.reservations')}
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">{t('reservations.newReservation')}</h1>
          <p className="text-neutral-600">{t('reservations.selectDateSubtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {LOCALIZED_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="text-sm font-medium text-neutral-900">
                  {step.title}
                </div>
                <div className="text-xs text-neutral-500 ml-2">
                  {getStepSubtitle(step.id)}
                </div>
                {index < LOCALIZED_STEPS.length - 1 && (
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
            {t('reservations.prev')}
          </button>

          {/* Validation Message */}
          <div className="flex-1 text-center">
            {!canProceed() && (
              <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-2 inline-block">
                {getValidationMessage()}
              </p>
            )}
          </div>
          
          {currentStep === LOCALIZED_STEPS.length - 1 ? (
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
                  <span>{t('reservations.processing')}</span>
                </>
              ) : (
                <span>{t('reservations.form.createReservation')}</span>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={isSubmitting || !canProceed()}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting || !canProceed()
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              {t('reservations.next')}
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
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t('reservations.successModal.title')}</h3>
              <p className="text-neutral-600 mb-4">
                {t('reservations.successModal.message')}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-green-900 mb-2">{t('reservations.successModal.detailsTitle')}</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p><span className="font-medium">{t('reservations.date')}:</span>{' '}
                    {reservationData.date
                      ? new Date(reservationData.date).toLocaleDateString(locale, {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })
                      : t('reservations.notSelected')}
                  </p>
                  <p><span className="font-medium">{t('reservations.time')}:</span>{' '}
                    {reservationData.time
                      ? formatTimeLabel(language, reservationData.time)
                      : t('reservations.notSelected')}
                  </p>
                  <p><span className="font-medium">{t('reservations.people')}:</span> {reservationData.adults + reservationData.children + reservationData.babies}</p>
                  <p><span className="font-medium">{t('reservations.table')}:</span>{' '}
                    {(() => {
                      const realId = getTableIdFromWizardId(String(reservationData.table));
                      const selTable = realId ? tables.find(t => t.id === realId) : undefined;
                      return selTable ? `${selTable.number}` : reservationData.table;
                    })()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-center">
                  <button onClick={handleDownloadReceipt} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    {language === 'en' ? 'Download receipt' : 'Descargar boleta'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                {t('reservations.successModal.redirecting')}
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
  const { t } = useLanguage();
  const updateGuests = (type: 'adults' | 'children' | 'babies', increment: boolean) => {
    const currentValue = data[type] || 0;
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
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
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">{t('reservations.choosePeopleTitle')}</h3>
        <p className="text-neutral-600">{t('reservations.childrenNote')}</p>
      </div>

      <div className="space-y-4 mb-8">
        <PersonCounter
          title={t('reservations.adults')}
          description={t('reservations.adultsSubtitle')}
          icon="👤"
          count={data.adults || 1}
          onIncrement={() => updateGuests('adults', true)}
          onDecrement={() => updateGuests('adults', false)}
          minValue={1}
        />
        
        <PersonCounter
          title={t('reservations.children')}
          description={t('reservations.childrenSubtitle')}
          icon="👶"
          count={data.children || 0}
          onIncrement={() => updateGuests('children', true)}
          onDecrement={() => updateGuests('children', false)}
        />
        
        <PersonCounter
          title={t('reservations.babies')}
          description={t('reservations.babiesSubtitle')}
          icon="🍼"
          count={data.babies || 0}
          onIncrement={() => updateGuests('babies', true)}
          onDecrement={() => updateGuests('babies', false)}
        />
      </div>

      {/* Resumen */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-amber-800">
          <span className="font-semibold">{t('reservations.totalPeople', {count: totalGuests})}</span>
        </p>
        {totalGuests > 8 && (
          <p className="text-sm text-amber-700 mt-2">
            {t('reservations.contactLargeGroups')}
          </p>
        )}
      </div>
    </div>
  );
}

function StepFecha({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const { t, language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-PE';
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
    return date.toLocaleDateString(locale, {
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
    if (isToday(date)) return t('reservations.today');
    if (isTomorrow(date)) return t('reservations.tomorrow');
    return formatDisplayDate(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">{t('reservations.selectDateTitle')}</h3>
        <p className="text-neutral-600">{t('reservations.selectDateSubtitle')}</p>
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
                {date.toLocaleDateString(locale, { month: 'short' })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fecha seleccionada */}
      {data.date && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-amber-800">
            <span className="font-semibold">{t('reservations.selectedDate')}: </span>
            {new Date(data.date).toLocaleDateString(locale, {
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
  const { t, language } = useLanguage();
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
    if (!data.date) return true;
    
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
          {formatTimeLabel(language, time)}
        </div>
        {!available && (
          <div className="text-xs text-red-500 mt-1">{t('reservations.form.notAvailable')}</div>
        )}
      </button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">{t('reservations.selectTimeTitle')}</h3>
        <p className="text-neutral-600">{t('reservations.selectTimeSubtitle')}</p>
      </div>

      <div className="space-y-8">
        {/* Horarios de Almuerzo */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🍽️</span>
            {t('reservations.lunch')}
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
            {t('reservations.dinner')}
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
            <span className="font-semibold">{t('reservations.selectedTime')}: </span>
            {formatTimeLabel(language, data.time)}
          </p>
        </div>
      )}
    </div>
  );
}

function StepZona({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const { tables, getAvailableTablesForZone, isTableAvailableForDateTime, getWizardIdFromTableId, getTableIdFromWizardId } = useTablesManager();
  const { t } = useLanguage();

  const totalGuests = (data.adults || 1) + (data.children || 0) + (data.babies || 0);

  const availableTables = getAvailableTablesForZone(
    data.zone || '',
    totalGuests,
    data.date || '',
    data.time || ''
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">{t('reservations.chooseZoneTypeTitle')}</h3>
        <p className="text-neutral-600">{t('reservations.chooseZoneTypeSubtitle')}</p>
      </div>

      <div className="space-y-8">
        {/* Selección de Zona */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4">{t('reservations.restaurantZone')}</h4>
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
                <div className="text-3xl mb-3">{(zone as any).icon}</div>
                <h5 className={`text-lg font-bold mb-2 ${
                  data.zone === zone.id ? 'text-amber-900' : 'text-neutral-900'
                }`}>
                  {t(`reservations.zones.${zone.id}.name`)}
                </h5>
                <p className={`text-sm ${
                  data.zone === zone.id ? 'text-amber-700' : 'text-neutral-600'
                }`}>
                  {t(`reservations.zones.${zone.id}.description`)}
                </p>
                <div className={`text-xs mt-2 ${
                  data.zone === zone.id ? 'text-amber-600' : 'text-neutral-500'
                }`}>
                  {getAvailableTablesForZone(zone.id, totalGuests, data.date || '', data.time || '').length} {t('reservations.tablesAvailable')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selección de Mesa */}
        {data.zone && (
          <div>
            <h4 className="text-xl font-semibold text-neutral-900 mb-4">
              {t('reservations.availableTablesIn')} {t(`reservations.zones.${data.zone}.name`)}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableTables.map((table) => {
                const wizardId = getWizardIdFromTableId(table.id) || String(table.id);
                const isAvailable = data.date && data.time
                  ? isTableAvailableForDateTime(table.id, data.date, data.time)
                  : table.status === 'available';
                const isSelected = data.table === wizardId;

                return (
                  <button
                    key={table.id}
                    onClick={() => isAvailable && onUpdate({ table: wizardId })}
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
                          {t('reservations.table')} {table.number}
                        </div>
                      <div className={`text-xs mb-1 ${
                        !isAvailable ? 'text-neutral-400' : isSelected ? 'text-amber-700' : 'text-neutral-600'
                      }`}>
                        {t(`reservations.zones.${table.location}.name`)}
                      </div>
                      <div className={`text-xs ${
                        !isAvailable ? 'text-neutral-400' : isSelected ? 'text-amber-600' : 'text-neutral-500'
                      }`}>
                        {t('reservations.capacityUpTo', {count: table.capacity})}
                        </div>
                      {!isAvailable && (
                        <div className="text-xs text-red-500 mt-1">{t('reservations.occupied')}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {availableTables.length === 0 && (
              <div className="text-center py-8 text-neutral-500">
                {t('reservations.noTablesAvailableZone', {count: totalGuests})}
                <br />
                {t('reservations.selectAnotherZone')}
              </div>
            )}
          </div>
        )}

        {/* Tipo de Consumo */}
        <div>
          <h4 className="text-xl font-semibold text-neutral-900 mb-4">{t('reservations.consumptionTypeTitle')}</h4>
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
                  {t(`reservations.consumptionTypes.${type.id}.name`)}
                </h5>
                <p className={`text-xs ${
                  data.consumptionType === type.id ? 'text-amber-700' : 'text-neutral-600'
                }`}>
                  {t(`reservations.consumptionTypes.${type.id}.description`)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de selección */}
      {(data.zone || data.consumptionType) && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h5 className="font-semibold text-amber-900 mb-2">{t('reservations.currentSelection')}</h5>
          <div className="text-amber-800 space-y-1">
            {data.zone && (
              <p><span className="font-medium">{t('reservations.zone')}:</span> {t(`reservations.zones.${data.zone}.name`)}</p>
            )}
            {data.table && (() => {
              const selId = getTableIdFromWizardId(String(data.table));
              const selTable = selId ? tables.find(t => t.id === selId) : undefined;
              return (
                <p><span className="font-medium">{t('reservations.table')}:</span> {selTable ? `${selTable.number}` : data.table}</p>
              );
            })()}
            {data.consumptionType && (
              <p><span className="font-medium">{t('reservations.consumptionType')}:</span> {t(`reservations.consumptionTypes.${data.consumptionType}.name`)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StepDatos({ data, onUpdate }: { data: ReservationData; onUpdate: (data: Partial<ReservationData>) => void }) {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { tables, getTableIdFromWizardId } = useTablesManager();
  const { t, language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-PE';

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'customerName':
        if (!value.trim()) {
          newErrors.customerName = t('reservations.errors.customerNameRequired');
        } else if (value.trim().length < 2) {
          newErrors.customerName = t('reservations.errors.customerNameMinLength');
        } else {
          delete newErrors.customerName;
        }
        break;
      case 'customerEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.customerEmail = t('reservations.errors.customerEmailRequired');
        } else if (!emailRegex.test(value)) {
          newErrors.customerEmail = t('reservations.errors.invalidEmail');
        } else {
          delete newErrors.customerEmail;
        }
        break;
      case 'customerPhone':
        if (!value.trim()) {
          newErrors.customerPhone = t('reservations.errors.customerPhoneRequired');
        } else if (value.trim().length < 8) {
          newErrors.customerPhone = t('reservations.errors.phoneMinLength');
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
        <h3 className="text-3xl font-bold text-neutral-900 mb-4">{t('reservations.yourDetailsTitle')}</h3>
        <p className="text-neutral-600">{t('reservations.yourDetailsSubtitle')}</p>
      </div>

      {/* Resumen de la reserva */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-amber-900 mb-4">{t('reservations.reservationSummaryTitle')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-amber-800">
              <span className="font-medium">{t('reservations.people')}:</span> {totalGuests} 
              {data.adults && ` (${data.adults} ${t('reservations.adults')}`}
              {data.children && data.children > 0 && `, ${data.children} ${t('reservations.children')}`}
              {data.babies && data.babies > 0 && `, ${data.babies} ${t('reservations.babies')}`}
              {data.adults && ')'}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">{t('reservations.date')}:</span> {data.date
                 ? new Date(data.date).toLocaleDateString(locale, {
                     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                   })
                 : t('reservations.notSelected')}
             </p>
             <p className="text-amber-800">
               <span className="font-medium">{t('reservations.time')}:</span> {data.time
                 ? new Date(`1970-01-01T${data.time}`).toLocaleTimeString(locale, {
                     hour: '2-digit', minute: '2-digit'
                   })
                 : t('reservations.notSelected')}
             </p>
          </div>
          <div>
            <p className="text-amber-800">
              <span className="font-medium">{t('reservations.zone')}:</span> {data.zone ? t(`reservations.zones.${data.zone}.name`) : t('reservations.notSelected')}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">{t('reservations.table')}:</span> {(() => {
                 const selId = getTableIdFromWizardId(String(data.table));
                 const selTable = selId ? tables.find(t => t.id === selId) : undefined;
                 return selTable ? `${selTable.number}` : data.table;
               })()}
            </p>
            <p className="text-amber-800">
              <span className="font-medium">{t('reservations.type')}:</span> {data.consumptionType ? t(`reservations.consumptionTypes.${data.consumptionType}.name`) : t('reservations.notSelected')}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de datos */}
      <div className="space-y-6">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-neutral-700 mb-2">
            {t('reservations.form.customerName')} *
          </label>
          <input
            type="text"
            id="customerName"
            value={data.customerName || ''}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.customerName ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder={t('reservations.form.customerNamePlaceholder')}
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-neutral-700 mb-2">
            {t('reservations.form.email')} *
          </label>
          <input
            type="email"
            id="customerEmail"
            value={data.customerEmail || ''}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.customerEmail ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder={t('reservations.form.emailPlaceholder')}
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-neutral-700 mb-2">
            {t('reservations.form.phone')} *
          </label>
          <input
            type="tel"
            id="customerPhone"
            value={data.customerPhone || ''}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
              errors.customerPhone ? 'border-red-500 bg-red-50' : 'border-neutral-300'
            }`}
            placeholder={t('reservations.form.phonePlaceholder')}
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
          )}
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-neutral-700 mb-2">
            {t('reservations.form.specialRequestsLabel')}
          </label>
          <textarea
            id="specialRequests"
            value={data.specialRequests || ''}
            onChange={(e) => onUpdate({ specialRequests: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
            placeholder={t('reservations.form.specialRequestsPlaceholder')}
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
            {t('reservations.acceptTermsStart')}
            <a href="#" className="text-amber-600 hover:text-amber-700 underline">
              {t('footer.termsOfService')}
            </a>
            {t('reservations.acceptTermsAnd')}
            <a href="#" className="text-amber-600 hover:text-amber-700 underline">
              {t('footer.privacyPolicy')}
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
            <p className="font-medium mb-1">{t('reservations.infoImportantTitle')}</p>
            <ul className="space-y-1 text-xs">
              <li>• {t('reservations.infoImportantBullets.bullet1')}</li>
              <li>• {t('reservations.infoImportantBullets.bullet2')}</li>
              <li>• {t('reservations.infoImportantBullets.bullet3')}</li>
              <li>• {t('reservations.infoImportantBullets.bullet4')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

