import React, { useMemo, useState } from "react";
import { Bus, PencilLine, Plus, Search, Users } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/contexts/AppDataContext";

interface DriverFormState {
  id?: string;
  name: string;
  email: string;
}

const emptyForm: DriverFormState = {
  name: "",
  email: "",
};

const AdminDrivers = () => {
  const { busesWithDetails, drivers, saveUser } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<DriverFormState>(emptyForm);

  const filteredDrivers = useMemo(
    () =>
      drivers.filter((driver) => {
        const searchTerm = search.toLowerCase();
        return driver.name.toLowerCase().includes(searchTerm) || driver.email.toLowerCase().includes(searchTerm);
      }),
    [drivers, search],
  );

  const openCreateDialog = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (driverId: string) => {
    const driver = drivers.find((candidate) => candidate.id === driverId);

    if (!driver) {
      return;
    }

    setForm({
      id: driver.id,
      name: driver.name,
      email: driver.email,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      return;
    }

    saveUser({
      id: form.id,
      name: form.name.trim(),
      email: form.email.trim(),
      role: "driver",
    });
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Driver Management</h1>
            <p className="text-muted-foreground">Maintain driver records and review each person&apos;s assigned buses.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">{drivers.length} Drivers</Badge>
            <Button className="gradient-primary text-primary-foreground" onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrivers.map((driver) => {
            const assignedBuses = busesWithDetails.filter((bus) => bus.driverId === driver.id);

            return (
              <Card key={driver.id}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary font-bold text-lg text-primary-foreground">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">{driver.email}</p>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(driver.id)}>
                      <PencilLine className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Assigned buses</p>
                    {assignedBuses.length > 0 ? (
                      assignedBuses.map((bus) => (
                        <div key={bus.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                          <div className="flex items-center gap-2">
                            <Bus className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{bus.busNumber}</p>
                              <p className="text-xs text-muted-foreground">{bus.route?.name}</p>
                            </div>
                          </div>
                          <Badge variant={bus.isActive ? "default" : "secondary"} className={bus.isActive ? "bg-success text-xs" : "text-xs"}>
                            {bus.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic text-muted-foreground">No buses assigned yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredDrivers.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted-foreground">No drivers matched your search.</p>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Driver" : "Add New Driver"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Driver name"
            />
            <Input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="driver@geu.edu.in"
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>
                Save Driver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDrivers;
