import { ApiResponse } from "./base";

export interface AdminStatsResponse {
  totalUsers: number;
  totalTutors: number;
  pendingTutors: number;
  totalRevenue: number;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "PARENT" | "TUTOR";
  isActive: boolean;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SubjectResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  tutorCount?: number;
}

export interface TutorDetailResponse {
  id: string | number;
  fullName: string;
  email: string;
  phone: string;
  subjects: string;
  bio: string;
  experience: string;
  education: string;
  certificates: { name: string; url: string }[];
  createdAt: string;
}

export interface TutorPendingResponse {
  id: number;
  fullName: string;
  avatarUrl: string;
  email: string;
  educationLevel: "HIGH_SCHOOL" | "BACHELOR" | "MASTER" | "PHD" | "OTHER";
  experience: string;
  qualifications: string;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH";
  teachingArea: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
}

export type ApiResponseAdminStats = ApiResponse<AdminStatsResponse>;
export type ApiResponseListTutorPending = ApiResponse<TutorPendingResponse[]>;
export type ApiResponseListUsers = ApiResponse<UserResponse[]>;
export type ApiResponseListSubjects = ApiResponse<SubjectResponse[]>;
export type ApiResponseTutorDetail = ApiResponse<TutorDetailResponse>;
