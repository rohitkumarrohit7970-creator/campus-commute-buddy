import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Calendar, MapPin, Clock, Ticket, ArrowRightLeft } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRecommendedBuses, mockRoutes, mockBookings, getBusesWithDetails } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [selectedStop, setSelectedStop] = useState('');
  const [direction, setDirection] = useState<'to_college' | 'from_college'>('to_college');

  const allBuses = getBusesWithDetails();
  const filteredRoutes = mockRoutes.filter(r => r.direction === direction);
  const recommendedBuses = selectedRoute ? getRecommendedBuses(selectedRoute) : [];
  const myBooking = mockBookings.find(b => b.studentId === user?.id && b.status === 'active');

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">Book your seat and track your bus</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="My Booking" 
            value={myBooking ? 'Active' : 'None'} 
            icon={Ticket}
            variant={myBooking ? 'success' : 'default'}
          />
          <StatCard 
            title="College ID" 
            value={user?.collegeId || 'N/A'} 
            icon={Calendar}
          />
          <StatCard 
            title="Available Buses" 
            value={allBuses.filter(b => b.isActive && b.vacantSeats > 0).length} 
            icon={Bus}
            variant="accent"
          />
        </div>

        {/* Live Map */}
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
                id: b.id,
                busNumber: b.busNumber,
                capacity: b.capacity,
                bookedSeats: b.bookedSeats,
                routeId: b.routeId,
                driverId: b.driverId,
                currentLocation: b.currentLocation,
                isActive: b.isActive,
              }))} 
              className="h-[300px]" 
            />
          </CardContent>
        </Card>

        {/* Route Selection & Available Buses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Book a Seat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Direction Toggle */}
            <Tabs value={direction} onValueChange={(v) => { setDirection(v as 'to_college' | 'from_college'); setSelectedRoute(''); }} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="to_college" className="gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  To College (Morning)
                </TabsTrigger>
                <TabsTrigger value="from_college" className="gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  From College (Evening)
                </TabsTrigger>
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
                        <BusCard 
                          key={bus.id} 
                          bus={bus} 
                          onBook={() => handleBookSeat(bus)}
                          isRecommended={index === 0}
                        />
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
                        stops={mockRoutes.find(r => r.id === selectedRoute)?.stops || []}
                        dropTime={mockRoutes.find(r => r.id === selectedRoute)?.dropTime || ''}
                        startTime={mockRoutes.find(r => r.id === selectedRoute)?.startTime || ''}
                        direction={direction}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onOpenChange={setBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Seat Booking</DialogTitle>
            <DialogDescription>
              Book a seat on {selectedBus?.busNumber}
            </DialogDescription>
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
              <Label>Select Pickup Stop</Label>
              <Select value={selectedStop} onValueChange={setSelectedStop}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose your pickup point" />
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
              <Button variant="outline" className="flex-1" onClick={() => setBookingDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={confirmBooking}>
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentDashboard;
