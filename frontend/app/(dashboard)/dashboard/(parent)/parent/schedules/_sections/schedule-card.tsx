"use client";

import { useState } from "react";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { ISession, SessionStatus } from "@/server/_types/session-type";
import { formatSessionTime, formatSessionDate } from "@/shared/lib/date-utils";
import { vi } from "date-fns/locale";
import { useCancelSession } from "@/server/_actions/session-action";
import { toast } from "sonner";
import { SessionDetailModal } from "@/shared/components/modals/session-detail-modal";
import { CancelSessionDialog } from "@/shared/components/modals/cancel-session-dialog";
import { Clock, MoreVertical, Video } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";

interface ScheduleCardProps {
  session: ISession;
}

const getStatusInfo = (status: SessionStatus) => {
  switch (status) {
    case "PENDING":
      return { label: "Chờ xác nhận", class: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20", variant: "pending" };
    case "CONFIRMED":
      return { label: "Đã xác nhận", class: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20", variant: "confirmed" };
    case "COMPLETED":
      return { label: "Đã hoàn thành", class: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20", variant: "completed" };
    case "CANCELLED":
      return { label: "Đã hủy", class: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-500/20", variant: "cancelled" };
    default:
      return { label: "Chờ xác nhận", class: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20", variant: "pending" };
  }
};

export function ScheduleCard({ session }: ScheduleCardProps) {
  const statusInfo = getStatusInfo(session.status);
  const isUpcoming = ["PENDING", "CONFIRMED"].includes(session.status);
  const isCompleted = session.status === "COMPLETED";
  const isCancelled = session.status === "CANCELLED";

  const dayOfWeek = formatSessionDate(session.sessionDate, session.startTime, "eee", { locale: vi, fallback: "N/A" }).toUpperCase();
  const dateValue = formatSessionDate(session.sessionDate, session.startTime, "dd", { fallback: "--" });

  const startTime = formatSessionTime(session.sessionDate, session.startTime, "--:--");
  const endTime = formatSessionTime(session.sessionDate, session.endTime, "--:--");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const { mutate: cancelSession, isPending: isCancelling } = useCancelSession();

  const handleCancelConfirm = (reason: string) => {
    cancelSession(
      { id: session.id, reason },
      {
        onSuccess: () => {
          toast.success("Đã hủy buổi học thành công");
          setIsCancelOpen(false);
        },
        onError: (error: any) => {
          toast.error(formatErrorMessage(error, "Không thể hủy buổi học"));
        },
      }
    );
  };

  return (
    <>
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group relative flex flex-col md:flex-row md:items-center gap-6 rounded-4xl bg-card p-5 shadow-sm border border-border hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 cursor-pointer"
      >
        {/* Date Badge */}
        <div className={cn(
          "flex flex-col items-center justify-center w-24 h-24 rounded-3xl shrink-0 transition-all duration-500 group-hover:scale-105 shadow-lg",
          isUpcoming 
            ? "bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20" 
            : "bg-muted text-muted-foreground border border-border"
        )}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{dayOfWeek}</span>
          <span className="text-3xl font-black">{dateValue}</span>
        </div>

        {/* Main Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <h3 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                {session.subjectName || "Môn học chưa xác định"}
              </h3>
              <div className="flex items-center gap-2">
                 <span className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  statusInfo.class
                )}>
                  {statusInfo.label}
                </span>
                {session.studentName && (
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-1 rounded-md">
                    HS: {session.studentName}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted md:hidden"
            >
              <MoreVertical size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/50 group-hover:border-primary/20 transition-all">
              <Clock size={16} strokeWidth={2.5} className="text-primary/70" />
              <span className="text-xs font-black text-foreground/80 tracking-wide uppercase whitespace-nowrap">
                {startTime} - {endTime}
              </span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/50 group-hover:border-primary/20 transition-all min-w-0">
              <Avatar className="h-5 w-5 shrink-0 border border-border/50">
                <AvatarImage src={session.tutorAvatar} />
                <AvatarFallback className="text-[8px] font-black">{session.tutorName?.charAt(0) || "T"}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-black text-foreground/80 tracking-wide uppercase truncate">
                {session.tutorName || `Gia sư #${session.tutorId}`}
              </span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/50 group-hover:border-primary/20 transition-all min-w-0">
               <div className="flex items-center gap-2.5">
                  <Video size={16} strokeWidth={2.5} className="text-primary/70" />
                  <span className="text-xs font-black text-primary tracking-widest uppercase cursor-pointer hover:underline underline-offset-4 decoration-2">Học Trực Tuyến</span>
                </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-stretch gap-2.5 pt-4 md:pt-0 md:pl-8 md:border-l border-border/50 shrink-0 md:min-w-45">
          {isUpcoming && (
            <>
              <button 
                type="button"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "w-full h-12 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-white rounded-2xl transition-all active:scale-95 shadow-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                )}
              >
                Vào học
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailOpen(true);
                  }}
                  className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/60 hover:bg-muted/50 hover:text-foreground rounded-xl transition-all"
                >
                  Chi tiết
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCancelOpen(true);
                  }}
                  className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all active:scale-95"
                >
                  Hủy
                </button>
              </div>
            </>
          )}

          {isCompleted && (
            <div className="space-y-2">
              <div className="w-full text-center py-3 px-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 mb-2">
                <p className="text-[10px] md:text-[11px] font-black text-emerald-600 uppercase tracking-widest">Hoàn thành</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailOpen(true);
                }}
                className="w-full h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/60 hover:bg-muted/50 hover:text-foreground rounded-xl transition-all"
              >
                Chi tiết
              </button>
            </div>
          )}

          {isCancelled && (
            <div className="space-y-2">
              <div className="w-full h-11 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 border border-dashed border-border bg-muted/20 rounded-xl cursor-not-allowed">
                Đã hủy
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailOpen(true);
                }}
                className="w-full h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/60 hover:bg-muted/50 hover:text-foreground rounded-xl transition-all"
              >
                Chi tiết
              </button>
            </div>
          )}
        </div>
      </div>

      <SessionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        session={session}
        role="parent"
      />

      <CancelSessionDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        isPending={isCancelling}
      />
    </>
  );
}
