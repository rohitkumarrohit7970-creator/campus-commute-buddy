import { Bus, Route, Stop, User, Booking, BusWithDetails } from '@/types/bus';

// Graphic Era University, Dehradun location
export const COLLEGE_LOCATION = { lat: 30.2672, lng: 78.0081 };

export const mockUsers: User[] = [
  { id: '1', email: 'admin@geu.edu.in', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'rahul@geu.edu.in', role: 'student', name: 'Rahul Sharma', collegeId: 'GEU2024001' },
  { id: '3', email: 'priya@geu.edu.in', role: 'student', name: 'Priya Singh', collegeId: 'GEU2024002' },
  { id: '4', email: 'driver1@geu.edu.in', role: 'driver', name: 'Ramesh Kumar' },
  { id: '5', email: 'driver2@geu.edu.in', role: 'driver', name: 'Suresh Rawat' },
];

// Stops around Dehradun leading to Graphic Era, Clement Town
export const mockStops: Stop[] = [
  // Route A - City Center Route
  { id: 's1', name: 'Clock Tower', pickupTime: '07:15', order: 1, location: { lat: 30.3165, lng: 78.0322 } },
  { id: 's2', name: 'Paltan Bazaar', pickupTime: '07:25', order: 2, location: { lat: 30.3189, lng: 78.0361 } },
  { id: 's3', name: 'ISBT Dehradun', pickupTime: '07:40', order: 3, location: { lat: 30.2986, lng: 78.0268 } },
  { id: 's4', name: 'Rispana Bridge', pickupTime: '07:55', order: 4, location: { lat: 30.2847, lng: 78.0156 } },
  
  // Route B - Rajpur Road Route  
  { id: 's5', name: 'Rajpur Road', pickupTime: '07:20', order: 1, location: { lat: 30.3456, lng: 78.0534 } },
  { id: 's6', name: 'Pacific Mall', pickupTime: '07:35', order: 2, location: { lat: 30.3312, lng: 78.0423 } },
  { id: 's7', name: 'Survey Chowk', pickupTime: '07:50', order: 3, location: { lat: 30.3078, lng: 78.0312 } },
  
  // Route C - Prem Nagar Route
  { id: 's8', name: 'Prem Nagar', pickupTime: '07:25', order: 1, location: { lat: 30.2789, lng: 77.9956 } },
  { id: 's9', name: 'Niranjanpur', pickupTime: '07:40', order: 2, location: { lat: 30.2712, lng: 78.0023 } },
  { id: 's10', name: 'FRI Gate', pickupTime: '07:55', order: 3, location: { lat: 30.2634, lng: 78.0078 } },
];

export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Route A - Clock Tower to GEU',
    stops: [mockStops[0], mockStops[1], mockStops[2], mockStops[3]],
    startTime: '07:15',
    dropTime: '08:15',
    collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r2',
    name: 'Route B - Rajpur Road to GEU',
    stops: [mockStops[4], mockStops[5], mockStops[6]],
    startTime: '07:20',
    dropTime: '08:10',
    collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r3',
    name: 'Route C - Prem Nagar to GEU',
    stops: [mockStops[7], mockStops[8], mockStops[9]],
    startTime: '07:25',
    dropTime: '08:20',
    collegeLocation: COLLEGE_LOCATION,
  },
];

export const mockBuses: Bus[] = [
  { id: 'b1', busNumber: 'GEU-01', capacity: 45, bookedSeats: 32, routeId: 'r1', driverId: '4', currentLocation: { lat: 30.3078, lng: 78.0268 }, isActive: true },
  { id: 'b2', busNumber: 'GEU-02', capacity: 50, bookedSeats: 48, routeId: 'r1', driverId: '5', currentLocation: { lat: 30.2912, lng: 78.0189 }, isActive: true },
  { id: 'b3', busNumber: 'GEU-03', capacity: 40, bookedSeats: 15, routeId: 'r2', driverId: '4', currentLocation: { lat: 30.3234, lng: 78.0423 }, isActive: true },
  { id: 'b4', busNumber: 'GEU-04', capacity: 45, bookedSeats: 28, routeId: 'r2', currentLocation: { lat: 30.3156, lng: 78.0356 }, isActive: true },
  { id: 'b5', busNumber: 'GEU-05', capacity: 40, bookedSeats: 35, routeId: 'r3', driverId: '5', currentLocation: { lat: 30.2734, lng: 78.0012 }, isActive: true },
  { id: 'b6', busNumber: 'GEU-06', capacity: 45, bookedSeats: 40, routeId: 'r3', isActive: false },
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
