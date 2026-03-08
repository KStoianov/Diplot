import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Функция за генериране на икони за картата
const createCustomIcon = (emoji, bgColor = '#3b82f6') => new L.divIcon({
    html: `<div style="font-size: 20px; background: ${bgColor}; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">${emoji}</div>`,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [bookedTrip, setBookedTrip] = useState(null); // Съхранява данните след резервация

    // Взимаме данните от Home.js (вече включваме и duration)
    const { results, aiMessage, duration } = location.state || { results: [], aiMessage: null, duration: 7 };

    // 🔍 ДЕБЪГ панел
    useEffect(() => {
        console.log("Продължителност на престоя:", duration);
        console.log("Отговор от AI:", aiMessage);
    }, [duration, aiMessage]);

    // 🚀 ИНТЕЛИГЕНТНО ФИЛТРИРАНЕ (Топ 3)
    const filteredHotels = results.filter(hotel => {
        if (!aiMessage) return false;
        const dbName = hotel.name.toLowerCase().trim();
        const aiFullText = (typeof aiMessage === 'string' ? aiMessage : (aiMessage.rawText || aiMessage.reason || JSON.stringify(aiMessage))).toLowerCase();
        return aiFullText.includes(dbName) || aiFullText.includes(dbName.split(' ')[0]);
    }).slice(0, 3);

    const getAiReason = (hotelName) => {
        const nameLower = hotelName.toLowerCase().trim();
        if (aiMessage?.recommendations) {
            const rec = aiMessage.recommendations.find(r => nameLower.includes(r.hotelName.toLowerCase().trim()));
            if (rec) return rec.reason;
        }
        return "Персонализирано предложение за вашата мечтана почивка.";
    };

    const handleBook = async (hotel) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser?._id) { navigate('/login'); return; }

        try {
            const res = await axios.post(`http://localhost:5000/api/users/${storedUser._id}/book`, {
                hotel,
                duration
            });
            setBookedTrip(res.data.trip); // Запазваме генерирания билет
            alert(`🎉 Резервацията за ${hotel.name} е завършена!`);
        } catch (error) {
            alert(error.response?.data?.message || "Грешка при резервация.");
        }
    };

    // 📄 ФУНКЦИЯ ЗА ГЕНЕРИРАНЕ И ИЗТЕГЛЯНЕ НА БИЛЕТ
    const downloadTicket = () => {
        if (!bookedTrip) return;
        const content = `
==============================================
          DIPLOT PRO - ПОТВЪРЖДЕНИЕ
==============================================
ХОТЕЛ: ${bookedTrip.hotelName}
ЛОКАЦИЯ: ${bookedTrip.location}
ПРЕСТОЙ: ${bookedTrip.duration} дни
ОБЩА ЦЕНА: ${bookedTrip.totalPrice} лв.
ДАТА НА ИЗДАВАНЕ: ${bookedTrip.bookingDate}

✈️ ИНФОРМАЦИЯ ЗА ПОЛЕТА:
ПОЛЕТ: ${bookedTrip.flight.number} | ГЕЙТ: ${bookedTrip.flight.gate}
МЯСТО: ${bookedTrip.flight.seat}
МАРШРУТ: ${bookedTrip.flight.from} -> ${bookedTrip.flight.to}

🚕 VIP ТРАНСФЕР (ДО ЛЕТИЩЕТО):
ВЗЕМАНЕ ОТ: ${bookedTrip.transport.pickup}
ЧАС: ${bookedTrip.transport.time}
АВТОМОБИЛ: ${bookedTrip.transport.service}
==============================================
Приятно пътуване с DIPLOT PRO!
        `;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Ticket_${bookedTrip.hotelName}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="min-h-screen text-slate-700 dark:text-slate-200 p-10 font-sans relative transition-colors">
            <button onClick={() => navigate('/home')} className="text-blue-500 mb-8 font-black uppercase text-sm hover:underline flex items-center gap-2">
                <span>⬅️</span> Назад към търсенето
            </button>

            <header className="mb-14">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase italic tracking-tighter">
                    Топ 3 <span className="text-blue-500">Предложения</span>
                </h2>
                <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl mb-10 max-w-4xl">
                    <p className="text-blue-400 font-black text-xs uppercase mb-2">🤖 Анализ за престой от {duration} дни:</p>
                    <p className="text-slate-700 dark:text-slate-300 italic">
                        "{aiMessage?.rawText || "Нашият AI подбра тези дестинации специално за вашия график."}"
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredHotels.map((hotel) => (
                    <div key={hotel._id} onClick={() => setSelectedHotel(hotel)} className="bg-white/85 dark:bg-slate-900/70 border border-white dark:border-slate-800 rounded-[45px] overflow-hidden hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-blue-500/10 group cursor-pointer flex flex-col backdrop-blur-md">
                        <div className="h-64 relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-yellow-400 text-sm shadow-lg">
                                {'⭐'.repeat(hotel.rating || 5)}
                            </div>
                        </div>

                        <div className="p-8 bg-white/70 dark:bg-slate-900/50 flex-1 flex flex-col justify-between backdrop-blur-md">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-blue-400 text-xs font-black uppercase tracking-widest">{hotel.location}</p>
                                    <span className="text-red-400 text-[10px] font-bold uppercase">{hotel.roomsAvailable} оставащи стаи</span>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{hotel.name}</h4>
                                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl mb-6">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-snug line-clamp-3">"{getAiReason(hotel.name)}"</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-500 uppercase font-black">Обща цена ({duration} дни)</p>
                                    <span className="text-slate-900 dark:text-white font-black text-2xl">{hotel.pricePerNight * duration} лв.</span>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">➔</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedHotel && (
                <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center z-[100] p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="bg-white/90 dark:bg-slate-900/85 border border-blue-500/30 w-full max-w-7xl h-[90vh] rounded-[45px] relative shadow-2xl shadow-blue-500/10 flex flex-col md:flex-row overflow-hidden backdrop-blur-xl">

                        <button onClick={() => { setSelectedHotel(null); setBookedTrip(null); }} className="absolute top-6 right-6 w-14 h-14 bg-white/90 dark:bg-slate-800/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-white hover:bg-red-500 hover:rotate-90 rounded-full flex items-center justify-center text-2xl z-50 transition-all">✕</button>

                        {/* ЛЯВА ЧАСТ: Карта */}
                        <div className="w-full md:w-[45%] h-[45%] md:h-full bg-slate-200 dark:bg-slate-800 relative flex flex-col border-r border-slate-300 dark:border-slate-800">
                            <div className="h-full w-full relative z-0">
                                <MapContainer center={[selectedHotel.lat || 42, selectedHotel.lng || 23]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                    <Marker position={[selectedHotel.lat, selectedHotel.lng]} icon={createCustomIcon('🏨', '#ef4444')}>
                                        <Popup><strong>{selectedHotel.name}</strong></Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>

                        {/* ДЯСНА ЧАСТ: Детайли и Логистика */}
                        <div className="w-full md:w-[55%] p-12 flex flex-col justify-between overflow-y-auto bg-white/75 dark:bg-slate-900/65 backdrop-blur-md">
                            <div>
                                <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{selectedHotel.name}</h2>
                                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-10">{selectedHotel.description}</p>

                                <div className="grid grid-cols-1 gap-6 mb-10">
                                    <div className="bg-blue-600/10 p-8 rounded-[30px] border border-blue-500/20">
                                        <h3 className="text-blue-400 font-black text-xs uppercase mb-4 tracking-widest">✈️ Полетна логистика</h3>
                                        <p className="text-xl">Дестинация: <strong>{selectedHotel.nearestAirport?.name} ({selectedHotel.nearestAirport?.code})</strong></p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Включен чекиран багаж и място в икономична класа.</p>
                                    </div>
                                    <div className="bg-slate-100 dark:bg-slate-800/60 p-8 rounded-[30px] border border-slate-200 dark:border-slate-700/50">
                                        <h3 className="text-slate-400 font-black text-xs uppercase mb-4 tracking-widest">🚕 Транспорт до летище</h3>
                                        <p className="text-xl">Услуга: <strong>DIPLOT VIP Mercedes EQV</strong></p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Вземане директно от вашия адрес 3 часа преди полета.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-slate-200/70 dark:from-blue-900/35 dark:to-slate-800 p-8 rounded-[35px] border border-blue-500/30 flex flex-col sm:flex-row justify-between items-center mt-auto gap-4">
                                <div>
                                    <p className="text-xs text-blue-400 uppercase font-black mb-2">Общо за {duration} нощувки</p>
                                    <p className="text-5xl font-black text-slate-900 dark:text-white">{selectedHotel.pricePerNight * duration} лв.</p>
                                </div>

                                {!bookedTrip ? (
                                    <button
                                        onClick={() => handleBook(selectedHotel)}
                                        className="bg-blue-600 hover:bg-blue-500 px-12 py-6 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all w-full sm:w-auto"
                                    >
                                        ФИНАЛИЗИРАЙ РЕЗЕРВАЦИЯ
                                    </button>
                                ) : (
                                    <button
                                        onClick={downloadTicket}
                                        className="bg-green-600 hover:bg-green-500 px-12 py-6 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all w-full sm:w-auto flex items-center gap-3"
                                    >
                                        📄 ИЗТЕГЛИ ДОКУМЕНТИ
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;