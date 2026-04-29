import {
  COLLEGE_LOCATION,
  mockBuses,
  mockBookings,
  mockRoutes,
  mockUsers,
} from "@/data/mockData";
import type { Bus, BusWithDetails, Booking, Route, RouteDirection, Stop, User, UserRole } from "@/types/bus";

export interface AppDataSnapshot {
  buses: Bus[];
  bookings: Booking[];
  routes: Route[];
  users: User[];
}

export interface BusWaypoint {
  id: string;
  kind: "campus" | "stop";
  label: string;
  time: string;
}

export interface BusProgressDetails {
  currentWaypoint: BusWaypoint;
  nextWaypoint: BusWaypoint | null;
  progressPercent: number;
  statusLabel: string;
  summaryLabel: string;
  tone: "default" | "success" | "warning" | "destructive";
  totalWaypoints: number;
}

export const APP_DATA_STORAGE_KEY = "campus-ride-data-v2";
export const APP_SESSION_STORAGE_KEY = "campus-ride-session-v1";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const isFromCollegeDirection = (direction?: RouteDirection) =>
  direction === "afternoon_from_college" || direction === "afternoon_drop_from_college";

export const formatRoleLabel = (role: UserRole) => role.charAt(0).toUpperCase() + role.slice(1);

export const getRouteDirectionLabel = (direction: RouteDirection) => {
  switch (direction) {
    case "morning_to_college":
      return "Morning Pickup";
    case "afternoon_from_college":
      return "Evening Drop";
    case "afternoon_to_college":
      return "Afternoon Pickup";
    case "afternoon_drop_from_college":
      return "Afternoon Drop";
    default:
      return "Campus Service";
  }
};

export const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

const distanceBetween = (
  pointA: { lat: number; lng: number },
  pointB: { lat: number; lng: number },
) => {
  const latDiff = pointA.lat - pointB.lat;
  const lngDiff = pointA.lng - pointB.lng;
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
};

export const getRouteWaypoints = (route?: Route): BusWaypoint[] => {
  if (!route) {
    return [];
  }

  const campusWaypoint: BusWaypoint = {
    id: `${route.id}-campus`,
    kind: "campus",
    label: "GEU Campus",
    time: isFromCollegeDirection(route.direction) ? route.startTime : route.dropTime,
  };

  const stopWaypoints = route.stops.map((stop) => ({
    id: stop.id,
    kind: "stop" as const,
    label: stop.name,
    time: stop.pickupTime,
  }));

  return isFromCollegeDirection(route.direction)
    ? [campusWaypoint, ...stopWaypoints]
    : [...stopWaypoints, campusWaypoint];
};

export const clampBusProgressStep = (bus: Bus, route?: Route) => {
  const waypoints = getRouteWaypoints(route);

  if (waypoints.length === 0) {
    return 0;
  }

  const step = bus.progressStep ?? 0;
  return Math.min(Math.max(step, 0), waypoints.length - 1);
};

export const getBusProgressDetails = (bus: Bus, route?: Route): BusProgressDetails | null => {
  const waypoints = getRouteWaypoints(route);

  if (waypoints.length === 0) {
    return null;
  }

  const currentStep = clampBusProgressStep(bus, route);
  const currentWaypoint = waypoints[currentStep];
  const nextWaypoint = waypoints[currentStep + 1] ?? null;
  const denominator = Math.max(waypoints.length - 1, 1);
  const progressPercent = Math.round((currentStep / denominator) * 100);

  if (!bus.isActive) {
    return {
      currentWaypoint,
      nextWaypoint,
      progressPercent,
      statusLabel: "Inactive",
      summaryLabel: "Bus is marked out of service",
      tone: "destructive",
      totalWaypoints: waypoints.length,
    };
  }

  if (currentStep === 0 && nextWaypoint) {
    return {
      currentWaypoint,
      nextWaypoint,
      progressPercent,
      statusLabel: isFromCollegeDirection(route?.direction) ? "Ready to depart" : "Boarding",
      summaryLabel: `Next stop: ${nextWaypoint.label}`,
      tone: "warning",
      totalWaypoints: waypoints.length,
    };
  }

  if (!nextWaypoint) {
    return {
      currentWaypoint,
      nextWaypoint,
      progressPercent: 100,
      statusLabel: "Completed",
      summaryLabel: currentWaypoint.kind === "campus" ? "Reached GEU campus" : "Finished the final stop",
      tone: "success",
      totalWaypoints: waypoints.length,
    };
  }

  return {
    currentWaypoint,
    nextWaypoint,
    progressPercent,
    statusLabel: "En route",
    summaryLabel: `Heading to ${nextWaypoint.label}`,
    tone: "default",
    totalWaypoints: waypoints.length,
  };
};

