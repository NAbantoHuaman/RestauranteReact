import React, { useEffect, useState } from 'react';
import { useTablesManager } from '../hooks/useTablesManager';
import { useLanguage } from '../contexts/LanguageContext';

export default function Tables() {
  const { t } = useLanguage();
  const { tables, reservations, refreshReservations } = useTablesManager();
  
  // Estado para filtros de fecha
  const [selectedDate, setSelectedDate] = useState('');
  const [showAllReservations, setShowAllReservations] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      case 'occupied':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'reserved':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return t('tables.status.available');
      case 'occupied':
        return t('tables.status.occupied');
      case 'reserved':
        return t('tables.status.reserved');
      default:
        return t('tables.status.unknown');
    }
  };

  const getLocationLabel = (location: string) => {
    switch (location) {
      case 'interior':
        return t('tables.locations.interior');
      case 'terraza':
        return t('tables.locations.terraza');
      case 'patio':
        return t('tables.locations.patio');
      case 'privado':
        return t('tables.locations.privado');
      default:
        return location;
    }
  };

  const filterTablesByLocation = (location: string) => {
    return tables.filter(table => table.location === location);
  };

  // Función para obtener todas las reservas de una mesa
  const getTableReservations = (tableId: string) => {
    const tableReservations = reservations.filter(r => r.tableId === tableId);
    
    if (selectedDate) {
      return tableReservations.filter(r => r.date === selectedDate);
    }
    
    if (!showAllReservations) {
      // Solo mostrar reservas de hoy y futuras
      const today = new Date().toISOString().split('T')[0];
      return tableReservations.filter(r => r.date >= today);
    }
    
    return tableReservations.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      return dateA.getTime() - dateB.getTime();
    });
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const locations = ['interior', 'terraza', 'patio', 'privado'];

  return (
    <div className="min-h-screen py-12 pt-20 bg-gradient-to-br from-amber-50 via-orange-50/30 to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-block mb-2 sm:mb-4">
            <div className="w-12 sm:w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mb-2 sm:mb-4"></div>
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent mb-3 sm:mb-4">
            {t('tables.title')}
          </h1>

          
          {/* Action Button */}
          <button
            onClick={refreshReservations}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('tables.updateButton')}
            </span>
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-12 border border-neutral-100">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-neutral-900 via-purple-800 to-neutral-900 bg-clip-text text-transparent">
                {t('tables.filters.title')}
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base">Filtra las mesas por fecha y configuración</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 sm:gap-6 items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <label htmlFor="date-filter" className="text-xs sm:text-sm font-semibold text-neutral-700 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">{t('tables.filters.specificDate')}</span>
                <span className="sm:hidden">Fecha</span>
              </label>
              <input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-1 sm:px-4 sm:py-2 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                id="show-all"
                type="checkbox"
                checked={showAllReservations}
                onChange={(e) => setShowAllReservations(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-neutral-300 text-amber-600 focus:ring-amber-500 shadow-sm"
              />
              <label htmlFor="show-all" className="text-xs sm:text-sm font-semibold text-neutral-700 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">{t('tables.filters.showAll')}</span>
                <span className="sm:hidden">Todas</span>
              </label>
            </div>
            
            {(selectedDate || showAllReservations) && (
              <button
                onClick={() => {
                  setSelectedDate('');
                  setShowAllReservations(false);
                }}
                className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">{t('tables.filters.clearFilters')}</span>
                <span className="sm:hidden">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Tables by Location */}
        {locations.map(location => {
          const locationTables = filterTablesByLocation(location);
          if (locationTables.length === 0) return null;

          return (
            <div key={location} className="mb-6 sm:mb-12">
              <div className="flex items-center mb-4 sm:mb-8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent">
                    {getLocationLabel(location)}
                  </h2>
                  <p className="text-neutral-600 text-sm sm:text-base">{locationTables.length} mesas disponibles</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-12">
                {locationTables.map((table, index) => (
                  <div
                    key={table.id}
                    className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-4 sm:p-8 border border-neutral-100 hover:border-amber-200 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mr-3 sm:mr-4">
                            {table.number}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg sm:text-xl text-neutral-900 group-hover:text-amber-800 transition-colors duration-300">
                              {t('tables.table')} {table.number}
                            </h3>
                            <p className="text-neutral-600 text-xs sm:text-sm">Mesa principal</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm font-bold ${getStatusColor(table.status)} group-hover:scale-105 transition-all duration-300`}>
                          {getStatusLabel(table.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                        <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50">
                          <span className="text-neutral-700 font-semibold flex items-center text-sm sm:text-base">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {t('tables.capacity')}
                          </span>
                          <span className="font-bold text-blue-700 text-base sm:text-lg">
                            {table.capacity} {t('tables.people')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl border border-green-200/50">
                          <span className="text-neutral-700 font-semibold flex items-center text-sm sm:text-base">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {t('tables.location')}
                          </span>
                          <span className="font-bold text-green-700 text-sm sm:text-base">
                            {getLocationLabel(table.location)}
                          </span>
                        </div>
                      </div>

                      {/* Reservations Section */}
                      {(() => {
                        const tableReservations = getTableReservations(table.id);
                        if (tableReservations.length > 0) {
                          return (
                            <div className="border-t border-neutral-200 pt-4 sm:pt-6">
                              <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-2 shadow-md">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  {t('tables.reservations')} ({tableReservations.length})
                                </div>
                              </div>
                              <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-48 overflow-y-auto">
                                {tableReservations.map((reservation, index) => (
                                  <div key={`${reservation.id}-${index}`} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 sm:p-4 border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="font-bold text-neutral-900 mb-1 sm:mb-2 text-sm sm:text-lg">{reservation.customerName}</div>
                                    <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm">
                                      <div className="text-neutral-600 flex items-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        {formatDate(reservation.date)} - {reservation.time}
                                      </div>
                                      <div className="text-neutral-600 flex items-center">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        {reservation.guests} {t('tables.people')}
                                      </div>
                                      {reservation.phone && (
                                        <div className="text-neutral-500 flex items-center">
                                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                          </svg>
                                          <span className="sm:hidden">{reservation.phone.slice(-4)}</span>
                                          <span className="hidden sm:inline">{reservation.phone}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="border-t border-neutral-200 pt-4 sm:pt-6">
                            <div className="text-center py-4 sm:py-6">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-inner">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                                {t('tables.noReservations')} {selectedDate ? t('tables.forSelectedDate') : t('tables.upcoming')}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
         </div>
         </div>
       );
     }
