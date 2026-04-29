import React from "react";
import { Bus, Clock, MapPin, Navigation, Users } from "lucide-react";

import { RouteTimeline } from "@/components/bus/RouteTimeline";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BusMap } from "@/components/map/BusMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { getBusProgressDetails, isFromCollegeDirection } from "@/lib/transport";

const DriverDashboard = () => {
  const { busesWithDetails, moveBusToNextStop, moveBusToPreviousStop } = useAppData();
  const { user } = useAuth();

  const assignedBus =
    busesWithDetails.find((bus) => bus.driverId === user?.id) ??
    busesWithDetails.find((bus) => bus.driverId) ??
    busesWithDetails[0];
  const route = assignedBus?.route;
  const progressDetails = assignedBus ? getBusProgressDetails(assignedBus, route) : null;
  const currentStep = assignedBus?.progressStep ?? 0;
  const passengerCount = assignedBus?.bookedSeats ?? 0;
  const vacantSeats = assignedBus?.vacantSeats ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
            <p className="text-muted-foreground">Operate your route in mock mode and keep the campus team synced.</p>
          </div>
          <Badge className="w-fit bg-success px-4 py-1.5 text-sm text-success-foreground">
            Mock operations active
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard title="Assigned Bus" value={assignedBus?.busNumber ?? "N/A"} icon={Bus} variant="primary" />
          <StatCard title="Current Route" value={route?.name.split(" - ")[1] || route?.name || "N/A"} icon={MapPin} variant="accent" />
          <StatCard title="Passengers" value={passengerCount} icon={Users} />
          <StatCard title="Seats Open" value={vacantSeats} icon={Navigation} variant="success" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Route Operations Board
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => assignedBus && moveBusToPreviousStop(assignedBus.id)}>
                    Previous checkpoint
                  </Button>
                  <Button className="gradient-primary text-primary-foreground" onClick={() => assignedBus && moveBusToNextStop(assignedBus.id)}>
                    Advance checkpoint
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {assignedBus ? (
                  <BusMap buses={[assignedBus]} selectedBusId={assignedBus.id} className="h-[420px]" />
                ) : (
                  <p className="text-muted-foreground">No bus has been assigned yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Shift Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Current checkpoint</p>
                <p className="mt-1 font-semibold">{progressDetails?.currentWaypoint.label ?? "Not available"}</p>
                <p className="text-sm text-muted-foreground">{progressDetails?.summaryLabel ?? "Assign a route to start mock progress."}</p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Progress marker</p>
                <p className="mt-1 font-semibold">
                  Step {currentStep + 1} of {Math.max((route?.stops.length ?? 0) + 1, 1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isFromCollegeDirection(route?.direction)
                    ? "Campus departure and drop checkpoints"
                    : "Pickup checkpoints and campus arrival"}
                </p>
              </div>

              {route && (
                <div className="rounded-xl border p-4">
                  <p className="mb-3 text-sm text-muted-foreground">Today&apos;s timing</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start</p>
                      <p className="font-semibold">{route.startTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Finish</p>
                      <p className="font-semibold">{route.dropTime}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Route Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {route ? (
              <RouteTimeline
                stops={route.stops}
                dropTime={route.dropTime}
                startTime={route.startTime}
                direction={isFromCollegeDirection(route.direction) ? "from_college" : "to_college"}
              />
            ) : (
              <p className="text-muted-foreground">Route data is unavailable for this driver.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;
