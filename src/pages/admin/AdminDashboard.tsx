import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Users, MapPin, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { BusCard } from '@/components/bus/BusCard';
import { BusMap } from '@/components/map/BusMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBusesWithDetails, mockRoutes, mockUsers } from '@/data/mockData';

const AdminDashboard = () => {
  const buses = getBusesWithDetails();
  const activeBuses = buses.filter(b => b.isActive);
  const totalSeats = buses.reduce((acc, b) => acc + b.capacity, 0);
  const bookedSeats = buses.reduce((acc, b) => acc + b.bookedSeats, 0);
  const occupancyRate = Math.round((bookedSeats / totalSeats) * 100);

  const stats = [
    { title: 'Total Buses', value: buses.length, icon: Bus, variant: 'primary' as const },
    { title: 'Active Routes', value: mockRoutes.length, icon: MapPin, variant: 'accent' as const },
    { title: 'Registered Students', value: mockUsers.filter(u => u.role === 'student').length * 50, icon: Users, variant: 'success' as const },
    { title: 'Seat Occupancy', value: `${occupancyRate}%`, icon: TrendingUp, trend: { value: 5, isPositive: true } },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your bus fleet</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Map and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Live Bus Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BusMap buses={activeBuses.map(b => ({
                  id: b.id,
                  busNumber: b.busNumber,
                  capacity: b.capacity,
                  bookedSeats: b.bookedSeats,
                  routeId: b.routeId,
                  driverId: b.driverId,
                  currentLocation: b.currentLocation,
                  isActive: b.isActive,
                }))} className="h-[350px]" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { message: 'CB-002 is near full capacity', type: 'warning' },
                { message: 'CB-004 is currently inactive', type: 'error' },
                { message: 'Route B running 5 mins ahead', type: 'info' },
              ].map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-3 rounded-lg text-sm ${
                    alert.type === 'warning' ? 'bg-warning/10 text-warning' :
                    alert.type === 'error' ? 'bg-destructive/10 text-destructive' :
                    'bg-primary/10 text-primary'
                  }`}
                >
                  {alert.message}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bus Fleet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              Bus Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buses.map((bus) => (
                <BusCard key={bus.id} bus={bus} showBookButton={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
