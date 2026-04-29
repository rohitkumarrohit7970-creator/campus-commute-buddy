import React, { useMemo, useState } from "react";
import { CloudSun, MapPin, PencilLine, Plus, Sun, Sunrise, Sunset } from "lucide-react";

import { RouteTimeline } from "@/components/bus/RouteTimeline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppData } from "@/contexts/AppDataContext";
import { buildStop, getRouteDirectionLabel, isFromCollegeDirection } from "@/lib/transport";
import type { Route, RouteDirection } from "@/types/bus";

const TABS: { value: RouteDirection; label: string; icon: React.ElementType }[] = [
  { value: "morning_to_college", label: "Morning Pickup", icon: Sunrise },
  { value: "afternoon_from_college", label: "Evening Drop", icon: Sunset },
  { value: "afternoon_to_college", label: "Afternoon Pickup", icon: Sun },
  { value: "afternoon_drop_from_college", label: "Afternoon Drop", icon: CloudSun },
];

interface RouteFormState {
  id?: string;
  direction: RouteDirection;
  name: string;
  startTime: string;
  dropTime: string;
  stopsText: string;
}

const emptyRouteForm: RouteFormState = {
  direction: "morning_to_college",
  name: "",
  startTime: "07:00",
  dropTime: "08:00",
  stopsText: "",
};

const AdminRoutes = () => {
  const { busesWithDetails, routes, saveRoute } = useAppData();
  const [direction, setDirection] = useState<RouteDirection>("morning_to_college");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<RouteFormState>(emptyRouteForm);

  const filteredRoutes = useMemo(
    () => routes.filter((route) => route.direction === direction),
    [direction, routes],
  );

  const openCreateDialog = () => {
    setForm({ ...emptyRouteForm, direction });
    setDialogOpen(true);
  };

  const openEditDialog = (route: Route) => {
    setForm({
      id: route.id,
      direction: route.direction,
      name: route.name,
      startTime: route.startTime,
      dropTime: route.dropTime,
      stopsText: route.stops.map((stop) => `${stop.name} | ${stop.pickupTime}`).join("\n"),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const matchingRoute = routes.find((route) => route.id === form.id);
    const stops = form.stopsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [namePart, timePart] = line.split("|").map((part) => part.trim());
        const existingStop = matchingRoute?.stops[index];
        return namePart
          ? buildStop(namePart, timePart || existingStop?.pickupTime || form.startTime, index + 1, existingStop)
          : null;
      })
      .filter((stop): stop is NonNullable<typeof stop> => Boolean(stop));

    if (!form.name.trim() || stops.length === 0) {
      return;
    }

    saveRoute({
      id: form.id,
      direction: form.direction,
      name: form.name.trim(),
      startTime: form.startTime,
      dropTime: form.dropTime,
      stops,
    });
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Route Management</h1>
            <p className="text-muted-foreground">Create, adjust, and review routes across every campus shift.</p>
          </div>
          <Button className="gradient-primary text-primary-foreground" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>

        <Tabs value={direction} onValueChange={(value) => setDirection(value as RouteDirection)}>
          <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-4">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 py-2 text-xs">
                <tab.icon className="h-3.5 w-3.5" />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredRoutes.map((route) => {
            const busesOnRoute = busesWithDetails.filter((bus) => bus.routeId === route.id);
            return (
              <Card key={route.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        {route.name}
                      </CardTitle>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{route.startTime} - {route.dropTime}</Badge>
                        <Badge className="bg-primary/10 text-primary">{route.stops.length} Stops</Badge>
                        <Badge className="bg-success/10 text-success">{busesOnRoute.length} Buses</Badge>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(route)}>
                      <PencilLine className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <RouteTimeline
                    stops={route.stops}
                    startTime={route.startTime}
                    dropTime={route.dropTime}
                    direction={isFromCollegeDirection(route.direction) ? "from_college" : "to_college"}
                  />
                  {busesOnRoute.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="mb-2 text-sm text-muted-foreground">Assigned buses</p>
                      <div className="flex flex-wrap gap-2">
                        {busesOnRoute.map((bus) => (
                          <Badge key={bus.id} variant="secondary">
                            {bus.busNumber}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Route" : "Add New Route"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Shift</Label>
              <Select value={form.direction} onValueChange={(value) => setForm((current) => ({ ...current, direction: value as RouteDirection }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shift" />
                </SelectTrigger>
                <SelectContent>
                  {TABS.map((tab) => (
                    <SelectItem key={tab.value} value={tab.value}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{getRouteDirectionLabel(form.direction)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="routeName">Route Name</Label>
              <Input
                id="routeName"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Route K - Patel Nagar to GEU"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropTime">End Time</Label>
                <Input
                  id="dropTime"
                  type="time"
                  value={form.dropTime}
                  onChange={(event) => setForm((current) => ({ ...current, dropTime: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stops">Stops</Label>
              <Textarea
                id="stops"
                rows={8}
                value={form.stopsText}
                onChange={(event) => setForm((current) => ({ ...current, stopsText: event.target.value }))}
                placeholder={"Clock Tower | 07:00\nISBT Dehradun | 07:20\nRispana Bridge | 07:35"}
              />
              <p className="text-xs text-muted-foreground">Enter one stop per line in the format: stop name | HH:MM</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
                Save Route
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminRoutes;
