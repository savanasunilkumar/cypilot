export interface CyRideRoute {
  id: string;
  name: string;
  description: string;
  color: string;
  type: 'bus' | 'paratransit';
  status: 'active' | 'inactive';
  operatingDays: string[];
  firstTrip?: string;
  lastTrip?: string;
}

export interface CyRideStop {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  routes: string[];
  accessible: boolean;
  shelter?: boolean;
}

export interface CyRideTrip {
  id: string;
  routeId: string;
  stopId: string;
  scheduledArrival: string;
  predictedArrival?: string;
  delay?: number; // in minutes
  status: 'on_time' | 'delayed' | 'early' | 'cancelled';
  vehicleId?: string;
}

export interface CyRideVehicle {
  id: string;
  routeId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  lastUpdate: string;
  occupancy?: 'low' | 'medium' | 'high';
}

export interface CyRideRoutePlan {
  origin: {
    name: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    name: string;
    latitude: number;
    longitude: number;
  };
  departureTime?: string;
  arrivalTime?: string;
  duration?: number; // in minutes
  walkingTime?: number; // in minutes
  routes: Array<{
    routeId: string;
    routeName: string;
    boardingStop: string;
    alightingStop: string;
    departureTime: string;
    arrivalTime: string;
  }>;
}
