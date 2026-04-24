import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Добавяме и useLocation за стила

const Navbar = () => {
  const navigate = useNavigate(); // Инициализираме навигацията
  const location = useLocation(); // Взимаме текущия път за активен стил

  return (
    <nav className="flex justify-center gap-8 p-6 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-[2000]">
      {/* БУТОН ТЪРСЕНЕ */}
      <button 
        onClick={() => navigate('/home')}
        className={`text-sm font-bold tracking-widest transition-all px-4 py-2 rounded-xl ${
          location.pathname === '/home' 
          ? 'text-blue-500 bg-blue-500/10 border border-blue-500/30' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        🔎 ТЪРСЕНЕ НА ПОЧИВКА
      </button>

      {/* БУТОН МОИТЕ ПОЧИВКИ */}
      <button 
        onClick={() => navigate('/my-trips')}
        className={`text-sm font-bold tracking-widest transition-all px-4 py-2 rounded-xl ${
          location.pathname === '/my-trips' 
          ? 'text-blue-500 bg-blue-500/10 border border-blue-500/30' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
         МОИТЕ ПОЧИВКИ
      </button>
    </nav>
  );
};

export default Navbar;