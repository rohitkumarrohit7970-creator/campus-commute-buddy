import React from 'react';
import { Calendar, Clock, Bus, MapPin, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RouteTimeline } from '@/components/bus/RouteTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRoutes, mockBuses } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const DriverSchedule = () => {
  const { user } = useAuth();

  const assignedBus = mockBuses.find(b => b.driverId === user?.id) || mockBuses[0];

  // Find all routes the driver's bus could serve across shifts
  const routeBaseName = mockRoutes.find(r => r.id === assignedBus.routeId)?.name.split(' to ')[0]?.replace('GEU to ', '') || '';
  
  const morningRoute = mockRoutes.find(r => r.direction === 'morning_to_college' && r.id === assignedBus.routeId) 
    || mockRoutes.find(r => r.direction === 'morning_to_college');
  const eveningRoute = mockRoutes.find(r => r.direction === 'afternoon_from_college' && r.name.includes(routeBaseName))
    || mockRoutes.find(r => r.direction === 'afternoon_from_college');
  const afternoonPickup = mockRoutes.find(r => r.direction === 'afternoon_to_college' && r.name.includes(routeBaseName))
    || mockRoutes.find(r => r.direction === 'afternoon_to_college');
  const afternoonDrop = mockRoutes.find(r => r.direction === 'afternoon_drop_from_college' && r.name.includes(routeBaseName))
    || mockRoutes.find(r => r.direction === 'afternoon_drop_from_college');

  const shifts = [
    { key: 'morning', label: 'Morning Pickup', route: morningRoute, direction: 'to_college' as const, icon: '🌅' },
    { key: 'evening', label: 'Evening Drop', route: eveningRoute, direction: 'from_college' as const, icon: '🌆' },
    { key: 'afternoon-pickup', label: 'Afternoon Pickup', route: afternoonPickup, direction: 'to_college' as const, icon: '☀️' },
    { key: 'afternoon-drop', label: 'Afternoon Drop', route: afternoonDrop, direction: 'from_college' as const, icon: '🌇' },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>

        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Shift Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shifts.map(shift => (
                <div key={shift.key} className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{shift.icon}</span>
                    <h3 className="font-semibold text-sm">{shift.label}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{shift.route?.startTime} → {shift.route?.dropTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{shift.route?.stops.length} stops</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Schedule Tabs */}
        <Tabs defaultValue="morning" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            {shifts.map(s => (
              <TabsTrigger key={s.key} value={s.key} className="text-xs sm:text-sm">
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {shifts.map(shift => (
            <TabsContent key={shift.key} value={shift.key}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Route Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bus className="h-5 w-5 text-primary" />
                      {shift.route?.name || 'N/A'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Bus Number</p>
                        <p className="font-bold">{assignedBus.busNumber}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="font-bold">{assignedBus.bookedSeats}/{assignedBus.capacity}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Departure</p>
                        <p className="font-bold">{shift.route?.startTime}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Arrival</p>
                        <p className="font-bold">{shift.route?.dropTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                      <Badge variant="outline">{shift.direction === 'to_college' ? 'Pickup' : 'Drop'}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {shift.direction === 'to_college' ? 'Heading to GEU Campus' : 'Departing from GEU Campus'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
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
                        direction={shift.direction}
                      />
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No route data available</p>
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
