export interface IJobMarketplace {
  id: number;
  parentId: number;
  subjectId: number;
  subjectName: string;
  gradeLevel: number;
  studentName: string; // From students table linked via parent or extra info
  desiredPrice: number;
  sessionsPerWeek: number;
  teachingMode: "online" | "offline" | "both";
  preferredArea?: string;
  location?: string; // Legacy/Alias for preferredArea
  scheduleNote?: string;
  createdAt: string;
  description: string;
  status: "pending" | "searching" | "has_applicants" | "matched" | "cancelled";
}

export interface IDirectInvitation {
  id: string;
  parentName: string;
  parentAvatar?: string;
  tutorAvatar?: string;
  studentName: string;
  subjectName: string;
  grade: string;
  budget: number;
  message: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "PENDING_PAYMENTS";
  createdAt: string;
}
