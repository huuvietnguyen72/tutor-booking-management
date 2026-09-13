import type {
  ApprovalStatus,
  ITutorDetail,
  TeachingMode,
  TutorEducationLevel,
} from "../_types/tutor-type";

export type TutorDetailWire = Omit<
  ITutorDetail,
  "educationLevel" | "teachingMode" | "approvalStatus" | "rejectionReason"
> & {
  educationLevel: string;
  teachingMode: string;
  approvalStatus: string;
  rejectionReason?: string | null;
};

const educationLevels = ["HIGH_SCHOOL", "BACHELOR", "MASTER", "PHD", "OTHER"] as const;
const teachingModes = ["ONLINE", "OFFLINE", "BOTH"] as const;
const approvalStatuses = ["PENDING", "APPROVED", "REJECTED"] as const;

function canonical<T extends string>(value: unknown, allowed: readonly T[], field: string): T {
  const normalized = String(value ?? "").toUpperCase();
  if (!allowed.includes(normalized as T)) {
    throw new Error(`Unknown tutor ${field}: ${String(value)}`);
  }
  return normalized as T;
}

export function normalizeTutorDetail(profile: TutorDetailWire): ITutorDetail {
  return {
    ...profile,
    educationLevel: canonical<TutorEducationLevel>(
      profile.educationLevel,
      educationLevels,
      "education level",
    ),
    teachingMode: canonical<TeachingMode>(profile.teachingMode, teachingModes, "teaching mode"),
    approvalStatus: canonical<ApprovalStatus>(
      profile.approvalStatus,
      approvalStatuses,
      "approval status",
    ),
    rejectionReason: profile.rejectionReason ?? null,
  };
}
