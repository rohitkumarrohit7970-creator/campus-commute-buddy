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
  // Route A - Clock Tower / City Center
  { id: 's1', name: 'Clock Tower', pickupTime: '07:00', order: 1, location: { lat: 30.3165, lng: 78.0322 } },
  { id: 's2', name: 'Paltan Bazaar', pickupTime: '07:10', order: 2, location: { lat: 30.3189, lng: 78.0361 } },
  { id: 's3', name: 'ISBT Dehradun', pickupTime: '07:20', order: 3, location: { lat: 30.2986, lng: 78.0268 } },
  { id: 's4', name: 'Rispana Bridge', pickupTime: '07:35', order: 4, location: { lat: 30.2847, lng: 78.0156 } },

  // Route B - Rajpur Road
  { id: 's5', name: 'Rajpur Road (Doon Hospital)', pickupTime: '07:10', order: 1, location: { lat: 30.3456, lng: 78.0534 } },
  { id: 's6', name: 'Pacific Mall', pickupTime: '07:20', order: 2, location: { lat: 30.3312, lng: 78.0423 } },
  { id: 's7', name: 'Survey Chowk', pickupTime: '07:30', order: 3, location: { lat: 30.3078, lng: 78.0312 } },
  { id: 's8', name: 'EC Road Crossing', pickupTime: '07:40', order: 4, location: { lat: 30.2920, lng: 78.0200 } },

  // Route C - Prem Nagar / FRI
  { id: 's9', name: 'Prem Nagar', pickupTime: '07:15', order: 1, location: { lat: 30.2789, lng: 77.9956 } },
  { id: 's10', name: 'Niranjanpur', pickupTime: '07:25', order: 2, location: { lat: 30.2712, lng: 78.0023 } },
  { id: 's11', name: 'FRI Gate', pickupTime: '07:35', order: 3, location: { lat: 30.2634, lng: 78.0078 } },

  // Route D - Haridwar Road
  { id: 's12', name: 'Mothrowala', pickupTime: '07:00', order: 1, location: { lat: 30.2650, lng: 78.0700 } },
  { id: 's13', name: 'Nepali Farm', pickupTime: '07:10', order: 2, location: { lat: 30.2700, lng: 78.0580 } },
  { id: 's14', name: 'Shimla Bypass Crossing', pickupTime: '07:20', order: 3, location: { lat: 30.2750, lng: 78.0450 } },
  { id: 's15', name: 'Ballupur Chowk', pickupTime: '07:30', order: 4, location: { lat: 30.2800, lng: 78.0350 } },

  // Route E - Mussoorie Road / Malsi
  { id: 's16', name: 'Malsi Deer Park', pickupTime: '07:05', order: 1, location: { lat: 30.3800, lng: 78.0600 } },
  { id: 's17', name: 'Kulhan', pickupTime: '07:15', order: 2, location: { lat: 30.3600, lng: 78.0500 } },
  { id: 's18', name: 'Sahastradhara Road', pickupTime: '07:25', order: 3, location: { lat: 30.3400, lng: 78.0450 } },
  { id: 's19', name: 'ONGC Chowk', pickupTime: '07:35', order: 4, location: { lat: 30.3200, lng: 78.0380 } },

  // Route F - Raipur Road / Doiwala
  { id: 's20', name: 'Doiwala', pickupTime: '06:50', order: 1, location: { lat: 30.1800, lng: 78.1200 } },
  { id: 's21', name: 'Raipur', pickupTime: '07:05', order: 2, location: { lat: 30.2100, lng: 78.0900 } },
  { id: 's22', name: 'Banjarawala', pickupTime: '07:15', order: 3, location: { lat: 30.2300, lng: 78.0700 } },
  { id: 's23', name: 'Harrawala', pickupTime: '07:25', order: 4, location: { lat: 30.2450, lng: 78.0500 } },

  // Route G - Saharanpur Road / Selaqui
  { id: 's24', name: 'Selaqui', pickupTime: '06:55', order: 1, location: { lat: 30.3700, lng: 77.8600 } },
  { id: 's25', name: 'Bhagwanpur', pickupTime: '07:10', order: 2, location: { lat: 30.3400, lng: 77.9000 } },
  { id: 's26', name: 'Vikasnagar Mod', pickupTime: '07:20', order: 3, location: { lat: 30.3200, lng: 77.9400 } },
  { id: 's27', name: 'Majra', pickupTime: '07:35', order: 4, location: { lat: 30.3000, lng: 77.9700 } },

  // Route H - Chakrata Road
  { id: 's28', name: 'Kaulagarh', pickupTime: '07:10', order: 1, location: { lat: 30.3350, lng: 77.9800 } },
  { id: 's29', name: 'Raipur Road Crossing', pickupTime: '07:20', order: 2, location: { lat: 30.3100, lng: 77.9900 } },
  { id: 's30', name: 'Dharampur', pickupTime: '07:30', order: 3, location: { lat: 30.2900, lng: 78.0000 } },

  // Route I - Rishikesh Road
  { id: 's31', name: 'Rishikesh Bus Stand', pickupTime: '06:40', order: 1, location: { lat: 30.0869, lng: 78.2676 } },
  { id: 's32', name: 'Raiwala', pickupTime: '06:55', order: 2, location: { lat: 30.1100, lng: 78.2300 } },
  { id: 's33', name: 'Shyampur', pickupTime: '07:10', order: 3, location: { lat: 30.1500, lng: 78.1800 } },
  { id: 's34', name: 'Lachhiwala', pickupTime: '07:25', order: 4, location: { lat: 30.2000, lng: 78.1300 } },

  // Route J - Herbertpur / Paonta Sahib Road
  { id: 's35', name: 'Herbertpur', pickupTime: '06:45', order: 1, location: { lat: 30.3900, lng: 77.7800 } },
  { id: 's36', name: 'Kalsi', pickupTime: '07:05', order: 2, location: { lat: 30.4000, lng: 77.8400 } },
  { id: 's37', name: 'Dakpathar', pickupTime: '07:20', order: 3, location: { lat: 30.3800, lng: 77.8900 } },
];

export const mockRoutes: Route[] = [
  {
    id: 'r1', name: 'Route A - Clock Tower / City Center to GEU',
    stops: [mockStops[0], mockStops[1], mockStops[2], mockStops[3]],
    startTime: '07:00', dropTime: '08:00', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r2', name: 'Route B - Rajpur Road to GEU',
    stops: [mockStops[4], mockStops[5], mockStops[6], mockStops[7]],
    startTime: '07:10', dropTime: '08:05', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r3', name: 'Route C - Prem Nagar / FRI to GEU',
    stops: [mockStops[8], mockStops[9], mockStops[10]],
    startTime: '07:15', dropTime: '07:55', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r4', name: 'Route D - Haridwar Road to GEU',
    stops: [mockStops[11], mockStops[12], mockStops[13], mockStops[14]],
    startTime: '07:00', dropTime: '07:55', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r5', name: 'Route E - Mussoorie Road / Malsi to GEU',
    stops: [mockStops[15], mockStops[16], mockStops[17], mockStops[18]],
    startTime: '07:05', dropTime: '08:05', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r6', name: 'Route F - Doiwala / Raipur to GEU',
    stops: [mockStops[19], mockStops[20], mockStops[21], mockStops[22]],
    startTime: '06:50', dropTime: '07:50', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r7', name: 'Route G - Selaqui / Saharanpur Road to GEU',
    stops: [mockStops[23], mockStops[24], mockStops[25], mockStops[26]],
    startTime: '06:55', dropTime: '08:00', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r8', name: 'Route H - Chakrata Road to GEU',
    stops: [mockStops[27], mockStops[28], mockStops[29]],
    startTime: '07:10', dropTime: '07:55', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r9', name: 'Route I - Rishikesh to GEU',
    stops: [mockStops[30], mockStops[31], mockStops[32], mockStops[33]],
    startTime: '06:40', dropTime: '08:00', collegeLocation: COLLEGE_LOCATION,
  },
  {
    id: 'r10', name: 'Route J - Herbertpur / Kalsi to GEU',
    stops: [mockStops[34], mockStops[35], mockStops[36]],
    startTime: '06:45', dropTime: '07:55', collegeLocation: COLLEGE_LOCATION,
  },
];

export const mockBuses: Bus[] = [
  { id: 'b1', busNumber: 'GEU-01', capacity: 45, bookedSeats: 32, routeId: 'r1', driverId: '4', currentLocation: { lat: 30.3078, lng: 78.0268 }, isActive: true },
  { id: 'b2', busNumber: 'GEU-02', capacity: 50, bookedSeats: 48, routeId: 'r1', driverId: '5', currentLocation: { lat: 30.2912, lng: 78.0189 }, isActive: true },
  { id: 'b3', busNumber: 'GEU-03', capacity: 40, bookedSeats: 15, routeId: 'r2', currentLocation: { lat: 30.3234, lng: 78.0423 }, isActive: true },
  { id: 'b4', busNumber: 'GEU-04', capacity: 45, bookedSeats: 28, routeId: 'r3', driverId: '4', currentLocation: { lat: 30.2712, lng: 78.0023 }, isActive: true },
  { id: 'b5', busNumber: 'GEU-05', capacity: 40, bookedSeats: 35, routeId: 'r4', currentLocation: { lat: 30.2700, lng: 78.0580 }, isActive: true },
  { id: 'b6', busNumber: 'GEU-06', capacity: 50, bookedSeats: 30, routeId: 'r5', driverId: '5', currentLocation: { lat: 30.3600, lng: 78.0500 }, isActive: true },
  { id: 'b7', busNumber: 'GEU-07', capacity: 45, bookedSeats: 40, routeId: 'r6', currentLocation: { lat: 30.2100, lng: 78.0900 }, isActive: true },
  { id: 'b8', busNumber: 'GEU-08', capacity: 50, bookedSeats: 22, routeId: 'r7', currentLocation: { lat: 30.3400, lng: 77.9000 }, isActive: true },
  { id: 'b9', busNumber: 'GEU-09', capacity: 40, bookedSeats: 38, routeId: 'r8', driverId: '4', currentLocation: { lat: 30.3100, lng: 77.9900 }, isActive: true },
  { id: 'b10', busNumber: 'GEU-10', capacity: 50, bookedSeats: 25, routeId: 'r9', currentLocation: { lat: 30.1100, lng: 78.2300 }, isActive: true },
  { id: 'b11', busNumber: 'GEU-11', capacity: 45, bookedSeats: 20, routeId: 'r10', driverId: '5', currentLocation: { lat: 30.3900, lng: 77.7800 }, isActive: true },
  { id: 'b12', busNumber: 'GEU-12', capacity: 45, bookedSeats: 44, routeId: 'r4', isActive: false },
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
