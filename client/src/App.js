import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // Добавихме useLocation
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import Home from './Home';
import SearchResults from './SearchResults';
import MyTrips from './components/MyTrips'; // Новият компонент
import Navbar from './components/Navbar';   // Новият компонент

/**
 * ProtectedRoute - Проверява ролята и логната сесия
 */
const ProtectedRoute = ({ children, roleRequired }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to={user.role === 'admin' ? "/admin" : "/home"} />;
  }

  return children;
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation(); // Следим къде се намира потребителят

  // Взимаме потребителя от localStorage за pastTrips
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Проверка дали да показваме Navbar-а (скриваме го на Landing, Login и Register)
  const showNavbar = user && user.role === 'user' && !['/', '/login', '/register'].includes(location.pathname);

  return (
    <>
      {/* 1. ПОКАЗВАМЕ NAVBAR САМО ЗА ЛОГНАТИ ПОТРЕБИТЕЛИ (USER) */}
      {showNavbar && <Navbar />}

      <button
        onClick={toggleTheme}
        className="fixed bottom-5 left-5 z-[200] h-11 px-4 rounded-2xl font-semibold text-sm transition-all bg-white/85 text-slate-800 border border-slate-300/80 shadow-lg shadow-blue-500/10 backdrop-blur-md hover:bg-white hover:shadow-xl dark:bg-slate-900/85 dark:text-slate-100 dark:border-slate-700/80 dark:hover:bg-slate-900"
        aria-label="Смяна на тема"
      >
        {theme === 'dark' ? '☀️ Светла' : '🌙 Тъмна'}
      </button>

      <Routes>
        {/* ПУБЛИЧНИ МАРШРУТИ */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* АДМИН ПАНЕЛ */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ПОТРЕБИТЕЛСКИ МАРШРУТИ (HOME / ТЪРСЕНЕ) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute roleRequired="user">
              <Home />
            </ProtectedRoute>
          }
        />

        {/* НОВО: МОИТЕ ПОЧИВКИ */}
        <Route
          path="/my-trips"
          element={
            <ProtectedRoute roleRequired="user">
              {/* Подаваме pastTrips от localStorage обекта */}
              <MyTrips pastTrips={user?.pastTrips || []} />
            </ProtectedRoute>
          }
        />

        <Route path="/search" element={<SearchResults />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;