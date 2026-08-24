"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Clock, CheckCircle2, XCircle, Inbox } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/constants/app";
import { useGetMySessions } from "@/server/_actions/session-action";
import { ISession, SessionStatus } from "@/server/_types/session-type";
import { vi } from "date-fns/locale";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatSessionDate, formatSessionTime, parseSessionDateTime } from "@/shared/lib/date-utils";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<SessionStatus, { label: string; className: string; icon: any }> = {
  PENDING: { 
    label: "Chờ xác nhận", 
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20", 
    icon: Clock 
  },
  CONFIRMED: { 
    label: "Đã xác nhận", 
    className: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border-sky-100 dark:border-sky-500/20", 
    icon: CheckCircle2 
  },
  COMPLETED: { 
    label: "Hoàn thành", 
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20", 
    icon: CheckCircle2 
  },
  CANCELLED: { 
    label: "Đã hủy", 
    className: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-500/20", 
    icon: XCircle 
  },
};

// ─── Sub-component ────────────────────────────────────────────────────────────

const LessonCard = memo(function LessonCard({ session, index }: { session: ISession; index: number }) {
  const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;

  const startTime = formatSessionTime(session.sessionDate, session.startTime, "--:--");
  const endTime = formatSessionTime(session.sessionDate, session.endTime, "--:--");
  const dayName = formatSessionDate(session.sessionDate, session.startTime, "EEEE", {
    locale: vi,
    fallback: "N/A",
  })
    .split(" ")
    .pop()
    ?.toUpperCase();
  const dateNum = formatSessionDate(session.sessionDate, session.startTime, "dd", { fallback: "--" });

  return (
    <div 
      className="group flex items-center gap-5 rounded-4xl bg-card p-5 shadow-sm border border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-right-4 fill-mode-both"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Date Badge */}
      <div className="flex w-16 h-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">
          THỨ {dayName}
        </span>
        <span className="text-2xl font-black leading-none mt-1">{dateNum}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-bold text-foreground text-base tracking-tight truncate group-hover:text-primary transition-colors">
          {session.subjectName || "Môn học"}
        </h3>
        <p className="text-sm text-muted-foreground font-medium truncate flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Học sinh: <span className="text-foreground/80">{session.studentName || "Học sinh"}</span>
        </p>
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/50">
            <Clock size={12} strokeWidth={2.5} />
            <span className="text-xs font-bold tabular-nums">
              {startTime} – {endTime}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={cn(
          "hidden sm:flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
          statusCfg.className
        )}
      >
        <StatusIcon size={12} strokeWidth={2.5} />
        {statusCfg.label}
      </div>
    </div>
  );
});

// ─── Main Export ───────────────────────────────────────────────────────────────

export function UpcomingLessons() {
  const { data: sessionsRes, isLoading } = useGetMySessions({ 
    size: 100,
  });

  // Filter upcoming sessions first, then sort by nearest datetime and take top 5.
  const sessions = useMemo(
    () =>
      (sessionsRes?.content || [])
        .filter((s) => s.status === "PENDING" || s.status === "CONFIRMED")
        .sort((a, b) => {
          const aTime = parseSessionDateTime(a.sessionDate, a.startTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
          const bTime = parseSessionDateTime(b.sessionDate, b.startTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
        })
        .slice(0, 5),
    [sessionsRes?.content]
  );
  const lessonCards = useMemo(
    () => sessions.map((session, index) => <LessonCard key={session.id} session={session} index={index} />),
    [sessions]
  );

  return (
    <section className="xl:col-span-3 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-black text-foreground tracking-tight">Buổi học sắp tới</h2>
        </div>
        <Link
          href={`${ROUTES.PARENT.SCHEDULES}`}
          className="group flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-all"
        >
          Toàn bộ lịch học
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-26 w-full rounded-4xl bg-muted" />
          ))
        ) : sessions.length > 0 ? (
          lessonCards
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-4xl border-2 border-dashed border-border/60">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Inbox className="text-muted-foreground opacity-30" size={32} />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Không có buổi học nào sắp tới</p>
          </div>
        )}
      </div>
    </section>
  );
}
