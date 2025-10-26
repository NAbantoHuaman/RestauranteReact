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
  {
    id: 13,
    name: 'Paella Mixta',
    description: 'Arroz con mariscos y carnes, azafrán y pimientos asados',
    price: 78,
    category: 'principales',
    image: 'https://www.rieglpalate.com/wp-content/uploads/2024/04/Paella-Mixta-1024x683.jpg'
  },
  {
    id: 14,
    name: 'Pollo a la Brasa',
    description: 'Clásico peruano con papas y ensalada, salsa huancaína',
    price: 55,
    category: 'principales',
    image: 'https://elcomercio.pe/resizer/v2/55QLUH7SV5E53AFZHMYNTJ4TTE.jpg?auth=bdffd2a0f4da7a109fb83ad9b94fcf63e5ca1c345be580dc898152c14dac10a0&width=1200&height=675&quality=75&smart=true'
  },
  {
    id: 15,
    name: 'Pasta Alfredo con Camarones',
    description: 'Fettuccine cremoso con mantequilla, parmesano y camarones',
    price: 66,
    category: 'principales',
    image: 'https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2023/05/pasta-alfredo-con-camarones-y-pesto.jpg'
  },
  {
    id: 16,
    name: 'Chicha Morada',
    description: 'Refresco tradicional de maíz morado con fruta y especias',
    price: 16,
    category: 'bebidas',
    image: 'https://origin.cronosmedia.glr.pe/large/2023/07/24/lg_64bebe2ae1753238157f7157.jpg'
  },
  {
    id: 17,
    name: 'Limonada de Hierbabuena',
    description: 'Limonada fresca con hoja de menta y hielo',
    price: 14,
    category: 'bebidas',
    image: 'https://www.apega.pe/wp-content/uploads/2025/08/receta-de-limonada-con-hierbabuena-800x445.jpg.webp'
  },
  {
    id: 18,
    name: 'Gin Tonic Clásico',
    description: 'Gin premium con tónica, limón y enebro',
    price: 28,
    category: 'bebidas',
    image: 'https://www.paulinacocina.net/wp-content/uploads/2022/05/gin-tonic-receta.jpg.webp'
  },
  {
    id: 19,
    name: 'Suspiro a la Limeña',
    description: 'Manjar blanco y merengue, un clásico dulce peruano',
    price: 26,
    category: 'postres',
    image: 'https://www.gourmet.cl/wp-content/uploads/2016/09/Suspiro-Limeno-ajustada-web-570x458.jpg'
  },
  {
    id: 20,
    name: 'Tres Leches',
    description: 'Bizcocho húmedo con mezcla de tres leches y canela',
    price: 24,
    category: 'postres',
    image: 'https://www.lemonblossoms.com/wp-content/uploads/2023/03/Tres-Leches-Cake-S2.jpg'
  },
  {
    id: 21,
    name: 'Helado Artesanal',
    description: 'Selección de sabores artesanales con frutas de estación',
    price: 22,
    category: 'postres',
    image: 'https://mejisa.com/wp-content/uploads/2019/04/helado-artesanal.jpg'
  },
];

export default function Menu() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  

  const getItemTranslationKey = (itemId: number): string => {
    const keyMap: Record<number, string> = {
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
      12: 'pisco',
      13: 'paella',
      14: 'pollo_brasa',
      15: 'pasta_alfredo',
      16: 'chicha',
      17: 'limonada',
      18: 'gin_tonic',
      19: 'suspiro',
      20: 'tres_leches',
      21: 'helado_artesanal'
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
        <div className="text-center mb-6 sm:mb-12">
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

        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-12 border border-neutral-100">
          <div className="flex items-center mb-3 sm:mb-6">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-2 sm:mr-4 shadow-lg">
              <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent">
                {t('menu.categoriesTitle')}
              </h3>
              <p className="text-xs sm:text-base text-neutral-600">{t('menu.categoriesSubtitle')}</p>
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

        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {filteredItems.map((item, index) => {
            

            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-100 hover:border-amber-200 transform hover:-translate-y-2`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative h-32 sm:h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={t(`menu.items.${getItemTranslationKey(item.id)}.name`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-2xl font-bold shadow-lg transform transition-all duration-300 group-hover:scale-110">
                    <span className="text-xs sm:text-sm">S/</span>
                    <span className="text-sm sm:text-lg ml-1">{item.price}</span>
                  </div>
                  
                  <div className={`absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r ${getCategoryColor(item.category)} text-white px-2 py-1 sm:px-3 sm:py-2 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg flex items-center`}>
                    <span className="mr-1 sm:mr-2">
                      {getCategoryIcon(item.category)}
                    </span>
                    <span className="hidden sm:inline">{t(`menu.categories.${item.category}`)}</span>
                  </div>
                </div>
                
                <div className="relative z-10 p-3 sm:p-6">
                  <h3 className="text-sm sm:text-2xl font-bold text-neutral-900 group-hover:text-amber-800 transition-colors duration-300 mb-1 sm:mb-3">
                    {t(`menu.items.${getItemTranslationKey(item.id)}.name`)}
                  </h3>
                  <p className="text-xs sm:text-base text-neutral-600 group-hover:text-neutral-700 transition-colors duration-300 mb-2 sm:mb-4 line-clamp-2">
                    {t(`menu.items.${getItemTranslationKey(item.id)}.description`)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex text-amber-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-neutral-500">(4.8)</span>
                    </div>
                    

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
