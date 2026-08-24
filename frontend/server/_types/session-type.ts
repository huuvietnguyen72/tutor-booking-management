export type SessionStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface ISession {
  id: number;
  bookingId: number;
  tutorId: number;
  parentId: number;
  // sessionDate is the date part (e.g., "2024-04-15")
  // startTime/endTime are TIME-ONLY strings (e.g., "08:00:00")
  // Use sessionDate + startTime/endTime to construct full datetime
  sessionDate?: string;
  startTime: string; // may be time-only "HH:mm:ss" OR full datetime
  endTime: string;   // may be time-only "HH:mm:ss" OR full datetime
  studentName?: string;
  studentAvatar?: string;
  tutorName?: string;
  tutorAvatar?: string;
  subjectName?: string;
  gradeLevel?: string;
  status: SessionStatus;
  sessionNote?: string;
  price: number;
  isPaid: boolean;
  reviewId?: number;
  cancelReason?: string;
  createdAt?: string;
  updatedAt?: string;
}
