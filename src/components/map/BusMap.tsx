import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus } from '@/types/bus';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const busIcon = new L.DivIcon({
  html: `<div class="relative">
    <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg animate-pulse">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
    </div>
  </div>`,
  className: 'bus-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const collegeIcon = new L.DivIcon({
  html: `<div class="w-12 h-12 rounded-full bg-success flex items-center justify-center text-white shadow-lg border-4 border-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  </div>`,
  className: 'college-marker',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

interface MapUpdaterProps {
  center: [number, number];
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

interface BusMapProps {
  buses: Bus[];
  collegeLocation?: { lat: number; lng: number };
  selectedBusId?: string;
  className?: string;
}

export const BusMap: React.FC<BusMapProps> = ({ 
  buses, 
  collegeLocation = { lat: 12.9536, lng: 77.6276 },
  selectedBusId,
  className = "h-[400px]"
}) => {
  const activeBuses = buses.filter(b => b.currentLocation && b.isActive);
  const center: [number, number] = selectedBusId 
    ? [
        activeBuses.find(b => b.id === selectedBusId)?.currentLocation?.lat || collegeLocation.lat,
        activeBuses.find(b => b.id === selectedBusId)?.currentLocation?.lng || collegeLocation.lng
      ]
    : [collegeLocation.lat, collegeLocation.lng];

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${className}`}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        
        {/* College marker */}
        <Marker position={[collegeLocation.lat, collegeLocation.lng]} icon={collegeIcon}>
          <Popup>
            <div className="font-semibold">College Campus</div>
            <div className="text-sm text-muted-foreground">Destination</div>
          </Popup>
        </Marker>

        {/* Bus markers */}
        {activeBuses.map(bus => (
          <Marker 
            key={bus.id}
            position={[bus.currentLocation!.lat, bus.currentLocation!.lng]} 
            icon={busIcon}
          >
            <Popup>
              <div className="font-semibold">{bus.busNumber}</div>
              <div className="text-sm text-muted-foreground">
                {bus.capacity - bus.bookedSeats} seats available
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
