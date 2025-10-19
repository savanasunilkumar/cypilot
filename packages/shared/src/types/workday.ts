export interface WorkdayNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  readAt?: string;
  actionRequired: boolean;
  actionUrl?: string;
  category: 'academic' | 'financial' | 'enrollment' | 'general';
}

export interface TuitionFee {
  term: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  description: string;
  feeType: 'tuition' | 'fees' | 'housing' | 'meal_plan' | 'other';
  paymentUrl?: string;
}

export interface StudentRecord {
  studentId: string;
  name: string;
  email: string;
  enrollmentStatus: 'active' | 'inactive' | 'graduated' | 'withdrawn';
  academicLevel: 'undergraduate' | 'graduate' | 'doctoral';
  major: string;
  gpa?: number;
  creditHours: number;
  expectedGraduationDate?: string;
  holds: Array<{
    id: string;
    type: string;
    description: string;
    reason: string;
    createdAt: string;
    resolutionInstructions?: string;
  }>;
}

export interface WorkdayActionItem {
  id: string;
  title: string;
  description: string;
  type: 'form' | 'approval' | 'review' | 'payment';
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  actionUrl: string;
  category: string;
}
