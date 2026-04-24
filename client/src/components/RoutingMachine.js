import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const RoutingMachine = ({ start, end, mode, setRouteInfo }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !start || !end) return;

        // 1. ФИКС ЗА КОЛАТА: Сървърът изисква 'car', а не 'driving'
        const profile = mode === 'walking' ? 'foot' : 'car';

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng)
            ],
            router: L.Routing.osrmv1({
                serviceUrl: `https://routing.openstreetmap.de/routed-${profile}/route/v1`
            }),
            lineOptions: {
                styles: [{ color: mode === 'walking' ? '#10b981' : '#3b82f6', weight: 6, opacity: 0.8 }]
            },
            show: false, // Казваме на библиотеката да не показва упътвания
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,

            // 2. ФИКС ЗА ГРОЗНИТЕ МАРКЕРИ (Оставяме само линията)
            createMarker: function () { return null; }
        });

        // Добавяме към картата
        routingControl.addTo(map);

        // Взимаме данните и ги пращаме към левия панел
        routingControl.on('routesfound', (e) => {
            const route = e.routes[0]; // Взимаме целия масив с данни за маршрута
            const summary = route.summary;
            
            if (setRouteInfo) {
                setRouteInfo({
                    distance: (summary.totalDistance / 1000).toFixed(1),
                    time: Math.round(summary.totalTime / 60),
                    mode,
                    instructions: route.instructions // 🆕 ИЗВЛИЧАМЕ ИНСТРУКЦИИТЕ ЗА ЗАВОИТЕ
                });
            }
        });

        //  ИЗЧИСТВАНЕ
        return () => {
            try {
                // Първо изключваме слушателя, за да спрем опитите за State Update
                routingControl.off('routesfound');
                // Премахваме маршрута от картата безопасно
                if (map.hasLayer(routingControl)) {
                    map.removeControl(routingControl);
                }
            } catch (error) {
                // Мълчаливо игнорираме остатъчни Leaflet бъгове
            }
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, start?.lat, start?.lng, end?.lat, end?.lng, mode]);

    // 3. ФИКСЪТ ЗА ЧЕРНАТА КУТИЯ: Връщаме CSS директно от компонента!
    // Това гарантира, че списъкът с упътвания никога няма да се покаже от самата библиотека.
    return (
        <style>
            {`
                .leaflet-routing-container { 
                    display: none !important; 
                }
                .leaflet-routing-alternatives-container { 
                    display: none !important; 
                }
            `}
        </style>
    );
};

export default RoutingMachine;