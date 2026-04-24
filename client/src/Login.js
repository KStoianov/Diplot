import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

// Взимаме само куките, без стария грозен бутон
import { useLanguage } from './components/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { t, language, toggleLanguage } = useLanguage();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      alert(err.response?.data?.message || t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B1121] font-sans transition-colors relative">

      {/*  МИНИМАЛИСТИЧЕН ЕЗИКОВ ПРЕВКЛЮЧВАТЕЛ */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-3 text-xs font-black uppercase tracking-widest">
        <button
          onClick={() => toggleLanguage('bg')}
          className={`transition-colors ${language === 'bg' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          БГ
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={() => toggleLanguage('en')}
          className={`transition-colors ${language === 'en' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          EN
        </button>
      </div>

      {/*  ЛЯВА ЧАСТ: Брандинг */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 to-[#0B1121] text-white items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/30 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-black italic tracking-tighter mb-6 drop-shadow-lg"
          >
            DIPLOT <span className="text-blue-400">PRO</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-blue-100 leading-relaxed font-light"
          >
            {t('loginHeroDesc')}
          </motion.p>
        </div>
      </div>

      {/*  ДЯСНА ЧАСТ: Форма за вход */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-white dark:bg-[#0B1121] z-10">

        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          className="w-full max-w-sm relative z-10" /* 👈 ТУК Е ФИКСЪТ ЗА ШИРИНАТА (от max-w-md на max-w-sm) */
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center lg:text-left mt-8 lg:mt-0">
            <h2 className="text-2xl md:text-3xl font-black mb-2 text-slate-900 dark:text-white tracking-tight">{t('welcomeBack')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('loginToAccount')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div className="space-y-1.5" whileFocus={{ scale: 1.01 }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400 ml-1 uppercase tracking-widest">{t('emailLabel')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#151E32] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
                />
              </div>
            </motion.div>

            <motion.div className="space-y-1.5" whileFocus={{ scale: 1.01 }}>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400 ml-1 uppercase tracking-widest">{t('passwordLabel')}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#151E32] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-white/5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_8px_20px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-widest"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? t('loading') : t('loginBtn')}
              {!isLoading && <FiArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t('noAccount')}{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-bold hover:underline transition-colors">
                {t('createNow')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;