export const buildBusesWithDetails = (
  buses: Bus[],
  routes: Route[],
  users: User[],
): BusWithDetails[] =>
  buses.map((bus) => {
    const route = routes.find((candidate) => candidate.id === bus.routeId);
    const driver = users.find((candidate) => candidate.id === bus.driverId);

    return {
      ...bus,
      driver,
      route,
      vacantSeats: Math.max(0, bus.capacity - bus.bookedSeats),
    };
  });

export const getRouteBaseName = (routeName: string) =>
  routeName
    .replace(" to GEU (Afternoon)", "")
    .replace(" to GEU", "")
    .replace("GEU to ", "")
    .replace(" (Afternoon)", "")
    .trim();

export const estimateInitialProgressStep = (bus: Bus, route?: Route) => {
  const waypoints = getRouteWaypoints(route);

  if (waypoints.length <= 1) {
    return 0;
  }

  if (!bus.currentLocation || !route) {
    return isFromCollegeDirection(route?.direction) ? 0 : Math.min(1, waypoints.length - 1);
  }

  if (isFromCollegeDirection(route.direction)) {
    const nearestStopIndex = route.stops.reduce(
      (closestIndex, stop, index, allStops) => {
        const closestDistance = distanceBetween(bus.currentLocation!, allStops[closestIndex].location);
        const stopDistance = distanceBetween(bus.currentLocation!, stop.location);
        return stopDistance < closestDistance ? index : closestIndex;
      },
      0,
    );

    return Math.min(nearestStopIndex + 1, waypoints.length - 1);
  }

  const nearestWaypointIndex = route.stops.reduce(
    (closestIndex, stop, index, allStops) => {
      const closestDistance = distanceBetween(bus.currentLocation!, allStops[closestIndex].location);
      const stopDistance = distanceBetween(bus.currentLocation!, stop.location);
      return stopDistance < closestDistance ? index : closestIndex;
    },
    0,
  );

  return Math.min(nearestWaypointIndex, waypoints.length - 1);
};

export const normalizeBus = (bus: Bus, route?: Route): Bus => ({
  ...bus,
  currentLocation: bus.currentLocation ?? route?.stops[0]?.location ?? COLLEGE_LOCATION,
  lastUpdated: bus.lastUpdated ?? new Date().toISOString(),
  progressStep: clampBusProgressStep(
    {
      ...bus,
      progressStep: bus.progressStep ?? estimateInitialProgressStep(bus, route),
    },
    route,
  ),
});

export const createInitialAppData = (): AppDataSnapshot => {
  const routes = clone(mockRoutes);
  const users = clone(mockUsers);
  const buses = clone(mockBuses).map((bus) => normalizeBus(bus, routes.find((route) => route.id === bus.routeId)));
  const bookings = clone(mockBookings);

  return {
    buses,
    bookings,
    routes,
    users,
  };
};

export const readStoredAppData = (): AppDataSnapshot => {
  if (typeof window === "undefined") {
    return createInitialAppData();
  }

  const stored = window.localStorage.getItem(APP_DATA_STORAGE_KEY);

  if (!stored) {
    return createInitialAppData();
  }

  try {
    const parsed = JSON.parse(stored) as AppDataSnapshot;
    return {
      buses: parsed.buses.map((bus) =>
        normalizeBus(bus, parsed.routes.find((route) => route.id === bus.routeId)),
      ),
      bookings: parsed.bookings,
      routes: parsed.routes,
      users: parsed.users,
    };
  } catch {
    return createInitialAppData();
  }
};

export const persistAppData = (snapshot: AppDataSnapshot) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(snapshot));
};

export const buildStop = (
  name: string,
  pickupTime: string,
  order: number,
  existingStop?: Stop,
): Stop => ({
  id: existingStop?.id ?? createId("stop"),
  name,
  order,
  pickupTime,
  location: existingStop?.location ?? COLLEGE_LOCATION,
});
