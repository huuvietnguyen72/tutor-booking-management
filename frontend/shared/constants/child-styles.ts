import { AcademicStatus } from "@/shared/types/child";

export const STATUS_BG_COLORS: Record<AcademicStatus, string> = {
  EXCELLENT: "bg-emerald-50",
  GOOD: "bg-blue-50",
  AVERAGE: "bg-orange-50",
  WEAK: "bg-red-50",
};

export const CHILD_STATUS_STYLES: Record<AcademicStatus, { badge: string; avatar: string }> = {
  EXCELLENT: {
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
    avatar: "bg-emerald-100/30 dark:bg-emerald-500/10"
  },
  GOOD: {
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    avatar: "bg-blue-100/30 dark:bg-blue-500/10"
  },
  AVERAGE: {
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20",
    avatar: "bg-orange-100/30 dark:bg-orange-500/10"
  },
  WEAK: {
    badge: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-500/20",
    avatar: "bg-red-100/30 dark:bg-red-500/10"
  },
};

