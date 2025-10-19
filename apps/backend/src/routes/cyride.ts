import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { cyrideService } from '../services/cyride';

const router = express.Router();

// Get all routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await cyrideService.getRoutes();
    res.json({
      success: true,
      data: routes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CYRIDE_ROUTES_ERROR',
        message: 'Failed to fetch CyRide routes'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get favorite routes for user
router.get('/routes/favorites', authenticateToken, async (req, res) => {
  try {
    const routes = await cyrideService.getFavoriteRoutes(req.user!);
    res.json({
      success: true,
      data: routes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CYRIDE_FAVORITE_ROUTES_ERROR',
        message: 'Failed to fetch favorite routes'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get stops for a route
router.get('/stops', async (req, res) => {
  try {
    const routeId = req.query.routeId as string;
    const stops = await cyrideService.getStops(routeId);
    res.json({
      success: true,
      data: stops,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CYRIDE_STOPS_ERROR',
        message: 'Failed to fetch CyRide stops'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get nearby stops for user
router.get('/stops/nearby', authenticateToken, async (req, res) => {
  try {
    const radius = parseFloat(req.query.radius as string) || 0.5;
    const stops = await cyrideService.getNearbyStops(req.user!, radius);
    res.json({
      success: true,
      data: stops,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CYRIDE_NEARBY_STOPS_ERROR',
        message: 'Failed to fetch nearby stops'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get upcoming trips for user
router.get('/trips/upcoming', authenticateToken, async (req, res) => {
  try {
    const trips = await cyrideService.getUpcomingTrips(req.user!);
    res.json({
      success: true,
      data: trips,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CYRIDE_UPCOMING_TRIPS_ERROR',
        message: 'Failed to fetch upcoming trips'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get vehicles for a route
router.get('/vehicles', async (req, res) => {
  try {
    const routeId = req.query.routeId as string;
    const vehicles = await cyrideService.getVehicles(routeId);
    res.json({
      success: true,
      data: vehicles,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CYRIDE_VEHICLES_ERROR',
        message: 'Failed to fetch vehicles'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Plan a route
router.post('/route-plan', authenticateToken, async (req, res) => {
  try {
    const { origin, destination, departureTime } = req.body;

    if (!origin || !destination || !origin.lat || !origin.lng || !destination.lat || !destination.lng) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ROUTE_PARAMS',
          message: 'Origin and destination with lat/lng coordinates are required'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const routePlan = await cyrideService.planRoute(origin, destination, departureTime);
    res.json({
      success: true,
      data: routePlan,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CYRIDE_ROUTE_PLAN_ERROR',
        message: 'Failed to plan route'
      },
      timestamp: new Date().toISOString()
    });
  }
});

export { router as cyrideRouter };
