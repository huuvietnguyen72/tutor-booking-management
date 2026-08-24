export type AcademicLevel = "EXCELLENT" | "GOOD" | "AVERAGE" | "WEAK";

export interface IStudent {
  id: number;
  parentId: number;
  fullName: string;
  grade: number;
  school: string;
  academicLevel: AcademicLevel;
  avatarUrl?: string;
  specialNotes?: string;
}
