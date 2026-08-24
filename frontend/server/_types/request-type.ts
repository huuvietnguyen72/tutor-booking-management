import { IBaseResponse } from "./base";

export type RequestStatus =
  | "SEARCHING"
  | "HAS_APPLICANTS"
  | "MATCHED"
  | "CANCELLED";
export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ISchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface IRequest {
  id: number;
  parentId: number;
  parentName?: string;
  subjectId: number;
  subjectName?: string;
  studentId: number;
  studentName?: string;
  gradeLevel: number;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH";
  desiredPrice: number;
  sessionsPerWeek: number;
  scheduleNote?: string;
  preferredArea?: string;
  description?: string;
  address?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  applicantsCount: number;
  schedule?: ISchedule[];
}

export interface IApplicant {
  id: number;
  applicationId: number;
  tutorId: number;
  tutorName: string;
  tutorAvatar?: string;
  rating?: number;
  education?: string;
  proposedPrice: number;
  coverLetter?: string;
  status: ApplicationStatus;
}

export interface IApplication {
  id: number;
  requestId: number;
  request?: IRequest;
  tutorId: number;
  tutorName?: string;
  proposedPrice: number;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ICreateRequestRequest {
  subjectId: number;
  studentId: number;
  gradeLevel: number;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH";
  desiredPrice: number;
  sessionsPerWeek: string;
  description?: string;
  address?: string;
  schedule?: ISchedule[];
}

export interface IUpdateRequestRequest {
  desiredPrice?: number;
  teachingMode?: "ONLINE" | "OFFLINE" | "BOTH";
  sessionsPerWeek?: string;
  scheduleNote?: string;
  preferredArea?: string;
}

export type IRequestDetailResponse = IBaseResponse<
  IRequest & { applicants: IApplicant[] }
>;
export type IRequestListResponse = IBaseResponse<IRequest[]>;
