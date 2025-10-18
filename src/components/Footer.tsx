import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-neutral-900 text-white py-8 sm:py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {/* Información de Contacto */}
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-amber-400 mb-3 sm:mb-6">{t('footer.contact').toUpperCase()}</h3>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-neutral-300 font-medium text-xs sm:text-sm">{t('footer.location')}</p>
                  <p className="text-neutral-200 text-xs sm:text-sm">Av. Principal 123</p>
                  <p className="text-neutral-200 text-xs sm:text-sm">Miraflores - Lima, Perú</p>
                  <a 
                    href="https://maps.google.com/?q=Calle+San+Martin+399+Miraflores+Lima+Peru" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-1 sm:mt-2 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Ver en Google Maps</span>
                    <span className="sm:hidden">Maps</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-neutral-300 font-medium text-xs sm:text-sm">{t('footer.phone')}</p>
                  <a 
                    href="tel:+51902291058" 
                    className="text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm"
                  >
                    +51 902291058
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-neutral-300 font-medium text-xs sm:text-sm">{t('footer.email')}</p>
                  <a 
                    href="mailto:BellaVista@gmail.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm"
                  >
                    BellaVista@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Horarios de Atención */}
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-amber-400 mb-3 sm:mb-6 flex items-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">HORARIOS</span>
              <span className="sm:hidden">HORAS</span>
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-300 text-xs sm:text-sm">{t('footer.mondayToSaturday')}</span>
                <span className="text-white font-bold text-xs sm:text-sm">1:00 PM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300 text-xs sm:text-sm">{t('footer.sunday')}</span>
                <span className="text-red-400 font-bold text-xs sm:text-sm">{t('footer.closed')}</span>
              </div>
            </div>
            <p className="text-xs text-amber-200 mt-2 sm:mt-4 p-2 sm:p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <strong className="text-amber-400">Nota:</strong> Los horarios pueden variar en días festivos
            </p>
          </div>

          {/* Logo y Información Adicional */}
          <div className="text-center">
            <div className="flex flex-col items-center justify-center mb-3 sm:mb-6">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-amber-400 rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                <span className="text-neutral-900 font-bold text-sm sm:text-xl">BV</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-amber-400">Bella Vista</h2>
              <p className="text-neutral-300 text-xs sm:text-sm mt-1 sm:mt-2 max-w-md hidden sm:block">
                Experiencia culinaria excepcional con ingredientes frescos y ambiente familiar
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs text-neutral-400">
              <span className="bg-neutral-800 px-2 py-1 sm:px-3 rounded-full">Cocina Premium</span>
              <span className="bg-neutral-800 px-2 py-1 sm:px-3 rounded-full hidden sm:inline">Ingredientes Frescos</span>
              <span className="bg-neutral-800 px-2 py-1 sm:px-3 rounded-full">Ambiente Familiar</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-700 pt-4 sm:pt-8 text-center">
          <p className="text-neutral-400 text-xs sm:text-sm">
            © 2024 Bella Vista Restaurant. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}