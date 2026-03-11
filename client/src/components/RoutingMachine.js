import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const RoutingMachine = ({ start, end, mode, setRouteInfo }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !start || !end) return;

        const profile = mode === 'walking' ? 'foot' : 'driving';

        const routingControl = L.Routing.control({
            waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
            router: L.Routing.osrmv1({
                serviceUrl: `https://routing.openstreetmap.de/routed-${profile}/route/v1`
            }),
            lineOptions: {
                styles: [{ color: mode === 'walking' ? '#10b981' : '#3b82f6', weight: 6, opacity: 0.7 }]
            },
            show: false,
            addWaypoints: false,
            fitSelectedRoutes: true
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
            const summary = e.routes[0].summary;
            setRouteInfo({
                distance: (summary.totalDistance / 1000).toFixed(1),
                time: Math.round(summary.totalTime / 60),
                mode
            });
        });

        return () => map.removeControl(routingControl);
    }, [map, start, end, mode]);

    return null;
};

export default RoutingMachine;