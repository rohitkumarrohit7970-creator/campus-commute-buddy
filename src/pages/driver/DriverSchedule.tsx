import React from "react";
import { ArrowRight, Bus, Calendar, Clock, MapPin } from "lucide-react";

import { RouteTimeline } from "@/components/bus/RouteTimeline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppData } from "@/contexts/AppDataContext";
import { useAuth } from "@/contexts/AuthContext";
import { getRouteBaseName, isFromCollegeDirection } from "@/lib/transport";

const DriverSchedule = () => {
  const { busesWithDetails, routes } = useAppData();
  const { user } = useAuth();

  const assignedBus =
    busesWithDetails.find((bus) => bus.driverId === user?.id) ??
    busesWithDetails.find((bus) => bus.driverId) ??
    busesWithDetails[0];
  const primaryRoute = routes.find((route) => route.id === assignedBus?.routeId);
  const routeBaseName = primaryRoute ? getRouteBaseName(primaryRoute.name) : "";

  const findShiftRoute = (direction: typeof routes[number]["direction"]) =>
    routes.find((route) => route.direction === direction && getRouteBaseName(route.name) === routeBaseName) ??
    routes.find((route) => route.direction === direction);

  const shifts = [
    { key: "morning", label: "Morning Pickup", route: findShiftRoute("morning_to_college"), icon: "🌅" },
    { key: "evening", label: "Evening Drop", route: findShiftRoute("afternoon_from_college"), icon: "🌆" },
    { key: "afternoon-pickup", label: "Afternoon Pickup", route: findShiftRoute("afternoon_to_college"), icon: "☀️" },
    { key: "afternoon-drop", label: "Afternoon Drop", route: findShiftRoute("afternoon_drop_from_college"), icon: "🌇" },
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today&apos;s Shift Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {shifts.map((shift) => (
                <div key={shift.key} className="space-y-2 rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{shift.icon}</span>
                    <h3 className="text-sm font-semibold">{shift.label}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{shift.route?.startTime} to {shift.route?.dropTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{shift.route?.stops.length ?? 0} stops</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="morning" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            {shifts.map((shift) => (
              <TabsTrigger key={shift.key} value={shift.key} className="text-xs sm:text-sm">
                {shift.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {shifts.map((shift) => (
            <TabsContent key={shift.key} value={shift.key}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bus className="h-5 w-5 text-primary" />
                      {shift.route?.name || "No route assigned"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Bus Number</p>
                        <p className="font-bold">{assignedBus?.busNumber ?? "N/A"}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="font-bold">
                          {assignedBus?.bookedSeats ?? 0}/{assignedBus?.capacity ?? 0}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Departure</p>
                        <p className="font-bold">{shift.route?.startTime || "N/A"}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Arrival</p>
                        <p className="font-bold">{shift.route?.dropTime || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Badge variant="outline">
                        {isFromCollegeDirection(shift.route?.direction) ? "Drop" : "Pickup"}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {isFromCollegeDirection(shift.route?.direction) ? "Departing from GEU campus" : "Heading toward GEU campus"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      Stops Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {shift.route ? (
                      <RouteTimeline
                        stops={shift.route.stops}
                        dropTime={shift.route.dropTime}
                        startTime={shift.route.startTime}
                        direction={isFromCollegeDirection(shift.route.direction) ? "from_college" : "to_college"}
                      />
                    ) : (
                      <p className="py-8 text-center text-muted-foreground">No route data available for this shift.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DriverSchedule;
