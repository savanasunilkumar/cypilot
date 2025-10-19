export interface CanvasCourse {
  id: number;
  name: string;
  courseCode: string;
  term: string;
  enrollmentTermId: number;
  startAt?: string;
  endAt?: string;
  workflowState: string;
  totalStudents?: number;
  courseFormat?: string;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description?: string;
  dueAt?: string;
  unlockAt?: string;
  lockAt?: string;
  pointsPossible: number;
  gradingType: string;
  submissionTypes: string[];
  hasSubmittedSubmissions: boolean;
  dueDateString?: string;
  courseId: number;
  htmlUrl: string;
  quizId?: number;
  assignmentGroupId: number;
  position: number;
  published: boolean;
}

export interface CanvasSubmission {
  id: number;
  assignmentId: number;
  userId: number;
  submittedAt?: string;
  score?: number;
  grade?: string;
  workflowState: string;
  attempt?: number;
  body?: string;
  gradeMatchesCurrentSubmission: boolean;
  htmlUrl: string;
  previewUrl?: string;
  url?: string;
}

export interface CanvasAnnouncement {
  id: number;
  title: string;
  message: string;
  postedAt: string;
  author: {
    id: number;
    displayName: string;
    avatarImageUrl?: string;
  };
  htmlUrl: string;
}

export interface CanvasGrade {
  courseId: number;
  assignmentId: number;
  score: number;
  grade: string;
  pointsPossible: number;
  percentage: number;
}
