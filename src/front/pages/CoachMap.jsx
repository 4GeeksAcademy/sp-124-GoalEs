import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const CoachMap = ({ latitude, longitude, name }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!latitude || !longitude) return;
        if (mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView([latitude, longitude], 13);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);

        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(name || "Coach location")
            .openPopup();

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [latitude, longitude]);

    if (!latitude || !longitude) return <p className="text-muted">No location set</p>;

    return (
        <div
            ref={mapRef}
            style={{ height: "300px", width: "100%", borderRadius: "8px" }}
        />
    );
};
