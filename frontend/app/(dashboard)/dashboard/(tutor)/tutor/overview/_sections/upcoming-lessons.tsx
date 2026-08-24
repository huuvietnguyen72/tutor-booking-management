"use client";

import { memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Clock, CheckCircle2, XCircle, User, CalendarCheck, Check } from "lucide-react";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { useGetMySessions, useConfirmSession, useCompleteSession } from "@/server/_actions/session-action";
import { ISession } from "@/server/_types/session-type";
import { formatSessionDate, formatSessionTime } from "@/shared/lib/date-utils";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING: { 
    label: "Chờ xác nhận", 
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20", 
    icon: Clock 
  },
  CONFIRMED: { 
    label: "Đã xác nhận", 
    className: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border-sky-100 dark:border-sky-500/20", 
    icon: CalendarCheck 
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
} as const;

// ─── Sub-component ────────────────────────────────────────────────────────────

const LessonCard = memo(function LessonCard({ lesson, index }: { lesson: ISession; index: number }) {
  const statusCfg = STATUS_CONFIG[lesson.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  
  const startTimeStr = lesson.startTime;
  const endTimeStr = lesson.endTime;

  const confirmMutation = useConfirmSession();
  const completeMutation = useCompleteSession();

  const handleConfirm = useCallback(() => {
    const toastId = toast.loading("Đang xác nhận buổi dạy...");
    confirmMutation.mutate(lesson.id, {
      onSuccess: () => {
        toast.success("Đã xác nhận buổi dạy!", { id: toastId });
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Không thể xác nhận buổi dạy. Vui lòng thử lại."), { id: toastId });
      }
    });
  }, [confirmMutation, lesson.id]);

  const handleComplete = useCallback(() => {
    const toastId = toast.loading("Đang đánh dấu hoàn thành...");
    completeMutation.mutate(lesson.id, {
      onSuccess: () => {
        toast.success("Buổi dạy đã hoàn thành!", { id: toastId });
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Không thể cập nhật trạng thái. Vui lòng thử lại."), { id: toastId });
      }
    });
  }, [completeMutation, lesson.id]);

  return (
    <div 
      className="group flex flex-col md:flex-row md:items-center gap-5 rounded-4xl bg-card p-5 shadow-sm border border-border hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 animate-in fade-in slide-in-from-right-4 fill-mode-both"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex items-center gap-5 flex-1 min-w-0">
        {/* Date Badge */}
        <div className="flex w-16 h-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
            {formatSessionDate(lesson.sessionDate, startTimeStr, "eee", { fallback: "---" })}
          </span>
          <span className="text-xl font-black leading-none mt-1">{formatSessionDate(lesson.sessionDate, startTimeStr, "dd", { fallback: "--" })}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <h3 className="font-black text-foreground text-[15px] md:text-base tracking-tight truncate group-hover:text-primary transition-colors">
            {lesson.subjectName || "Môn học"}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[13px] text-muted-foreground font-bold truncate flex items-center gap-1.5">
              <User size={14} className="text-primary/70" />
              <span className="text-foreground/80">{lesson.studentName || "Học sinh N/A"}</span>
              {lesson.gradeLevel && (
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-muted text-[9px] uppercase font-black tracking-widest text-muted-foreground/80">Lớp {lesson.gradeLevel}</span>
              )}
            </p>
            
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-muted/40 text-muted-foreground border border-border/40">
              <Clock size={12} strokeWidth={2.5} className="text-primary/60" />
              <span className="text-xs font-black tracking-tight tabular-nums">
                {formatSessionTime(lesson.sessionDate, startTimeStr)} – {formatSessionTime(lesson.sessionDate, endTimeStr)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Status */}
      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
        <div
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm",
            statusCfg.className
          )}
        >
          <StatusIcon size={12} strokeWidth={3} />
          {statusCfg.label}
        </div>

        {lesson.status === "PENDING" && (
          <Button 
            size="sm" 
            className="rounded-xl font-black h-9 px-5 bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
            onClick={handleConfirm}
            disabled={confirmMutation.isPending}
          >
            <Check size={14} className="mr-1.5" strokeWidth={3} />
            Xác nhận
          </Button>
        )}

        {lesson.status === "CONFIRMED" && (
          <Button 
            size="sm" 
            className="rounded-xl font-black h-9 px-5 bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
            onClick={handleComplete}
            disabled={completeMutation.isPending}
          >
            <CheckCircle2 size={14} className="mr-1.5" strokeWidth={3} />
            Hoàn thành
          </Button>
        )}
      </div>
    </div>
  );
});

// ─── Main Export ───────────────────────────────────────────────────────────────

export function UpcomingLessons() {
  const { data: response, isLoading } = useGetMySessions({ 
    size: 5,
    // StartTime can be added here once backend supports ISO strings for current day
  });

  // Filter lessons that are upcoming (PENDING or CONFIRMED)
  // In a real app, the API should handle this through the 'status' param
  const lessons = useMemo(
    () => response?.content?.filter((s) => s.status === "PENDING" || s.status === "CONFIRMED") || [],
    [response?.content]
  );
  const lessonCards = useMemo(
    () => lessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} index={index} />),
    [lessons]
  );

  return (
    <section className="xl:col-span-3 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-black text-foreground tracking-tight">Lịch dạy sắp tới</h2>
        </div>
        <Link
          href="/dashboard/tutor/schedule"
          className="group flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-all"
        >
          Toàn bộ lịch dạy
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 w-full animate-pulse rounded-4xl bg-muted" />
          ))
        ) : (
          <>
            {lessonCards}
            {lessons.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-4xl border border-dashed border-border bg-muted/20">
                 <CalendarCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                 <p className="text-muted-foreground font-medium">Bạn chưa có lịch dạy nào sắp tới.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
