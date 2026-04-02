import React, { useState } from 'react';
import { Bus, MapPin, Sunrise, Sunset, Sun, CloudSun } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BusCard } from '@/components/bus/BusCard';
import { RouteTimeline } from '@/components/bus/RouteTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRecommendedBuses, mockRoutes } from '@/data/mockData';
import { toast } from 'sonner';
import { RouteDirection } from '@/types/bus';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SCHEDULE_TABS: { value: RouteDirection; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'morning_to_college', label: 'Morning Pickup', icon: Sunrise, desc: 'Home → GEU (7-8 AM)' },
  { value: 'afternoon_from_college', label: 'Evening Drop', icon: Sunset, desc: 'GEU → Home (4 PM)' },
  { value: 'afternoon_to_college', label: 'Afternoon Pickup', icon: Sun, desc: 'Home → GEU (12-1 PM)' },
  { value: 'afternoon_drop_from_college', label: 'Afternoon Drop', icon: CloudSun, desc: 'GEU → Home (1 PM)' },
];

const BookSeat = () => {
  const { user } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [selectedStop, setSelectedStop] = useState('');
  const [direction, setDirection] = useState<RouteDirection>('morning_to_college');
  const [isBooking, setIsBooking] = useState(false);

  const filteredRoutes = mockRoutes.filter(r => r.direction === direction);
  const recommendedBuses = selectedRoute ? getRecommendedBuses(selectedRoute) : [];
  const selectedRouteData = mockRoutes.find(r => r.id === selectedRoute);
  const isFromCollege = direction === 'afternoon_from_college' || direction === 'afternoon_drop_from_college';

  const handleBookSeat = (bus: any) => {
    setSelectedBus(bus);
    setBookingDialog(true);
  };

  const confirmBooking = async () => {
    if (!selectedStop) {
      toast.error('Please select a pickup stop');
      return;
    }
    if (!user?.id || !selectedBus) return;

    setIsBooking(true);
    try {
      // Create the booking
      const seatNumber = selectedBus.bookedSeats + 1;
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          student_id: user.id,
          bus_id: selectedBus.id,
          stop_id: selectedStop,
          seat_number: seatNumber,
          status: 'active',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Send notification to the driver if bus has a driver assigned
      if (selectedBus.driverId) {
        const stopName = selectedBus.route?.stops?.find((s: any) => s.id === selectedStop)?.name || 'Unknown stop';
        await supabase.from('notifications').insert({
          recipient_id: selectedBus.driverId,
          type: 'booking',
          title: 'New Seat Booking!',
          message: `${user.name} booked seat #${seatNumber} on ${selectedBus.busNumber} (Stop: ${stopName})`,
          related_bus_id: selectedBus.id,
          related_booking_id: bookingData.id,
        });
      }

      toast.success(`Seat booked successfully on ${selectedBus.busNumber}!`);
      setBookingDialog(false);
      setSelectedBus(null);
      setSelectedStop('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to book seat');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Book a Seat</h1>
          <p className="text-muted-foreground">Select your route and book a seat on an available bus</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Select Schedule & Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={direction} onValueChange={(v) => { setDirection(v as RouteDirection); setSelectedRoute(''); }} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                {SCHEDULE_TABS.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex flex-col gap-0.5 py-2 px-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <tab.icon className="h-3.5 w-3.5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">{tab.desc}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mb-6">
              <Label>Select Your Route</Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a route to see available buses" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoutes.map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name} ({route.startTime} - {route.dropTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoute && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="font-semibold mb-4">Available Buses (sorted by vacancy)</h3>
                  {recommendedBuses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendedBuses.map((bus, index) => (
                        <BusCard key={bus.id} bus={bus} onBook={() => handleBookSeat(bus)} isRecommended={index === 0} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No buses available for this route</p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Route Schedule</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <RouteTimeline
                        stops={selectedRouteData?.stops || []}
                        dropTime={selectedRouteData?.dropTime || ''}
                        startTime={selectedRouteData?.startTime || ''}
                        direction={isFromCollege ? 'from_college' : 'to_college'}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={bookingDialog} onOpenChange={setBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Seat Booking</DialogTitle>
            <DialogDescription>Book a seat on {selectedBus?.busNumber}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Bus</span>
                <span className="font-semibold">{selectedBus?.busNumber}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Route</span>
                <span className="font-semibold">{selectedBus?.route?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available Seats</span>
                <span className="font-semibold text-success">{selectedBus?.vacantSeats}</span>
              </div>
            </div>
            <div>
              <Label>{isFromCollege ? 'Select Drop Stop' : 'Select Pickup Stop'}</Label>
              <Select value={selectedStop} onValueChange={setSelectedStop}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={isFromCollege ? 'Choose your drop point' : 'Choose your pickup point'} />
                </SelectTrigger>
                <SelectContent>
                  {selectedBus?.route?.stops.map((stop: any) => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.name} - {stop.pickupTime}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setBookingDialog(false)} disabled={isBooking}>
                Cancel
              </Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={confirmBooking} disabled={isBooking}>
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BookSeat;
