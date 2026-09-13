import type { AcademicLevel, IStudent } from "../_types/student-type";

const levels = new Set<AcademicLevel>(["EXCELLENT", "GOOD", "AVERAGE", "WEAK"]);

export type StudentWire = Omit<IStudent, "academicLevel"> & {
  academicLevel?: unknown;
};

export function normalizeAcademicLevel(value: unknown): AcademicLevel {
  const normalized = String(value ?? "").toUpperCase() as AcademicLevel;
  return levels.has(normalized) ? normalized : "AVERAGE";
}

export function normalizeStudent(student: StudentWire): IStudent {
  return { ...student, academicLevel: normalizeAcademicLevel(student.academicLevel) };
}
