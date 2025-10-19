import axios from 'axios';
import { config } from '../config';
import { User } from '@cypilot/shared';
import { CyRideRoute, CyRideStop, CyRideTrip, CyRideVehicle, CyRideRoutePlan } from '@cypilot/shared';

class CyRideService {
  private baseUrl = config.cyride.baseUrl;
  private apiKey = config.cyride.apiKey;

  async getDashboardData(user: User, accessToken: string) {
    const [favoriteRoutes, nearbyStops, upcomingTrips] = await Promise.allSettled([
      this.getFavoriteRoutes(user),
      this.getNearbyStops(user),
      this.getUpcomingTrips(user)
    ]);

    return {
      favoriteRoutes: favoriteRoutes.status === 'fulfilled' ? favoriteRoutes.value : [],
      nearbyStops: nearbyStops.status === 'fulfilled' ? nearbyStops.value : [],
      upcomingTrips: upcomingTrips.status === 'fulfilled' ? upcomingTrips.value : []
    };
  }

  async getRoutes(): Promise<CyRideRoute[]> {
    try {
      // In a real implementation, this would call the CyRide API
      // For now, we'll return mock data based on actual CyRide routes
      const mockRoutes: CyRideRoute[] = [
        {
          id: '1',
          name: 'Red Route',
          description: 'Main campus route connecting residence halls to academic buildings',
          color: '#DC143C',
          type: 'bus',
          status: 'active',
          operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          firstTrip: '07:00',
          lastTrip: '22:00'
        },
        {
          id: '2',
          name: 'Blue Route',
          description: 'Downtown and off-campus route',
          color: '#4169E1',
          type: 'bus',
          status: 'active',
          operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          firstTrip: '06:30',
          lastTrip: '23:00'
        },
        {
          id: '3',
          name: 'Orange Route',
          description: 'Evening and weekend service',
          color: '#FF8C00',
          type: 'bus',
          status: 'active',
          operatingDays: ['Friday', 'Saturday', 'Sunday'],
          firstTrip: '18:00',
          lastTrip: '02:00'
        }
      ];

      return mockRoutes;
    } catch (error) {
      console.error('Error fetching CyRide routes:', error);
      return [];
    }
  }

  async getFavoriteRoutes(user: User): Promise<CyRideRoute[]> {
    try {
      // In a real implementation, this would fetch user's favorite routes from database
      // For now, return a subset of routes
      const allRoutes = await this.getRoutes();
      return allRoutes.slice(0, 2); // Return first 2 routes as favorites
    } catch (error) {
      console.error('Error fetching favorite routes:', error);
      return [];
    }
  }

  async getStops(routeId?: string): Promise<CyRideStop[]> {
    try {
      // Mock data for CyRide stops
      const mockStops: CyRideStop[] = [
        {
          id: '1',
          name: 'Memorial Union',
          description: 'Main student union building',
          latitude: 42.0267,
          longitude: -93.6479,
          routes: ['1', '2'],
          accessible: true,
          shelter: true
        },
        {
          id: '2',
          name: 'Library',
          description: 'Parks Library',
          latitude: 42.0288,
          longitude: -93.6457,
          routes: ['1'],
          accessible: true,
          shelter: false
        },
        {
          id: '3',
          name: 'Carver Hall',
          description: 'Engineering building',
          latitude: 42.0275,
          longitude: -93.6491,
          routes: ['1', '3'],
          accessible: true,
          shelter: true
        }
      ];

      if (routeId) {
        return mockStops.filter(stop => stop.routes.includes(routeId));
      }

      return mockStops;
    } catch (error) {
      console.error('Error fetching CyRide stops:', error);
      return [];
    }
  }

  async getNearbyStops(user: User, radius: number = 0.5): Promise<CyRideStop[]> {
    try {
      // In a real implementation, this would use the user's location
      // For now, return some stops near campus
      const allStops = await this.getStops();
      return allStops.slice(0, 3); // Return first 3 stops as nearby
    } catch (error) {
      console.error('Error fetching nearby stops:', error);
      return [];
    }
  }

  async getUpcomingTrips(user: User): Promise<CyRideTrip[]> {
    try {
      // Mock data for upcoming trips
      const mockTrips: CyRideTrip[] = [
        {
          id: '1',
          routeId: '1',
          stopId: '1',
          scheduledArrival: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
          predictedArrival: new Date(Date.now() + 4 * 60 * 1000).toISOString(), // 4 minutes from now
          delay: -1, // 1 minute early
          status: 'early',
          vehicleId: 'V001'
        },
        {
          id: '2',
          routeId: '2',
          stopId: '2',
          scheduledArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
          predictedArrival: new Date(Date.now() + 17 * 60 * 1000).toISOString(), // 17 minutes from now
          delay: 2, // 2 minutes late
          status: 'delayed',
          vehicleId: 'V002'
        }
      ];

      return mockTrips;
    } catch (error) {
      console.error('Error fetching upcoming trips:', error);
      return [];
    }
  }

  async getVehicles(routeId?: string): Promise<CyRideVehicle[]> {
    try {
      // Mock data for vehicles
      const mockVehicles: CyRideVehicle[] = [
        {
          id: 'V001',
          routeId: '1',
          latitude: 42.0265,
          longitude: -93.6480,
          heading: 45,
          speed: 25,
          lastUpdate: new Date().toISOString(),
          occupancy: 'medium'
        },
        {
          id: 'V002',
          routeId: '2',
          latitude: 42.0270,
          longitude: -93.6460,
          heading: 90,
          speed: 30,
          lastUpdate: new Date().toISOString(),
          occupancy: 'high'
        }
      ];

      if (routeId) {
        return mockVehicles.filter(vehicle => vehicle.routeId === routeId);
      }

      return mockVehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  }

  async planRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    departureTime?: string
  ): Promise<CyRideRoutePlan> {
    try {
      // Mock route planning data
      const mockRoutePlan: CyRideRoutePlan = {
        origin: {
          name: 'Current Location',
          latitude: origin.lat,
          longitude: origin.lng
        },
        destination: {
          name: 'Destination',
          latitude: destination.lat,
          longitude: destination.lng
        },
        departureTime: departureTime || new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(), // 20 minutes from now
        duration: 20,
        walkingTime: 5,
        routes: [
          {
            routeId: '1',
            routeName: 'Red Route',
            boardingStop: 'Memorial Union',
            alightingStop: 'Library',
            departureTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            arrivalTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
          }
        ]
      };

      return mockRoutePlan;
    } catch (error) {
      console.error('Error planning route:', error);
      throw error;
    }
  }
}

export const cyrideService = new CyRideService();
