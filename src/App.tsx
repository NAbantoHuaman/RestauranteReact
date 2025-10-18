import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import ReservationForm from './pages/ReservationForm';

function AppContent() {
  const location = useLocation();
  
  // Determinar la página actual basada en la ruta
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/menu') return 'menu';
    if (path === '/tables') return 'tables';
    if (path === '/reservations' || path === '/reservation-form') return 'reservations';
    return 'home';
  };

  const currentPage = getCurrentPage();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: 'transparent' }}>
      <Header currentPage={currentPage} />
      <main className="flex-1 overflow-x-hidden" style={{ background: 'none' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservation-form" element={<ReservationForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
