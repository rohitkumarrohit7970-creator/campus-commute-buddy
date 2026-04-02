import React, { useState, useMemo } from 'react';
import { MapPin, Bus, Clock, Users, Radio } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BusMap } from '@/components/map/BusMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getBusesWithDetails } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useRealtimeDriverLocation } from '@/hooks/useRealtimeDriverLocation';

const TrackBus = () => {
  const allBuses = getBusesWithDetails();
  const activeBuses = allBuses.filter(b => b.isActive);
  const [selectedBusId, setSelectedBusId] = useState('');
  const selectedBus = activeBuses.find(b => b.id === selectedBusId);

  // Get driver IDs for real-time location tracking
  const driverIds = useMemo(() => 
    activeBuses.map(b => b.driverId).filter(Boolean) as string[], 
    [activeBuses]
  );
  const driverLocations = useRealtimeDriverLocation(driverIds);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Track Bus</h1>
          <p className="text-muted-foreground">View live locations of all active buses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Live Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BusMap
                  buses={activeBuses.map(b => ({
                    id: b.id, busNumber: b.busNumber, capacity: b.capacity, bookedSeats: b.bookedSeats,
                    routeId: b.routeId, driverId: b.driverId, currentLocation: b.currentLocation, isActive: b.isActive,
                  }))}
                  className="h-[400px]"
                />
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
                <Select value={selectedBusId} onValueChange={setSelectedBusId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a bus to track" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBuses.map(bus => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.busNumber} - {bus.route?.name || 'No route'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedBus && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bus className="h-5 w-5 text-primary" />
                      {selectedBus.busNumber}
                    </CardTitle>
                    <Badge className="bg-success">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Route:</span>
                    <span className="font-medium">{selectedBus.route?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-medium">{selectedBus.route?.startTime} - {selectedBus.route?.dropTime}</span>
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
                  {activeBuses.map(bus => (
                    <div
                      key={bus.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                        selectedBusId === bus.id ? "bg-primary/10 border border-primary/20" : "bg-muted/50 hover:bg-muted"
                      )}
                      onClick={() => setSelectedBusId(bus.id)}
                    >
                      <div>
                        <p className="font-medium text-sm">{bus.busNumber}</p>
                        <p className="text-xs text-muted-foreground">{bus.route?.name}</p>
                      </div>
                      <span className="text-xs font-medium text-success">{bus.vacantSeats} seats</span>
                    </div>
                  ))}
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
