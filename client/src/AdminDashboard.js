import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [data, setData] = useState({ users: [], hotels: [], flights: [], transport: [] });
    const [activeTab, setActiveTab] = useState('users');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchAllData = async () => {
        try {
            const [u, h, f, t] = await Promise.all([
                axios.get('http://localhost:5000/api/users'),
                axios.get('http://localhost:5000/api/hotels'),
                axios.get('http://localhost:5000/api/flights'),
                axios.get('http://localhost:5000/api/transport')
            ]);
            setData({ users: u.data, hotels: h.data, flights: f.data, transport: t.data });
        } catch (err) { console.error("Грешка при зареждане:", err); }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/home'); return; }
        fetchAllData();
    }, []);

    // 🛠️ Динамично пресмятане на стила на почивка
    const getCalculatedStyle = (targetUser) => {
        if (!targetUser.pastTrips || targetUser.pastTrips.length === 0) return 'Няма история';

        const counts = {};
        targetUser.pastTrips.forEach(trip => {
            let cat = trip.type;
            if (!cat && trip.hotelName?.toLowerCase().includes('сноу')) cat = 'Ski';
            if (!cat) cat = 'Стандартна';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        const topCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

        const translations = { 'Ski': 'Зимна / Ски почивка', 'Beach': 'Морска почивка', 'Culture': 'Културен туризъм', 'City': 'Градска разходка', 'Mountain': 'Планински преход' };
        return translations[topCategory] || topCategory;
    };

    // 💰 Динамичен бюджет
    const getCalculatedBudget = (targetUser) => {
        if (!targetUser.pastTrips || targetUser.pastTrips.length === 0) return 'Няма данни';
        const totalAvg = targetUser.pastTrips.reduce((acc, trip) => acc + ((trip.totalPrice || 0) / (trip.duration || 1)), 0) / targetUser.pastTrips.length;
        if (totalAvg > 250) return "ВИСОК / PREMIUM";
        if (totalAvg > 100) return "СРЕДЕН";
        return "ИКОНОМИЧЕН";
    };

    // 🤖 Извикваме НОВИЯ AI маршрут за Админ панела
    const generateAIOffer = async (targetUser) => {
        setLoadingAI(true);
        try {
            const history = targetUser.pastTrips?.map(t => t.hotelName).join(', ') || "няма предни резервации";

            // ВАЖНО: Използваме новия адрес /api/admin/ai-offer
            const res = await axios.post('http://localhost:5000/api/admin/ai-offer', {
                userName: targetUser.name,
                history: history
            });

            alert(`🤖 ПЕРСОНАЛИЗИРАН СЪВЕТ ЗА ${targetUser.name.toUpperCase()}:\n\nПредложение: ${res.data.recommendation}\nОбосновка: ${res.data.reason}`);
        } catch (err) {
            alert("AI моделът не успя да генерира отговор.");
        }
        setLoadingAI(false);
    };

    return (
        <div className="min-h-screen text-slate-700 dark:text-slate-200 p-8 font-sans transition-colors">
            <div className="max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-10 bg-white/75 dark:bg-slate-900/60 p-6 rounded-3xl border border-white dark:border-slate-800/70 backdrop-blur-xl shadow-2xl shadow-blue-500/10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white italic">DIPLOT <span className="text-blue-500">ADMIN</span></h1>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Travel Management System</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="bg-red-500/10 hover:bg-red-500 text-red-500 px-6 py-2 rounded-xl font-bold transition-all border border-red-500/20 shadow-lg shadow-red-500/5">Изход</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Потребители" count={data.users.length} icon="👤" color="from-purple-500 to-indigo-600" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <StatCard title="Хотели" count={data.hotels.length} icon="🏨" color="from-blue-500 to-cyan-600" active={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} />
                    <StatCard title="Полети" count={data.flights.length} icon="✈️" color="from-emerald-500 to-teal-600" active={activeTab === 'flights'} onClick={() => setActiveTab('flights')} />
                    <StatCard title="Транспорт" count={data.transport.length} icon="🚗" color="from-orange-500 to-yellow-600" active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} />
                </div>

                <div className="bg-white/80 dark:bg-slate-900/60 border border-white dark:border-slate-800/70 rounded-[45px] p-10 shadow-2xl shadow-blue-500/10 min-h-[500px] backdrop-blur-md">
                    <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
                        <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                        {activeTab === 'users' ? 'Списък Клиенти' : activeTab === 'hotels' ? 'Наличност в Хотелите' : activeTab === 'flights' ? 'Активни Полетни Билети' : 'Логистика на Трансфери'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeTab === 'users' && data.users.map(u => (
                            <div key={u._id} onClick={() => setSelectedUser(u)} className="bg-white/80 dark:bg-slate-800/45 p-6 rounded-[35px] border border-slate-200 dark:border-slate-700/50 flex items-center gap-5 cursor-pointer hover:border-purple-500 transition-all group">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-2xl text-purple-500 group-hover:scale-110 transition-transform">👤</div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-lg">{u.name}</p>
                                    <p className="text-xs text-slate-500 italic lowercase">{u.email}</p>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'hotels' && data.hotels.map(h => (
                            <div key={h._id} className="bg-white/80 dark:bg-slate-800/45 p-6 rounded-[35px] border border-slate-200 dark:border-slate-700/50 flex items-center gap-5">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl text-blue-500">🏨</div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-lg">{h.name}</p>
                                    <p className={`text-[10px] font-black uppercase ${h.roomsAvailable > 0 ? 'text-blue-400' : 'text-red-500'}`}>{h.roomsAvailable} свободни стаи</p>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'flights' && data.flights.map((f, idx) => (
                            <div key={idx} className="bg-white/80 dark:bg-slate-800/45 p-6 rounded-[35px] border border-slate-200 dark:border-slate-700/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 text-xl">✈️</div>
                                    <span className="bg-slate-900 px-3 py-1 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">{f.number || "FB-TBA"}</span>
                                </div>
                                <p className="font-bold text-slate-900 dark:text-white">{f.from || "София"} ➔ {f.to || "Дестинация"}</p>
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between">
                                    <p className="text-[10px] text-slate-500 uppercase">Място: <span className="text-slate-900 dark:text-white">{f.seat || "--"}</span></p>
                                    <p className="text-[10px] text-slate-500 uppercase">Пътник: <span className="text-blue-400">{f.user || "Клиент"}</span></p>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'transport' && data.transport.map((t, idx) => (
                            <div key={idx} className="bg-white/80 dark:bg-slate-800/45 p-6 rounded-[35px] border border-slate-200 dark:border-slate-700/50">
                                <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-xl text-orange-500 mb-4">🚗</div>
                                <p className="font-bold text-slate-900 dark:text-white">{t.service || "VIP Трансфер"}</p>
                                <p className="text-xs text-slate-400 mt-1 italic">Вземане от: {t.pickup || "Адрес"}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-[10px] text-orange-400 font-black uppercase">⏰ {t.time || "05:00"}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Пътник: <span className="text-blue-400">{t.user || "Клиент"}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data[activeTab].length === 0 && <div className="text-center py-24 opacity-20 italic text-2xl font-black">НЯМА ДАННИ В ТАЗИ КАТЕГОРИЯ</div>}
                </div>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white/90 dark:bg-slate-900/90 border border-white dark:border-slate-800 w-full max-w-5xl rounded-[60px] p-14 relative shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-10 right-10 w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all hover:rotate-90">✕</button>

                        <div className="flex items-center gap-10 mb-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[35px] flex items-center justify-center text-5xl shadow-2xl shadow-purple-500/30 font-black text-white">{selectedUser.name.charAt(0)}</div>
                            <div>
                                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedUser.name}</h2>
                                <p className="text-purple-400 font-bold uppercase text-xs tracking-[0.4em] mt-3">Клиентска Поща: {selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="bg-white/80 dark:bg-slate-800/45 p-10 rounded-[45px] border border-slate-200 dark:border-slate-700/50 backdrop-blur-md">
                                <h3 className="text-xs font-black text-slate-500 uppercase mb-8 tracking-widest flex items-center gap-2"><span>✨</span> Gemma AI Персонализация</h3>
                                <div className="space-y-4 mb-10">
                                    <DetailBoxSmall label="Предпочитан Стил" value={getCalculatedStyle(selectedUser)} />
                                    <DetailBoxSmall label="Бюджетна Група" value={getCalculatedBudget(selectedUser)} />
                                </div>
                                <button
                                    onClick={() => generateAIOffer(selectedUser)}
                                    disabled={loadingAI}
                                    className="w-full bg-purple-600 hover:bg-purple-500 text-white py-6 rounded-3xl font-black text-sm transition-all shadow-xl shadow-purple-600/30 active:scale-95 disabled:opacity-50"
                                >
                                    {loadingAI ? "АНАЛИЗИРАНЕ НА ИСТОРИЯ..." : "✨ ГЕНЕРИРАЙ AI ПРЕДЛОЖЕНИЕ"}
                                </button>
                            </div>

                            <div className="bg-white/80 dark:bg-slate-800/45 p-10 rounded-[45px] border border-slate-200 dark:border-slate-700/50 max-h-[450px] overflow-y-auto custom-scrollbar backdrop-blur-md">
                                <h3 className="text-xs font-black text-slate-500 uppercase mb-8 tracking-widest flex items-center gap-2"><span>📂</span> Хронология на пътуванията</h3>
                                {selectedUser.pastTrips?.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedUser.pastTrips.map((trip, i) => (
                                            <div key={i} onClick={() => setSelectedTrip(trip)} className="bg-white dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all flex justify-between items-center group">
                                                <div>
                                                    <p className="text-slate-900 dark:text-white font-black text-lg">{trip.hotelName}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-black mt-1 tracking-widest">📅 Резервирано на: {trip.bookingDate}</p>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">➔</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 opacity-30 italic text-sm">Все още няма направени резервации.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedTrip && (
                <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center z-[150] p-6 animate-in zoom-in duration-300">
                    <div className="bg-white/90 dark:bg-slate-900/90 border border-blue-500/30 w-full max-w-lg rounded-[60px] p-14 relative shadow-2xl shadow-blue-500/10 overflow-hidden backdrop-blur-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px]"></div>
                        <button onClick={() => setSelectedTrip(null)} className="absolute top-10 right-10 text-slate-500 hover:text-slate-900 dark:hover:text-white text-2xl transition-all">✕</button>

                        <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-10 text-center tracking-tighter leading-tight italic">{selectedTrip.hotelName}</h4>

                        <div className="grid grid-cols-2 gap-6">
                            <DetailBox label="Сума" value={`${selectedTrip.totalPrice || selectedTrip.price} лв.`} icon="💰" />
                            <DetailBox label="Период" value={`${selectedTrip.duration} дни`} icon="🌙" />
                            <DetailBox label="Полет" value={selectedTrip.flight?.number || "FB100"} icon="✈️" />
                            <DetailBox label="Място" value={selectedTrip.flight?.seat || "12B"} icon="💺" />
                        </div>

                        <div className="mt-10 bg-blue-600/10 p-7 rounded-3xl border border-blue-500/20">
                            <p className="text-[10px] text-blue-400 font-black uppercase mb-2 tracking-widest text-center">Локация</p>
                            <p className="text-slate-900 dark:text-white text-base font-black text-center italic">📍 {selectedTrip.location || selectedTrip.destination || 'Виж в базата'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailBox = ({ label, value, icon }) => (
    <div className="bg-slate-100 dark:bg-slate-800/60 p-6 rounded-[30px] border border-slate-200 dark:border-slate-700/50 shadow-inner flex flex-col items-center">
        <p className="text-[9px] text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">{label}</p>
        <p className="text-slate-900 dark:text-white font-black text-sm flex items-center gap-3"><span className="text-xl">{icon}</span> {value}</p>
    </div>
);

const DetailBoxSmall = ({ label, value }) => (
    <div className="flex justify-between items-center bg-white dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{label}</span>
        <span className="text-white font-black text-xs uppercase bg-blue-600/10 px-4 py-1.5 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/5">{value}</span>
    </div>
);

const StatCard = ({ title, count, icon, color, active, onClick }) => (
    <div onClick={onClick} className={`cursor-pointer p-8 rounded-[45px] border transition-all duration-700 relative overflow-hidden ${active ? `bg-white dark:bg-slate-900 border-blue-500 scale-105 shadow-2xl shadow-blue-500/20` : 'bg-white/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 shadow-lg'}`}>
        {active && <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-[40px]"></div>}
        <div className={`bg-gradient-to-br ${color} w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl mb-8 shadow-2xl shadow-black/50 transition-transform group-hover:scale-110`}>{icon}</div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{title}</p>
        <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{count}</p>
    </div>
);

export default AdminDashboard;