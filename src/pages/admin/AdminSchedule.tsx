import React, { useState } from 'react';
import { Calendar, Sunrise, Sunset, Sun, CloudSun, Bus, Clock, MapPin } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockRoutes, getBusesWithDetails } from '@/data/mockData';
import { RouteDirection } from '@/types/bus';

const TABS: { value: RouteDirection; label: string; icon: React.ElementType; time: string }[] = [
  { value: 'morning_to_college', label: 'Morning Pickup', icon: Sunrise, time: '7:00 - 8:00 AM' },
  { value: 'afternoon_from_college', label: 'Evening Drop', icon: Sunset, time: '4:00 PM' },
  { value: 'afternoon_to_college', label: 'Afternoon Pickup', icon: Sun, time: '12:00 - 1:00 PM' },
  { value: 'afternoon_drop_from_college', label: 'Afternoon Drop', icon: CloudSun, time: '1:00 PM' },
];

const AdminSchedule = () => {
  const [direction, setDirection] = useState<RouteDirection>('morning_to_college');
  const allBuses = getBusesWithDetails();
  const filteredRoutes = mockRoutes.filter(r => r.direction === direction);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule Overview</h1>
          <p className="text-muted-foreground">View the complete bus schedule across all shifts</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TABS.map(tab => {
            const routes = mockRoutes.filter(r => r.direction === tab.value);
            const buses = allBuses.filter(b => routes.some(r => r.id === b.routeId));
            return (
              <Card key={tab.value} className="text-center">
                <CardContent className="pt-6">
                  <tab.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">{tab.label}</p>
                  <p className="text-xs text-muted-foreground">{tab.time}</p>
                  <div className="flex justify-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">{routes.length} Routes</Badge>
                    <Badge variant="outline" className="text-xs">{buses.length} Buses</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Buses Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.map(route => {
                  const buses = allBuses.filter(b => b.routeId === route.id);
                  return (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {route.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {route.startTime}
                        </div>
                      </TableCell>
                      <TableCell>{route.dropTime}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{route.stops.length} stops</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {buses.length > 0 ? buses.map(b => (
                            <Badge key={b.id} variant="secondary" className="text-xs">
                              <Bus className="h-3 w-3 mr-1" />{b.busNumber}
                            </Badge>
                          )) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSchedule;
