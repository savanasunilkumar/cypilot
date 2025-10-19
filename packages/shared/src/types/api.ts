import { User } from './auth';
import { CanvasCourse, CanvasAssignment, CanvasSubmission, CanvasAnnouncement } from './canvas';
import { OutlookEmail, OutlookCalendarEvent } from './outlook';
import { WorkdayNotification, TuitionFee, StudentRecord, WorkdayActionItem } from './workday';
import { CyRideRoute, CyRideStop, CyRideTrip, CyRideVehicle, CyRideRoutePlan } from './cyride';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Dashboard aggregated data
export interface DashboardData {
  user: User;
  canvas: {
    courses: CanvasCourse[];
    upcomingAssignments: CanvasAssignment[];
    recentAnnouncements: CanvasAnnouncement[];
    unreadAnnouncements: number;
  };
  outlook: {
    importantEmails: OutlookEmail[];
    upcomingEvents: OutlookCalendarEvent[];
    unreadImportantEmails: number;
  };
  workday: {
    notifications: WorkdayNotification[];
    actionItems: WorkdayActionItem[];
    tuitionFees: TuitionFee[];
    studentRecord: StudentRecord;
    unreadNotifications: number;
  };
  cyride: {
    favoriteRoutes: CyRideRoute[];
    nearbyStops: CyRideStop[];
    upcomingTrips: CyRideTrip[];
  };
}

// Canvas API endpoints
export interface CanvasApiEndpoints {
  getCourses: () => Promise<ApiResponse<CanvasCourse[]>>;
  getAssignments: (courseId: number) => Promise<ApiResponse<CanvasAssignment[]>>;
  getUpcomingAssignments: () => Promise<ApiResponse<CanvasAssignment[]>>;
  getSubmissions: (assignmentId: number) => Promise<ApiResponse<CanvasSubmission[]>>;
  getAnnouncements: (courseId: number) => Promise<ApiResponse<CanvasAnnouncement[]>>;
  getRecentAnnouncements: () => Promise<ApiResponse<CanvasAnnouncement[]>>;
}

// Outlook API endpoints
export interface OutlookApiEndpoints {
  getImportantEmails: () => Promise<ApiResponse<OutlookEmail[]>>;
  getEmails: (limit?: number, skip?: number) => Promise<PaginatedResponse<OutlookEmail[]>>;
  getUpcomingEvents: () => Promise<ApiResponse<OutlookCalendarEvent[]>>;
  getCalendarEvents: (startDate?: string, endDate?: string) => Promise<ApiResponse<OutlookCalendarEvent[]>>;
  markEmailAsRead: (emailId: string) => Promise<ApiResponse<void>>;
}

// Workday API endpoints
export interface WorkdayApiEndpoints {
  getNotifications: () => Promise<ApiResponse<WorkdayNotification[]>>;
  getActionItems: () => Promise<ApiResponse<WorkdayActionItem[]>>;
  getTuitionFees: () => Promise<ApiResponse<TuitionFee[]>>;
  getStudentRecord: () => Promise<ApiResponse<StudentRecord>>;
  markNotificationAsRead: (notificationId: string) => Promise<ApiResponse<void>>;
}

// CyRide API endpoints
export interface CyRideApiEndpoints {
  getRoutes: () => Promise<ApiResponse<CyRideRoute[]>>;
  getStops: (routeId?: string) => Promise<ApiResponse<CyRideStop[]>>;
  getNearbyStops: (latitude: number, longitude: number, radius?: number) => Promise<ApiResponse<CyRideStop[]>>;
  getUpcomingTrips: (stopId: string) => Promise<ApiResponse<CyRideTrip[]>>;
  getVehicles: (routeId?: string) => Promise<ApiResponse<CyRideVehicle[]>>;
  planRoute: (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }, departureTime?: string) => Promise<ApiResponse<CyRideRoutePlan>>;
}
