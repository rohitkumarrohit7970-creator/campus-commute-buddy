import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { COLLEGE_LOCATION } from "@/data/mockData";
import {
  buildBusesWithDetails,
  createId,
  createInitialAppData,
  normalizeBus,
  persistAppData,
  readStoredAppData,
} from "@/lib/transport";
import type { Bus, BusWithDetails, Booking, Route, Stop, User } from "@/types/bus";

interface SaveBusInput {
  id?: string;
  busNumber: string;
  capacity: number;
  routeId: string;
  driverId?: string;
  isActive: boolean;
}

interface SaveRouteInput {
  id?: string;
  name: string;
  startTime: string;
  dropTime: string;
  direction: Route["direction"];
  stops: Stop[];
}

interface SaveUserInput {
  id?: string;
  name: string;
  email: string;
  role: User["role"];
  collegeId?: string;
}

interface BookingResult {
  booking?: Booking;
  message: string;
  success: boolean;
}

interface AppDataContextValue {
  buses: Bus[];
  busesWithDetails: BusWithDetails[];
  bookings: Booking[];
  drivers: User[];
  routes: Route[];
  students: User[];
  users: User[];
  saveBus: (input: SaveBusInput) => void;
  saveRoute: (input: SaveRouteInput) => void;
  saveUser: (input: SaveUserInput) => User;
  bookSeat: (input: { busId: string; stopId: string; studentId: string }) => BookingResult;
  cancelBooking: (bookingId: string) => BookingResult;
  setBusProgress: (busId: string, nextStep: number) => void;
  moveBusToNextStop: (busId: string) => void;
  moveBusToPreviousStop: (busId: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialSnapshot] = useState(() => readStoredAppData());
  const [users, setUsers] = useState<User[]>(initialSnapshot.users);
  const [routes, setRoutes] = useState<Route[]>(initialSnapshot.routes);
  const [buses, setBuses] = useState<Bus[]>(initialSnapshot.buses);
  const [bookings, setBookings] = useState<Booking[]>(initialSnapshot.bookings);

  useEffect(() => {
    persistAppData({ buses, bookings, routes, users });
  }, [buses, bookings, routes, users]);

  const saveUser = (input: SaveUserInput) => {
    const user: User = {
      id: input.id ?? createId(input.role),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      collegeId: input.role === "student" ? input.collegeId?.trim() : undefined,
    };

    setUsers((currentUsers) => {
      const exists = currentUsers.some((existingUser) => existingUser.id === user.id);
      return exists
        ? currentUsers.map((existingUser) => (existingUser.id === user.id ? user : existingUser))
        : [...currentUsers, user];
    });

    return user;
  };

  const saveRoute = (input: SaveRouteInput) => {
    const route: Route = {
      id: input.id ?? createId("route"),
      name: input.name.trim(),
      startTime: input.startTime,
      dropTime: input.dropTime,
      direction: input.direction,
      collegeLocation: COLLEGE_LOCATION,
      stops: input.stops
        .map((stop, index) => ({
          ...stop,
          id: stop.id || createId("stop"),
          order: index + 1,
          location: stop.location ?? COLLEGE_LOCATION,
        }))
        .sort((left, right) => left.order - right.order),
    };

    setRoutes((currentRoutes) => {
      const exists = currentRoutes.some((existingRoute) => existingRoute.id === route.id);
      return exists
        ? currentRoutes.map((existingRoute) => (existingRoute.id === route.id ? route : existingRoute))
        : [...currentRoutes, route];
    });

    setBuses((currentBuses) =>
      currentBuses.map((bus) =>
        bus.routeId === route.id
          ? normalizeBus(
              {
                ...bus,
                currentLocation: bus.currentLocation ?? route.stops[0]?.location ?? COLLEGE_LOCATION,
              },
              route,
            )
          : bus,
      ),
    );
  };

  const saveBus = (input: SaveBusInput) => {
    const route = routes.find((candidate) => candidate.id === input.routeId);

    setBuses((currentBuses) => {
      const existingBus = currentBuses.find((candidate) => candidate.id === input.id);
      const normalizedCapacity = Number(input.capacity);
      const nextBus = normalizeBus(
        {
          id: input.id ?? createId("bus"),
          bookedSeats: Math.min(existingBus?.bookedSeats ?? 0, normalizedCapacity),
          currentLocation: existingBus?.currentLocation ?? route?.stops[0]?.location ?? COLLEGE_LOCATION,
          lastUpdated: new Date().toISOString(),
          progressStep: existingBus?.progressStep,
          ...input,
          capacity: normalizedCapacity,
        },
        route,
      );

      const exists = currentBuses.some((candidate) => candidate.id === nextBus.id);
      return exists
        ? currentBuses.map((candidate) => (candidate.id === nextBus.id ? nextBus : candidate))
        : [...currentBuses, nextBus];
    });
  };

