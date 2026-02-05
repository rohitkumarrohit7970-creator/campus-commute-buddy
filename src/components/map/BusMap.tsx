import React from 'react';
import { MapPin, Bus as BusIcon, Navigation } from 'lucide-react';
import { Bus } from '@/types/bus';
import { cn } from '@/lib/utils';

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

  // Generate static map URL using OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${collegeLocation.lng - 0.05},${collegeLocation.lat - 0.03},${collegeLocation.lng + 0.05},${collegeLocation.lat + 0.03}&layer=mapnik&marker=${collegeLocation.lat},${collegeLocation.lng}`;

  return (
    <div className={cn("rounded-xl overflow-hidden shadow-lg bg-muted relative", className)}>
      {/* Embedded OpenStreetMap */}
      <iframe
        title="Bus Location Map"
        src={mapUrl}
        className="w-full h-full border-0"
        style={{ minHeight: '100%' }}
      />
      
      {/* Overlay with bus info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 shadow-md">
            <MapPin className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">College Campus</span>
          </div>
          
          {activeBuses.length > 0 && (
            <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 shadow-md">
              <BusIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{activeBuses.length} Active Buses</span>
            </div>
          )}
        </div>
        
        {/* Bus list */}
        {activeBuses.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {activeBuses.map(bus => (
              <div 
                key={bus.id}
                className={cn(
                  "flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 text-xs font-medium",
                  selectedBusId === bus.id && "bg-primary text-primary-foreground"
                )}
              >
                <Navigation className="h-3 w-3" />
                <span>{bus.busNumber}</span>
                <span className="text-muted-foreground">
                  ({bus.capacity - bus.bookedSeats} seats)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
