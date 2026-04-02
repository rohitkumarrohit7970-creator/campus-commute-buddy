import React from 'react';
import { MapPin, Navigation, Clock, Users, Bus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BusMap } from '@/components/map/BusMap';
import { RouteTimeline } from '@/components/bus/RouteTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRoutes, mockBuses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDriverLocation } from '@/hooks/useDriverLocation';

const DriverRoute = () => {
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const { currentLocation } = useDriverLocation(isSharingLocation);

  const assignedBus = mockBuses.find(b => b.driverId === user?.id) || mockBuses[0];
  const route = mockRoutes.find(r => r.id === assignedBus.routeId);

  const handleStartNavigation = () => {
    if (!route || !route.stops.length) return;
    setIsNavigating(prev => !prev);
    
    if (!isNavigating) {
      // Open Google Maps navigation to first stop
      const firstStop = route.stops[0];
      const url = `https://www.google.com/maps/dir/?api=1&destination=${firstStop.location.lat},${firstStop.location.lng}&travelmode=driving`;
      window.open(url, '_blank');
      toast.success('Navigation started! Google Maps opened.');
    } else {
      toast.info('Navigation stopped.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Route</h1>
            <p className="text-muted-foreground">{route?.name || 'No route assigned'}</p>
          </div>
          <Button 
            onClick={handleStartNavigation}
            className={isNavigating ? 'bg-destructive hover:bg-destructive/90' : ''}
            size="lg"
          >
            <Navigation className="h-5 w-5 mr-2" />
            {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
          </Button>
        </div>

        {/* Route Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bus</p>
                  <p className="font-bold text-lg">{assignedBus.busNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <MapPin className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stops</p>
                  <p className="font-bold text-lg">{route?.stops.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start</p>
                  <p className="font-bold text-lg">{route?.startTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passengers</p>
                  <p className="font-bold text-lg">{assignedBus.bookedSeats}/{assignedBus.capacity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Route Map
                  {isNavigating && (
                    <Badge className="bg-success text-success-foreground ml-2">
                      <span className="animate-pulse mr-1">●</span> Navigating
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BusMap
                  buses={[assignedBus]}
                  selectedBusId={assignedBus.id}
                  className="h-[450px]"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Route Stops
              </CardTitle>
            </CardHeader>
            <CardContent>
              {route && (
                <RouteTimeline stops={route.stops} dropTime={route.dropTime} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stop Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stop Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stop Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Navigate</th>
                  </tr>
                </thead>
                <tbody>
                  {route?.stops.map((stop, idx) => (
                    <tr key={stop.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4">{stop.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{stop.pickupTime}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.location.lat},${stop.location.lng}&travelmode=driving`, '_blank');
                          }}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriverRoute;
