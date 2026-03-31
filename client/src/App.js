import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUser, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import Home from './Home';
import SearchResults from './SearchResults';
import MyTrips from './components/MyTrips';
import Profile from './Profile';
import { LanguageProvider, useLanguage, LanguageSwitcher } from './components/LanguageContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/" />;
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to={user.role === 'admin' ? "/admin" : "/home"} />;
  }
  return children;
};

const AppContent = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const { t } = useLanguage();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const showNavbar = user && user.role === 'user' && !['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && (
        <motion.nav
          className="fixed top-0 left-0 right-0 z-[150] bg-white/90 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-2 flex justify-between items-center shadow-sm"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/home" className="flex items-center">
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white">
              DIPLOT
              <span className="text-blue-600 ml-1">TRAVEL</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <Link
              to="/home"
              className={`px-3 py-1.5 rounded-md font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 ${location.pathname === '/home' || location.pathname === '/search'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <FiSearch className="w-3.5 h-3.5" />
              {t('search')}
            </Link>
            <Link
              to="/my-trips"
              className={`px-3 py-1.5 rounded-md font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 ${location.pathname === '/my-trips'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <FiCalendar className="w-3.5 h-3.5" />
              {t('myTrips')}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            <motion.button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all border border-transparent dark:hover:border-slate-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </motion.button>

            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all border border-slate-200 dark:border-slate-800">
              <FiUser className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{user?.name?.split(' ')[0] || 'Profile'}</span>
            </Link>

            <motion.button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.nav>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute roleRequired="user"><Home /></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute roleRequired="user"><MyTrips /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute roleRequired="user"><SearchResults /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute roleRequired="user"><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {showNavbar && (
        <motion.div
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl shadow-2xl flex gap-2"
          initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}
        >
          <Link to="/home"><motion.div className={`p-3 rounded-lg text-xl transition-all ${location.pathname === '/home' || location.pathname === '/search' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`} whileTap={{ scale: 0.95 }}><FiSearch className="w-5 h-5" /></motion.div></Link>
          <Link to="/my-trips"><motion.div className={`p-3 rounded-lg text-xl transition-all ${location.pathname === '/my-trips' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`} whileTap={{ scale: 0.95 }}><FiCalendar className="w-5 h-5" /></motion.div></Link>
          <Link to="/profile"><motion.div className={`p-3 rounded-lg transition-all ${location.pathname === '/profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`} whileTap={{ scale: 0.95 }}><FiUser className="w-5 h-5" /></motion.div></Link>
        </motion.div>
      )}
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;