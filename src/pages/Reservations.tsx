import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, User, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTablesManager } from '../hooks/useTablesManager';
import { useLanguage } from '../contexts/LanguageContext';
import PersonSelector from '../components/PersonSelector';

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: string;
}

interface Reservation {
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
}

export default function Reservations() {
  const { 
    tables, 
    reservations, 
    addReservation, 
    removeReservation, 
    refreshReservations,
    getAvailableTablesForDateTime,
    isTableAvailableForDateTime
  } = useTablesManager();
  
  const { t } = useLanguage();
  
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tableId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: '',
    adults: 1,
    children: 0,
    babies: 0,
  });

  // Actualizar datos cada 30 segundos para mostrar información en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      refreshReservations();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [refreshReservations]);

  // Actualizar datos cuando el componente se monta o cuando se enfoca la ventana
  useEffect(() => {
    const handleFocus = () => {
      refreshReservations();
    };

    window.addEventListener('focus', handleFocus);
    
    // Actualizar inmediatamente al montar
    refreshReservations();

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshReservations]);



  const createReservation = () => {
    setError('');

    const totalGuests = formData.adults + formData.children + formData.babies;

    if (
      !formData.tableId ||
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.date ||
      !formData.time ||
      totalGuests === 0
    ) {
      setError(t('reservations.errors.allFieldsRequired'));
      return;
    }

    const tableId = parseInt(formData.tableId);
    const table = tables.find((t) => t.id === tableId);

    if (!table) {
      setError(t('reservations.errors.tableNotFound'));
      return;
    }

    if (totalGuests > table.capacity) {
      setError(t('reservations.errors.capacityExceeded', { tableNumber: table.number, capacity: table.capacity }));
      return;
    }

    const success = addReservation({
      tableId: tableId,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      date: formData.date,
      time: formData.time,
      guests: totalGuests,
      adults: formData.adults,
      children: formData.children,
      babies: formData.babies,
    });

    if (success) {
      // Actualizar el estado local inmediatamente para reflejar los cambios
      refreshReservations();
      closeModal();
    } else {
      setError(t('reservations.errors.alreadyReserved'));
    }
  };

  const deleteReservation = (id: number) => {
    removeReservation(id);
  };

  const openModal = () => {
    setFormData({
      tableId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      guests: '',
      adults: 1,
      children: 0,
      babies: 0,
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      tableId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      guests: '',
      adults: 1,
      children: 0,
      babies: 0,
    });
    setError('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Función para verificar si un horario está disponible
  const isTimeSlotAvailable = (time: string) => {
    if (!formData.date) return true; // Si no hay fecha, mostrar todos disponibles
    
    // Verificar si hay al menos una mesa disponible para esta fecha y hora
    const availableTablesForTime = tables.filter(table => 
      isTableAvailableForDateTime(table.id, formData.date, time)
    );
    
    return availableTablesForTime.length > 0;
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateB.getTime() - dateA.getTime();
  });

  const availableTables = formData.date && formData.time 
    ? getAvailableTablesForDateTime(formData.date, formData.time, formData.adults + formData.children + formData.babies)
    : tables;

  return (
    <div className="min-h-screen py-6 sm:py-12 pt-16 sm:pt-20 bg-gradient-to-br from-amber-50 via-orange-50/30 to-neutral-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-block mb-2 sm:mb-4">
            <div className="w-12 sm:w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mb-2 sm:mb-4"></div>
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent mb-2 sm:mb-4">
            {t('reservations.title')}
          </h1>

          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mt-4 sm:mt-8">
            <button
              onClick={refreshReservations}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs sm:text-base">{t('reservations.updateButton')}</span>
              </span>
            </button>
            <Link
              to="/reservation-form"
              className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                <Plus className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-base">{t('reservations.newReservation')}</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8 mb-6 sm:mb-12">
          <div className="group relative bg-white p-3 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-200 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Calendar className="h-4 w-4 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-4xl font-bold text-blue-600 mb-1">{reservations.length}</p>
                  <div className="w-6 sm:w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full ml-auto"></div>
                </div>
              </div>
              <h3 className="text-xs sm:text-lg font-semibold text-neutral-800 mb-1 sm:mb-2">{t('reservations.totalReservations')}</h3>
              <p className="text-neutral-600 text-xs sm:text-sm hidden sm:block">Reservas registradas en el sistema</p>
            </div>
          </div>

          <div className="group relative bg-white p-3 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-green-100 hover:border-green-200 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-green-100/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="h-4 w-4 sm:h-8 sm:w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-4xl font-bold text-green-600 mb-1">{tables.filter(t => t.status === 'available').length}</p>
                  <div className="w-6 sm:w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full ml-auto"></div>
                </div>
              </div>
              <h3 className="text-xs sm:text-lg font-semibold text-neutral-800 mb-1 sm:mb-2">{t('reservations.availableTables')}</h3>
              <p className="text-neutral-600 text-xs sm:text-sm hidden sm:block">Mesas disponibles ahora</p>
            </div>
          </div>

          <div className="group relative bg-white p-3 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-amber-100 hover:border-amber-200 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Clock className="h-4 w-4 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-4xl font-bold text-amber-600 mb-1">
                    {
                      reservations.filter((res) => {
                        const resDate = new Date(res.date + 'T' + res.time);
                        return resDate >= new Date();
                      }).length
                    }
                  </p>
                  <div className="w-6 sm:w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full ml-auto"></div>
                </div>
              </div>
              <h3 className="text-xs sm:text-lg font-semibold text-neutral-800 mb-1 sm:mb-2">{t('reservations.upcomingReservations')}</h3>
              <p className="text-neutral-600 text-xs sm:text-sm hidden sm:block">Próximas reservas confirmadas</p>
            </div>
          </div>
        </div>

        {/* Reservations Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-3 sm:p-8 border border-neutral-100">
          <div className="flex items-center mb-4 sm:mb-8">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-2 sm:mr-4 shadow-lg">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent">
                {t('reservations.calendar')}
              </h2>

            </div>
          </div>

          {sortedReservations.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-amber-600" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-neutral-800 mb-2 sm:mb-4">No hay reservas</h3>
              <p className="text-sm sm:text-lg text-neutral-600 mb-6 sm:mb-8 max-w-md mx-auto">
                Aún no tienes reservas programadas. ¡Crea tu primera reserva!
              </p>
              <button
                onClick={openModal}
                className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Nueva Reserva
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedReservations.map((reservation, index) => (
                <div
                  key={reservation.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-200 hover:border-amber-300 p-4 sm:p-6 hover:scale-[1.02] transform"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-50/30 to-orange-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                        {reservation.tableNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-bold text-neutral-900 group-hover:text-amber-800 transition-colors duration-300 truncate">
                          {reservation.customerName}
                        </h3>
                        <p className="text-neutral-600 flex items-center text-sm sm:text-base mt-1">
                          <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                          {reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeReservation(reservation.id)}
                        className="group/btn relative w-8 h-8 sm:w-10 sm:h-10 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-all duration-300 border border-red-200 hover:border-red-300 hover:shadow-lg flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 group-hover/btn:text-red-600 transition-colors duration-300" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center justify-between bg-neutral-50 rounded-lg p-2">
                        <div className="flex items-center text-neutral-600">
                          <Calendar className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
                          <span className="hidden sm:inline">
                            {new Date(reservation.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="sm:hidden">
                            {new Date(reservation.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-neutral-600">
                          <Clock className="h-4 w-4 mr-1 text-amber-500 flex-shrink-0" />
                          <span className="font-medium">{reservation.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-neutral-50 rounded-lg p-2">
                        <div className="flex items-center text-neutral-600">
                          <Phone className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
                          <span className="hidden sm:inline">{reservation.customerPhone}</span>
                          <span className="sm:hidden">{reservation.customerPhone.slice(-4)}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-500">Mesa</p>
                          <p className="text-lg font-bold text-amber-600">#{reservation.tableNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('reservations.newReservation')}</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t('reservations.form.date')}
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t('reservations.form.time')}
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">{t('reservations.form.selectTime')}</option>
                      <option value="12:00" disabled={!isTimeSlotAvailable('12:00')}>
                        12:00 PM {!isTimeSlotAvailable('12:00') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="12:30" disabled={!isTimeSlotAvailable('12:30')}>
                        12:30 PM {!isTimeSlotAvailable('12:30') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="13:00" disabled={!isTimeSlotAvailable('13:00')}>
                        1:00 PM {!isTimeSlotAvailable('13:00') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="13:30" disabled={!isTimeSlotAvailable('13:30')}>
                        1:30 PM {!isTimeSlotAvailable('13:30') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="14:00" disabled={!isTimeSlotAvailable('14:00')}>
                        2:00 PM {!isTimeSlotAvailable('14:00') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="14:30" disabled={!isTimeSlotAvailable('14:30')}>
                        2:30 PM {!isTimeSlotAvailable('14:30') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="19:00" disabled={!isTimeSlotAvailable('19:00')}>
                        7:00 PM {!isTimeSlotAvailable('19:00') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="19:30" disabled={!isTimeSlotAvailable('19:30')}>
                        7:30 PM {!isTimeSlotAvailable('19:30') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="20:00" disabled={!isTimeSlotAvailable('20:00')}>
                        8:00 PM {!isTimeSlotAvailable('20:00') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="20:30" disabled={!isTimeSlotAvailable('20:30')}>
                        8:30 PM {!isTimeSlotAvailable('20:30') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="21:00" disabled={!isTimeSlotAvailable('21:00')}>
                        9:00 PM {!isTimeSlotAvailable('21:00') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="21:30" disabled={!isTimeSlotAvailable('21:30')}>
                        9:30 PM {!isTimeSlotAvailable('21:30') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                      <option value="22:00" disabled={!isTimeSlotAvailable('22:00')}>
                        10:00 PM {!isTimeSlotAvailable('22:00') ? `(${t('reservations.form.notAvailable')})` : ''}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t('reservations.form.table')}
                    </label>
                    <select
                      value={formData.tableId}
                      onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">{t('reservations.form.selectTable')}</option>
                      {availableTables.map((table) => (
                        <option key={table.id} value={table.id}>
                          {t('reservations.form.tableOption', { number: table.number, capacity: table.capacity })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <PersonSelector
                      adults={formData.adults}
                      children={formData.children}
                      babies={formData.babies}
                      onAdultsChange={(count) => setFormData({ ...formData, adults: count })}
                      onChildrenChange={(count) => setFormData({ ...formData, children: count })}
                      onBabiesChange={(count) => setFormData({ ...formData, babies: count })}
                      maxTotal={8}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('reservations.form.customerName')}
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder={t('reservations.form.customerNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('reservations.form.email')}
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder={t('reservations.form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('reservations.form.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, customerPhone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder={t('reservations.form.phonePlaceholder')}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
                >
                  {t('reservations.form.cancel')}
                </button>
                <button
                  onClick={createReservation}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  {t('reservations.form.createReservation')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
