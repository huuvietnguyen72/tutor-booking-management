"use client";

import { cn } from "@/shared/lib/utils";
import { 
  History, 
  TrendingUp, 
  Timer,
  Wallet,
  CalendarCheck2
} from "lucide-react";
import { ISession } from "@/server/_types/session-type";
import { useMemo } from "react";
import { format, isSameMonth, parseISO, differenceInMinutes, isAfter, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { safeFormat, safeParseISO, parseSessionDateTime } from "@/shared/lib/date-utils";

interface ScheduleStatsProps {
  sessions: ISession[];
}

export function ScheduleStats({ sessions }: ScheduleStatsProps) {
  const statsData = useMemo(() => {
    const now = new Date();
    const currentMonthSessions = sessions.filter(s => {
      const date = parseSessionDateTime(s.sessionDate, s.startTime);
      return date ? isSameMonth(date, now) : false;
    });
    
    // 1. Next Session
    const upcoming = sessions
      .filter(s => {
        const date = parseSessionDateTime(s.sessionDate, s.startTime);
        return (s.status === "PENDING" || s.status === "CONFIRMED") && date && isAfter(date, now);
      })
      .sort((a, b) => {
        const da = parseSessionDateTime(a.sessionDate, a.startTime)?.getTime() || 0;
        const db = parseSessionDateTime(b.sessionDate, b.startTime)?.getTime() || 0;
        return da - db;
      });
    
    const nextSession = upcoming[0];
    const nextStartDate = nextSession ? parseSessionDateTime(nextSession.sessionDate, nextSession.startTime) : null;
    const nextTime = nextStartDate ? format(nextStartDate, "HH:mm") : "--:--";
    const nextDay = nextStartDate ? format(nextStartDate, "dd/MM") : "N/A";

    // 2. Total Hours (Month)
    const totalMinutes = currentMonthSessions
      .filter(s => s.status === "COMPLETED")
      .reduce((acc, s) => {
        const start = parseSessionDateTime(s.sessionDate, s.startTime);
        const end = parseSessionDateTime(s.sessionDate, s.endTime);
        if (!start || !end) return acc;
        return acc + differenceInMinutes(end, start);
      }, 0);
    const totalHours = Math.round(totalMinutes / 60);

    // 3. Projected Earnings (Month)
    const earnings = currentMonthSessions
      .filter(s => s.status === "COMPLETED")
      .reduce((acc, s) => acc + (s.price || 0), 0);

    // 4. Target Completion
    const totalSessionsMonth = currentMonthSessions.length;
    const completedSessionsMonth = currentMonthSessions.filter(s => s.status === "COMPLETED").length;
    const completionRate = totalSessionsMonth > 0 ? Math.round((completedSessionsMonth / totalSessionsMonth) * 100) : 0;

    return {
      nextTime,
      nextDay,
      totalHours,
      earnings,
      completionRate,
      completedSessionsMonth,
      totalSessionsMonth
    };
  }, [sessions]);

  const stats = [
    {
      label: "Buổi dạy kế tiếp",
      value: statsData.nextTime,
      subValue: statsData.nextDay === "N/A" ? "Chưa có lịch" : `Ngày ${statsData.nextDay}`,
      icon: CalendarCheck2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Tổng giờ dạy (Tháng)",
      value: `${statsData.totalHours}h`,
      subValue: "Buổi học đã hoàn thành",
      icon: Timer,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Thu nhập thực tế",
      value: `${(statsData.earnings / 1000000).toFixed(1)}M`,
      subValue: `Tháng ${format(new Date(), "MM/yyyy")}`,
      icon: Wallet,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest pl-2">
        Thống kê tổng quan
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 lg:space-y-3">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="group bg-card border border-border/50 rounded-3xl md:rounded-4xl p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
          >
            <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center gap-3 md:gap-4">
              <div className={cn(
                "flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                stat.bg, stat.color
              )}>
                <stat.icon size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">
                  {stat.label}
                </p>
                <p className="text-xl md:text-2xl font-black text-foreground tracking-tight tabular-nums">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 md:mt-1">
                  {stat.label.includes("Tổng giờ") && <TrendingUp size={10} className="text-emerald-500 md:w-3 md:h-3" />}
                  <p className="text-[9px] md:text-[11px] font-bold text-muted-foreground/70 truncate">
                    {stat.subValue}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="col-span-2 lg:col-span-1 bg-primary/5 border border-primary/10 rounded-3xl md:rounded-4xl p-4 md:p-5 overflow-hidden relative group">
          <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-700 group-hover:scale-150 group-hover:-rotate-12">
            <TrendingUp size={100} className="md:w-30 md:h-30" strokeWidth={3} />
          </div>
          <p className="text-[9px] md:text-xs font-black text-primary uppercase tracking-widest mb-1">Hoàn thành tháng này</p>
          <div className="flex items-baseline gap-2 mb-2 md:mb-3">
            <span className="text-xl md:text-2xl font-black text-primary">{statsData.completionRate}%</span>
            <span className="text-[8px] md:text-[10px] font-bold text-primary/60">{statsData.completedSessionsMonth}/{statsData.totalSessionsMonth} buổi dạy</span>
          </div>
          <div className="h-1.5 md:h-2 w-full bg-primary/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 group-hover:opacity-80" 
              style={{ width: `${statsData.completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
