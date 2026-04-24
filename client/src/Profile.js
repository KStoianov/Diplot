import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMapPin, FiX, FiDownload, FiStar, FiArrowRight, FiUser, FiMail } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

//  ИМПОРТ НА ГЛОБАЛНИЯ ЕЗИК
import { useLanguage } from './components/LanguageContext';

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

//  Конфигурация на сървъра
const API_URL = "http://localhost:5000";

//  Пътища към твоите авторски 3000x4000 снимки
const dayImages = [
    `${API_URL}/uploads/home_photos/day1.jpg`,
    `${API_URL}/uploads/home_photos/day2.jpg`
];

const nightImages = [
    `${API_URL}/uploads/home_photos/night1.jpg`,
    `${API_URL}/uploads/home_photos/night2.jpg`
];

const createCustomIcon = (bgColor = '#ef4444') => new L.divIcon({
    html: `<div style="background: ${bgColor}; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 3px solid white;"><svg viewBox="0 0 24 24" fill="white" style="width: 20px; height: 20px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg></div>`,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const Profile = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [favoriteHotels, setFavoriteHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [bookedTrip, setBookedTrip] = useState(null);
    const [bgImage, setBgImage] = useState('');
    const duration = 7;

    const { scrollY } = useScroll();
    const blurBg = useTransform(scrollY, [0, 400], ['blur(0px)', 'blur(25px)']);
    const scaleBg = useTransform(scrollY, [0, 1000], [1.0, 1.08]);

    const updateBackground = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const images = isDark ? nightImages : dayImages;
        const randomPic = images[Math.floor(Math.random() * images.length)];
        setBgImage(randomPic);
    };

    useEffect(() => {
        if (!user) { navigate('/login'); return; }

        updateBackground();

        axios.get(`${API_URL}/api/hotels`)
            .then(res => {
                const favs = res.data.filter(hotel => user.favorites?.includes(hotel._id));
                setFavoriteHotels(favs);
                setLoading(false);
            })
            .catch(err => {
                console.error("Грешка:", err);
                setLoading(false);
            });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') updateBackground();
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, [user, navigate]);

    const removeFavorite = async (hotelId) => {
        try {
            const res = await axios.post(`${API_URL}/api/users/${user._id}/favorite`, { hotelId });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            setFavoriteHotels(prev => prev.filter(h => h._id !== hotelId));
        } catch (error) { console.error(error); }
    };

    const handleBook = async (hotel) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?._id) { navigate('/login'); return; }
        try {
            const startDate = new Date().toISOString().split('T')[0];
            const res = await axios.post(`${API_URL}/api/users/${storedUser._id}/book`, { hotel, duration, startDate });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setBookedTrip(res.data.trip);
        } catch (error) {
            alert(error.response?.data?.message || "Възникна грешка при резервацията.");
        }
    };

    const downloadTicket = () => {
        if (!bookedTrip) return;
        const hotelName = bookedTrip.hotel?.name || bookedTrip.hotelName;
        const content = `DIPLOT TRAVEL\nХОТЕЛ: ${hotelName}\nЦЕНА: ${bookedTrip.totalPrice} лв.\nДАТА: ${bookedTrip.bookingDate}`;
        const element = document.createElement("a");
        element.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
        element.download = `Ticket_${hotelName}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0B1121]">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B1121] font-sans transition-colors relative">

            {/* 🎬 CINEMATIC BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div className="absolute inset-0 w-full h-full" style={{ filter: blurBg, scale: scaleBg }}>
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={bgImage} 
                            src={bgImage} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            transition={{ duration: 1.5 }} 
                            className="w-full h-full object-cover" 
                            style={{ objectPosition: 'center 35%' }}
                        />
                    </AnimatePresence>
                </motion.div>
                <div className="absolute inset-0 bg-white/40 dark:bg-[#0B1121]/80 transition-colors duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/70 to-transparent dark:from-[#0B1121] dark:via-[#0B1121]/80 transition-colors duration-1000"></div>
            </div>

            {/*  PROFILE HEADER */}
            <div className="relative z-10 pt-32 pb-20 px-4 md:px-8">
                <motion.div
                    className="max-w-5xl mx-auto bg-white/40 dark:bg-[#151E32]/40 backdrop-blur-3xl border border-white/60 dark:border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center gap-10"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex justify-center md:justify-start items-center gap-3 mb-3">
                            <span className="text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-[0.2em]">{t('premiumMember')}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{user?.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-full border border-white/40 dark:border-white/5 text-sm text-slate-600 dark:text-slate-300">
                                <FiMail className="text-teal-500" /> {user?.email}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 rounded-full border border-white/40 dark:border-white/5 text-sm text-slate-600 dark:text-slate-300">
                                <FiUser className="text-teal-500" /> {t('activeProfile')}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/*  FAVORITES SECTION */}
            <div className="relative z-10 max-w-[1100px] mx-auto px-4 pb-40">
                <div className="flex items-center gap-4 mb-12 px-4">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('favoritePlaces')}</h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-teal-500/50 to-transparent"></div>
                </div>

                {favoriteHotels.length === 0 ? (
                    <div className="bg-white/30 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-[3rem] p-20 text-center">
                        <div className="text-6xl mb-6 opacity-20">🌍</div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t('emptyFavoritesTitle')}</h3>
                        <p className="text-slate-500 mt-2 mb-8">{t('emptyFavoritesDesc')}</p>
                        <button onClick={() => navigate('/home')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-full font-bold shadow-xl transition-all hover:scale-105">{t('backToSearch')}</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 justify-items-center">
                        {favoriteHotels.map((hotel, idx) => (
                            <motion.div
                                key={hotel._id}
                                onClick={() => setSelectedHotel(hotel)}
                                className="group cursor-pointer flex flex-col w-full max-w-[320px]"
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                            >
                                <div className="relative w-full aspect-[3/4.2] rounded-[2rem] overflow-hidden mb-5 shadow-lg border border-slate-200/50 dark:border-white/5">
                                    <img
                                        src={hotel.images?.exterior || hotel.image}
                                        alt={hotel.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105"
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"; }}
                                    />
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/40 transition-colors duration-500"></div>

                                    <div className="absolute top-4 left-4 bg-white/40 dark:bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest shadow-sm">
                                        {t(hotel.category)}
                                    </div>
                                    
                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); removeFavorite(hotel._id); }}
                                        className="absolute top-4 right-4 w-8 h-8 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-xl"
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    >
                                        <FiHeart className="fill-current w-4 h-4" />
                                    </motion.button>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-1.5 text-white/80 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                                            <FiMapPin className="text-teal-400 w-3.5 h-3.5" />{hotel.location}
                                        </div>
                                        <h4 className="text-2xl font-bold text-white leading-snug mb-3">{hotel.name}</h4>
                                        <div className="flex justify-between items-center pt-3 border-t border-white/20">
                                            <div>
                                                <p className="text-[9px] text-white/60 uppercase tracking-widest font-black mb-0.5">{t('perNight')}</p>
                                                <p className="font-black text-lg text-white">{hotel.pricePerNight} {language === 'bg' ? 'лв.' : 'BGN'}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-teal-500 transition-all">
                                                <FiArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/*  MODAL WITH LEAFLET */}
            <AnimatePresence>
                {selectedHotel && (
                    <motion.div
                        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-8"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => { setSelectedHotel(null); setBookedTrip(null); }}
                    >
                        <motion.div
                            className="bg-white dark:bg-[#0B1121] border border-white/20 w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full md:w-[45%] h-72 md:h-auto bg-slate-200 relative flex-shrink-0 border-r border-white/10">
                                <div className="absolute inset-0 z-0">
                                    <MapContainer center={[selectedHotel.lat || 42, selectedHotel.lng || 23]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                        <Marker position={[selectedHotel.lat || 42, selectedHotel.lng || 23]} icon={createCustomIcon()}>
                                            <Popup><strong>{selectedHotel.name}</strong></Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            </div>

                            <div className="w-full md:w-[55%] p-10 flex flex-col overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{selectedHotel.name}</h2>
                                        <div className="flex items-center gap-2 text-teal-600 font-bold uppercase text-xs tracking-widest">
                                            <FiMapPin /> {selectedHotel.location}
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedHotel(null); setBookedTrip(null); }} className="p-3 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-red-500 hover:text-white transition-all shrink-0">
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-lg">{selectedHotel.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">{t('nearestAirport')}</h3>
                                        <p className="font-bold text-slate-900 dark:text-white">{selectedHotel.nearestAirport?.name} ({selectedHotel.nearestAirport?.code})</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                                        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">{t('transport')}</h3>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm leading-relaxed">{t('vipTransportDesc') || 'VIP Mercedes Service Included'}</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('totalFor')} {duration} {t('nights')}</p>
                                        <p className="text-4xl font-black text-slate-900 dark:text-white">{selectedHotel.pricePerNight * duration} {language === 'bg' ? 'лв.' : 'BGN'}</p>
                                    </div>

                                    {!bookedTrip ? (
                                        <button onClick={() => handleBook(selectedHotel)} className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all">
                                            {t('bookNow')}
                                        </button>
                                    ) : (
                                        <button onClick={downloadTicket} className="w-full sm:w-auto bg-teal-500 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
                                            <FiDownload /> {t('downloadReceipt')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;