import React from 'react';
import { MapPin, Bus as BusIcon, Navigation, ExternalLink } from 'lucide-react';
import { Bus } from '@/types/bus';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BusMapProps {
  buses: Bus[];
  collegeLocation?: { lat: number; lng: number };
  selectedBusId?: string;
  className?: string;
}

// Graphic Era Deemed University, Dehradun coordinates
const GRAPHIC_ERA_LOCATION = { lat: 30.2672, lng: 78.0081 };

export const BusMap: React.FC<BusMapProps> = ({ 
  buses, 
  collegeLocation = GRAPHIC_ERA_LOCATION,
  selectedBusId,
  className = "h-[400px]"
}) => {
  const activeBuses = buses.filter(b => b.currentLocation && b.isActive);

  // OpenStreetMap embed centered on Graphic Era University, Dehradun
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${collegeLocation.lng - 0.06},${collegeLocation.lat - 0.04},${collegeLocation.lng + 0.06},${collegeLocation.lat + 0.04}&layer=mapnik&marker=${collegeLocation.lat},${collegeLocation.lng}`;

  // Google Maps directions link from Graphic Era to surrounding areas
  const directionsUrl = `https://www.google.com/maps/dir/Graphic+Era+Deemed+To+Be+University,+Clement+Town,+Dehradun,+Uttarakhand/`;

  return (
    <div className={cn("rounded-xl overflow-hidden shadow-lg bg-muted relative", className)}>
      {/* Embedded OpenStreetMap */}
      <iframe
        title="Graphic Era University - Bus Route Map"
        src={mapUrl}
        className="w-full h-full border-0"
        style={{ minHeight: '100%' }}
      />
      
      {/* Overlay with location info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent p-4">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2 bg-card rounded-lg px-3 py-2 shadow-md">
            <MapPin className="h-4 w-4 text-success" />
            <div>
              <span className="text-sm font-semibold">Graphic Era University</span>
              <span className="text-xs text-muted-foreground block">Clement Town, Dehradun</span>
            </div>
          </div>
          
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Maps
            </Button>
          </a>
        </div>

        {activeBuses.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <BusIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{activeBuses.length} Active Buses on Route</span>
            </div>
            
            {/* Bus list */}
            <div className="flex gap-2 flex-wrap">
              {activeBuses.map(bus => (
                <div 
                  key={bus.id}
                  className={cn(
                    "flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    selectedBusId === bus.id && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <Navigation className="h-3 w-3" />
                  <span>{bus.busNumber}</span>
                  <span className={cn(
                    "opacity-70",
                    selectedBusId === bus.id && "opacity-90"
                  )}>
                    ({bus.capacity - bus.bookedSeats} seats)
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
