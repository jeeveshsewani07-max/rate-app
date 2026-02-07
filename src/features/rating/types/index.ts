import { Trait } from '../../../app/config/constants';

export interface DailyAssignment {
  id: string;
  targetUserId: string;
  targetDisplayName: string;
  groupId: string;
  groupName: string;
  assignedAt: string;
  expiresAt: string;
  status: 'pending' | 'completed' | 'expired';
}

export interface RatingSubmission {
  assignmentId: string;
  traits: Trait[];
  submittedAt: string;
}

export interface PendingRating {
  id: string;
  assignmentId: string;
  traits: Trait[];
  createdAt: string;
  retryCount: number;
}

export interface RatingHistoryItem {
  id: string;
  groupName: string;
  submittedAt: string;
  traitCount: number;
}

export interface DailyAssignmentResponse {
  data: DailyAssignment | null;
  nextAssignmentAt: string | null;
}

export type AssignmentStatus =
  | { type: 'no_assignment'; nextAt: string | null }
  | { type: 'pending'; assignment: DailyAssignment }
  | { type: 'completed'; nextAt: string }
  | { type: 'loading' }
  | { type: 'error'; message: string };
