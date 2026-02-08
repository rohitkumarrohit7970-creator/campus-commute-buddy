import React from 'react';
import { Users, Search, Bus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockUsers, getBusesWithDetails } from '@/data/mockData';
import { useState } from 'react';

const AdminDrivers = () => {
  const [search, setSearch] = useState('');
  const drivers = mockUsers.filter(u => u.role === 'driver');
  const allBuses = getBusesWithDetails();

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Driver Management</h1>
            <p className="text-muted-foreground">View and manage bus drivers</p>
          </div>
          <Badge variant="outline" className="text-sm w-fit">{drivers.length} Drivers</Badge>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(driver => {
            const assignedBuses = allBuses.filter(b => b.driverId === driver.id);
            return (
              <Card key={driver.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                      <p className="text-sm text-muted-foreground">{driver.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Assigned Buses:</p>
                    {assignedBuses.length > 0 ? (
                      <div className="space-y-2">
                        {assignedBuses.map(bus => (
                          <div key={bus.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Bus className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">{bus.busNumber}</span>
                            </div>
                            <Badge variant={bus.isActive ? "default" : "secondary"} className={bus.isActive ? "bg-success text-xs" : "text-xs"}>
                              {bus.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No buses assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">No drivers found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDrivers;
