import axios from 'axios';
import { User } from '@cypilot/shared';
import { OutlookEmail, OutlookCalendarEvent } from '@cypilot/shared';

class OutlookService {
  private baseUrl = 'https://graph.microsoft.com/v1.0';

  async getDashboardData(user: User, accessToken: string) {
    const [importantEmails, upcomingEvents] = await Promise.allSettled([
      this.getImportantEmails(accessToken),
      this.getUpcomingEvents(accessToken)
    ]);

    return {
      importantEmails: importantEmails.status === 'fulfilled' ? importantEmails.value : [],
      upcomingEvents: upcomingEvents.status === 'fulfilled' ? upcomingEvents.value : [],
      unreadImportantEmails: importantEmails.status === 'fulfilled' ? 
        importantEmails.value.filter(email => !email.isRead).length : 0
    };
  }

  async getImportantEmails(accessToken: string): Promise<OutlookEmail[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/messages`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          $filter: "importance eq 'high' or flag/flagStatus eq 'flagged'",
          $orderby: 'receivedDateTime desc',
          $top: 20,
          $select: 'id,subject,bodyPreview,receivedDateTime,from,toRecipients,importance,isRead,hasAttachments,flag,webLink'
        }
      });

      return response.data.value.map((email: any) => ({
        id: email.id,
        subject: email.subject,
        bodyPreview: email.bodyPreview,
        receivedDateTime: email.receivedDateTime,
        from: email.from,
        toRecipients: email.toRecipients,
        importance: email.importance,
        isRead: email.isRead,
        hasAttachments: email.hasAttachments,
        flag: email.flag,
        webLink: email.webLink
      }));
    } catch (error) {
      console.error('Error fetching important emails:', error);
      return [];
    }
  }

  async getEmails(accessToken: string, limit: number = 50, skip: number = 0): Promise<OutlookEmail[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/messages`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          $orderby: 'receivedDateTime desc',
          $top: limit,
          $skip: skip,
          $select: 'id,subject,bodyPreview,receivedDateTime,from,toRecipients,importance,isRead,hasAttachments,flag,webLink'
        }
      });

      return response.data.value.map((email: any) => ({
        id: email.id,
        subject: email.subject,
        bodyPreview: email.bodyPreview,
        receivedDateTime: email.receivedDateTime,
        from: email.from,
        toRecipients: email.toRecipients,
        importance: email.importance,
        isRead: email.isRead,
        hasAttachments: email.hasAttachments,
        flag: email.flag,
        webLink: email.webLink
      }));
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  }

  async getUpcomingEvents(accessToken: string): Promise<OutlookCalendarEvent[]> {
    try {
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const response = await axios.get(`${this.baseUrl}/me/events`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          $filter: `start/dateTime ge '${now.toISOString()}' and start/dateTime le '${oneWeekFromNow.toISOString()}'`,
          $orderby: 'start/dateTime asc',
          $top: 20,
          $select: 'id,subject,bodyPreview,start,end,location,organizer,attendees,isAllDay,showAs,webLink'
        }
      });

      return response.data.value.map((event: any) => ({
        id: event.id,
        subject: event.subject,
        bodyPreview: event.bodyPreview,
        start: event.start,
        end: event.end,
        location: event.location,
        organizer: event.organizer,
        attendees: event.attendees,
        isAllDay: event.isAllDay,
        showAs: event.showAs,
        webLink: event.webLink
      }));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  async getCalendarEvents(accessToken: string, startDate?: string, endDate?: string): Promise<OutlookCalendarEvent[]> {
    try {
      const now = new Date();
      const start = startDate ? new Date(startDate) : now;
      const end = endDate ? new Date(endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const response = await axios.get(`${this.baseUrl}/me/events`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          $filter: `start/dateTime ge '${start.toISOString()}' and start/dateTime le '${end.toISOString()}'`,
          $orderby: 'start/dateTime asc',
          $top: 100,
          $select: 'id,subject,bodyPreview,start,end,location,organizer,attendees,isAllDay,showAs,webLink'
        }
      });

      return response.data.value.map((event: any) => ({
        id: event.id,
        subject: event.subject,
        bodyPreview: event.bodyPreview,
        start: event.start,
        end: event.end,
        location: event.location,
        organizer: event.organizer,
        attendees: event.attendees,
        isAllDay: event.isAllDay,
        showAs: event.showAs,
        webLink: event.webLink
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  async markEmailAsRead(accessToken: string, emailId: string): Promise<void> {
    try {
      await axios.patch(`${this.baseUrl}/me/messages/${emailId}`, {
        isRead: true
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error marking email as read:', error);
      throw error;
    }
  }
}

export const outlookService = new OutlookService();
