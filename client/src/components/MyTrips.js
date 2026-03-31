import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import RoutingMachine from './RoutingMachine';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiArrowLeft, FiMapPin, FiNavigation, FiCalendar, FiBriefcase, FiX, FiCheckCircle, FiChevronRight, FiAlertCircle, FiClock, FiTrash2, FiDownload } from 'react-icons/fi';

// 🌍 ТУК Е ПОПРАВКАТА В ПЪТЯ:
import { useLanguage } from './LanguageContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

const dayImages = ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2500&q=80", "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2500&q=80"];
const nightImages = ["https://images.unsplash.com/photo-1514810771018-276192729582?auto=format&fit=crop&w=2500&q=80", "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=2500&q=80"];

const createCustomIcon = (bgColor = '#14b8a6') => new L.divIcon({
    html: `<div style="background: ${bgColor}; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.3); border: 2px solid white;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    className: 'custom-leaflet-icon', iconSize: [36, 36], iconAnchor: [18, 36]
});

const MyTrips = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage(); 
    
    const [user, setUser] = useState(null);
    const [pastTrips, setPastTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [pickupCities, setPickupCities] = useState({});
    const [pickupAddresses, setPickupAddresses] = useState({});
    const [wantLogistics, setWantLogistics] = useState({});
    const [loadingIndex, setLoadingIndex] = useState(null);
    const [activeRoute, setActiveRoute] = useState(null);
    const [travelMode, setTravelMode] = useState('driving');
    const [routeInfo, setRouteInfo] = useState(null);

    const { scrollY } = useScroll();
    const blurBg = useTransform(scrollY, [0, 400], ['blur(0px)', 'blur(20px)']);
    const [bgImage, setBgImage] = useState('');

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setBgImage(isDark ? nightImages[Math.floor(Math.random() * nightImages.length)] : dayImages[Math.floor(Math.random() * dayImages.length)]);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) navigate('/login');
        else {
            setUser(storedUser);
            if (storedUser.pastTrips) setPastTrips(storedUser.pastTrips.filter(trip => trip?.hotel?.name));
        }
    }, [navigate]);

    const handleFinalize = async (tripIndex, e, skipLogistics = false) => {
        e.stopPropagation();
        const city = pickupCities[tripIndex] || 'София';
        const address = pickupAddresses[tripIndex] || '';
        setLoadingIndex(tripIndex);
        try {
            const res = await axios.post(`http://localhost:5000/api/users/${user._id}/trip/${tripIndex}/logistics`, { pickupCity: city, pickupAddress: address, skipLogistics });
            const updatedUser = res.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setPastTrips(updatedUser.pastTrips.filter(trip => trip?.hotel?.name));
        } catch (error) { alert(error.response?.data?.message || "Error"); }
        setLoadingIndex(null);
    };

    const handleDeleteTrip = async (tripIndex, e) => {
        e.stopPropagation();
        if (!window.confirm(language === 'en' ? "Are you sure?" : "Сигурни ли сте?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${user._id}/trip/${tripIndex}`);
            const updatedUser = { ...user };
            updatedUser.pastTrips.splice(tripIndex, 1);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setPastTrips(updatedUser.pastTrips.filter(trip => trip?.hotel?.name));
        } catch (error) { alert("Error"); }
    };

    const toggleLogistics = (index, value) => setWantLogistics(prev => ({ ...prev, [index]: value }));

    const downloadReceipt = (trip, e) => {
        e.stopPropagation();
        const hotelName = trip.hotel?.name || trip.hotelName;
        let content = `====================================\n    DIPLOT TRAVEL - RECEIPT\n====================================\n\n`;
        if (language === 'bg') {
            content += `КЛИЕНТ: ${user?.name}\nХОТЕЛ: ${hotelName}\nЛОКАЦИЯ: ${trip.hotel?.location}\nПЕРИОД: ${trip.bookingDate} (${trip.duration} нощувки)\n\nПЛАТЕНА СУМА: ${trip.totalPrice} лв.\nСТАТУС: ✅ ПЛАТЕНО\n\n------------------------------------\n`;
            if (trip.status === 'confirmed' && trip.flight) {
                content += `[ ЛОГИСТИКА И ТРАНСФЕР ]\nАДРЕС НА ВЗИМАНЕ: ${trip.transport?.pickupLocation}\nЧАС НА ВЗИМАНЕ: ${trip.transport?.pickupTime}\n\nПОЛЕТ: ${trip.flight.number} (Място: ${trip.flight.seat})\nИЗЛИТАНЕ: ${trip.flight.departureTime} (${trip.flight.from})\nКАЦАНЕ: ${trip.flight.arrivalTime} (${trip.flight.to})\n`;
            } else {
                content += `[ ТРАНСПОРТ ]\nСобствен транспорт. Очакваме ви директно на рецепцията на хотела!\n`;
            }
        } else {
            content += `CLIENT: ${user?.name}\nHOTEL: ${hotelName}\nLOCATION: ${trip.hotel?.location}\nPERIOD: ${trip.bookingDate} (${trip.duration} nights)\n\nAMOUNT PAID: ${trip.totalPrice} BGN\nSTATUS: ✅ PAID\n\n------------------------------------\n`;
            if (trip.status === 'confirmed' && trip.flight) {
                content += `[ LOGISTICS & TRANSFER ]\nPICKUP ADDRESS: ${trip.transport?.pickupLocation}\nPICKUP TIME: ${trip.transport?.pickupTime}\n\nFLIGHT: ${trip.flight.number} (Seat: ${trip.flight.seat})\nDEPARTURE: ${trip.flight.departureTime} (${trip.flight.from})\nARRIVAL: ${trip.flight.arrivalTime} (${trip.flight.to})\n`;
            } else {
                content += `[ TRANSPORT ]\nOwn transport. We await you directly at the hotel reception!\n`;
            }
        }
        const element = document.createElement("a");
        element.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
        element.download = `Diplot_Receipt_${hotelName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(element); element.click(); document.body.removeChild(element);
    };

    if (pastTrips.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] dark:bg-[#080C14] text-slate-400">
                <FiBriefcase className="w-16 h-16 mb-6 opacity-20" />
                <p className="text-xl font-light italic mb-6">{t('noTrips')}</p>
                <button onClick={() => navigate('/home')} className="bg-teal-500 text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl transition-all hover:scale-105">{t('searchHoliday')}</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080C14] font-sans selection:bg-teal-500/30 transition-colors duration-700">
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#080C14] transition-colors duration-1000"></div>
                <motion.div key={bgImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="absolute inset-0 bg-cover bg-center opacity-20 blur-[10px]" style={{ filter: blurBg, backgroundImage: `url(${bgImage})` }} />
                <div className="absolute bottom-0 left-0 w-full h-[80vh] bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/40 to-transparent dark:from-[#080C14] dark:via-[#080C14]/70"></div>
            </div>

            <div className="relative z-10 pt-32 pb-40 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
                <motion.header className="mb-28" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <motion.button onClick={() => navigate('/home')} className="mb-12 inline-flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold uppercase text-[9px] tracking-[0.5em] transition-all" whileHover={{ x: -8 }}>
                        <FiArrowLeft /> {t('backToSearch')}
                    </motion.button>
                    <div className="flex items-center gap-4 mb-8">
                        <span className="h-[1px] w-8 bg-teal-500/60"></span>
                        <span className="text-teal-600 dark:text-teal-400 font-bold text-[10px] uppercase tracking-[0.6em]">{t('travelLog')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-6">
                        {t('myTripsTitle1')} <br />
                        <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500">{t('myTripsTitle2')}</span>
                    </h1>
                </motion.header>

                <div className="space-y-12 max-w-5xl mx-auto">
                    {pastTrips.map((trip, index) => {
                        const isPending = trip.status === 'pending_logistics' || (!trip.status && !trip.flight?.number && trip.status !== 'hotel_only');
                        const isHotelOnly = trip.status === 'hotel_only';
                        const wantsFlight = wantLogistics[index] !== false;

                        return (
                            <motion.div key={index} onClick={() => !isPending && setSelectedTrip(trip)} className={`group rounded-[3rem] border backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col md:flex-row ${isPending ? 'bg-white/80 dark:bg-[#0D121F]/80 border-orange-500/30' : 'bg-white/80 dark:bg-[#0D121F]/80 border-white/40 dark:border-white/5 cursor-pointer hover:border-teal-500/50'}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                                <button onClick={(e) => handleDeleteTrip(index, e)} className="absolute top-6 right-6 w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all z-20 shadow-md"><FiTrash2 /></button>
                                
                                <div className="w-full md:w-1/3 h-64 md:h-auto relative overflow-hidden shrink-0">
                                    <img src={trip.hotel?.images?.exterior || trip.hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ${!isPending && 'group-hover:scale-105'}`} alt={trip.hotel?.name} />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                                    <div className="absolute top-6 left-6 bg-white/90 dark:bg-black/40 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest shadow-lg">
                                        {t(trip.type) || 'Stay'}
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4"><FiMapPin /> {trip.hotel.location || trip.hotel.country}</div>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-8">{trip.hotel.name}</h4>

                                    {isPending ? (
                                        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-6 rounded-3xl">
                                            <div className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-widest text-[10px] mb-4"><FiAlertCircle className="w-4 h-4 animate-pulse" /> {t('awaitingFinalization')}</div>
                                            <div className="mb-6 flex flex-col gap-3">
                                                <label className="flex items-center gap-3 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-bold">
                                                    <input type="radio" checked={wantsFlight} onChange={() => toggleLogistics(index, true)} className="w-4 h-4 accent-orange-500" /> {t('wantFlight')}
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-bold">
                                                    <input type="radio" checked={!wantsFlight} onChange={() => toggleLogistics(index, false)} className="w-4 h-4 accent-orange-500" /> {t('ownTransportOption')}
                                                </label>
                                            </div>

                                            {wantsFlight ? (
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <input type="text" placeholder={t('departureCity')} value={pickupCities[index] || ''} onChange={(e) => setPickupCities({ ...pickupCities, [index]: e.target.value })} className="flex-1 bg-white dark:bg-[#151E32] px-4 py-3 rounded-xl border border-orange-500/30 text-slate-900 dark:text-white text-sm font-bold outline-none" />
                                                        <input type="text" placeholder={t('exactAddress')} value={pickupAddresses[index] || ''} onChange={(e) => setPickupAddresses({ ...pickupAddresses, [index]: e.target.value })} className="flex-[2] bg-white dark:bg-[#151E32] px-4 py-3 rounded-xl border border-orange-500/30 text-slate-900 dark:text-white text-sm font-bold outline-none" />
                                                    </div>
                                                    <button onClick={(e) => handleFinalize(index, e, false)} disabled={loadingIndex === index || !pickupCities[index] || !pickupAddresses[index]} className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg disabled:opacity-50">
                                                        {loadingIndex === index ? t('loadingGen') : t('generateTicket')}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={(e) => handleFinalize(index, e, true)} disabled={loadingIndex === index} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg disabled:opacity-50">
                                                    {loadingIndex === index ? t('loadingSave') : t('confirmHotelOnly')}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex gap-8 mb-8 border-b border-slate-200 dark:border-white/10 pb-8">
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">{t('period')}</p>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{trip.bookingDate} ({trip.duration} {t('days')})</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">{t('totalPrice')}</p>
                                                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{trip.totalPrice} {language==='bg'?'лв.':'BGN'}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-emerald-500 flex items-center gap-2"><FiCheckCircle /> {isHotelOnly ? t('confirmedHotelOnly') : t('confirmedWithLogistics')}</span>
                                                <div className="flex gap-3">
                                                    <button onClick={(e) => downloadReceipt(trip, e)} className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest"><FiDownload /> {t('downloadReceipt')}</button>
                                                    <span className="text-teal-500 flex items-center gap-2">{t('clickForDetails')} <FiChevronRight className="w-4 h-4" /></span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {selectedTrip && (
                    <motion.div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white dark:bg-[#0D121F] w-full max-w-7xl max-h-[95vh] rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 relative" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                            <div className="w-full md:w-[50%] h-80 md:h-auto relative bg-slate-100 overflow-hidden shrink-0">
                                <div className="absolute inset-0 z-0">
                                    <MapContainer center={[selectedTrip.hotel.lat || 42, selectedTrip.hotel.lng || 23]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                        <Marker position={[selectedTrip.hotel.lat, selectedTrip.hotel.lng]} icon={createCustomIcon('#ef4444')} />
                                        {selectedTrip.hotel.attractions?.map((attr, i) => (
                                            <Marker key={i} position={[attr.lat, attr.lng]} icon={createCustomIcon()}>
                                                <Popup>
                                                    <div className="p-3 text-center">
                                                        <p className="font-bold mb-3 text-slate-800">{attr.name}</p>
                                                        <div className="flex justify-center gap-2">
                                                            <button onClick={() => { setActiveRoute(attr); setTravelMode('walking') }} className="bg-teal-500 px-3 py-1.5 rounded-lg text-white text-xs font-bold">{t('walk')}</button>
                                                            <button onClick={() => { setActiveRoute(attr); setTravelMode('driving') }} className="bg-blue-500 px-3 py-1.5 rounded-lg text-white text-xs font-bold">{t('car')}</button>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}
                                        {activeRoute && <RoutingMachine start={{ lat: selectedTrip.hotel.lat, lng: selectedTrip.hotel.lng }} end={{ lat: activeRoute.lat, lng: activeRoute.lng }} mode={travelMode} setRouteInfo={setRouteInfo} />}
                                    </MapContainer>
                                </div>
                            </div>

                            <div className="w-full md:w-[50%] p-10 md:p-14 flex flex-col overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="space-y-3">
                                        <p className="text-teal-500 font-bold uppercase text-[9px] tracking-[0.5em] flex items-center gap-3"><span className="w-8 h-[1px] bg-teal-500/40"></span> {t('fullItinerary')}</p>
                                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic">{selectedTrip.hotel.name}</h2>
                                    </div>
                                    <button onClick={() => { setSelectedTrip(null); setRouteInfo(null); setActiveRoute(null); }} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shrink-0"><FiX className="w-6 h-6" /></button>
                                </div>

                                {selectedTrip.status === 'hotel_only' ? (
                                    <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] mb-8 text-center">
                                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚗</div>
                                        <h3 className="font-black text-slate-900 dark:text-white text-lg mb-2">{t('ownTransportTitle')}</h3>
                                        <p className="text-slate-500 text-sm font-bold">{t('ownTransportDesc')}</p>
                                    </div>
                                ) : (selectedTrip.flight && selectedTrip.flight.number) ? (
                                    <div className="bg-gradient-to-br from-indigo-500/10 to-teal-500/10 border border-indigo-500/20 p-8 rounded-[2.5rem] mb-8">
                                        <div className="flex justify-between items-center border-b border-indigo-500/20 pb-4 mb-6">
                                            <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{t('flightTicket')}</span>
                                            <span className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black tracking-widest">{selectedTrip.flight.number}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('from')} ({selectedTrip.transport?.pickupLocation || '--'})</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedTrip.flight.departureTime || '--:--'}</p>
                                            </div>
                                            <div className="flex-1 px-4 text-center">
                                                <FiNavigation className="text-indigo-500 mx-auto w-5 h-5 mb-2 rotate-45" />
                                                <div className="w-full h-[1px] bg-indigo-500/30"></div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">{t('to')}</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedTrip.flight.arrivalTime || '--:--'}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-indigo-500/10 flex justify-between">
                                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">{t('transferLabel')} <span className="text-slate-900 dark:text-white">{selectedTrip.transport?.pickupTime || '--:--'}</span></p>
                                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">{t('seatLabel')} <span className="text-indigo-500">{selectedTrip.flight.seat || '--'}</span></p>
                                        </div>
                                    </div>
                                ) : null}

                                <AnimatePresence>
                                    {routeInfo && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 p-6 bg-teal-500/10 rounded-[2rem] border border-teal-500/20 flex justify-between items-center overflow-hidden">
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-widest mb-1">{t('distanceToAttraction')}</p>
                                                <p className="text-xl font-black text-slate-900 dark:text-white">{routeInfo.distance} км</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-widest mb-1">{t('time')} ({travelMode === 'walking' ? t('walk').toLowerCase() : t('car').toLowerCase()})</p>
                                                <p className="text-xl font-black text-teal-500">{routeInfo.time} мин</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('paidAmount')}</p>
                                        <p className="text-4xl font-black text-slate-900 dark:text-white">{selectedTrip.totalPrice} {language==='bg'?'лв.':'BGN'}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={(e) => downloadReceipt(selectedTrip, e)} className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest"><FiDownload /> {t('downloadReceipt')}</button>
                                        <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase text-xs tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl"><FiCheckCircle /> {t('paid')}</div>
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

export default MyTrips;