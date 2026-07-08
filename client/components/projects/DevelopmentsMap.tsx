import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SkeletonMap } from "@/components/loading";
import { useShowQuerySkeleton } from "@/hooks/useShowQuerySkeleton";
import { fetchDevelopmentsMap } from "@/lib/api";
import type { DevelopmentMapMarker } from "@shared/api";

const projectIcon = L.divIcon({
  className: "",
  html: `<div style="
    background:#E87722;color:#fff;
    width:28px;height:28px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-weight:700;font-size:12px;font-family:sans-serif;
    border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);
  ">●</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 14);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 13 });
  }, [positions, map]);
  return null;
}

function MapCenterer({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

type DevelopmentsMapProps = {
  className?: string;
  title?: string;
  subtitle?: string;
};

export function DevelopmentsMap({
  className = "",
  title = "Ubicación de nuestros desarrollos",
  subtitle = "Guadalajara y zona metropolitana",
}: DevelopmentsMapProps) {
  const mapQ = useQuery({
    queryKey: ["developments", "map"],
    queryFn: fetchDevelopmentsMap,
    retry: false,
  });

  const loading = useShowQuerySkeleton(mapQ);
  const center = mapQ.data?.center ?? { lat: 20.6736, lng: -103.3444 };
  const markers = mapQ.data?.markers ?? [];
  const error = mapQ.error;

  const positions = useMemo(
    () =>
      markers.map(
        (m) => [m.latitude, m.longitude] as [number, number],
      ),
    [markers],
  );

  if (loading) {
    return <SkeletonMap className={className} />;
  }

  if (error || markers.length === 0) {
    return null;
  }

  const heightPattern = /(?:sm:|md:|lg:)?h-(?:\[[\d]+px\]|\d+)/g;
  const mapHeight =
    className.match(heightPattern)?.join(" ").trim() || "min-h-[360px]";
  const wrapperClass = className.replace(heightPattern, "").replace(/\s+/g, " ").trim();

  return (
    <div className={`min-w-0 max-w-full ${wrapperClass}`.trim()}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-montserrat font-bold text-cu-black mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-cu-concrete text-sm sm:text-base">{subtitle}</p>
          )}
        </div>
      )}
      <div
        className={`cu-map-shell relative w-full rounded-sm overflow-hidden border border-cu-stone/20 shadow-sm ${mapHeight}`}
      >
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full !h-full"
          style={{ height: "100%", minHeight: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.length > 1 ? (
            <FitBounds positions={positions} />
          ) : (
            <MapCenterer lat={center.lat} lng={center.lng} />
          )}
          {markers.map((m) => (
            <ProjectMarker key={m.id} marker={m} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

function ProjectMarker({ marker }: { marker: DevelopmentMapMarker }) {
  return (
    <Marker position={[marker.latitude, marker.longitude]} icon={projectIcon}>
      <Popup>
        <div className="font-montserrat text-sm min-w-[160px]">
          <p className="font-bold text-cu-black mb-1">{marker.name}</p>
          {marker.location_label && (
            <p className="text-cu-concrete mb-2">{marker.location_label}</p>
          )}
          <Link
            to={`/projects/${marker.slug}`}
            className="text-cu-orange font-semibold hover:underline"
          >
            Ver proyecto →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
