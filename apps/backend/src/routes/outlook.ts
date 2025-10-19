import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { outlookService } from '../services/outlook';

const router = express.Router();

// Get important emails
router.get('/emails/important', authenticateToken, async (req, res) => {
  try {
    const emails = await outlookService.getImportantEmails(req.accessToken!);
    res.json({
      success: true,
      data: emails,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OUTLOOK_IMPORTANT_EMAILS_ERROR',
        message: 'Failed to fetch important emails'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get emails with pagination
router.get('/emails', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const emails = await outlookService.getEmails(req.accessToken!, limit, skip);
    res.json({
      success: true,
      data: emails,
      pagination: {
        limit,
        skip,
        total: emails.length,
        hasNext: emails.length === limit
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OUTLOOK_EMAILS_ERROR',
        message: 'Failed to fetch emails'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get upcoming calendar events
router.get('/events/upcoming', authenticateToken, async (req, res) => {
  try {
    const events = await outlookService.getUpcomingEvents(req.accessToken!);
    res.json({
      success: true,
      data: events,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OUTLOOK_UPCOMING_EVENTS_ERROR',
        message: 'Failed to fetch upcoming events'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get calendar events within date range
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const events = await outlookService.getCalendarEvents(req.accessToken!, startDate, endDate);
    res.json({
      success: true,
      data: events,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OUTLOOK_EVENTS_ERROR',
        message: 'Failed to fetch calendar events'
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Mark email as read
router.patch('/emails/:emailId/read', authenticateToken, async (req, res) => {
  try {
    const emailId = req.params.emailId;
    await outlookService.markEmailAsRead(req.accessToken!, emailId);
    res.json({
      success: true,
      data: { message: 'Email marked as read' },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'OUTLOOK_MARK_READ_ERROR',
        message: 'Failed to mark email as read'
      },
      timestamp: new Date().toISOString()
    });
  }
});

export { router as outlookRouter };
