import { Bus, Route, Stop, User, Booking, BusWithDetails } from '@/types/bus';

export const mockUsers: User[] = [
  { id: '1', email: 'admin@college.edu', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'john@college.edu', role: 'student', name: 'John Doe', collegeId: 'STU001' },
  { id: '3', email: 'jane@college.edu', role: 'student', name: 'Jane Smith', collegeId: 'STU002' },
  { id: '4', email: 'driver1@college.edu', role: 'driver', name: 'Mike Johnson' },
  { id: '5', email: 'driver2@college.edu', role: 'driver', name: 'Sarah Wilson' },
];

export const mockStops: Stop[] = [
  { id: 's1', name: 'Central Station', pickupTime: '07:30', order: 1, location: { lat: 12.9716, lng: 77.5946 } },
  { id: 's2', name: 'Tech Park', pickupTime: '07:45', order: 2, location: { lat: 12.9656, lng: 77.6056 } },
  { id: 's3', name: 'Mall Junction', pickupTime: '08:00', order: 3, location: { lat: 12.9596, lng: 77.6166 } },
  { id: 's4', name: 'North Point', pickupTime: '07:35', order: 1, location: { lat: 12.9816, lng: 77.5846 } },
  { id: 's5', name: 'East Colony', pickupTime: '07:50', order: 2, location: { lat: 12.9756, lng: 77.5946 } },
  { id: 's6', name: 'Market Square', pickupTime: '08:05', order: 3, location: { lat: 12.9696, lng: 77.6046 } },
];

export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Route A - Central',
    stops: [mockStops[0], mockStops[1], mockStops[2]],
    startTime: '07:30',
    dropTime: '08:30',
    collegeLocation: { lat: 12.9536, lng: 77.6276 },
  },
  {
    id: 'r2',
    name: 'Route B - North',
    stops: [mockStops[3], mockStops[4], mockStops[5]],
    startTime: '07:35',
    dropTime: '08:35',
    collegeLocation: { lat: 12.9536, lng: 77.6276 },
  },
];

export const mockBuses: Bus[] = [
  { id: 'b1', busNumber: 'CB-001', capacity: 45, bookedSeats: 32, routeId: 'r1', driverId: '4', currentLocation: { lat: 12.9676, lng: 77.5996 }, isActive: true },
  { id: 'b2', busNumber: 'CB-002', capacity: 50, bookedSeats: 48, routeId: 'r1', driverId: '5', currentLocation: { lat: 12.9616, lng: 77.6096 }, isActive: true },
  { id: 'b3', busNumber: 'CB-003', capacity: 40, bookedSeats: 15, routeId: 'r2', driverId: '4', currentLocation: { lat: 12.9776, lng: 77.5896 }, isActive: true },
  { id: 'b4', busNumber: 'CB-004', capacity: 45, bookedSeats: 40, routeId: 'r2', isActive: false },
];

export const mockBookings: Booking[] = [
  { id: 'bk1', studentId: '2', busId: 'b1', stopId: 's1', seatNumber: 12, bookedAt: '2024-01-15T08:00:00Z', status: 'active' },
  { id: 'bk2', studentId: '3', busId: 'b1', stopId: 's2', seatNumber: 15, bookedAt: '2024-01-15T09:30:00Z', status: 'active' },
];

export const getBusesWithDetails = (): BusWithDetails[] => {
  return mockBuses.map(bus => {
    const route = mockRoutes.find(r => r.id === bus.routeId);
    const driver = mockUsers.find(u => u.id === bus.driverId);
    return {
      ...bus,
      route,
      driver,
      vacantSeats: bus.capacity - bus.bookedSeats,
    };
  });
};

export const getRecommendedBuses = (routeId: string): BusWithDetails[] => {
  return getBusesWithDetails()
    .filter(bus => bus.routeId === routeId && bus.isActive)
    .sort((a, b) => b.vacantSeats - a.vacantSeats);
};
