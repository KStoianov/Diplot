import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [wish, setWish] = useState('');
    const [availableHotels, setAvailableHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null); // За съхранение на текущия потребител
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Взимаме потребителя от локалното хранилище
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);

        // 2. Зареждаме хотелите
        axios.get('http://localhost:5000/api/hotels')
            .then(res => setAvailableHotels(res.data))
            .catch(err => console.error("Грешка при зареждане на хотелите"));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user'); // Изтриваме данните за сесията
        navigate('/login'); // Препращаме към вход
    };

    const askGemma = async () => {
        if (!wish) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/chat', { message: wish });
            navigate('/search', {
                state: {
                    results: availableHotels,
                    aiMessage: res.data,
                    duration: res.data.duration || 7
                }
            });
        } catch (err) {
            alert("AI е зает, опитайте пак.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen text-slate-700 dark:text-slate-200 font-sans transition-colors">
            {/* 🚀 NAVIGATION BAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/75 dark:bg-slate-950/55 backdrop-blur-xl border-b border-white/70 dark:border-slate-800/80 px-10 py-4 flex justify-between items-center shadow-lg shadow-slate-500/5">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-black italic tracking-tighter">
                        DIPLOT <span className="text-blue-500">PRO</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Информация за акаунта */}
                    <div className="flex items-center gap-3 bg-white/85 dark:bg-slate-900/80 px-4 py-2 rounded-2xl border border-white dark:border-slate-700/70 backdrop-blur-md">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Акаунт</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{user?.name || "Потребител"}</p>
                        </div>
                    </div>

                    {/* Бутон за изход */}
                    <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-500 font-bold text-sm transition-colors flex items-center gap-2 uppercase tracking-widest"
                    >
                        Изход <span>🚪</span>
                    </button>
                </div>
            </nav>

            {/* ОСНОВНО СЪДЪРЖАНИЕ */}
            <div className="flex flex-col items-center justify-center pt-32 p-10">
                <div className="bg-white/80 dark:bg-slate-900/60 border border-white/80 dark:border-slate-800/80 p-12 rounded-[50px] w-full max-w-3xl text-center shadow-2xl shadow-blue-500/10 relative overflow-hidden backdrop-blur-md">
                    {/* Декоративен градиент отзад */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>

                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8 uppercase italic">
                        Къде ще бъдеш <span className="text-blue-500">утре?</span>
                    </h2>

                    <textarea
                        value={wish}
                        onChange={(e) => setWish(e.target.value)}
                        placeholder="Напр: Искам на море за 3 дена до 800лв..."
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 p-8 rounded-[35px] text-lg text-slate-900 dark:text-slate-200 outline-none focus:border-blue-500 transition-all mb-8 min-h-[180px] shadow-inner"
                    />

                    <button
                        onClick={askGemma}
                        disabled={loading}
                        className="bg-blue-600 px-16 py-6 rounded-2xl font-black text-xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Анализиране...
                            </span>
                        ) : "✨ Виж моите оферти"}
                    </button>
                </div>

                <p className="mt-10 text-slate-600 text-sm font-medium uppercase tracking-[0.3em]">
                    Powered by Gemma 2:9B AI Engine
                </p>
            </div>
        </div>
    );
};

export default Home;