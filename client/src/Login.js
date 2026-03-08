import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Това е "кормилото", което сменя страниците

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });

      // 1. ЗАПАЗВАМЕ потребителя в паметта на браузъра
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert('Успешен вход!');

      // 2. ПРЕНАСОЧВАМЕ към таблото
      navigate('/admin');

    } catch (err) {
      alert('Грешен имейл или парола!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-slate-900 dark:text-white font-sans transition-colors">
      <form onSubmit={handleLogin} className="bg-white/80 dark:bg-slate-900/65 border border-white/80 dark:border-slate-700/70 backdrop-blur-xl p-12 rounded-3xl shadow-2xl shadow-blue-500/10 max-w-md w-full">
        <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Вход</h2>

        <div className="space-y-4">
          <input
            type="email" placeholder="Имейл" required
            className="w-full p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" placeholder="Парола" required
            className="w-full p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-xl transition-all shadow-lg shadow-blue-600/20">
            Влез сега
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;