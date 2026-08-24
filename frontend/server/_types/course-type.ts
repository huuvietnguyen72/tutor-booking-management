import { IBaseResponse } from "./base";

export type CourseStatus = "pending" | "active" | "completed" | "cancelled";

export interface ICourse {
  id: number;
  parentId: number;
  tutorId: number;
  subjectId: number;
  studentId: number;
  tutorName?: string;
  tutorAvatar?: string;
  studentName?: string;
  subjectName?: string;
  gradeLevel: number;
  pricePerSession: number;
  teachingMode: "online" | "offline" | "both";
  isRecurring: boolean;
  startDate: string; // recurring_start_date
  endDate?: string;   // recurring_end_date
  status: CourseStatus;
  totalSessions?: number;
  completedSessions?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseStats {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  totalHours: number;
}

export type IGetCoursesResponse = IBaseResponse<ICourse[]>;
export type IGetCourseStatsResponse = IBaseResponse<ICourseStats>;
