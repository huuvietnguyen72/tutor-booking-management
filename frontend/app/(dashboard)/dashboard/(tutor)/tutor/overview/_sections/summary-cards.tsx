"use client";

import { memo, useMemo } from "react";
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  Wallet,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useGetMyBookings } from "@/server/_actions/booking-action";
import { useGetMySessions } from "@/server/_actions/session-action";
import { parseSessionDateTime } from "@/shared/lib/date-utils";
import { ISession } from "@/server/_types/session-type";

const SummaryStatCard = memo(function SummaryStatCard({
  stat,
}: {
  stat: {
    title: string;
    value: string;
    icon: any;
    description: string;
    color: string;
    trend: string;
  };
}) {
  return (
    <div className="group relative overflow-hidden rounded-4xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5">
      <div className={cn(
        "absolute -right-8 -bottom-8 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700",
        stat.color.split(" ")[1]
      )} />

      <div className="flex items-start justify-between relative z-10">
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-[20px] shadow-lg shadow-black/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
          stat.color
        )}>
          <stat.icon size={26} strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-[9px] font-black text-primary uppercase transition-colors group-hover:bg-primary/10 group-hover:border-primary/20">
          <span>{stat.trend}</span>
          <ArrowUpRight size={12} strokeWidth={3} />
        </div>
      </div>

      <div className="mt-8 flex flex-col relative z-10">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-muted-foreground/80">
          {stat.title}
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-4xl font-black tracking-tight text-foreground transition-all">
            {stat.value}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 relative z-10">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-xs font-bold text-muted-foreground/80">
          {stat.description}
        </span>
      </div>
    </div>
  );
});

export function SummaryCards() {
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetMyBookings({ size: 100 });
  const { data: sessionsResponse, isLoading: isSessionsLoading } = useGetMySessions({ size: 100 });

  const stats = useMemo(() => {
    if (!bookingsResponse || !sessionsResponse) return null;

    const bookings = bookingsResponse.content || [];
    const sessions = sessionsResponse.content || [];

    // 1. Students: Unique student IDs from ACTIVE/COMPLETED bookings
    const uniqueStudents = new Set(bookings.map(b => b.studentId)).size;

    // 2. Completed Sessions: Sessions with status COMPLETED
    const completedSessions = sessions.filter(s => s.status === "COMPLETED");
    const sessionCount = completedSessions.length;

    // 3. Teaching Hours: (Assuming 1.5h per session if no duration, or calculate from startTime/endTime)
    const totalHours = completedSessions.reduce((acc: number, s: ISession) => {
      const start = parseSessionDateTime(s.sessionDate, s.startTime);
      const end = parseSessionDateTime(s.sessionDate, s.endTime);
      
      if (!start || !end) return acc + 1.5;
      
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + (duration > 0 ? duration : 1.5);
    }, 0);

    // 4. Earnings: sum of completed sessions * price
    // Note: Better to sum from bookings' completedSessions * pricePerSession
    const totalEarnings = bookings.reduce((acc: number, b) => acc + (b.pricePerSession * (b.completedSessions || 0)), 0);

    return [
      {
        title: "Học sinh",
        value: uniqueStudents.toString(),
        icon: Users,
        description: "Đang & đã học",
        color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        trend: "Tổng cộng"
      },
      {
        title: "Buổi dạy",
        value: sessionCount.toString(),
        icon: CalendarCheck,
        description: "Hoàn thành",
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        trend: "Tất cả"
      },
      {
        title: "Giờ dạy",
        value: `${Math.round(totalHours)}h`,
        icon: Clock,
        description: "Tích lũy",
        color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
        trend: "Thời gian thực"
      },
      {
        title: "Thu nhập",
        value: totalEarnings > 1000000 ? `${(totalEarnings / 1000000).toFixed(1)}M` : `${totalEarnings.toLocaleString()}đ`,
        icon: Wallet,
        description: "Đã tích lũy",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
        trend: "Tổng thu nhập"
      }
    ];
  }, [bookingsResponse, sessionsResponse]);

  if (isBookingsLoading || isSessionsLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 w-full animate-pulse rounded-4xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {stats?.map((stat, index) => <SummaryStatCard key={index} stat={stat} />)}
    </div>
  );
}
