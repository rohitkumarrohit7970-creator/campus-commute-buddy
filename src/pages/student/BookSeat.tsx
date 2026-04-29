import React, { useMemo, useState } from "react";
import { Bus, CloudSun, MapPin, Sun, Sunrise, Sunset } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { BusCard } from "@/components/bus/BusCard";
import { RouteTimeline } from "@/components/bus/RouteTimeline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppData } from "@/contexts/AppDataContext";
import { useAuth } from "@/contexts/AuthContext";
import type { BusWithDetails, RouteDirection } from "@/types/bus";

const SCHEDULE_TABS: { value: RouteDirection; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "morning_to_college", label: "Morning Pickup", icon: Sunrise, desc: "Home to GEU between 7:00 and 8:00 AM" },
  { value: "afternoon_from_college", label: "Evening Drop", icon: Sunset, desc: "GEU to home starting at 4:00 PM" },
  { value: "afternoon_to_college", label: "Afternoon Pickup", icon: Sun, desc: "Home to GEU between 12:00 and 1:00 PM" },
  { value: "afternoon_drop_from_college", label: "Afternoon Drop", icon: CloudSun, desc: "GEU to home around 1:00 PM" },
];

const BookSeat = () => {
  const { bookSeat, busesWithDetails, bookings, routes } = useAppData();
  const { user } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState("");
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusWithDetails | null>(null);
  const [selectedStop, setSelectedStop] = useState("");
  const [direction, setDirection] = useState<RouteDirection>("morning_to_college");

  const activeBooking = bookings.find((booking) => booking.studentId === user?.id && booking.status === "active");
  const filteredRoutes = routes.filter((route) => route.direction === direction);
  const selectedRouteData = routes.find((route) => route.id === selectedRoute);
  const isFromCollege = direction === "afternoon_from_college" || direction === "afternoon_drop_from_college";

  const recommendedBuses = useMemo(
    () =>
      busesWithDetails
        .filter((bus) => bus.routeId === selectedRoute && bus.isActive && bus.vacantSeats > 0)
        .sort((left, right) => right.vacantSeats - left.vacantSeats),
    [busesWithDetails, selectedRoute],
  );

  const handleBookSeat = (bus: BusWithDetails) => {
    setSelectedBus(bus);
    setSelectedStop("");
    setBookingDialog(true);
  };

  const confirmBooking = () => {
    if (!selectedBus || !user) {
      return;
    }

    if (!selectedStop) {
      toast.error(isFromCollege ? "Please select your drop stop." : "Please select your pickup stop.");
      return;
    }

    const result = bookSeat({ busId: selectedBus.id, stopId: selectedStop, studentId: user.id });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setBookingDialog(false);
    setSelectedBus(null);
    setSelectedStop("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Book a Seat</h1>
          <p className="text-muted-foreground">Choose a shift, compare buses by seat availability, and confirm your stop.</p>
        </div>

        {activeBooking && (
          <Card className="border-warning/40 bg-warning/5">
            <CardContent className="flex flex-col gap-3 pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold">You already have an active booking.</p>
                <p className="text-sm text-muted-foreground">Cancel the current seat from My Booking before reserving another one.</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/student/booking">Go to My Booking</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Select Shift and Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={direction}
              onValueChange={(value) => {
                setDirection(value as RouteDirection);
                setSelectedRoute("");
              }}
              className="mb-6"
            >
              <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-4">
                {SCHEDULE_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex flex-col gap-0.5 px-2 py-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <tab.icon className="h-3.5 w-3.5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <span className="hidden text-[10px] text-muted-foreground sm:block">{tab.desc}</span>
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
                  {filteredRoutes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name} ({route.startTime} - {route.dropTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoute && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h3 className="mb-4 font-semibold">Available Buses</h3>
                  {recommendedBuses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {recommendedBuses.map((bus, index) => (
                        <BusCard key={bus.id} bus={bus} onBook={() => handleBookSeat(bus)} isRecommended={index === 0} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No active buses with open seats are assigned to this route right now.</p>
                  )}
                </div>

                <div>
                  <h3 className="mb-4 font-semibold">Route Timeline</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <RouteTimeline
                        stops={selectedRouteData?.stops || []}
                        dropTime={selectedRouteData?.dropTime || ""}
                        startTime={selectedRouteData?.startTime || ""}
                        direction={isFromCollege ? "from_college" : "to_college"}
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
            <DialogDescription>Reserve a seat on {selectedBus?.busNumber} using the mock booking flow.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bus</span>
                <span className="font-semibold">{selectedBus?.busNumber}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Route</span>
                <span className="font-semibold">{selectedBus?.route?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Seats open</span>
                <span className="font-semibold text-success">{selectedBus?.vacantSeats}</span>
              </div>
            </div>

            <div>
              <Label>{isFromCollege ? "Select Drop Stop" : "Select Pickup Stop"}</Label>
              <Select value={selectedStop} onValueChange={setSelectedStop}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={isFromCollege ? "Choose your drop point" : "Choose your pickup point"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedBus?.route?.stops.map((stop) => (
                    <SelectItem key={stop.id} value={stop.id}>
                      {stop.name} - {stop.pickupTime}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <p>
                  Live bus tracking and map-based validation are intentionally disabled in this build. Bookings update the shared app state instantly, and the route progress view stays mock-only.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setBookingDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={confirmBooking} disabled={!!activeBooking}>
                Confirm Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BookSeat;
