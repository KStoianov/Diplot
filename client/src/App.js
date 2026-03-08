import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage'; // Нашата нова начална страница
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import Home from './Home'; // Потребителското табло
import SearchResults from './SearchResults'; // Внеси го
/**
 * ProtectedRoute - Компонент за сигурност.
 * Той проверява ролята на потребителя от localStorage и го пренасочва правилно.
 */
const ProtectedRoute = ({ children, roleRequired }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Ако няма логнат потребител, го пращаме към Welcome страницата
  if (!user) {
    return <Navigate to="/" />;
  }

  // Проверка на ролята спрямо базата данни
  // Ако ролята не съвпада, го пренасочваме към неговото си табло
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to={user.role === 'admin' ? "/admin" : "/home"} />;
  }

  return children;
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

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

  return (
    <>
      <button
        onClick={toggleTheme}
        className="fixed bottom-5 left-5 z-[200] h-11 px-4 rounded-2xl font-semibold text-sm transition-all bg-white/85 text-slate-800 border border-slate-300/80 shadow-lg shadow-blue-500/10 backdrop-blur-md hover:bg-white hover:shadow-xl dark:bg-slate-900/85 dark:text-slate-100 dark:border-slate-700/80 dark:hover:bg-slate-900"
        aria-label="Смяна на тема"
      >
        {theme === 'dark' ? '☀️ Светла' : '🌙 Тъмна'}
      </button>

      <Routes>
        {/* 1. НАЧАЛНА СТРАНИЦА (WELCOME PAGE) - Първото, което се вижда */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. АВТЕНТИКАЦИЯ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3. АДМИН ПАНЕЛ - Достъпен само за role: 'admin' */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 4. ПОТРЕБИТЕЛСКО ТАБЛО - Достъпно само за role: 'user' */}
        <Route
          path="/home"
          element={
            <ProtectedRoute roleRequired="user">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<SearchResults />} />
        {/* 5. ЗАЩИТА ПРИ ГРЕШЕН АДРЕС - Връща потребителя в началото */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;