import React from 'react';
import { Ticket, Bus, MapPin, Clock, Calendar, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockBookings, getBusesWithDetails, mockRoutes } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MyBooking = () => {
  const { user } = useAuth();
  const allBuses = getBusesWithDetails();
  const myBookings = mockBookings.filter(b => b.studentId === user?.id);
  const activeBooking = myBookings.find(b => b.status === 'active');

  const bookedBus = activeBooking ? allBuses.find(b => b.id === activeBooking.busId) : null;
  const bookedRoute = bookedBus?.route;
  const bookedStop = bookedRoute?.stops.find(s => s.id === activeBooking?.stopId);

  const handleCancel = () => {
    toast.success('Booking cancelled successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Booking</h1>
          <p className="text-muted-foreground">View and manage your current bus booking</p>
        </div>

        {activeBooking && bookedBus ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Active Booking
                </CardTitle>
                <Badge className="bg-success">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl gradient-primary text-primary-foreground">
                      <Bus className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bus Number</p>
                      <p className="font-semibold text-lg">{bookedBus.busNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Route</p>
                      <p className="font-medium">{bookedRoute?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Stop</p>
                      <p className="font-medium">{bookedStop?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Time</p>
                      <p className="font-medium">{bookedStop?.pickupTime || bookedRoute?.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Seat Number</p>
                      <p className="font-medium">#{activeBooking.seatNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Booked On</p>
                      <p className="font-medium">{new Date(activeBooking.bookedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="destructive" onClick={handleCancel} className="mt-4">
                <XCircle className="h-4 w-4 mr-2" /> Cancel Booking
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Ticket className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Booking</h3>
              <p className="text-muted-foreground mb-4">You haven't booked a seat yet. Head over to Book Seat to reserve your spot.</p>
              <Button asChild className="gradient-primary text-primary-foreground">
                <a href="/student/book">Book a Seat</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {myBookings.filter(b => b.status === 'cancelled').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Past Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myBookings.filter(b => b.status === 'cancelled').map(booking => {
                  const bus = allBuses.find(b => b.id === booking.busId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{bus?.busNumber || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{new Date(booking.bookedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="secondary">Cancelled</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyBooking;
