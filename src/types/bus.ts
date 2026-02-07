export type UserRole = 'admin' | 'student' | 'driver';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  collegeId?: string;
  profileImage?: string;
}

export interface Bus {
  id: string;
  busNumber: string;
  capacity: number;
  bookedSeats: number;
  routeId: string;
  driverId?: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  startTime: string;
  dropTime: string;
  direction: 'to_college' | 'from_college';
  collegeLocation: {
    lat: number;
    lng: number;
  };
}

export interface Stop {
  id: string;
  name: string;
  pickupTime: string;
  order: number;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  studentId: string;
  busId: string;
  stopId: string;
  seatNumber: number;
  bookedAt: string;
  status: 'active' | 'cancelled';
}

export interface BusWithDetails extends Bus {
  route?: Route;
  driver?: User;
  vacantSeats: number;
}
