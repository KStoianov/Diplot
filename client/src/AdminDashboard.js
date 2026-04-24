import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiX, FiInfo, FiMapPin, FiUser, FiHome, FiNavigation, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
    const [data, setData] = useState({ users: [], hotels: [] });
    const [activeTab, setActiveTab] = useState('users');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchAllData = async () => {
        try {
            const [u, h] = await Promise.all([
                axios.get('http://localhost:5000/api/users'),
                axios.get('http://localhost:5000/api/hotels')
            ]);
            setData({ users: u.data, hotels: h.data });
        } catch (err) { console.error("Грешка при зареждане:", err); }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/home'); return; }
        fetchAllData();
    }, [user, navigate]);

    //  ДИНАМИЧНО ИЗВЛИЧАНЕ НА ПОЛЕТИ И ТРАНСПОРТ (с имената на клиентите)
    const getAllFlights = () => {
        return data.users.flatMap(u => (u.pastTrips || []).filter(t => t.flight).map(t => ({
            ...t.flight, userName: u.name, date: t.bookingDate
        })));
    };

    const getAllTransports = () => {
        return data.users.flatMap(u => (u.pastTrips || []).filter(t => t.transport).map(t => ({
            ...t.transport, userName: u.name, date: t.bookingDate
        })));
    };

    const allFlights = getAllFlights();
    const allTransports = getAllTransports();

    //  СТИЛ И БЮДЖЕТ
    const getCalculatedStyle = (targetUser) => {
        if (!targetUser.pastTrips || targetUser.pastTrips.length === 0) return 'Няма история';
        const counts = {};
        targetUser.pastTrips.forEach(trip => {
            let cat = trip.type;
            if (!cat && trip.hotel?.name?.toLowerCase().includes('сноу')) cat = 'Ski';
            if (!cat) cat = 'Стандартна';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        const topCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        const translations = { 'Ski': 'Зимна / Ски почивка', 'Beach': 'Морска почивка', 'Culture': 'Културен туризъм', 'City': 'Градска разходка', 'Mountain': 'Планински преход' };
        return translations[topCategory] || topCategory;
    };

    const getCalculatedBudget = (targetUser) => {
        if (!targetUser.pastTrips || targetUser.pastTrips.length === 0) return 'Няма данни';
        const totalAvg = targetUser.pastTrips.reduce((acc, trip) => acc + ((trip.totalPrice || 0) / (trip.duration || 1)), 0) / targetUser.pastTrips.length;
        if (totalAvg > 250) return "ВИСОК / PREMIUM";
        if (totalAvg > 100) return "СРЕДЕН";
        return "ИКОНОМИЧЕН";
    };

    const generateAIOffer = async (targetUser) => {
        setLoadingAI(true);
        try {
            const history = targetUser.pastTrips?.map(t => t.hotel?.name || t.hotelName).join(', ') || "няма предни резервации";
            const res = await axios.post('http://localhost:5000/api/admin/ai-offer', { userName: targetUser.name, history: history });
            alert(`🤖 ПЕРСОНАЛИЗИРАН СЪВЕТ ЗА ${targetUser.name.toUpperCase()}:\n\nПредложение: ${res.data.recommendation}\nОбосновка: ${res.data.reason}`);
        } catch (err) { alert("AI моделът не успя да генерира отговор."); }
        setLoadingAI(false);
    };

    const deleteTrip = async (userId, tripIndex, e) => {
        e.stopPropagation();
        if (!window.confirm("Сигурни ли сте, че искате да изтриете тази резервация?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}/trip/${tripIndex}`);
            const updatedUser = { ...selectedUser };
            updatedUser.pastTrips.splice(tripIndex, 1);
            setSelectedUser(updatedUser);
            setData(prev => ({ ...prev, users: prev.users.map(u => u._id === userId ? updatedUser : u) }));
            fetchAllData();
        } catch (error) { console.error(error); alert("Грешка при изтриване!"); }
    };

    //  КАЛЕНДАРНА ЛОГИКА
    const getNext30Days = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const getTakenRoomsForDate = (hotelName, targetDate) => {
        let takenRoomsCount = 0;
        data.users.forEach(u => {
            u.pastTrips?.forEach(trip => {
                const name = trip.hotel?.name || trip.hotelName;
                if (name === hotelName && trip.bookingDate) {
                    const parts = trip.bookingDate.split('.');
                    if (parts.length === 3) {
                        const startDate = new Date(parts[2], parts[1] - 1, parts[0]);
                        const endDate = new Date(startDate);
                        endDate.setDate(startDate.getDate() + (trip.duration || 7));
                        const targetTime = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
                        const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
                        const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
                        if (targetTime >= startTime && targetTime < endTime) takenRoomsCount += 1;
                    }
                }
            });
        });
        return takenRoomsCount;
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B1121] text-slate-700 dark:text-slate-200 p-6 md:p-10 font-sans transition-colors relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2500&q=80')] bg-cover bg-center opacity-5 pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-12 bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 rounded-[2.5rem] border border-white dark:border-slate-800/70 backdrop-blur-2xl shadow-2xl shadow-blue-500/5">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white italic leading-none mb-2">
                            DIPLOT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">ADMIN</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Command Center</p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="bg-slate-100 hover:bg-red-500 dark:bg-slate-800 dark:hover:bg-red-500 text-slate-600 dark:text-slate-300 hover:text-white px-8 py-3 rounded-full font-bold transition-all text-xs uppercase tracking-widest shadow-xl">
                        Изход
                    </button>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                    <StatCard title="Клиенти" count={data.users.length} icon={<FiUser />} color="from-purple-500 to-indigo-600" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <StatCard title="Хотели" count={data.hotels.length} icon={<FiHome />} color="from-blue-500 to-cyan-600" active={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} />
                    <StatCard title="Полети" count={allFlights.length} icon={<FiNavigation />} color="from-indigo-500 to-blue-600" active={activeTab === 'flights'} onClick={() => setActiveTab('flights')} />
                    <StatCard title="Транспорт" count={allTransports.length} icon={<FiCalendar />} color="from-teal-500 to-emerald-600" active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} />
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/80 dark:bg-slate-900/60 border border-white dark:border-slate-800/70 rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5 min-h-[600px] backdrop-blur-xl">
                    <h2 className="text-2xl font-black mb-12 flex items-center gap-4 text-slate-900 dark:text-white uppercase tracking-widest text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                        {activeTab === 'users' ? 'Списък Клиенти' : activeTab === 'hotels' ? 'Управление на Хотели и Календари' : activeTab === 'flights' ? 'Активни Полети' : 'Логистика на Трансфери'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'users' && data.users.map(u => (
                            <motion.div whileHover={{ y: -5 }} key={u._id} onClick={() => setSelectedUser(u)} className="bg-white/90 dark:bg-slate-800/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center gap-5 cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-all shadow-lg group">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"><FiUser /></div>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white text-lg leading-tight">{u.name}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">{u.pastTrips?.length || 0} Резервации</p>
                                </div>
                            </motion.div>
                        ))}

                        {activeTab === 'hotels' && data.hotels.map(h => (
                            <motion.div whileHover={{ y: -5 }} key={h._id} onClick={() => setSelectedHotel(h)} className="bg-white/90 dark:bg-slate-800/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 flex items-center gap-5 cursor-pointer hover:border-blue-500 transition-all shadow-lg group">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><FiHome /></div>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white text-lg leading-tight truncate max-w-[150px]">{h.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-slate-400">Цъкни за календар 📅</p>
                                </div>
                            </motion.div>
                        ))}

                        {/*  ОБНОВЕН ТАБ ПОЛЕТИ */}
                        {activeTab === 'flights' && allFlights.map((f, idx) => (
                            <div key={idx} className="bg-white/90 dark:bg-slate-800/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-lg">
                                <div className="flex justify-between items-start mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Клиент</p>
                                        <p className="font-black text-indigo-500 text-sm">{f.userName}</p>
                                    </div>
                                    <span className="bg-slate-100 dark:bg-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest">{f.number || "FB-TBA"}</span>
                                </div>
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Излитане</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">{f.departureTime || '--:--'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Кацане</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">{f.arrivalTime || '--:--'}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-slate-500 text-center mb-4 bg-slate-50 dark:bg-slate-900/50 py-2 rounded-lg">{f.from} ➔ {f.to}</p>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Дата: <span className="text-slate-900 dark:text-white">{f.date}</span></p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Място: <span className="text-indigo-500">{f.seat || "--"}</span></p>
                                </div>
                            </div>
                        ))}

                        {/*  ОБНОВЕН ТАБ ТРАНСПОРТ */}
                        {activeTab === 'transport' && allTransports.map((t, idx) => (
                            <div key={idx} className="bg-white/90 dark:bg-slate-800/60 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-lg flex flex-col">
                                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700/50 pb-4">
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Клиент</p>
                                        <p className="font-black text-teal-500 text-sm">{t.userName}</p>
                                    </div>
                                    <div className="bg-teal-500/10 w-10 h-10 rounded-full flex items-center justify-center text-teal-500">🚗</div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Град на тръгване</p>
                                    <p className="font-black text-slate-900 dark:text-white text-lg mb-4">{t.pickupLocation || t.pickup || 'Не е посочен'}</p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-lg">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Час на взимане:</span>
                                            <span className="text-xs font-black text-teal-500">{t.pickupTime || t.time || '--:--'}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-lg">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Път до летище:</span>
                                            <span className="text-xs font-black text-slate-900 dark:text-white">{t.toAirportTime || '-- мин.'}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-lg">
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Трансфер до хотел:</span>
                                            <span className="text-xs font-black text-slate-900 dark:text-white">{t.arrivalTransferTime || '-- мин.'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(activeTab === 'flights' && allFlights.length === 0) || (activeTab === 'transport' && allTransports.length === 0) ? (
                        <div className="text-center py-32 opacity-20 text-lg uppercase tracking-widest font-black flex flex-col items-center justify-center"><FiInfo className="w-12 h-12 mb-4" /> Няма данни в тази категория</div>
                    ) : null}
                </motion.div>
            </div>

            {/*  USER MODAL */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 z-[100]">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-[#0D121F] border border-white/10 w-full max-w-6xl rounded-[3.5rem] p-8 md:p-16 relative shadow-2xl flex flex-col md:flex-row gap-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <button onClick={() => setSelectedUser(null)} className="absolute top-8 right-8 w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"><FiX className="text-xl" /></button>
                            <div className="w-full md:w-1/3 flex flex-col">
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-purple-500/30 font-black text-white mb-6">{selectedUser.name.charAt(0)}</div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-2">{selectedUser.name}</h2>
                                <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mb-10">{selectedUser.email}</p>
                                <div className="space-y-4 mb-10 bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                                    <DetailBoxSmall label="Стил" value={getCalculatedStyle(selectedUser)} />
                                    <DetailBoxSmall label="Бюджет" value={getCalculatedBudget(selectedUser)} />
                                </div>
                                <button onClick={() => generateAIOffer(selectedUser)} disabled={loadingAI} className="w-full mt-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-purple-600 dark:hover:bg-purple-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-50">
                                    {loadingAI ? "Анализиране..." : "AI Персонализация"}
                                </button>
                            </div>
                            <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-10 md:pt-0 md:pl-12">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase mb-8 tracking-[0.3em] flex items-center gap-2"><FiNavigation /> Хронология на пътуванията</h3>
                                {selectedUser.pastTrips?.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedUser.pastTrips.map((trip, i) => (
                                            <div key={i} className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex justify-between items-center group">
                                                <div className="flex-1 cursor-pointer" onClick={() => setSelectedTrip(trip)}>
                                                    <p className="text-slate-900 dark:text-white font-black text-lg group-hover:text-teal-500 transition-colors">{trip.hotel?.name || trip.hotelName}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black mt-2 tracking-widest flex items-center gap-2">
                                                        {trip.bookingDate} • {trip.duration} Дни <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded-md text-[8px] text-teal-500">Виж билета</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="font-black text-slate-900 dark:text-white text-lg">{trip.totalPrice} лв.</p>
                                                    <button onClick={(e) => deleteTrip(selectedUser._id, i, e)} className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"><FiTrash2 /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 opacity-30 italic text-sm">Клиентът няма направени резервации.</div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/*  ДЕТАЙЛЕН БИЛЕТ MODAL (С ЛОГИСТИКА) */}
            <AnimatePresence>
                {selectedTrip && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 z-[120]">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-[#0D121F] border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden relative shadow-2xl p-8 md:p-12">
                            <button onClick={() => setSelectedTrip(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 transition-all z-20"><FiX /></button>

                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 italic">{selectedTrip.hotel?.name || selectedTrip.hotelName}</h2>

                            <div className="space-y-6 bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5">
                                {/* Трансфер 1 */}
                                <div className="flex items-center gap-5">
                                    <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center text-teal-600 text-xl shrink-0">🚗</div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Тръгване от {selectedTrip.transport?.pickupLocation || selectedTrip.transport?.pickup || 'Адрес'}</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2"><FiClock className="text-teal-500" /> {selectedTrip.transport?.pickupTime || selectedTrip.transport?.time || '--:--'}</p>
                                        <p className="text-xs text-slate-400 mt-1">Очаквано време до летище: {selectedTrip.transport?.toAirportTime || '--'}</p>
                                    </div>
                                </div>

                                {/* Полет */}
                                <div className="flex items-center gap-5 border-y border-slate-200 dark:border-white/10 py-6">
                                    <div className="bg-indigo-500/20 w-12 h-12 rounded-full flex items-center justify-center text-indigo-600 text-xl shrink-0">✈️</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Излитане</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{selectedTrip.flight?.departureTime || '--:--'}</p>
                                            </div>
                                            <div className="w-full px-4 flex flex-col items-center">
                                                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-1">{selectedTrip.flight?.number}</p>
                                                <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-700 relative">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-[#121826] px-2 text-slate-400 text-xs">✈️</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Кацане</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{selectedTrip.flight?.arrivalTime || '--:--'}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 text-center">{selectedTrip.flight?.from || 'Летище'} ➔ {selectedTrip.flight?.to || 'Дестинация'}</p>
                                    </div>
                                    <div className="text-center pl-4 border-l border-slate-200 dark:border-white/10 shrink-0">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Място</p>
                                        <p className="text-2xl font-black text-indigo-500">{selectedTrip.flight?.seat || '--'}</p>
                                    </div>
                                </div>

                                {/* Трансфер 2 */}
                                <div className="flex items-center gap-5">
                                    <div className="bg-teal-500/20 w-12 h-12 rounded-full flex items-center justify-center text-teal-600 text-xl shrink-0">🏨</div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">VIP Трансфер до рецепция</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Време на пътуване: {selectedTrip.transport?.arrivalTransferTime || '--'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/*  ХОТЕЛ + КАЛЕНДАР MODAL */}
            <AnimatePresence>
                {selectedHotel && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 z-[110]">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-[#0D121F] border border-white/10 w-full max-w-5xl rounded-[3rem] overflow-hidden relative shadow-2xl max-h-[95vh] flex flex-col">
                            <button onClick={() => setSelectedHotel(null)} className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all z-20"><FiX /></button>
                            <div className="h-48 relative bg-slate-200 dark:bg-slate-800 shrink-0">
                                <img src={selectedHotel.images?.exterior || selectedHotel.image} alt="Hotel" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"; }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D121F] via-[#0D121F]/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-10 right-6">
                                    <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest mb-1"><FiMapPin /> {selectedHotel.location}</div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">{selectedHotel.name}</h2>
                                </div>
                            </div>
                            <div className="p-8 md:p-10 flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-10">
                                <div className="w-full md:w-1/3 space-y-4">
                                    <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl text-center">
                                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Общ брой стаи</p>
                                        <div className="text-4xl font-black text-slate-900 dark:text-white">{selectedHotel.roomsAvailable + getTakenRoomsForDate(selectedHotel.name, new Date())}</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 text-center">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Цена / Нощувка</p>
                                        <p className="font-black text-emerald-500 text-xl">{selectedHotel.pricePerNight} лв.</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-2/3">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-[0.3em] flex items-center gap-2"><FiCalendar /> Календар: Следващите 30 дни</h3>
                                    <div className="grid grid-cols-5 md:grid-cols-7 gap-3">
                                        {getNext30Days().map((date, i) => {
                                            const taken = getTakenRoomsForDate(selectedHotel.name, date);
                                            const isFullyBooked = taken >= (selectedHotel.roomsAvailable + taken) && taken > 0;
                                            const isPartiallyBooked = taken > 0 && !isFullyBooked;
                                            return (
                                                <div key={i} className={`p-3 rounded-2xl border text-center flex flex-col justify-center items-center h-20 transition-all ${isFullyBooked ? 'bg-red-500/10 border-red-500/30' : isPartiallyBooked ? 'bg-orange-500/10 border-orange-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                                                    <span className={`text-[10px] font-bold uppercase mb-1 ${isFullyBooked ? 'text-red-400' : isPartiallyBooked ? 'text-orange-400' : 'text-emerald-500'}`}>{date.toLocaleDateString('bg-BG', { weekday: 'short' })}</span>
                                                    <span className={`text-xl font-black ${isFullyBooked ? 'text-red-500' : isPartiallyBooked ? 'text-orange-500' : 'text-emerald-500'}`}>{date.getDate()}</span>
                                                    {taken > 0 && <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-1 ${isFullyBooked ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>{taken} Заети</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DetailBoxSmall = ({ label, value }) => (
    <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-white/5 last:border-0 last:pb-0">
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{label}</span>
        <span className="text-slate-900 dark:text-white font-black text-[11px] uppercase tracking-widest">{value}</span>
    </div>
);

const StatCard = ({ title, count, icon, color, active, onClick }) => (
    <div onClick={onClick} className={`cursor-pointer p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center ${active ? `bg-slate-900 dark:bg-white border-transparent scale-105 shadow-2xl` : 'bg-white/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:-translate-y-2 shadow-lg backdrop-blur-md'}`}>
        <div className={`bg-gradient-to-br ${color} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl text-white mb-6 shadow-xl`}>{icon}</div>
        <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${active ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500'}`}>{title}</p>
        <p className={`text-4xl md:text-5xl font-black tracking-tighter leading-none ${active ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>{count}</p>
    </div>
);

export default AdminDashboard;