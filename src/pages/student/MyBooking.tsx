import React from "react";
import { Bus, Calendar, Clock, MapPin, Ticket, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppDataContext";
import { useAuth } from "@/contexts/AuthContext";

const MyBooking = () => {
  const { bookings, busesWithDetails, cancelBooking } = useAppData();
  const { user } = useAuth();

  const myBookings = bookings
    .filter((booking) => booking.studentId === user?.id)
    .sort((left, right) => new Date(right.bookedAt).getTime() - new Date(left.bookedAt).getTime());
  const activeBooking = myBookings.find((booking) => booking.status === "active");
  const bookedBus = activeBooking ? busesWithDetails.find((bus) => bus.id === activeBooking.busId) : null;
  const bookedRoute = bookedBus?.route;
  const bookedStop = bookedRoute?.stops.find((stop) => stop.id === activeBooking?.stopId);

  const handleCancel = () => {
    if (!activeBooking) {
      return;
    }

    const result = cancelBooking(activeBooking.id);

    if (result.success) {
      toast.success(result.message);
      return;
    }

    toast.error(result.message);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Booking</h1>
          <p className="text-muted-foreground">Review your active seat, cancel when needed, and keep a record of past rides.</p>
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl gradient-primary p-3 text-primary-foreground">
                      <Bus className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bus Number</p>
                      <p className="text-lg font-semibold">{bookedBus.busNumber}</p>
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
                      <p className="text-sm text-muted-foreground">Stop</p>
                      <p className="font-medium">{bookedStop?.name || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Stop Time</p>
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
                      <p className="font-medium">{new Date(activeBooking.bookedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="destructive" onClick={handleCancel}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Booking
                </Button>
                <Button asChild variant="outline">
                  <Link to="/student/track">Open mock tracking</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Ticket className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="mb-2 text-xl font-semibold">No Active Booking</h3>
              <p className="mb-4 text-muted-foreground">You have not reserved a seat yet. Once you book one, the trip details will show up here.</p>
              <Button asChild className="gradient-primary text-primary-foreground">
                <Link to="/student/book">Book a Seat</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            {myBookings.length > 0 ? (
              <div className="space-y-3">
                {myBookings.map((booking) => {
                  const bus = busesWithDetails.find((candidate) => candidate.id === booking.busId);
                  const route = bus?.route;
                  const stop = route?.stops.find((candidate) => candidate.id === booking.stopId);

                  return (
                    <div key={booking.id} className="flex flex-col gap-3 rounded-lg bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{bus?.busNumber || "Unknown bus"} {route ? `• ${route.name}` : ""}</p>
                        <p className="text-sm text-muted-foreground">
                          {stop?.name || "Stop unavailable"} • Seat #{booking.seatNumber} • {new Date(booking.bookedAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={booking.status === "active" ? "default" : "secondary"} className={booking.status === "active" ? "bg-success" : ""}>
                        {booking.status === "active" ? "Active" : "Cancelled"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">Your booking history is still empty.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyBooking;
