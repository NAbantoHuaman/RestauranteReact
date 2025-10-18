import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type Category = 'all' | 'entradas' | 'principales' | 'postres' | 'bebidas';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'all'>;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Carpaccio de Res',
    description: 'Finas láminas de res con parmesano, rúcula y reducción de balsámico',
    price: 42,
    category: 'entradas',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 2,
    name: 'Ceviche Clásico',
    description: 'Pescado fresco marinado en limón con cebolla, ají y camote',
    price: 48,
    category: 'entradas',
    image: 'https://www.recetasnestle.cl/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/379d1ba605985c4bc3ea975cabacce13.webp?itok=OPDxjAtZ'
  },
  {
    id: 3,
    name: 'Ensalada César Premium',
    description: 'Lechuga romana, croutons artesanales, parmesano y aderezo César',
    price: 38,
    category: 'entradas',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 4,
    name: 'Lomo Saltado Premium',
    description: 'Jugoso lomo fino salteado con papas fritas y arroz blanco',
    price: 68,
    category: 'principales',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2031&q=80'
  },
  {
    id: 5,
    name: 'Risotto de Hongos',
    description: 'Arroz arborio cremoso con hongos silvestres y trufa negra',
    price: 62,
    category: 'principales',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 6,
    name: 'Salmón a la Plancha',
    description: 'Filete de salmón con vegetales asados y salsa de alcaparras',
    price: 75,
    category: 'principales',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80'
  },
  {
    id: 7,
    name: 'Ossobuco',
    description: 'Osobuco de res braseado con puré de papas y gremolata',
    price: 82,
    category: 'principales',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  },
  {
    id: 8,
    name: 'Tiramisú Clásico',
    description: 'Postre italiano tradicional con mascarpone y café',
    price: 28,
    category: 'postres',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80'
  },
  {
    id: 9,
    name: 'Volcán de Chocolate',
    description: 'Bizcocho de chocolate con centro fundido y helado de vainilla',
    price: 32,
    category: 'postres',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80'
  },
  {
    id: 10,
    name: 'Cheesecake de Frutos Rojos',
    description: 'Suave cheesecake con coulis de frutos del bosque',
    price: 30,
    category: 'postres',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 11,
    name: 'Vino Tinto Reserva',
    description: 'Copa de vino tinto selección especial',
    price: 35,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80'
  },
  {
    id: 12,
    name: 'Pisco Sour',
    description: 'Cóctel peruano tradicional con pisco acholado',
    price: 25,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
];

export default function Menu() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Definir filteredItems antes del useEffect
  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.5, 1],
      rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          entry.target.classList.remove('revealed');
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up, .scroll-reveal-zoom');
    scrollElements.forEach((el) => observer.observe(el));
    
    return () => {
      observer.disconnect();
    };
  }, [selectedCategory]);

  // Mapeo de IDs de platos a claves de traducción
  const getItemTranslationKey = (itemId: number): string => {
    const keyMap: { [key: number]: string } = {
      1: 'carpaccio',
      2: 'ceviche', 
      3: 'caesar',
      4: 'lomo',
      5: 'risotto',
      6: 'salmon',
      7: 'ossobuco',
      8: 'tiramisu',
      9: 'volcano',
      10: 'cheesecake',
      11: 'wine',
      12: 'pisco'
    };
    return keyMap[itemId] || 'unknown';
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'all':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'entradas':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        );
      case 'principales':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'postres':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 'bebidas':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 8V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v3h2a1 1 0 110 2h-1v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7H4a1 1 0 110-2h2zM8 5v3h4V5H8z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'all':
        return 'from-neutral-500 to-neutral-600';
      case 'entradas':
        return 'from-green-500 to-green-600';
      case 'principales':
        return 'from-red-500 to-red-600';
      case 'postres':
        return 'from-pink-500 to-pink-600';
      case 'bebidas':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const categories = [
    { id: 'all' as Category, label: 'Todo' },
    { id: 'entradas' as Category, label: 'Entradas' },
    { id: 'principales' as Category, label: 'Platos Principales' },
    { id: 'postres' as Category, label: 'Postres' },
    { id: 'bebidas' as Category, label: 'Bebidas' },
  ];

  return (
    <div className="min-h-screen py-6 sm:py-12 pt-20 bg-gradient-to-br from-amber-50 via-orange-50/30 to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-12 scroll-reveal-zoom">
          <div className="inline-block mb-2 sm:mb-4">
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mb-2 sm:mb-4"></div>
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent mb-2 sm:mb-4">
            {t('menu.title')}
          </h1>
          <p className="text-sm sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-8">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Categories Filter */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-12 border border-neutral-100 scroll-reveal-up reveal-delay-1">
          <div className="flex items-center mb-3 sm:mb-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-2 sm:mr-4 shadow-lg">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent">
                Categorías
              </h3>
              <p className="text-xs sm:text-base text-neutral-600">Explora nuestras deliciosas opciones por categoría</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative overflow-hidden px-3 py-2 sm:px-6 sm:py-4 rounded-2xl font-semibold text-xs sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${getCategoryColor(category.id)} text-white`
                    : 'bg-white text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 border border-neutral-200'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category.id)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <span className="relative z-10 flex items-center justify-center">
                  <span className="mr-2">
                    {getCategoryIcon(category.id)}
                  </span>
                  {t(`menu.categories.${category.id}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {filteredItems.map((item, index) => {
            // Determinar el tipo de animación basado en el índice
            const getAnimationClass = (index: number) => {
              const animations = ['scroll-reveal-left', 'scroll-reveal-up', 'scroll-reveal-right', 'scroll-reveal-zoom'];
              return animations[index % animations.length];
            };

            const getDelayClass = (index: number) => {
              const delays = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5', 'reveal-delay-6'];
              return delays[index % delays.length];
            };

            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-100 hover:border-amber-200 transform hover:-translate-y-2 ${getAnimationClass(index)} ${getDelayClass(index)}`}
              >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Image Section */}
              <div className="relative h-32 sm:h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={t(`menu.items.${getItemTranslationKey(item.id)}.name`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Price Badge */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-2xl font-bold shadow-lg transform transition-all duration-300 group-hover:scale-110">
                  <span className="text-xs sm:text-sm">S/</span>
                  <span className="text-sm sm:text-lg ml-1">{item.price}</span>
                </div>
                
                {/* Category Badge */}
                <div className={`absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r ${getCategoryColor(item.category)} text-white px-2 py-1 sm:px-3 sm:py-2 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg flex items-center`}>
                  <span className="mr-1 sm:mr-2">
                    {getCategoryIcon(item.category)}
                  </span>
                  <span className="hidden sm:inline">{t(`menu.categories.${item.category}`)}</span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="relative z-10 p-3 sm:p-6">
                <h3 className="text-sm sm:text-2xl font-bold text-neutral-900 group-hover:text-amber-800 transition-colors duration-300 mb-1 sm:mb-3">
                  {t(`menu.items.${getItemTranslationKey(item.id)}.name`)}
                </h3>
                
                <p className="text-neutral-600 leading-relaxed mb-2 sm:mb-6 text-xs sm:text-sm">
                  {t(`menu.items.${getItemTranslationKey(item.id)}.description`)}
                </p>
                
                {/* Action Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-green-700">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-12 h-12 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No hay platos disponibles</h3>
            <p className="text-neutral-500">No se encontraron platos en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
