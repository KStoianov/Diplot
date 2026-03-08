import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/register', formData);
            alert('Регистрацията е успешна! Сега можеш да влезеш.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Грешка при регистрация!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 transition-colors">
            <form onSubmit={handleRegister} className="bg-white/80 dark:bg-slate-900/65 p-8 rounded-3xl shadow-2xl shadow-blue-500/10 w-full max-w-md border border-white/80 dark:border-slate-700/70 backdrop-blur-xl">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Регистрация в Diplot</h2>

                <input
                    type="text" placeholder="Име" required
                    className="w-full p-4 mb-4 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                    type="email" placeholder="Имейл" required
                    className="w-full p-4 mb-4 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="password" placeholder="Парола" required
                    className="w-full p-4 mb-6 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
                    Създай профил
                </button>

                <p className="text-slate-500 dark:text-slate-400 mt-6 text-center">
                    Вече имаш профил? <Link to="/login" className="text-blue-400 hover:underline">Влез тук</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;