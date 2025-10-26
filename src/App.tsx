import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';

import Reservations from './pages/Reservations';
import ReservationForm from './pages/ReservationForm';
import ReservationView from './pages/ReservationView';

function AppContent() {
  const location = useLocation();
  
  const getCurrentPage = () => {
    const path = window.location.pathname;
    if (path === '/') return 'home';
    if (path === '/menu') return 'menu';
    if (path === '/reservations') return 'reservations';

    if (path === '/reservation-form') return 'reservation-form';
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

          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservation-form" element={<ReservationForm />} />
          <Route path="/reservation-view" element={<ReservationView />} />
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
