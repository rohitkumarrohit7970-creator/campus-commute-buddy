import React from 'react';
import { Bus, Calendar, MapPin, Ticket } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BusMap } from '@/components/map/BusMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockBookings, getBusesWithDetails } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const allBuses = getBusesWithDetails();
  const myBooking = mockBookings.find(b => b.studentId === user?.id && b.status === 'active');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">Book your seat and track your bus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="My Booking" value={myBooking ? 'Active' : 'None'} icon={Ticket} variant={myBooking ? 'success' : 'default'} />
          <StatCard title="College ID" value={user?.collegeId || 'N/A'} icon={Calendar} />
          <StatCard title="Available Buses" value={allBuses.filter(b => b.isActive && b.vacantSeats > 0).length} icon={Bus} variant="accent" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Live Bus Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BusMap
              buses={allBuses.filter(b => b.isActive).map(b => ({
                id: b.id, busNumber: b.busNumber, capacity: b.capacity, bookedSeats: b.bookedSeats,
                routeId: b.routeId, driverId: b.driverId, currentLocation: b.currentLocation, isActive: b.isActive,
              }))}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
