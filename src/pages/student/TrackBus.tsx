import React, { useMemo } from 'react';
import { MapPin, Bus, Clock, Users, Radio, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BusMap } from '@/components/map/BusMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRealtimeDriverLocation } from '@/hooks/useRealtimeDriverLocation';
import { useStudentBooking } from '@/hooks/useStudentBooking';
import { useNavigate } from 'react-router-dom';

const TrackBus = () => {
  const { booking, loading } = useStudentBooking();
  const navigate = useNavigate();

  // Get driver ID for real-time location tracking
  const driverIds = useMemo(() => {
    if (booking?.bus?.driver_id) return [booking.bus.driver_id];
    return [];
  }, [booking?.bus?.driver_id]);

  const driverLocations = useRealtimeDriverLocation(driverIds);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!booking || !booking.bus) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Track Bus</h1>
            <p className="text-muted-foreground">View live location of your booked bus</p>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No Active Booking</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You need to book a seat on a bus first to track its live location. 
                Only the bus you've booked will be shown here for tracking.
              </p>
              <Button onClick={() => navigate('/student/book')} className="gradient-primary text-primary-foreground">
                Book a Seat
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const bus = booking.bus;
  const route = booking.route;
  const driverLocation = bus.driver_id ? driverLocations[bus.driver_id] : null;

  const mapBus = {
    id: bus.id,
    busNumber: bus.bus_number,
    capacity: bus.capacity,
    bookedSeats: bus.booked_seats,
    routeId: bus.route_id || '',
    driverId: bus.driver_id || undefined,
    currentLocation: driverLocation
      ? { lat: driverLocation.lat, lng: driverLocation.lng }
      : bus.current_lat && bus.current_lng
        ? { lat: bus.current_lat, lng: bus.current_lng }
        : undefined,
    isActive: bus.is_active,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Track Bus</h1>
          <p className="text-muted-foreground">Live location of your booked bus</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Live Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BusMap
                  buses={[mapBus]}
                  selectedBusId={bus.id}
                  className="h-[400px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bus className="h-5 w-5 text-primary" />
                    {bus.bus_number}
                  </CardTitle>
                  <Badge className={bus.is_active ? "bg-success" : "bg-muted"}>
                    {bus.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Real-time location indicator */}
                {driverLocation && (
                  <div className="flex items-center gap-2 text-sm p-2 bg-success/10 rounded-lg">
                    <Radio className="h-4 w-4 text-success animate-pulse" />
                    <span className="font-medium text-success">Live Location Active</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Updated {new Date(driverLocation.updated_at).toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {!driverLocation && (
                  <div className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded-lg">
                    <Radio className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Driver location not available yet</span>
                  </div>
                )}

                {route && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">{route.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Schedule:</span>
                      <span className="font-medium">{route.start_time} - {route.drop_time}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Seats:</span>
                  <span className={cn("font-medium", (bus.capacity - bus.booked_seats) > 10 ? "text-success" : "text-warning")}>
                    {bus.capacity - bus.booked_seats}/{bus.capacity} available
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Your Seat:</span>
                  <Badge variant="outline">#{booking.seat_number}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrackBus;
