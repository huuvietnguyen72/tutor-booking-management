export type TutorEducationLevel = "HIGH_SCHOOL" | "BACHELOR" | "MASTER" | "PHD" | "OTHER";
export type TeachingMode = "ONLINE" | "OFFLINE" | "BOTH";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ITutorDetail {
  id: number;
  userId: number;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  educationLevel: TutorEducationLevel;
  experienceYears: number;
  experience?: string; // Legacy
  qualifications?: string;
  teachingMode: TeachingMode;
  teachingArea?: string;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorSubject {
  id: number;
  subjectId: number;
  subjectName: string;
  gradeLevel: number;
  pricePerSession: number;
}

export interface ITutorAvailability {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface IUpdateTutorRequest {
  educationLevel: string;
  experience: string;
  qualifications: string;
  teachingMode: string;
  teachingArea: string;
}

export interface ITutorSubjectRequest {
  subjectId?: number;
  gradeLevel: number;
  pricePerSession: number;
}

export interface ITutorAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface ISubject {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface IMyTutor {
  id: string | number;
  fullName: string;
  avatarUrl: string;
  subjects: string[];
  rating: number;
  totalReviews: number;
  lastLesson: string;
  activeStatus: "ACTIVE" | "INACTIVE";
}

export interface IUpcomingLesson {
  id: number;
  subject: string;
  studentName: string;
  grade: string;
  dayOfWeek: string;
  dateNum: number;
  timeFrom: string;
  timeTo: string;
  status: "confirmed" | "pending" | "cancelled";
}

