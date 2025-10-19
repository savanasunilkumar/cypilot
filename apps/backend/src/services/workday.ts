import axios from 'axios';
import { config } from '../config';
import { User } from '@cypilot/shared';
import { WorkdayNotification, TuitionFee, StudentRecord, WorkdayActionItem } from '@cypilot/shared';

class WorkdayService {
  private baseUrl = config.workday.baseUrl;
  private clientId = config.workday.clientId;
  private clientSecret = config.workday.clientSecret;

  async getDashboardData(user: User, accessToken: string) {
    const [notifications, actionItems, tuitionFees, studentRecord] = await Promise.allSettled([
      this.getNotifications(user),
      this.getActionItems(user),
      this.getTuitionFees(user),
      this.getStudentRecord(user)
    ]);

    return {
      notifications: notifications.status === 'fulfilled' ? notifications.value : [],
      actionItems: actionItems.status === 'fulfilled' ? actionItems.value : [],
      tuitionFees: tuitionFees.status === 'fulfilled' ? tuitionFees.value : [],
      studentRecord: studentRecord.status === 'fulfilled' ? studentRecord.value : {
        studentId: user.universityId,
        name: user.name,
        email: user.email,
        enrollmentStatus: 'active',
        academicLevel: 'undergraduate',
        major: '',
        creditHours: 0,
        holds: []
      },
      unreadNotifications: notifications.status === 'fulfilled' ? 
        notifications.value.filter(n => !n.readAt).length : 0
    };
  }

  async getNotifications(user: User): Promise<WorkdayNotification[]> {
    try {
      // In a real implementation, this would call the Workday API
      // For now, we'll return mock data
      const mockNotifications: WorkdayNotification[] = [
        {
          id: '1',
          title: 'Tuition Payment Reminder',
          message: 'Your fall semester tuition payment is due in 5 days.',
          type: 'warning',
          priority: 'high',
          createdAt: new Date().toISOString(),
          actionRequired: true,
          actionUrl: 'https://workday.iastate.edu/payments',
          category: 'financial'
        },
        {
          id: '2',
          title: 'Registration Open',
          message: 'Spring 2024 course registration opens tomorrow at 8:00 AM.',
          type: 'info',
          priority: 'medium',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          actionRequired: false,
          category: 'academic'
        }
      ];

      return mockNotifications;
    } catch (error) {
      console.error('Error fetching Workday notifications:', error);
      return [];
    }
  }

  async getActionItems(user: User): Promise<WorkdayActionItem[]> {
    try {
      // Mock data for action items
      const mockActionItems: WorkdayActionItem[] = [
        {
          id: '1',
          title: 'Complete FERPA Consent Form',
          description: 'You need to complete the FERPA consent form to access your academic records.',
          type: 'form',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'high',
          actionUrl: 'https://workday.iastate.edu/forms/ferpa',
          category: 'Academic Records'
        },
        {
          id: '2',
          title: 'Approve Course Schedule',
          description: 'Review and approve your proposed course schedule for next semester.',
          type: 'approval',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'medium',
          actionUrl: 'https://workday.iastate.edu/schedule',
          category: 'Course Planning'
        }
      ];

      return mockActionItems;
    } catch (error) {
      console.error('Error fetching Workday action items:', error);
      return [];
    }
  }

  async getTuitionFees(user: User): Promise<TuitionFee[]> {
    try {
      // Mock data for tuition fees
      const mockTuitionFees: TuitionFee[] = [
        {
          term: 'Fall 2024',
          amount: 8475.00,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          description: 'Full-time undergraduate tuition and fees',
          feeType: 'tuition',
          paymentUrl: 'https://workday.iastate.edu/payments'
        },
        {
          term: 'Fall 2024',
          amount: 1250.00,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          description: 'On-campus housing and meal plan',
          feeType: 'housing',
          paymentUrl: 'https://workday.iastate.edu/payments'
        }
      ];

      return mockTuitionFees;
    } catch (error) {
      console.error('Error fetching tuition fees:', error);
      return [];
    }
  }

  async getStudentRecord(user: User): Promise<StudentRecord> {
    try {
      // Mock data for student record
      const mockStudentRecord: StudentRecord = {
        studentId: user.universityId,
        name: user.name,
        email: user.email,
        enrollmentStatus: 'active',
        academicLevel: 'undergraduate',
        major: 'Computer Science',
        gpa: 3.7,
        creditHours: 120,
        expectedGraduationDate: '2025-05-15',
        holds: [
          {
            id: '1',
            type: 'Financial',
            description: 'Outstanding balance on account',
            reason: 'Tuition payment overdue',
            createdAt: new Date().toISOString(),
            resolutionInstructions: 'Please contact the Bursar\'s office to resolve this hold.'
          }
        ]
      };

      return mockStudentRecord;
    } catch (error) {
      console.error('Error fetching student record:', error);
      return {
        studentId: user.universityId,
        name: user.name,
        email: user.email,
        enrollmentStatus: 'active',
        academicLevel: 'undergraduate',
        major: '',
        creditHours: 0,
        holds: []
      };
    }
  }

  async markNotificationAsRead(user: User, notificationId: string): Promise<void> {
    try {
      // In a real implementation, this would call the Workday API to mark notification as read
      console.log(`Marking notification ${notificationId} as read for user ${user.id}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
}

export const workdayService = new WorkdayService();
