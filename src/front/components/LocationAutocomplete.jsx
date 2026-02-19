import { useEffect, useRef } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const LocationAutocomplete = ({ onPlaceSelected }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (mapInstanceRef.current) return;


        const map = L.map(mapRef.current).setView([40.4168, -3.7038], 5);
        mapInstanceRef.current = map;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors"
        }).addTo(map);
        const provider = new OpenStreetMapProvider({
            params: {
                countrycodes: "es,it,pt",
                 addressdetails: 1,
            }
        });

        const searchControl = new GeoSearchControl({
            provider,
            style: "bar",
            showMarker: true,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: "Buscar cidade, província, país..."
        });

        map.addControl(searchControl);

        map.on("geosearch/showlocation", (result) => {
            const { location } = result;

            if (markerRef.current) {
                markerRef.current.remove();
            }

            markerRef.current = L.marker([location.y, location.x]).addTo(map);

            onPlaceSelected({
                city: location.raw.address?.city || location.raw.address?.town || location.raw.address?.village || "",
                province: location.raw.address?.state || location.raw.address?.county || "",
                country: location.raw.address?.country || "",
                latitude: location.y,
                longitude: location.x,
            });
        });

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    return (
        <div
            ref={mapRef}
            style={{ height: "300px", width: "100%", borderRadius: "8px" }}
        />
    );
};