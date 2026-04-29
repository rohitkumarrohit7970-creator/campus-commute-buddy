import React, { useMemo, useState } from "react";
import { Bus, PencilLine, Plus, Search } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppData } from "@/contexts/AppDataContext";

interface BusFormState {
  id?: string;
  busNumber: string;
  capacity: string;
  routeId: string;
  driverId: string;
  isActive: boolean;
}

const emptyForm: BusFormState = {
  busNumber: "",
  capacity: "45",
  routeId: "",
  driverId: "unassigned",
  isActive: true,
};

const AdminBuses = () => {
  const { busesWithDetails, drivers, routes, saveBus } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<BusFormState>(emptyForm);

  const filteredBuses = useMemo(
    () =>
      busesWithDetails.filter((bus) => {
        const searchTerm = search.toLowerCase();
        return (
          bus.busNumber.toLowerCase().includes(searchTerm) ||
          bus.route?.name.toLowerCase().includes(searchTerm) ||
          bus.driver?.name.toLowerCase().includes(searchTerm)
        );
      }),
    [busesWithDetails, search],
  );

  const openCreateDialog = () => {
    setForm({ ...emptyForm, routeId: routes[0]?.id ?? "" });
    setDialogOpen(true);
  };

  const openEditDialog = (busId: string) => {
    const bus = busesWithDetails.find((candidate) => candidate.id === busId);

    if (!bus) {
      return;
    }

    setForm({
      id: bus.id,
      busNumber: bus.busNumber,
      capacity: String(bus.capacity),
      routeId: bus.routeId,
      driverId: bus.driverId ?? "unassigned",
      isActive: bus.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.busNumber.trim() || !form.routeId || !form.capacity) {
      return;
    }

    saveBus({
      id: form.id,
      busNumber: form.busNumber.trim().toUpperCase(),
      capacity: Number(form.capacity),
      routeId: form.routeId,
      driverId: form.driverId === "unassigned" ? undefined : form.driverId,
      isActive: form.isActive,
    });
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bus Management</h1>
            <p className="text-muted-foreground">Add buses, update route assignments, and switch service status without leaving the admin portal.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">{busesWithDetails.length} Total</Badge>
            <Badge className="bg-success text-sm">{busesWithDetails.filter((bus) => bus.isActive).length} Active</Badge>
            <Button className="gradient-primary text-primary-foreground" onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Bus
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by bus, route, or driver..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Fleet Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell className="font-medium">{bus.busNumber}</TableCell>
                    <TableCell>{bus.route?.name || "No route assigned"}</TableCell>
                    <TableCell>{bus.driver?.name || "Unassigned"}</TableCell>
                    <TableCell>
                      {bus.bookedSeats}/{bus.capacity}
                    </TableCell>
                    <TableCell>
                      <Badge className={bus.isActive ? "bg-success" : "bg-muted text-muted-foreground"}>
                        {bus.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(bus.id)}>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBuses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No buses matched your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Bus" : "Add New Bus"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="busNumber">Bus Number</Label>
              <Input
                id="busNumber"
                value={form.busNumber}
                onChange={(event) => setForm((current) => ({ ...current, busNumber: event.target.value }))}
                placeholder="GEU-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned Route</Label>
              <Select value={form.routeId} onValueChange={(value) => setForm((current) => ({ ...current, routeId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned Driver</Label>
              <Select value={form.driverId} onValueChange={(value) => setForm((current) => ({ ...current, driverId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign a driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Bus is active</p>
                <p className="text-sm text-muted-foreground">Inactive buses stay visible but disappear from booking recommendations.</p>
              </div>
              <Switch checked={form.isActive} onCheckedChange={(checked) => setForm((current) => ({ ...current, isActive: checked }))} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
                Save Bus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminBuses;
