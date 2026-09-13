"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useGetMe } from "@/server/_actions/auth-action";
import { useGetMySessions } from "@/server/_actions/session-action";
import { getCookie } from "cookies-next";
import { APP_SAVE_KEY } from "@/shared/constants/app";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SummaryCards } from "./summary-cards";
import { UpcomingLessons } from "./upcoming-lessons";
import { ProfileStatus } from "./profile-status";
import { Sparkles, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { useGetTutorProfile } from "@/server/_actions/tutor-action";
import { cn } from "@/shared/lib/utils";
import { ApprovalStatus } from "@/server/_types/tutor-type";

const statusConfig: Record<
  ApprovalStatus,
  { className: string; label: string; Icon: typeof Sparkles; iconClassName?: string }
> = {
  APPROVED: {
    className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
    label: "Đối tác đã xác thực",
    Icon: Sparkles,
    iconClassName: "animate-pulse",
  },
  PENDING: {
    className: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    label: "Hồ sơ đang xét duyệt",
    Icon: Clock,
    iconClassName: "animate-spin-slow",
  },
  REJECTED: {
    className: "bg-rose-500/10 border-rose-500/20 text-rose-600",
    label: "Cần cập nhật hồ sơ",
    Icon: AlertCircle,
  },
};

export function TutorDashboardContent() {
  const [isMounted, setIsMounted] = useState(false);
  const token = getCookie(APP_SAVE_KEY.TOKEN_KEY);
  const { data: user, isLoading: isUserLoading } = useGetMe({
    enabled: !!token && isMounted,
  });
  const {
    data: tutorProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchTutorProfile,
  } =
    useGetTutorProfile();
  const { data: sessionsResponse } = useGetMySessions({ size: 100 });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayUpcomingSessionsCount = sessionsResponse?.content?.filter(
    (s) => s.sessionDate === todayStr && (s.status === "PENDING" || s.status === "CONFIRMED")
  ).length || 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 p-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background transition-colors duration-500">
      <div className="p-4 md:p-8 space-y-8">
        {/* Greeting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {isUserLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 bg-muted" />
                <Skeleton className="h-4 w-80 bg-muted" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  Chào buổi sáng,{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    Gia sư {user?.fullName?.split(" ").slice(-1)[0] || ""}
                  </span>{" "}
                  ☕
                </h1>
                <p className="mt-1 text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2">
                  Hôm nay bạn có{" "}
                  <span className="text-foreground font-bold underline decoration-blue-500/30">
                    {todayUpcomingSessionsCount} buổi dạy
                  </span>{" "}
                  cần chuẩn bị.
                </p>
              </>
            )}
          </div>

          {/* Status Badge */}
          {!isProfileLoading && !isProfileError && tutorProfile && (() => {
            const status = statusConfig[tutorProfile.approvalStatus];
            const Icon = status.Icon;

            return (
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                  status.className,
                )}
              >
                <Icon size={14} className={status.iconClassName} />
                {status.label}
              </div>
            );
          })()}
        </div>

        <SummaryCards />

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <UpcomingLessons />

          <div className="xl:col-span-2 space-y-6">
            <ProfileStatus
              tutorProfile={tutorProfile}
              isLoading={isProfileLoading}
              isError={isProfileError}
              onRetry={refetchTutorProfile}
            />
            {/* Potential Jobs preview could go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
