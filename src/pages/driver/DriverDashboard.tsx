import React from 'react';
import { motion } from 'framer-motion';
import { Bus, MapPin, Clock, Users, Calendar, Navigation } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BusMap } from '@/components/map/BusMap';
import { RouteTimeline } from '@/components/bus/RouteTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRoutes, mockBuses, mockUsers } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import { useDriverLocation } from '@/hooks/useDriverLocation';
import { NotificationBell } from '@/components/driver/NotificationBell';

const DriverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const { currentLocation } = useDriverLocation(isSharingLocation);
  
  // Find the bus assigned to this driver
  const assignedBus = mockBuses.find(b => b.driverId === user?.id) || mockBuses[0];
  const route = mockRoutes.find(r => r.id === assignedBus.routeId);
  const passengersToday = assignedBus.bookedSeats;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isSharingLocation ? "destructive" : "default"}
              onClick={() => {
                setIsSharingLocation(prev => !prev);
                if (!isSharingLocation) {
                  toast.success('Location sharing started! Students can now track your bus.');
                } else {
                  toast.info('Location sharing stopped.');
                }
              }}
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isSharingLocation ? 'Stop Sharing Location' : 'Share Live Location'}
            </Button>
            <Badge className="w-fit bg-success text-success-foreground text-sm py-1.5 px-4">
              <span className="animate-pulse mr-2">●</span>
              On Duty
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Assigned Bus" 
            value={assignedBus.busNumber} 
            icon={Bus}
            variant="primary"
          />
          <StatCard 
            title="Today's Route" 
            value={route?.name.split(' - ')[1] || 'N/A'} 
            icon={MapPin}
            variant="accent"
          />
          <StatCard 
            title="Passengers Today" 
            value={passengersToday} 
            icon={Users}
          />
          <StatCard 
            title="Next Stop" 
            value={route?.stops[0].name || 'N/A'} 
            icon={Navigation}
            variant="success"
          />
        </div>

        {/* Map and Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Your Route Map
                </CardTitle>
                <Button 
                  variant={isNavigating ? "destructive" : "outline"} 
                  size="sm"
                  onClick={() => {
                    if (!isNavigating && route?.stops.length) {
                      const firstStop = route.stops[0];
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${firstStop.location.lat},${firstStop.location.lng}&travelmode=driving`, '_blank');
                      toast.success('Navigation started! Google Maps opened.');
                    } else {
                      toast.info('Navigation stopped.');
                    }
                    setIsNavigating(prev => !prev);
                  }}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
                </Button>
              </CardHeader>
              <CardContent>
                <BusMap 
                  buses={[assignedBus]} 
                  selectedBusId={assignedBus.id}
                  className="h-[400px]" 
                />
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {route && (
                <RouteTimeline stops={route.stops} dropTime={route.dropTime} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bus Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Bus Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bus Number</p>
                <p className="font-semibold text-lg">{assignedBus.busNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Capacity</p>
                <p className="font-semibold text-lg">{assignedBus.capacity} seats</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booked Seats</p>
                <p className="font-semibold text-lg">{assignedBus.bookedSeats} seats</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vacant Seats</p>
                <p className="font-semibold text-lg text-success">{assignedBus.capacity - assignedBus.bookedSeats} seats</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Today's Timing</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="font-semibold">{route?.startTime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">College Arrival</p>
                  <p className="font-semibold">{route?.dropTime}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;
