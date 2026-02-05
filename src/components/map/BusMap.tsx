import React, { useEffect } from 'react';
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

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const collegeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2602/2602414.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
}

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
  
  const selectedBus = selectedBusId 
    ? activeBuses.find(b => b.id === selectedBusId)
    : null;
    
  const center: [number, number] = selectedBus?.currentLocation 
    ? [selectedBus.currentLocation.lat, selectedBus.currentLocation.lng]
    : [collegeLocation.lat, collegeLocation.lng];

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${className}`}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
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
            <div className="text-sm text-gray-500">Destination</div>
          </Popup>
        </Marker>

        {/* Bus markers */}
        {activeBuses.map(bus => (
          bus.currentLocation && (
            <Marker 
              key={bus.id}
              position={[bus.currentLocation.lat, bus.currentLocation.lng]} 
              icon={busIcon}
            >
              <Popup>
                <div className="font-semibold">{bus.busNumber}</div>
                <div className="text-sm text-gray-500">
                  {bus.capacity - bus.bookedSeats} seats available
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};
