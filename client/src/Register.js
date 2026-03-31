import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

// 🌍 Импортираме контекста и превключвателя за езика
import { useLanguage } from './components/LanguageContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🌍 Взимаме функцията t(), езика и toggleLanguage
  const { t, language, toggleLanguage } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert(t('registerSuccess'));
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || t('registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors relative">
      
      {/* 🌍 МИНИМАЛИСТИЧЕН ЕЗИКОВ ПРЕВКЛЮЧВАТЕЛ (Вляво, защото картинката е вдясно) */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-3 text-xs font-black uppercase tracking-widest">
        <button
          onClick={() => toggleLanguage('bg')}
          className={`transition-colors ${language === 'bg' ? 'text-teal-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          БГ
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={() => toggleLanguage('en')}
          className={`transition-colors ${language === 'en' ? 'text-teal-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          EN
        </button>
      </div>

      {/* 🔐 ЛЯВА ЧАСТ: Форма за регистрация (Смалена и с оригиналния градиент) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-white dark:bg-slate-900 z-10 shadow-[20px_0_30px_-15px_rgba(0,0,0,0.1)]">
        
        {/* Декоративен ефект - Зелено сияние */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 dark:bg-teal-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          className="w-full max-w-sm relative z-10" /* 👈 СМАЛЕНА ШИРИНА (max-w-sm) */
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 text-center lg:text-left mt-8 lg:mt-0">
            {/* Градиентно заглавие Blue-to-Teal */}
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 tracking-tight">
                {t('joinDiplot')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('unlockWorld')}</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Име */}
            <motion.div className="space-y-1.5" whileFocus={{ scale: 1.01 }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-widest">{t('fullNameLabel')}</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('namePlaceholder')}
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm text-sm"
                />
              </div>
            </motion.div>

            {/* Имейл */}
            <motion.div className="space-y-1.5" whileFocus={{ scale: 1.01 }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-widest">{t('emailLabel')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm text-sm"
                />
              </div>
            </motion.div>

            {/* Парола */}
            <motion.div className="space-y-1.5" whileFocus={{ scale: 1.01 }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-widest">{t('passwordLabel')}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm text-sm"
                />
              </div>
            </motion.div>

            {/* Бутон с градиент Blue-to-Teal */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-widest"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? t('loading') : t('createAccountBtn')}
              {!isLoading && <FiArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-teal-600 dark:text-teal-400 hover:text-teal-500 font-bold hover:underline transition-colors">
                {t('loginHere')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* 🏔️ ДЯСНА ЧАСТ: Визуален брандинг (С оригиналния Teal градиент вдясно) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 to-teal-900 text-white items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        
        {/* Декоративен светещ кръг - Зелено */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-teal-500/20 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-md text-right">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-black italic tracking-tighter mb-6 drop-shadow-lg"
          >
            DIPLOT <span className="text-teal-400 font-light">{t('registerHeroTitle')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-teal-50 text-balance leading-relaxed font-light"
          >
            {t('registerHeroDesc')}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Register;