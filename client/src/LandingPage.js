import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen text-slate-900 dark:text-white font-sans flex flex-col items-center justify-center relative overflow-hidden transition-colors">

      {/* Дизайнерски фонови кръгове за "Pro" визия */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10 text-center max-w-3xl px-6 py-12 rounded-[38px] bg-white/70 dark:bg-slate-900/45 border border-white/70 dark:border-slate-800/70 backdrop-blur-md shadow-2xl shadow-blue-500/10">

        {/* Икона със самолетче */}
        <div className="inline-block p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[35px] shadow-2xl shadow-blue-500/20 mb-10 animate-pulse">
          <span className="text-6xl">✈️</span>
        </div>

        {/* Заглавие на агенцията */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic uppercase">
          DIPLOT <span className="text-blue-500">TRAVEL</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-light">
          Твоят интелигентен партньор за пътешествия. Открий следващата дестинация с персонализирани AI оферти.
        </p>

        {/* Бутони за действие */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link
            to="/login"
            className="group relative px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Влез в профила</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </Link>

          <Link
            to="/register"
            className="px-12 py-5 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95"
          >
            Регистрация
          </Link>
        </div>

        {/* Технологичен надпис в долната част */}
        <div className="mt-24 pt-10 border-t border-slate-300 dark:border-slate-900/50 flex flex-col items-center gap-4">
          <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase font-black tracking-[0.5em]">
            Powered by Google Gemma AI & MongoDB
          </p>
          <div className="flex gap-4 opacity-30">
            <span className="text-xs">React</span>
            <span className="text-xs">•</span>
            <span className="text-xs">Node.js</span>
            <span className="text-xs">•</span>
            <span className="text-xs">Tailwind</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;