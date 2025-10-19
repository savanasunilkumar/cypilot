import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { canvasService } from '../services/canvas';

const router = express.Router();

// Get all courses
router.get('/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await canvasService.getCourses(req.user!);
    res.json({
      success: true,
      data: courses,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CANVAS_COURSES_ERROR',
        message: 'Failed to fetch Canvas courses'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get assignments for a specific course
router.get('/courses/:courseId/assignments', authenticateToken, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_COURSE_ID',
          message: 'Invalid course ID'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const assignments = await canvasService.getAssignments(courseId, req.user!);
    res.json({
      success: true,
      data: assignments,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CANVAS_ASSIGNMENTS_ERROR',
        message: 'Failed to fetch Canvas assignments'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get upcoming assignments across all courses
router.get('/assignments/upcoming', authenticateToken, async (req, res) => {
  try {
    const assignments = await canvasService.getUpcomingAssignments(req.user!);
    res.json({
      success: true,
      data: assignments,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CANVAS_UPCOMING_ASSIGNMENTS_ERROR',
        message: 'Failed to fetch upcoming assignments'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get announcements for a specific course
router.get('/courses/:courseId/announcements', authenticateToken, async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_COURSE_ID',
          message: 'Invalid course ID'
        },
        timestamp: new Date().toISOString()
      });
      return;
    }

    const announcements = await canvasService.getAnnouncements(courseId, req.user!);
    res.json({
      success: true,
      data: announcements,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CANVAS_ANNOUNCEMENTS_ERROR',
        message: 'Failed to fetch Canvas announcements'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get recent announcements across all courses
router.get('/announcements/recent', authenticateToken, async (req, res) => {
  try {
    const announcements = await canvasService.getRecentAnnouncements(req.user!);
    res.json({
      success: true,
      data: announcements,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'CANVAS_RECENT_ANNOUNCEMENTS_ERROR',
        message: 'Failed to fetch recent announcements'
      },
      timestamp: new Date().toISOString()
    });
  }
});

export { router as canvasRouter };
