import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiHeart, FiMapPin, FiX,
    FiStar, FiNavigation, FiArrowRight, FiCheckCircle
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet Marker Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

const createCustomIcon = (bgColor = '#14b8a6') => new L.divIcon({
    html: `<div style="background: ${bgColor}; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 2px solid white;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [bookedTrip, setBookedTrip] = useState(null);
    const [activeImgType, setActiveImgType] = useState('exterior');

    const { results, aiMessage, duration } = location.state || { results: [], aiMessage: null, duration: 7 };

    //  ДЕФОЛТНИ ДАТИ
    const todayStr = new Date().toISOString().split('T')[0];
    const initialEndDate = new Date();
    initialEndDate.setDate(initialEndDate.getDate() + (duration || 7));
    const endStr = initialEndDate.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(endStr);

    const { scrollY } = useScroll();
    const blurBg = useTransform(scrollY, [0, 500], ['blur(0px)', 'blur(15px)']);

    const [favorites, setFavorites] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.favorites || [];
    });

    //  ДИНАМИЧНО ПРЕСМЯТАНЕ НА ДНИТЕ
    const actualDuration = useMemo(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    }, [startDate, endDate]);

    const filteredHotels = useMemo(() => {
        if (!aiMessage || !aiMessage.recommendations || aiMessage.recommendations.length === 0) {
            return results.slice(0, 3);
        }

        const matchedHotels = [];
        aiMessage.recommendations.forEach(rec => {
            const foundHotel = results.find(h => h.name === rec.hotelName);
            if (foundHotel) matchedHotels.push(foundHotel);
        });

        if (matchedHotels.length === 0) {
            return results.slice(0, 3);
        }

        return matchedHotels.slice(0, 3);
    }, [results, aiMessage]);

    const getAiReason = (hotelName) => {
        if (aiMessage?.recommendations) {
            const rec = aiMessage.recommendations.find(r => r.hotelName === hotelName);
            if (rec && rec.reason) return rec.reason;
        }
        return "Ексклузивна селекция, отговаряща на вашия стил и критерии.";
    };

    const toggleFavorite = async (hotelId) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?._id) return alert("Моля, влезте в профила си.");
        try {
            const res = await axios.post(`http://localhost:5000/api/users/${storedUser._id}/favorite`, { hotelId });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setFavorites(res.data.favorites);
        } catch (error) { console.error(error); }
    };

    const handleBook = async (hotel) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?._id) { navigate('/login'); return; }
        try {
            const res = await axios.post(`http://localhost:5000/api/users/${storedUser._id}/book`, {
                hotel,
                duration: actualDuration,
                startDate
            });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setBookedTrip(res.data.trip);
        } catch (error) {
            alert(error.response?.data?.message || "Грешка при резервация.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C14] font-sans selection:bg-teal-500/30 transition-colors duration-700">

            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-indigo-500/5 dark:from-teal-500/10 dark:to-[#080C14]"></div>
                <motion.div style={{ filter: blurBg }} className="absolute inset-0 opacity-40 dark:opacity-20 bg-[url('https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=2500&q=80')] bg-cover bg-center" />
            </div>

            <div className="relative z-10 pt-32 pb-40 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">

                <motion.button
                    onClick={() => navigate('/home')}
                    className="mb-20 inline-flex items-center gap-3 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase text-[9px] tracking-[0.5em] transition-all"
                    whileHover={{ x: -8 }}
                >
                    <FiArrowLeft /> Назад
                </motion.button>

                <motion.header className="mb-28" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-4 mb-8">
                        <span className="h-[1px] w-8 bg-teal-500/60"></span>
                        <span className="text-teal-600 dark:text-teal-400 font-bold text-[10px] uppercase tracking-[0.6em]">Premium Selection</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-12">
                        Вашето <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">следващо ниво.</span>
                    </h1>
                    <div className="max-w-2xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] shadow-sm">
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
                            "{aiMessage?.rawText || "Нашият AI анализира вашите предпочитания и подбра най-ексклузивните дестинации за вашия престой."}"
                        </p>
                    </div>
                </motion.header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
                    {filteredHotels.map((hotel, idx) => {
                        const isFav = favorites.includes(hotel._id);
                        return (
                            <motion.div
                                key={hotel._id}
                                onClick={() => { setSelectedHotel(hotel); setActiveImgType('exterior'); }}
                                className="group cursor-pointer"
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                            >
                                <div className="relative w-full aspect-[3/4.5] rounded-[3rem] overflow-hidden mb-10 shadow-2xl group-hover:shadow-teal-500/20 transition-all duration-700">
                                    <img
                                        src={hotel.images?.exterior || hotel.image}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                                        alt={hotel.name}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>

                                    <div className="absolute top-8 left-8 bg-white/90 dark:bg-black/40 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 shadow-xl">
                                        <FiStar className="text-yellow-500 fill-yellow-500 w-3.5 h-3.5" /> {hotel.rating || 5} Rating
                                    </div>

                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(hotel._id); }}
                                        className="absolute top-8 right-8 w-12 h-12 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl"
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    >
                                        <FiHeart className={`w-5 h-5 ${isFav ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                                    </motion.button>
                                </div>

                                <div className="px-4">
                                    <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
                                        <FiMapPin /> {hotel.location}
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-8 group-hover:text-teal-500 transition-colors">
                                        {hotel.name}
                                    </h4>

                                    <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-white/10">
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Ориентировъчна цена</p>
                                            <p className="font-black text-2xl text-slate-900 dark:text-white">{hotel.pricePerNight * duration} лв.</p>
                                        </div>
                                        <div className="w-14 h-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center transition-all group-hover:translate-x-2 shadow-xl">
                                            <FiArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/*  THE GALLANT MODAL */}
            <AnimatePresence>
                {selectedHotel && (
                    <motion.div
                        className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center z-[100] p-4 md:p-10"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => { setSelectedHotel(null); setBookedTrip(null); }}
                    >
                        <motion.div
                            className="bg-white dark:bg-[#0D121F] w-full max-w-7xl max-h-[95vh] rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative border border-white/10"
                            initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ЛЯВА СЕКЦИЯ: ИНТЕРАКТИВНА ГАЛЕРИЯ */}
                            <div className="w-full lg:w-[50%] h-[300px] lg:h-auto relative bg-slate-900 overflow-hidden shrink-0">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImgType}
                                        src={selectedHotel.images?.[activeImgType]}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"; }}
                                    />
                                </AnimatePresence>

                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-black/40 backdrop-blur-2xl p-2 rounded-2xl border border-white/10">
                                    {['exterior', 'room', 'amenity'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setActiveImgType(type)}
                                            className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeImgType === type ? 'bg-white text-black shadow-xl' : 'text-white/60 hover:text-white'}`}
                                        >
                                            {type === 'exterior' ? 'Екстериор' : type === 'room' ? 'Сюит' : 'Удобства'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ДЯСНА СЕКЦИЯ: ДЕТАЙЛИ И КАРТА */}
                            <div className="w-full lg:w-[50%] p-10 md:p-16 flex flex-col overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="space-y-4">
                                        <p className="text-teal-500 font-bold uppercase text-[9px] tracking-[0.5em] flex items-center gap-3">
                                            <span className="w-8 h-[1px] bg-teal-500/40"></span> Platinum Experience
                                        </p>
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                                            {selectedHotel.name}
                                        </h2>
                                        <div className="flex items-center gap-2.5 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                            <FiMapPin className="text-teal-500 w-4 h-4" /> {selectedHotel.location}
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedHotel(null); setBookedTrip(null); }} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg shrink-0">
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>

                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light italic mb-10 pl-6 border-l-2 border-teal-500/30">
                                    {getAiReason(selectedHotel.name)}
                                </p>

                                {/* Mini Map */}
                                <div className="h-44 rounded-[2.5rem] overflow-hidden mb-12 border border-slate-200 dark:border-white/5 relative shadow-inner shrink-0">
                                    <MapContainer center={[selectedHotel.lat || 0, selectedHotel.lng || 0]} zoom={14} className="h-full w-full" zoomControl={false}>
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                        <Marker position={[selectedHotel.lat || 0, selectedHotel.lng || 0]} icon={createCustomIcon('#14b8a6')} />
                                    </MapContainer>
                                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] z-[400]"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-10 shrink-0">
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Най-близко летище</h3>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedHotel.nearestAirport?.name} ({selectedHotel.nearestAirport?.code})</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Транспорт</h3>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">VIP Mercedes S-Class</p>
                                    </div>
                                </div>

                                {/*  DATES & ACTION BAR */}
                                <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex flex-col xl:flex-row gap-4 mb-6">
                                        <div className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Настаняване</p>
                                            <input
                                                type="date"
                                                value={startDate}
                                                min={todayStr}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full bg-transparent text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Напускане</p>
                                            <input
                                                type="date"
                                                value={endDate}
                                                min={startDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full bg-transparent text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Общо за {actualDuration} нощувки</p>
                                            <p className="text-4xl font-black text-slate-900 dark:text-white">{selectedHotel.pricePerNight * actualDuration} лв.</p>
                                        </div>
                                        {!bookedTrip ? (
                                            <button
                                                onClick={() => handleBook(selectedHotel)}
                                                className="w-full sm:w-auto flex-1 max-w-[280px] py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-teal-500 hover:text-white transition-all active:scale-95"
                                            >
                                                Запази почивката
                                            </button>
                                        ) : (
                                            <div className="w-full sm:w-auto flex-1 max-w-[280px] text-center">
                                                <button onClick={() => navigate('/my-trips')} className="w-full py-4 mb-2 bg-teal-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-all">
                                                    <FiCheckCircle className="animate-pulse w-5 h-5" /> Към Моите Почивки
                                                </button>
                                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Изберете логистика (Полет / Кола)</p>
                                            </div>
                                        )}
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

export default SearchResults;