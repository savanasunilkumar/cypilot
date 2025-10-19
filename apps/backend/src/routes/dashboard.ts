import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { canvasService } from '../services/canvas';
import { outlookService } from '../services/outlook';
import { workdayService } from '../services/workday';
import { cyrideService } from '../services/cyride';
import { DashboardData } from '@cypilot/shared';

const router = express.Router();

// Get aggregated dashboard data
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user!;
    const accessToken = req.accessToken!;

    // Fetch data from all services in parallel
    const [canvasData, outlookData, workdayData, cyrideData] = await Promise.allSettled([
      canvasService.getDashboardData(user, accessToken),
      outlookService.getDashboardData(user, accessToken),
      workdayService.getDashboardData(user, accessToken),
      cyrideService.getDashboardData(user, accessToken)
    ]);

    // Combine the results
    const dashboardData: DashboardData = {
      user,
      canvas: canvasData.status === 'fulfilled' ? canvasData.value : {
        courses: [],
        upcomingAssignments: [],
        recentAnnouncements: [],
        unreadAnnouncements: 0
      },
      outlook: outlookData.status === 'fulfilled' ? outlookData.value : {
        importantEmails: [],
        upcomingEvents: [],
        unreadImportantEmails: 0
      },
      workday: workdayData.status === 'fulfilled' ? workdayData.value : {
        notifications: [],
        actionItems: [],
        tuitionFees: [],
        studentRecord: {
          studentId: user.universityId,
          name: user.name,
          email: user.email,
          enrollmentStatus: 'active',
          academicLevel: 'undergraduate',
          major: '',
          creditHours: 0,
          holds: []
        },
        unreadNotifications: 0
      },
      cyride: cyrideData.status === 'fulfilled' ? cyrideData.value : {
        favoriteRoutes: [],
        nearbyStops: [],
        upcomingTrips: []
      }
    };

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DASHBOARD_ERROR',
        message: 'Failed to fetch dashboard data'
      },
      timestamp: new Date().toISOString()
    });
  }
});

export { router as dashboardRouter };
