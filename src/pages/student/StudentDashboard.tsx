import React, { useState } from 'react';
import { Bus, Calendar, MapPin, Ticket, ArrowRightLeft, Sunrise, Sunset, Sun, CloudSun } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BusCard } from '@/components/bus/BusCard';
import { BusMap } from '@/components/map/BusMap';
import { RouteTimeline } from '@/components/bus/RouteTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRecommendedBuses, mockRoutes, mockBookings, getBusesWithDetails } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { RouteDirection } from '@/types/bus';

const SCHEDULE_TABS: { value: RouteDirection; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'morning_to_college', label: 'Morning Pickup', icon: Sunrise, desc: 'Home → GEU (7-8 AM)' },
  { value: 'afternoon_from_college', label: 'Evening Drop', icon: Sunset, desc: 'GEU → Home (4 PM)' },
  { value: 'afternoon_to_college', label: 'Afternoon Pickup', icon: Sun, desc: 'Home → GEU (12-1 PM)' },
  { value: 'afternoon_drop_from_college', label: 'Afternoon Drop', icon: CloudSun, desc: 'GEU → Home (1 PM)' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [selectedStop, setSelectedStop] = useState('');
  const [direction, setDirection] = useState<RouteDirection>('morning_to_college');

  const allBuses = getBusesWithDetails();
  const filteredRoutes = mockRoutes.filter(r => r.direction === direction);
  const recommendedBuses = selectedRoute ? getRecommendedBuses(selectedRoute) : [];
  const myBooking = mockBookings.find(b => b.studentId === user?.id && b.status === 'active');
  const selectedRouteData = mockRoutes.find(r => r.id === selectedRoute);
  const isFromCollege = direction === 'afternoon_from_college' || direction === 'afternoon_drop_from_college';

  const handleBookSeat = (bus: any) => {
    setSelectedBus(bus);
    setBookingDialog(true);
  };

  const confirmBooking = () => {
    if (!selectedStop) {
      toast.error('Please select a pickup stop');
      return;
    }
    toast.success(`Seat booked successfully on ${selectedBus.busNumber}!`);
    setBookingDialog(false);
    setSelectedBus(null);
    setSelectedStop('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">Book your seat and track your bus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="My Booking" value={myBooking ? 'Active' : 'None'} icon={Ticket} variant={myBooking ? 'success' : 'default'} />
          <StatCard title="College ID" value={user?.collegeId || 'N/A'} icon={Calendar} />
          <StatCard title="Available Buses" value={allBuses.filter(b => b.isActive && b.vacantSeats > 0).length} icon={Bus} variant="accent" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Bus Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusMap
              buses={allBuses.filter(b => b.isActive).map(b => ({
                id: b.id, busNumber: b.busNumber, capacity: b.capacity, bookedSeats: b.bookedSeats,
                routeId: b.routeId, driverId: b.driverId, currentLocation: b.currentLocation, isActive: b.isActive,
              }))}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Book a Seat
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
              <Button variant="outline" className="flex-1" onClick={() => setBookingDialog(false)}>Cancel</Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={confirmBooking}>Confirm Booking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentDashboard;
