import React from 'react';
import { Bus, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BusCard } from '@/components/bus/BusCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getBusesWithDetails } from '@/data/mockData';
import { useState } from 'react';

const AdminBuses = () => {
  const allBuses = getBusesWithDetails();
  const [search, setSearch] = useState('');

  const filtered = allBuses.filter(b =>
    b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.route?.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeBuses = filtered.filter(b => b.isActive);
  const inactiveBuses = filtered.filter(b => !b.isActive);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bus Management</h1>
            <p className="text-muted-foreground">View and manage all buses in the fleet</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">{allBuses.length} Total</Badge>
            <Badge className="bg-success text-sm">{allBuses.filter(b => b.isActive).length} Active</Badge>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by bus number or route..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Active Buses ({activeBuses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeBuses.map(bus => (
                <BusCard key={bus.id} bus={bus} showBookButton={false} />
              ))}
            </div>
            {activeBuses.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No active buses found</p>
            )}
          </CardContent>
        </Card>

        {inactiveBuses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-muted-foreground">Inactive Buses ({inactiveBuses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveBuses.map(bus => (
                  <BusCard key={bus.id} bus={bus} showBookButton={false} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminBuses;
