import React from "react";
import { Bus, Clock, MapPin, Navigation, Users } from "lucide-react";

import { RouteTimeline } from "@/components/bus/RouteTimeline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BusMap } from "@/components/map/BusMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData } from "@/contexts/AppDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { getBusProgressDetails, getRouteWaypoints, isFromCollegeDirection } from "@/lib/transport";
import { cn } from "@/lib/utils";

const DriverRoute = () => {
  const { busesWithDetails, moveBusToNextStop, moveBusToPreviousStop, setBusProgress } = useAppData();
  const { user } = useAuth();

  const assignedBus =
    busesWithDetails.find((bus) => bus.driverId === user?.id) ??
    busesWithDetails.find((bus) => bus.driverId) ??
    busesWithDetails[0];
  const route = assignedBus?.route;
  const progressDetails = assignedBus ? getBusProgressDetails(assignedBus, route) : null;
  const routeWaypoints = getRouteWaypoints(route);
  const currentStep = assignedBus?.progressStep ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Route</h1>
            <p className="text-muted-foreground">{route?.name || "No route assigned"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => assignedBus && moveBusToPreviousStop(assignedBus.id)}>
              Previous checkpoint
            </Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => assignedBus && moveBusToNextStop(assignedBus.id)}>
              Advance checkpoint
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Bus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bus</p>
                  <p className="text-lg font-bold">{assignedBus?.busNumber ?? "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <MapPin className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Checkpoints</p>
                  <p className="text-lg font-bold">{routeWaypoints.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start</p>
                  <p className="text-lg font-bold">{route?.startTime ?? "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passengers</p>
                  <p className="text-lg font-bold">
                    {assignedBus?.bookedSeats ?? 0}/{assignedBus?.capacity ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Route Operations View
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignedBus ? (
                  <BusMap buses={[assignedBus]} selectedBusId={assignedBus.id} className="h-[450px]" />
                ) : (
                  <p className="text-muted-foreground">This driver has no route assigned.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Route Stops
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
                <p className="text-muted-foreground">No route data available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Checkpoint Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Checkpoint</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {routeWaypoints.map((waypoint, index) => (
                    <tr key={waypoint.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{index + 1}</td>
                      <td className="px-4 py-3">{waypoint.label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{waypoint.time}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            index < currentStep && "bg-success/15 text-success",
                            index === currentStep && "bg-primary/15 text-primary",
                          )}
                        >
                          {index < currentStep ? "Completed" : index === currentStep ? progressDetails?.statusLabel ?? "Current" : "Upcoming"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {assignedBus && (
                          <Button variant="ghost" size="sm" onClick={() => setBusProgress(assignedBus.id, index)}>
                            <Navigation className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriverRoute;
