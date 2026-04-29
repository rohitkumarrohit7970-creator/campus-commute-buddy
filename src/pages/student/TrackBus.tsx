import React, { useMemo, useState } from "react";
import { Bus, Clock, MapPin, Users } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BusMap } from "@/components/map/BusMap";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/contexts/AppDataContext";
import { getBusProgressDetails } from "@/lib/transport";
import { cn } from "@/lib/utils";

const TrackBus = () => {
  const { busesWithDetails } = useAppData();
  const [selectedBusId, setSelectedBusId] = useState("");

  const activeBuses = useMemo(() => busesWithDetails.filter((bus) => bus.isActive), [busesWithDetails]);
  const selectedBus = activeBuses.find((bus) => bus.id === selectedBusId) ?? activeBuses[0];
  const progressDetails = selectedBus ? getBusProgressDetails(selectedBus, selectedBus.route) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Track Bus</h1>
          <p className="text-muted-foreground">Monitor route progress through the internal mock operations board. Live GPS and map integrations stay disabled in this build.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Mock Route Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BusMap buses={activeBuses} selectedBusId={selectedBus?.id} className="h-[480px]" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select a Bus</CardTitle>
              </CardHeader>
              <CardContent>
                <Label>Filter by Bus</Label>
                <Select value={selectedBusId || selectedBus?.id || ""} onValueChange={setSelectedBusId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a bus to inspect" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBuses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.busNumber} - {bus.route?.name || "No route"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedBus && progressDetails && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bus className="h-5 w-5 text-primary" />
                      {selectedBus.busNumber}
                    </CardTitle>
                    <Badge className="bg-success">Mock feed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Current point:</span>
                    <span className="font-medium">{progressDetails.currentWaypoint.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Next move:</span>
                    <span className="font-medium">{progressDetails.summaryLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Seats:</span>
                    <span className={cn("font-medium", selectedBus.vacantSeats > 10 ? "text-success" : "text-warning")}>
                      {selectedBus.vacantSeats}/{selectedBus.capacity} available
                    </span>
                  </div>
                  {selectedBus.driver && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="font-medium">{selectedBus.driver.name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Buses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeBuses.map((bus) => {
                    const details = getBusProgressDetails(bus, bus.route);

                    return (
                      <button
                        key={bus.id}
                        type="button"
                        className={cn(
                          "w-full rounded-lg p-3 text-left transition-colors",
                          selectedBus?.id === bus.id ? "border border-primary/20 bg-primary/10" : "bg-muted/50 hover:bg-muted",
                        )}
                        onClick={() => setSelectedBusId(bus.id)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-sm">{bus.busNumber}</p>
                            <p className="text-xs text-muted-foreground">{details?.summaryLabel ?? bus.route?.name}</p>
                          </div>
                          <span className="text-xs font-medium text-success">{bus.vacantSeats} seats</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrackBus;
