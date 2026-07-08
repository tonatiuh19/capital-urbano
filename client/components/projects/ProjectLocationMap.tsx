import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const projectIcon = L.divIcon({
  className: "",
  html: `<div style="
    background:#FF9933;color:#fff;
    width:28px;height:28px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-weight:700;font-size:12px;font-family:sans-serif;
    border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);
  ">●</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

function CenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export function ProjectLocationMap({
  name,
  lat,
  lng,
  className = "",
}: {
  name: string;
  lat: number;
  lng: number;
  className?: string;
}) {
  return (
    <div className={`min-w-0 max-w-full w-full ${className}`.trim()}>
      <div className="cu-map-shell relative h-[320px] sm:h-[380px] w-full rounded-sm overflow-hidden border border-cu-stone/20">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterMap lat={lat} lng={lng} />
        <Marker position={[lat, lng]} icon={projectIcon}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
      </div>
    </div>
  );
}
