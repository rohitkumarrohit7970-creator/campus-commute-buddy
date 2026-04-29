import React from "react";
import { Bus, Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

import { BusMap } from "@/components/map/BusMap";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { getBusProgressDetails } from "@/lib/transport";

const StudentDashboard = () => {
  const { bookings, busesWithDetails } = useAppData();
  const { user } = useAuth();

  const myBooking = bookings.find((booking) => booking.studentId === user?.id && booking.status === "active");
  const myBus = myBooking ? busesWithDetails.find((bus) => bus.id === myBooking.busId) : null;
  const myRoute = myBus?.route;
  const myStop = myRoute?.stops.find((stop) => stop.id === myBooking?.stopId);
  const progressDetails = myBus ? getBusProgressDetails(myBus, myRoute) : null;
  const activeBuses = busesWithDetails.filter((bus) => bus.isActive);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted-foreground">Plan your commute, manage your seat, and monitor mock route progress.</p>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/student/booking">View booking</Link>
            </Button>
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/student/book">Book a seat</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard title="My Booking" value={myBooking ? "Active" : "Not booked"} icon={Ticket} variant={myBooking ? "success" : "default"} />
          <StatCard title="College ID" value={user?.collegeId || "N/A"} icon={Calendar} />
          <StatCard title="Open Seats" value={activeBuses.reduce((total, bus) => total + bus.vacantSeats, 0)} icon={Bus} variant="accent" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Mock Operations View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BusMap buses={myBus ? [myBus, ...activeBuses.filter((bus) => bus.id !== myBus.id)] : activeBuses} selectedBusId={myBus?.id} className="h-[420px]" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Commute Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {myBooking && myBus && myRoute ? (
                <>
                  <div className="rounded-xl border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground">Bus</p>
                    <p className="mt-1 text-lg font-semibold">{myBus.busNumber}</p>
                    <p className="text-sm text-muted-foreground">{myRoute.name}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4">
                      <p className="text-sm text-muted-foreground">Pickup point</p>
                      <p className="mt-1 font-semibold">{myStop?.name ?? "Campus stop pending"}</p>
                      <p className="text-sm text-muted-foreground">{myStop?.pickupTime ?? myRoute.startTime}</p>
                    </div>

                    <div className="rounded-xl border p-4">
                      <p className="text-sm text-muted-foreground">Seat number</p>
                      <p className="mt-1 font-semibold">#{myBooking.seatNumber}</p>
                      <p className="text-sm text-muted-foreground">Booked {new Date(myBooking.bookedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Route status</p>
                    <p className="mt-1 font-semibold">{progressDetails?.statusLabel ?? "Mock status unavailable"}</p>
                    <p className="text-sm text-muted-foreground">{progressDetails?.summaryLabel ?? "Live GPS is intentionally disabled in this build."}</p>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed p-6 text-center">
                  <Ticket className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                  <h3 className="text-lg font-semibold">No active seat yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Choose a route, lock in a seat, and this dashboard will start showing your assigned bus summary.
                  </p>
                  <Button asChild className="mt-4 gradient-primary text-primary-foreground">
                    <Link to="/student/book">Start booking</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