  const bookSeat = ({ busId, stopId, studentId }: { busId: string; stopId: string; studentId: string }): BookingResult => {
    const bus = buses.find((candidate) => candidate.id === busId);
    const route = routes.find((candidate) => candidate.id === bus?.routeId);
    const activeBooking = bookings.find(
      (candidate) => candidate.studentId === studentId && candidate.status === "active",
    );

    if (activeBooking) {
      return {
        success: false,
        message: "You already have an active booking. Cancel it before booking another seat.",
      };
    }

    if (!bus || !route) {
      return {
        success: false,
        message: "Selected bus is unavailable right now.",
      };
    }

    if (!bus.isActive) {
      return {
        success: false,
        message: "This bus is currently inactive.",
      };
    }

    if (bus.bookedSeats >= bus.capacity) {
      return {
        success: false,
        message: "This bus is fully booked.",
      };
    }

    const stop = route.stops.find((candidate) => candidate.id === stopId);

    if (!stop) {
      return {
        success: false,
        message: "Please select a valid stop for this route.",
      };
    }

    const booking: Booking = {
      id: createId("booking"),
      studentId,
      busId,
      stopId,
      seatNumber: Math.min(bus.capacity, bus.bookedSeats + 1),
      bookedAt: new Date().toISOString(),
      status: "active",
    };

    setBookings((currentBookings) => [booking, ...currentBookings]);
    setBuses((currentBuses) =>
      currentBuses.map((candidate) =>
        candidate.id === busId
          ? {
              ...candidate,
              bookedSeats: Math.min(candidate.capacity, candidate.bookedSeats + 1),
              lastUpdated: new Date().toISOString(),
            }
          : candidate,
      ),
    );

    return {
      booking,
      success: true,
      message: `Seat #${booking.seatNumber} booked on ${bus.busNumber}.`,
    };
  };

  const cancelBooking = (bookingId: string): BookingResult => {
    const booking = bookings.find((candidate) => candidate.id === bookingId);

    if (!booking || booking.status !== "active") {
      return {
        success: false,
        message: "That booking is already cancelled.",
      };
    }

    const bus = buses.find((candidate) => candidate.id === booking.busId);

    setBookings((currentBookings) =>
      currentBookings.map((candidate) =>
        candidate.id === bookingId ? { ...candidate, status: "cancelled" } : candidate,
      ),
    );
    setBuses((currentBuses) =>
      currentBuses.map((candidate) =>
        candidate.id === booking.busId
          ? {
              ...candidate,
              bookedSeats: Math.max(0, candidate.bookedSeats - 1),
              lastUpdated: new Date().toISOString(),
            }
          : candidate,
      ),
    );

    return {
      success: true,
      message: `Booking on ${bus?.busNumber ?? "the selected bus"} has been cancelled.`,
    };
  };

  const setBusProgress = (busId: string, nextStep: number) => {
    setBuses((currentBuses) =>
      currentBuses.map((bus) => {
        if (bus.id !== busId) {
          return bus;
        }

        const route = routes.find((candidate) => candidate.id === bus.routeId);
        return normalizeBus(
          {
            ...bus,
            progressStep: nextStep,
            lastUpdated: new Date().toISOString(),
          },
          route,
        );
      }),
    );
  };

  const moveBusToNextStop = (busId: string) => {
    const bus = buses.find((candidate) => candidate.id === busId);

    if (!bus) {
      return;
    }

    setBusProgress(busId, (bus.progressStep ?? 0) + 1);
  };

  const moveBusToPreviousStop = (busId: string) => {
    const bus = buses.find((candidate) => candidate.id === busId);

    if (!bus) {
      return;
    }

    setBusProgress(busId, (bus.progressStep ?? 0) - 1);
  };

  const busesWithDetails = useMemo(() => buildBusesWithDetails(buses, routes, users), [buses, routes, users]);
  const students = useMemo(() => users.filter((user) => user.role === "student"), [users]);
  const drivers = useMemo(() => users.filter((user) => user.role === "driver"), [users]);

  return (
    <AppDataContext.Provider
      value={{
        buses,
        busesWithDetails,
        bookings,
        drivers,
        routes,
        saveBus,
        saveRoute,
        saveUser,
        bookSeat,
        cancelBooking,
        setBusProgress,
        moveBusToNextStop,
        moveBusToPreviousStop,
        students,
        users,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }

  return context;
};

export const resetAppData = () => {
  const snapshot = createInitialAppData();
  persistAppData(snapshot);
};
