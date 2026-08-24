export type AcademicStatus = "EXCELLENT" | "GOOD" | "AVERAGE" | "WEAK";

export interface ChildRecord {
  id: string;
  name: string;
  level: string;
  school: string;
  academicStatus: AcademicStatus;
  avatarUrl?: string; // Illustration representation
  avatarBgColor: string; // e.g. "bg-emerald-50", "bg-sky-50", etc.
  parentNotes: string;
}
