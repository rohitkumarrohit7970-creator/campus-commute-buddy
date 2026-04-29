import React from "react";
import { AlertTriangle, Bus, MapPin, TrendingUp, Users } from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BusMap } from "@/components/map/BusMap";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppDataContext";
import { getBusProgressDetails } from "@/lib/transport";

const AdminDashboard = () => {
  const { bookings, busesWithDetails, routes, students } = useAppData();
  const activeBuses = busesWithDetails.filter((bus) => bus.isActive);
  const totalSeats = busesWithDetails.reduce((total, bus) => total + bus.capacity, 0);
  const bookedSeats = busesWithDetails.reduce((total, bus) => total + bus.bookedSeats, 0);
  const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  const alerts = [
    ...busesWithDetails
      .filter((bus) => bus.vacantSeats <= 5 && bus.isActive)
      .slice(0, 3)
      .map((bus) => ({ message: `${bus.busNumber} is nearly full with only ${bus.vacantSeats} seats left.`, type: "warning" as const })),
    ...busesWithDetails
      .filter((bus) => !bus.isActive)
      .slice(0, 2)
      .map((bus) => ({ message: `${bus.busNumber} is marked inactive and needs reassignment review.`, type: "error" as const })),
  ];

  const recentBookings = bookings
    .filter((booking) => booking.status === "active")
    .slice(0, 4)
    .map((booking) => {
      const bus = busesWithDetails.find((candidate) => candidate.id === booking.busId);
      const student = students.find((candidate) => candidate.id === booking.studentId);
      return {
        id: booking.id,
        busNumber: bus?.busNumber ?? "Unknown bus",
        studentName: student?.name ?? "Unknown student",
        bookedAt: booking.bookedAt,
      };
    });

  const stats = [
    { title: "Total Buses", value: busesWithDetails.length, icon: Bus, variant: "primary" as const },
    { title: "Active Routes", value: routes.length, icon: MapPin, variant: "accent" as const },
    { title: "Registered Students", value: students.length, icon: Users, variant: "success" as const },
    { title: "Seat Occupancy", value: `${occupancyRate}%`, icon: TrendingUp, trend: { value: 5, isPositive: occupancyRate >= 60 } },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the campus fleet, monitor bookings, and oversee mock route progress from one place.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Fleet Operations Board
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BusMap buses={activeBuses} className="h-[400px]" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.message}
                    className={`rounded-lg p-3 text-sm ${
                      alert.type === "warning"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {alert.message}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No urgent fleet alerts right now.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary" />
                Fleet Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {busesWithDetails.slice(0, 6).map((bus) => {
                const details = getBusProgressDetails(bus, bus.route);

                return (
                  <div key={bus.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{bus.busNumber}</p>
                      <p className="text-sm text-muted-foreground">{bus.route?.name || "No route assigned"}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{bus.bookedSeats}/{bus.capacity} seats used</Badge>
                      <Badge className={bus.isActive ? "bg-success" : "bg-muted text-muted-foreground"}>
                        {details?.statusLabel ?? (bus.isActive ? "Active" : "Inactive")}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="rounded-lg bg-muted/50 p-4">
                    <p className="font-medium">{booking.studentName}</p>
                    <p className="text-sm text-muted-foreground">{booking.busNumber}</p>
                    <p className="text-xs text-muted-foreground">{new Date(booking.bookedAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No active bookings are recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
