import React, { useState } from 'react';
import { MapPin, Sunrise, Sunset, Sun, CloudSun } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RouteTimeline } from '@/components/bus/RouteTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRoutes, getBusesWithDetails } from '@/data/mockData';
import { RouteDirection } from '@/types/bus';

const TABS: { value: RouteDirection; label: string; icon: React.ElementType }[] = [
  { value: 'morning_to_college', label: 'Morning Pickup', icon: Sunrise },
  { value: 'afternoon_from_college', label: 'Evening Drop', icon: Sunset },
  { value: 'afternoon_to_college', label: 'Afternoon Pickup', icon: Sun },
  { value: 'afternoon_drop_from_college', label: 'Afternoon Drop', icon: CloudSun },
];

const AdminRoutes = () => {
  const [direction, setDirection] = useState<RouteDirection>('morning_to_college');
  const allBuses = getBusesWithDetails();
  const filteredRoutes = mockRoutes.filter(r => r.direction === direction);
  const isFromCollege = direction === 'afternoon_from_college' || direction === 'afternoon_drop_from_college';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Route Management</h1>
          <p className="text-muted-foreground">View all routes and their schedules</p>
        </div>

        <Tabs value={direction} onValueChange={v => setDirection(v as RouteDirection)}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            {TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 py-2 text-xs">
                <tab.icon className="h-3.5 w-3.5" />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoutes.map(route => {
            const busesOnRoute = allBuses.filter(b => b.routeId === route.id);
            return (
              <Card key={route.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {route.name}
                    </CardTitle>
                    <Badge variant="outline">{route.startTime} - {route.dropTime}</Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-primary/10 text-primary">{route.stops.length} Stops</Badge>
                    <Badge className="bg-success/10 text-success">{busesOnRoute.length} Buses</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <RouteTimeline
                    stops={route.stops}
                    startTime={route.startTime}
                    dropTime={route.dropTime}
                    direction={isFromCollege ? 'from_college' : 'to_college'}
                  />
                  {busesOnRoute.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Assigned Buses:</p>
                      <div className="flex flex-wrap gap-2">
                        {busesOnRoute.map(b => (
                          <Badge key={b.id} variant="secondary">{b.busNumber}</Badge>
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
    </DashboardLayout>
  );
};

export default AdminRoutes;
