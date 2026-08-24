import { Tutor } from "./tutor";

export type RequestStatus = "Đang tuyển" | "Đã kết thúc" | "Đã duyệt" | "Bị từ chối";

export interface TutoringRequest {
  id: string;
  subject: string;
  grade: string;
  salary: number; // monthly or hourly
  method: "Online" | "Offline" | "Hybrid";
  address?: string;
  district?: string;
  city?: string;
  schedule: TutoringSession[];
  description?: string;
  status: RequestStatus;
  createdAt: string;
  applicantsCount: number;
  newApplicantCount?: number;
}

export interface TutoringSession {
  dayOfWeek: number; // 0 for Sunday, 1-6 for Mon-Sat
  startTime: string; // e.g. "18:00"
  endTime: string;   // e.g. "20:00"
}

export interface Applicant extends Tutor {
  appliedAt: string;
  status: "Pending" | "Accepted" | "Rejected";
  matchRate?: number;
  isNew?: boolean;
}
