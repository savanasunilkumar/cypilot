import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { workdayService } from '../services/workday';

const router = express.Router();

// Get notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await workdayService.getNotifications(req.user!);
    res.json({
      success: true,
      data: notifications,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'WORKDAY_NOTIFICATIONS_ERROR',
        message: 'Failed to fetch Workday notifications'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get action items
router.get('/action-items', authenticateToken, async (req, res) => {
  try {
    const actionItems = await workdayService.getActionItems(req.user!);
    res.json({
      success: true,
      data: actionItems,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'WORKDAY_ACTION_ITEMS_ERROR',
        message: 'Failed to fetch Workday action items'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get tuition fees
router.get('/tuition-fees', authenticateToken, async (req, res) => {
  try {
    const tuitionFees = await workdayService.getTuitionFees(req.user!);
    res.json({
      success: true,
      data: tuitionFees,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'WORKDAY_TUITION_FEES_ERROR',
        message: 'Failed to fetch tuition fees'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get student record
router.get('/student-record', authenticateToken, async (req, res) => {
  try {
    const studentRecord = await workdayService.getStudentRecord(req.user!);
    res.json({
      success: true,
      data: studentRecord,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'WORKDAY_STUDENT_RECORD_ERROR',
        message: 'Failed to fetch student record'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Mark notification as read
router.patch('/notifications/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await workdayService.markNotificationAsRead(req.user!, notificationId);
    res.json({
      success: true,
      data: { message: 'Notification marked as read' },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'WORKDAY_MARK_NOTIFICATION_READ_ERROR',
        message: 'Failed to mark notification as read'
      },
      timestamp: new Date().toISOString()
    });
  }
});

export { router as workdayRouter };
