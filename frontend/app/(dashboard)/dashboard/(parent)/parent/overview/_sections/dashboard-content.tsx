"use client";

import { useState, useEffect } from "react";
import { useGetMe } from "@/server/_actions/auth-action";
import { getCookie } from "cookies-next";
import { APP_SAVE_KEY } from "@/shared/constants/app";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { SummaryCards } from "./summary-cards";
import { UpcomingLessons } from "./upcoming-lessons";
import { TutorRequests } from "./tutor-requests";
import { ReferralBanner } from "./referral-banner";

// ─── Main Component ───────────────────────────────────────────────────────────

export function ParentDashboardContent() {
  const [isMounted, setIsMounted] = useState(false);
  const token = getCookie(APP_SAVE_KEY.TOKEN_KEY);
  const { data: user, isLoading } = useGetMe({ enabled: !!token && isMounted });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-muted" />
              <Skeleton className="h-4 w-80 bg-muted" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                Xin chào,{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {user?.fullName?.split(" ").slice(-2).join(" ") || "Phụ huynh"}
                </span>{" "}
                👋
              </h1>
              <p className="mt-1 text-sm md:text-base text-muted-foreground font-medium">
                Theo dõi các buổi học và quản lý gia sư của con bạn tại đây.
              </p>
            </>
          )}
        </div>

        {/* <SummaryCards /> */}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <UpcomingLessons />
          <TutorRequests />
        </div>

        <ReferralBanner />
      </div>
    </div>
  );
}
