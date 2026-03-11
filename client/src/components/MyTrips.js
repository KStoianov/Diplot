import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import RoutingMachine from './RoutingMachine';

const MyTrips = ({ pastTrips }) => {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [activeRoute, setActiveRoute] = useState(null);
    const [travelMode, setTravelMode] = useState('driving');
    const [routeInfo, setRouteInfo] = useState(null);

    if (!pastTrips || pastTrips.length === 0) {
        return <div className="p-10 text-center text-slate-400 text-xl">Все още нямате резервирани почивки. 🎒</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-500">
            {!selectedTrip ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastTrips.map((trip, idx) => (
                        <div key={idx} className="group bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl hover:border-blue-500/50 transition-all cursor-pointer shadow-2xl"
                            onClick={() => setSelectedTrip(trip)}>
                            <div className="text-blue-400 font-bold mb-2">HOTEL</div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{trip.hotel.name}</h3>
                            <div className="flex justify-between text-slate-400 text-sm">
                                <span>📅 {trip.duration} дни</span>
                                <span className="text-emerald-400 font-bold">{trip.totalPrice} BGN</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-950/80 rounded-[2rem] border border-slate-800 p-8 shadow-3xl">
                    <button onClick={() => { setSelectedTrip(null); setRouteInfo(null); }} className="text-blue-500 hover:text-blue-400 font-bold flex items-center gap-2 mb-8 transition">
                        ← НАЗАД КЪМ СПИСЪКА
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-4 space-y-6">
                            <h2 className="text-3xl font-bold text-white mb-4">{selectedTrip.hotel.name}</h2>
                            <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
                                <p className="text-blue-400 font-bold text-xs uppercase mb-2">Вашият полет</p>
                                <p className="text-white text-lg">Номер: {selectedTrip.flight.flightNumber}</p>
                                <p className="text-slate-400">Място: {selectedTrip.flight.seat} | Гейт: {selectedTrip.flight.gate}</p>
                            </div>

                            {routeInfo && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl animate-bounce-short">
                                    <p className="text-emerald-400 font-bold text-xs uppercase mb-1">Маршрут до {activeRoute.name}</p>
                                    <p className="text-white text-xl">{routeInfo.distance} км / {routeInfo.time} мин</p>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-8 h-[600px] rounded-[2rem] overflow-hidden border border-slate-800 shadow-inner">
                            <MapContainer center={[selectedTrip.hotel.lat, selectedTrip.hotel.lng]} zoom={14} className="h-full w-full">
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <Marker position={[selectedTrip.hotel.lat, selectedTrip.hotel.lng]}><Popup>Вашият хотел</Popup></Marker>
                                {selectedTrip.hotel.attractions.map((attr, i) => (
                                    <Marker key={i} position={[attr.lat, attr.lng]}>
                                        <Popup>
                                            <div className="p-2 text-center">
                                                <p className="font-bold mb-2">{attr.name}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setActiveRoute(attr); setTravelMode('walking') }} className="bg-emerald-600 px-3 py-1 rounded-lg text-white">🚶‍♂️</button>
                                                    <button onClick={() => { setActiveRoute(attr); setTravelMode('driving') }} className="bg-blue-600 px-3 py-1 rounded-lg text-white">🚗</button>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                                {activeRoute && <RoutingMachine start={{ lat: selectedTrip.hotel.lat, lng: selectedTrip.hotel.lng }} end={{ lat: activeRoute.lat, lng: activeRoute.lng }} mode={travelMode} setRouteInfo={setRouteInfo} />}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTrips;