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

// ===== MORNING PICKUP STOPS (to college) =====
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
  // Route F - Doiwala / Raipur
  { id: 's20', name: 'Doiwala', pickupTime: '06:50', order: 1, location: { lat: 30.1800, lng: 78.1200 } },
  { id: 's21', name: 'Raipur', pickupTime: '07:05', order: 2, location: { lat: 30.2100, lng: 78.0900 } },
  { id: 's22', name: 'Banjarawala', pickupTime: '07:15', order: 3, location: { lat: 30.2300, lng: 78.0700 } },
  { id: 's23', name: 'Harrawala', pickupTime: '07:25', order: 4, location: { lat: 30.2450, lng: 78.0500 } },
  // Route G - Selaqui / Saharanpur Road
  { id: 's24', name: 'Selaqui', pickupTime: '06:55', order: 1, location: { lat: 30.3700, lng: 77.8600 } },
  { id: 's25', name: 'Bhagwanpur', pickupTime: '07:10', order: 2, location: { lat: 30.3400, lng: 77.9000 } },
  { id: 's26', name: 'Vikasnagar Mod', pickupTime: '07:20', order: 3, location: { lat: 30.3200, lng: 77.9400 } },
  { id: 's27', name: 'Majra', pickupTime: '07:35', order: 4, location: { lat: 30.3000, lng: 77.9700 } },
  // Route H - Chakrata Road
  { id: 's28', name: 'Kaulagarh', pickupTime: '07:10', order: 1, location: { lat: 30.3350, lng: 77.9800 } },
  { id: 's29', name: 'Raipur Road Crossing', pickupTime: '07:20', order: 2, location: { lat: 30.3100, lng: 77.9900 } },
  { id: 's30', name: 'Dharampur', pickupTime: '07:30', order: 3, location: { lat: 30.2900, lng: 78.0000 } },
  // Route I - Rishikesh
  { id: 's31', name: 'Rishikesh Bus Stand', pickupTime: '06:40', order: 1, location: { lat: 30.0869, lng: 78.2676 } },
  { id: 's32', name: 'Raiwala', pickupTime: '06:55', order: 2, location: { lat: 30.1100, lng: 78.2300 } },
  { id: 's33', name: 'Shyampur', pickupTime: '07:10', order: 3, location: { lat: 30.1500, lng: 78.1800 } },
  { id: 's34', name: 'Lachhiwala', pickupTime: '07:25', order: 4, location: { lat: 30.2000, lng: 78.1300 } },
  // Route J - Herbertpur / Kalsi
  { id: 's35', name: 'Herbertpur', pickupTime: '06:45', order: 1, location: { lat: 30.3900, lng: 77.7800 } },
  { id: 's36', name: 'Kalsi', pickupTime: '07:05', order: 2, location: { lat: 30.4000, lng: 77.8400 } },
  { id: 's37', name: 'Dakpathar', pickupTime: '07:20', order: 3, location: { lat: 30.3800, lng: 77.8900 } },
];

// ===== EVENING DROP STOPS (from college, 4 PM) =====
export const mockReturnStops: Stop[] = [
  { id: 'rs1', name: 'Rispana Bridge', pickupTime: '16:15', order: 1, location: { lat: 30.2847, lng: 78.0156 } },
  { id: 'rs2', name: 'ISBT Dehradun', pickupTime: '16:30', order: 2, location: { lat: 30.2986, lng: 78.0268 } },
  { id: 'rs3', name: 'Paltan Bazaar', pickupTime: '16:40', order: 3, location: { lat: 30.3189, lng: 78.0361 } },
  { id: 'rs4', name: 'Clock Tower', pickupTime: '16:50', order: 4, location: { lat: 30.3165, lng: 78.0322 } },
  { id: 'rs5', name: 'EC Road Crossing', pickupTime: '16:15', order: 1, location: { lat: 30.2920, lng: 78.0200 } },
  { id: 'rs6', name: 'Survey Chowk', pickupTime: '16:25', order: 2, location: { lat: 30.3078, lng: 78.0312 } },
  { id: 'rs7', name: 'Pacific Mall', pickupTime: '16:35', order: 3, location: { lat: 30.3312, lng: 78.0423 } },
  { id: 'rs8', name: 'Rajpur Road (Doon Hospital)', pickupTime: '16:45', order: 4, location: { lat: 30.3456, lng: 78.0534 } },
  { id: 'rs9', name: 'FRI Gate', pickupTime: '16:10', order: 1, location: { lat: 30.2634, lng: 78.0078 } },
  { id: 'rs10', name: 'Niranjanpur', pickupTime: '16:20', order: 2, location: { lat: 30.2712, lng: 78.0023 } },
  { id: 'rs11', name: 'Prem Nagar', pickupTime: '16:30', order: 3, location: { lat: 30.2789, lng: 77.9956 } },
  { id: 'rs12', name: 'Ballupur Chowk', pickupTime: '16:10', order: 1, location: { lat: 30.2800, lng: 78.0350 } },
  { id: 'rs13', name: 'Shimla Bypass Crossing', pickupTime: '16:20', order: 2, location: { lat: 30.2750, lng: 78.0450 } },
  { id: 'rs14', name: 'Nepali Farm', pickupTime: '16:30', order: 3, location: { lat: 30.2700, lng: 78.0580 } },
  { id: 'rs15', name: 'Mothrowala', pickupTime: '16:40', order: 4, location: { lat: 30.2650, lng: 78.0700 } },
  { id: 'rs16', name: 'ONGC Chowk', pickupTime: '16:15', order: 1, location: { lat: 30.3200, lng: 78.0380 } },
  { id: 'rs17', name: 'Sahastradhara Road', pickupTime: '16:25', order: 2, location: { lat: 30.3400, lng: 78.0450 } },
  { id: 'rs18', name: 'Kulhan', pickupTime: '16:35', order: 3, location: { lat: 30.3600, lng: 78.0500 } },
  { id: 'rs19', name: 'Malsi Deer Park', pickupTime: '16:50', order: 4, location: { lat: 30.3800, lng: 78.0600 } },
  { id: 'rs20', name: 'Harrawala', pickupTime: '16:10', order: 1, location: { lat: 30.2450, lng: 78.0500 } },
  { id: 'rs21', name: 'Banjarawala', pickupTime: '16:20', order: 2, location: { lat: 30.2300, lng: 78.0700 } },
  { id: 'rs22', name: 'Raipur', pickupTime: '16:35', order: 3, location: { lat: 30.2100, lng: 78.0900 } },
  { id: 'rs23', name: 'Doiwala', pickupTime: '16:50', order: 4, location: { lat: 30.1800, lng: 78.1200 } },
  { id: 'rs24', name: 'Majra', pickupTime: '16:15', order: 1, location: { lat: 30.3000, lng: 77.9700 } },
  { id: 'rs25', name: 'Vikasnagar Mod', pickupTime: '16:30', order: 2, location: { lat: 30.3200, lng: 77.9400 } },
  { id: 'rs26', name: 'Bhagwanpur', pickupTime: '16:45', order: 3, location: { lat: 30.3400, lng: 77.9000 } },
  { id: 'rs27', name: 'Selaqui', pickupTime: '17:00', order: 4, location: { lat: 30.3700, lng: 77.8600 } },
  { id: 'rs28', name: 'Dharampur', pickupTime: '16:10', order: 1, location: { lat: 30.2900, lng: 78.0000 } },
  { id: 'rs29', name: 'Raipur Road Crossing', pickupTime: '16:20', order: 2, location: { lat: 30.3100, lng: 77.9900 } },
  { id: 'rs30', name: 'Kaulagarh', pickupTime: '16:30', order: 3, location: { lat: 30.3350, lng: 77.9800 } },
  { id: 'rs31', name: 'Lachhiwala', pickupTime: '16:15', order: 1, location: { lat: 30.2000, lng: 78.1300 } },
  { id: 'rs32', name: 'Shyampur', pickupTime: '16:30', order: 2, location: { lat: 30.1500, lng: 78.1800 } },
  { id: 'rs33', name: 'Raiwala', pickupTime: '16:50', order: 3, location: { lat: 30.1100, lng: 78.2300 } },
  { id: 'rs34', name: 'Rishikesh Bus Stand', pickupTime: '17:10', order: 4, location: { lat: 30.0869, lng: 78.2676 } },
  { id: 'rs35', name: 'Dakpathar', pickupTime: '16:15', order: 1, location: { lat: 30.3800, lng: 77.8900 } },
  { id: 'rs36', name: 'Kalsi', pickupTime: '16:35', order: 2, location: { lat: 30.4000, lng: 77.8400 } },
  { id: 'rs37', name: 'Herbertpur', pickupTime: '16:55', order: 3, location: { lat: 30.3900, lng: 77.7800 } },
];

// ===== AFTERNOON PICKUP STOPS (to college, 1 PM) =====
const makeAfternoonPickupStops = (baseStops: Stop[], prefix: string, startHour: number, startMin: number, interval: number): Stop[] => {
  return baseStops.map((s, i) => {
    const totalMin = startMin + i * interval;
    const h = startHour + Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    return { ...s, id: `${prefix}${i + 1}`, pickupTime: time };
  });
};

export const afternoonPickupStops: Stop[] = [
  ...makeAfternoonPickupStops([mockStops[0], mockStops[1], mockStops[2], mockStops[3]], 'ap-a', 12, 0, 10),
  ...makeAfternoonPickupStops([mockStops[4], mockStops[5], mockStops[6], mockStops[7]], 'ap-b', 12, 10, 10),
  ...makeAfternoonPickupStops([mockStops[8], mockStops[9], mockStops[10]], 'ap-c', 12, 15, 10),
  ...makeAfternoonPickupStops([mockStops[11], mockStops[12], mockStops[13], mockStops[14]], 'ap-d', 12, 0, 10),
  ...makeAfternoonPickupStops([mockStops[15], mockStops[16], mockStops[17], mockStops[18]], 'ap-e', 12, 5, 10),
  ...makeAfternoonPickupStops([mockStops[19], mockStops[20], mockStops[21], mockStops[22]], 'ap-f', 11, 50, 10),
  ...makeAfternoonPickupStops([mockStops[23], mockStops[24], mockStops[25], mockStops[26]], 'ap-g', 11, 55, 10),
  ...makeAfternoonPickupStops([mockStops[27], mockStops[28], mockStops[29]], 'ap-h', 12, 10, 10),
  ...makeAfternoonPickupStops([mockStops[30], mockStops[31], mockStops[32], mockStops[33]], 'ap-i', 11, 40, 15),
  ...makeAfternoonPickupStops([mockStops[34], mockStops[35], mockStops[36]], 'ap-j', 11, 45, 15),
];

// ===== AFTERNOON DROP STOPS (from college, 1 PM) =====
const makeAfternoonDropStops = (baseReturnStops: Stop[], prefix: string, startHour: number, startMin: number, interval: number): Stop[] => {
  return baseReturnStops.map((s, i) => {
    const totalMin = startMin + i * interval;
    const h = startHour + Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    return { ...s, id: `${prefix}${i + 1}`, pickupTime: time };
  });
};

export const afternoonDropStops: Stop[] = [
  ...makeAfternoonDropStops([mockReturnStops[0], mockReturnStops[1], mockReturnStops[2], mockReturnStops[3]], 'ad-a', 13, 15, 10),
  ...makeAfternoonDropStops([mockReturnStops[4], mockReturnStops[5], mockReturnStops[6], mockReturnStops[7]], 'ad-b', 13, 15, 10),
  ...makeAfternoonDropStops([mockReturnStops[8], mockReturnStops[9], mockReturnStops[10]], 'ad-c', 13, 10, 10),
  ...makeAfternoonDropStops([mockReturnStops[11], mockReturnStops[12], mockReturnStops[13], mockReturnStops[14]], 'ad-d', 13, 10, 10),
  ...makeAfternoonDropStops([mockReturnStops[15], mockReturnStops[16], mockReturnStops[17], mockReturnStops[18]], 'ad-e', 13, 15, 10),
  ...makeAfternoonDropStops([mockReturnStops[19], mockReturnStops[20], mockReturnStops[21], mockReturnStops[22]], 'ad-f', 13, 10, 10),
  ...makeAfternoonDropStops([mockReturnStops[23], mockReturnStops[24], mockReturnStops[25], mockReturnStops[26]], 'ad-g', 13, 15, 15),
  ...makeAfternoonDropStops([mockReturnStops[27], mockReturnStops[28], mockReturnStops[29]], 'ad-h', 13, 10, 10),
  ...makeAfternoonDropStops([mockReturnStops[30], mockReturnStops[31], mockReturnStops[32], mockReturnStops[33]], 'ad-i', 13, 15, 15),
  ...makeAfternoonDropStops([mockReturnStops[34], mockReturnStops[35], mockReturnStops[36]], 'ad-j', 13, 15, 15),
];

// Helper to slice afternoon stops by route index
const apSlice = (routeIdx: number, count: number) => {
  let offset = 0;
  const counts = [4, 4, 3, 4, 4, 4, 4, 3, 4, 3];
  for (let i = 0; i < routeIdx; i++) offset += counts[i];
  return afternoonPickupStops.slice(offset, offset + count);
};
const adSlice = (routeIdx: number, count: number) => {
  let offset = 0;
  const counts = [4, 4, 3, 4, 4, 4, 4, 3, 4, 3];
  for (let i = 0; i < routeIdx; i++) offset += counts[i];
  return afternoonDropStops.slice(offset, offset + count);
};

const routeNames = [
  'Route A - Clock Tower / City Center',
  'Route B - Rajpur Road',
  'Route C - Prem Nagar / FRI',
  'Route D - Haridwar Road',
  'Route E - Mussoorie Road / Malsi',
  'Route F - Doiwala / Raipur',
  'Route G - Selaqui / Saharanpur Road',
  'Route H - Chakrata Road',
  'Route I - Rishikesh',
  'Route J - Herbertpur / Kalsi',
];

const morningStopSets: Stop[][] = [
  [mockStops[0], mockStops[1], mockStops[2], mockStops[3]],
  [mockStops[4], mockStops[5], mockStops[6], mockStops[7]],
  [mockStops[8], mockStops[9], mockStops[10]],
  [mockStops[11], mockStops[12], mockStops[13], mockStops[14]],
  [mockStops[15], mockStops[16], mockStops[17], mockStops[18]],
  [mockStops[19], mockStops[20], mockStops[21], mockStops[22]],
  [mockStops[23], mockStops[24], mockStops[25], mockStops[26]],
  [mockStops[27], mockStops[28], mockStops[29]],
  [mockStops[30], mockStops[31], mockStops[32], mockStops[33]],
  [mockStops[34], mockStops[35], mockStops[36]],
];

const eveningStopSets: Stop[][] = [
  [mockReturnStops[0], mockReturnStops[1], mockReturnStops[2], mockReturnStops[3]],
  [mockReturnStops[4], mockReturnStops[5], mockReturnStops[6], mockReturnStops[7]],
  [mockReturnStops[8], mockReturnStops[9], mockReturnStops[10]],
  [mockReturnStops[11], mockReturnStops[12], mockReturnStops[13], mockReturnStops[14]],
  [mockReturnStops[15], mockReturnStops[16], mockReturnStops[17], mockReturnStops[18]],
  [mockReturnStops[19], mockReturnStops[20], mockReturnStops[21], mockReturnStops[22]],
  [mockReturnStops[23], mockReturnStops[24], mockReturnStops[25], mockReturnStops[26]],
  [mockReturnStops[27], mockReturnStops[28], mockReturnStops[29]],
  [mockReturnStops[30], mockReturnStops[31], mockReturnStops[32], mockReturnStops[33]],
  [mockReturnStops[34], mockReturnStops[35], mockReturnStops[36]],
];

const morningStartTimes = ['07:00','07:10','07:15','07:00','07:05','06:50','06:55','07:10','06:40','06:45'];
const morningDropTimes = ['08:00','08:05','07:55','07:55','08:05','07:50','08:00','07:55','08:00','07:55'];
const eveningStartTimes = Array(10).fill('16:00');
const eveningDropTimes = ['16:50','16:45','16:30','16:40','16:50','16:50','17:00','16:30','17:10','16:55'];
const stopCounts = [4, 4, 3, 4, 4, 4, 4, 3, 4, 3];

export const mockRoutes: Route[] = [
  // === MORNING PICKUP (to college) ===
  ...routeNames.map((name, i) => ({
    id: `r${i + 1}`,
    name: `${name} to GEU`,
    stops: morningStopSets[i],
    startTime: morningStartTimes[i],
    dropTime: morningDropTimes[i],
    direction: 'morning_to_college' as const,
    collegeLocation: COLLEGE_LOCATION,
  })),

  // === EVENING DROP (from college, 4 PM) ===
  ...routeNames.map((name, i) => ({
    id: `r${i + 11}`,
    name: `GEU to ${name}`,
    stops: eveningStopSets[i],
    startTime: eveningStartTimes[i],
    dropTime: eveningDropTimes[i],
    direction: 'afternoon_from_college' as const,
    collegeLocation: COLLEGE_LOCATION,
  })),

  // === AFTERNOON PICKUP (to college, 12-1 PM for afternoon classes) ===
  ...routeNames.map((name, i) => ({
    id: `r${i + 21}`,
    name: `${name} to GEU (Afternoon)`,
    stops: apSlice(i, stopCounts[i]),
    startTime: apSlice(i, stopCounts[i])[0]?.pickupTime || '12:00',
    dropTime: '13:00',
    direction: 'afternoon_to_college' as const,
    collegeLocation: COLLEGE_LOCATION,
  })),

  // === AFTERNOON DROP (from college, 1 PM for morning-only students) ===
  ...routeNames.map((name, i) => ({
    id: `r${i + 31}`,
    name: `GEU to ${name} (Afternoon)`,
    stops: adSlice(i, stopCounts[i]),
    startTime: '13:00',
    dropTime: adSlice(i, stopCounts[i]).at(-1)?.pickupTime || '14:00',
    direction: 'afternoon_drop_from_college' as const,
    collegeLocation: COLLEGE_LOCATION,
  })),
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
  // Evening buses
  { id: 'b13', busNumber: 'GEU-13', capacity: 45, bookedSeats: 30, routeId: 'r11', driverId: '4', currentLocation: COLLEGE_LOCATION, isActive: true },
  { id: 'b14', busNumber: 'GEU-14', capacity: 50, bookedSeats: 35, routeId: 'r12', currentLocation: COLLEGE_LOCATION, isActive: true },
  { id: 'b15', busNumber: 'GEU-15', capacity: 40, bookedSeats: 20, routeId: 'r13', driverId: '5', currentLocation: COLLEGE_LOCATION, isActive: true },
  { id: 'b16', busNumber: 'GEU-16', capacity: 45, bookedSeats: 25, routeId: 'r14', currentLocation: COLLEGE_LOCATION, isActive: true },
  { id: 'b17', busNumber: 'GEU-17', capacity: 50, bookedSeats: 40, routeId: 'r15', currentLocation: COLLEGE_LOCATION, isActive: true },
  // Afternoon pickup buses
  { id: 'b18', busNumber: 'GEU-18', capacity: 45, bookedSeats: 18, routeId: 'r21', currentLocation: { lat: 30.3165, lng: 78.0322 }, isActive: true },
  { id: 'b19', busNumber: 'GEU-19', capacity: 40, bookedSeats: 12, routeId: 'r22', currentLocation: { lat: 30.3456, lng: 78.0534 }, isActive: true },
  { id: 'b20', busNumber: 'GEU-20', capacity: 45, bookedSeats: 20, routeId: 'r23', currentLocation: { lat: 30.2789, lng: 77.9956 }, isActive: true },
  // Afternoon drop buses
  { id: 'b21', busNumber: 'GEU-21', capacity: 45, bookedSeats: 22, routeId: 'r31', currentLocation: COLLEGE_LOCATION, isActive: true },
  { id: 'b22', busNumber: 'GEU-22', capacity: 40, bookedSeats: 15, routeId: 'r32', currentLocation: COLLEGE_LOCATION, isActive: true },
  { id: 'b23', busNumber: 'GEU-23', capacity: 50, bookedSeats: 28, routeId: 'r33', currentLocation: COLLEGE_LOCATION, isActive: true },
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
    return { ...bus, route, driver, vacantSeats: bus.capacity - bus.bookedSeats };
  });
};

export const getRecommendedBuses = (routeId: string): BusWithDetails[] => {
  return getBusesWithDetails()
    .filter(bus => bus.routeId === routeId && bus.isActive)
    .sort((a, b) => b.vacantSeats - a.vacantSeats);
};
