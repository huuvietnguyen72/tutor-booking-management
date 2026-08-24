"use client";

import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { 
  Clock, 
  MapPin, 
  MoreVertical, 
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Check,
  Info
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { ISession, SessionStatus } from "@/server/_types/session-type";
import { vi } from "date-fns/locale";
import { formatSessionTime, formatSessionDate } from "@/shared/lib/date-utils";
import { useConfirmSession, useCompleteSession, useCancelSession } from "@/server/_actions/session-action";
import { toast } from "sonner";
import { Dropdown } from "@/shared/components/ui/dropdown";
import { SessionDetailModal } from "@/shared/components/modals/session-detail-modal";
import { CancelSessionDialog } from "@/shared/components/modals/cancel-session-dialog";
import { useToggle } from "@/shared/hooks/use-toggle"; 

interface ScheduleCardProps {
  session: ISession;
}

const statusConfig: Record<SessionStatus, { label: string; icon: any; color: string; bg: string; border: string }> = {
  PENDING: {
    label: "Chờ xác nhận",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: CalendarCheck,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
};

export function ScheduleCard({ session }: ScheduleCardProps) {
  const config = statusConfig[session.status] || statusConfig.PENDING;

  const detailDialog = useToggle(false);
  const cancelDialog = useToggle(false);

  const confirmMutation = useConfirmSession();
  const completeMutation = useCompleteSession();
  const cancelMutation = useCancelSession();

  const startStr = formatSessionTime(session.sessionDate, session.startTime, "--:--");
  const endStr = formatSessionTime(session.sessionDate, session.endTime, "--:--");
  const dayStr = formatSessionDate(session.sessionDate, session.startTime, "EEEE", { locale: vi, fallback: "N/A" }).toUpperCase();
  const dateStr = formatSessionDate(session.sessionDate, session.startTime, "dd", { fallback: "--" });
  const monthStr = formatSessionDate(session.sessionDate, session.startTime, "MM", { fallback: "--" });

  const handleConfirm = () => {
    const toastId = toast.loading("Đang xác nhận dạy...");
    confirmMutation.mutate(session.id, {
      onSuccess: () => toast.success("Đã xác nhận buổi dạy!", { id: toastId }),
      onError: (error: any) => toast.error(formatErrorMessage(error, "Lỗi khi xác nhận. Vui lòng thử lại."), { id: toastId }),
    });
  };

  const handleComplete = () => {
    const toastId = toast.loading("Đang đánh dấu hoàn thành...");
    completeMutation.mutate(session.id, {
      onSuccess: () => toast.success("Đã hoàn thành buổi dạy!", { id: toastId }),
      onError: (error: any) => toast.error(formatErrorMessage(error, "Lỗi khi cập nhật. Vui lòng thử lại."), { id: toastId }),
    });
  };

  const handleCancelConfirm = (reason: string) => {
    const toastId = toast.loading("Đang hủy buổi học...");
    cancelMutation.mutate({ id: session.id, reason }, {
      onSuccess: () => {
        toast.success("Đã hủy buổi học!", { id: toastId });
          cancelDialog.close();
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Lỗi khi hủy. Vui lòng thử lại."), { id: toastId });
      },
    });
  };

  const isPendingAction = confirmMutation.isPending || completeMutation.isPending || cancelMutation.isPending;

  return (
    <>
      <div 
        onClick={detailDialog.open}
        className="group relative bg-muted/5 hover:bg-muted/10 border border-border/50 rounded-3xl md:rounded-4xl p-4 md:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.99] cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          
          {/* Date Ticket Section */}
          <div className="flex flex-row md:flex-col items-center md:justify-center md:w-24 shrink-0 gap-3 md:gap-0 md:border-r border-border/40 md:pr-6">
            <div className="flex flex-col items-center justify-center bg-primary/5 md:bg-transparent rounded-2xl md:rounded-none p-3 md:p-0 min-w-20 md:min-w-fit border border-primary/10 md:border-none">
              <span className="text-[10px] md:text-xs font-black text-primary/70 md:text-muted-foreground uppercase tracking-widest leading-none">
                {dayStr}
              </span>
              <span className="text-2xl md:text-3xl font-black text-foreground tabular-nums leading-none mt-1">
                {dateStr}
              </span>
              <span className="text-[9px] md:text-[10px] font-black text-primary/60 uppercase tracking-tighter leading-none mt-1">
                THÁNG {monthStr}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 md:py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider border",
                    config.color, config.bg, config.border
                  )}>
                    <config.icon size={10} className="md:w-3 md:h-3" strokeWidth={3} />
                    {config.label}
                  </span>
                  {session.isPaid && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 md:py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] md:text-[10px] font-black uppercase tracking-wider">
                      Đã thanh toán
                    </span>
                  )}
                </div>
                <h4 className="text-base md:text-[17px] font-black text-foreground tracking-tight truncate mb-1 group-hover:text-primary transition-colors capitalize">
                  {session.subjectName || "Môn học chưa xác định"} - Lớp {session.gradeLevel || "N/A"}
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground/80">
                  <Avatar className="h-4 w-4 md:h-5 md:w-5 border border-border/50 shrink-0">
                    <AvatarImage src={session.studentAvatar} />
                    <AvatarFallback className="text-[8px] font-black">{session.studentName?.charAt(0) || "S"}</AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] md:text-sm font-bold truncate">Học sinh: {session.studentName || "Chưa xác định"}</span>
                </div>
              </div>
              
              <Dropdown
                trigger={
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-muted-foreground/40 hover:text-foreground hover:bg-muted rounded-xl transition-all shrink-0 font-bold"
                  >
                    <MoreVertical size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
                  </button>
                }
                align="right"
              >
                <div className="flex flex-col min-w-50 bg-card border border-border/60 shadow-2xl rounded-2xl overflow-hidden p-1.5 animate-in zoom-in-95 duration-200">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      detailDialog.open();
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Info size={16} />
                    Xem chi tiết
                  </button>
                  {session.status === "PENDING" && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm();
                      }}
                      disabled={isPendingAction}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] text-amber-600 hover:bg-amber-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      Xác nhận dạy
                    </button>
                  )}
                  {session.status === "CONFIRMED" && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComplete();
                      }}
                      disabled={isPendingAction}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Đánh dấu Hoàn thành
                    </button>
                  )}
                  {(session.status === "PENDING" || session.status === "CONFIRMED") && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelDialog.open();
                      }}
                      disabled={isPendingAction}
                      className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-[13px] text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-2"
                    >
                      <XCircle size={16} />
                      Hủy buổi học
                    </button>
                  )}
                </div>
              </Dropdown>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-x-6 gap-y-2 pt-3 border-t border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg md:rounded-xl bg-primary/5 text-primary shrink-0">
                  <Clock size={14} className="md:w-4 md:h-4" strokeWidth={2.5} />
                </div>
                <span className="text-[13px] md:text-sm font-black tracking-tight tabular-nums">
                  {startStr} - {endStr}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground min-w-0 flex-1">
                <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-lg md:rounded-xl bg-primary/5 text-primary">
                  <MapPin size={14} className="md:w-4 md:h-4" strokeWidth={2.5} />
                </div>
                <span className="text-[12px] md:text-sm font-bold truncate tracking-tight">
                  {session.sessionNote || "Chưa có ghi chú địa điểm/hình thức"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button Section */}
          <div className="mt-4 md:mt-0 md:pl-8 md:border-l border-border/50 flex flex-col items-stretch gap-2.5 shrink-0">
            {session.status === "PENDING" ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm();
                }}
                disabled={isPendingAction}
                className="w-full md:min-w-37.5 px-6 py-3 border-none bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:translate-y-0"
              >
                <div className="flex items-center justify-center gap-2">
                  <Check size={16} strokeWidth={3} />
                  <span>Xác nhận dạy</span>
                </div>
              </button>
            ) : session.status === "CONFIRMED" ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                disabled={isPendingAction}
                className="w-full md:min-w-37.5 px-6 py-3 border-none bg-linear-to-r from-sky-500 to-blue-600 text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:translate-y-0"
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} strokeWidth={3} />
                  <span>Hoàn thành</span>
                </div>
              </button>
            ) : null}

            <button 
              onClick={(e) => {
                e.stopPropagation();
                  detailDialog.open();
              }}
              className="w-full md:min-w-37.5 px-6 py-3 bg-muted/30 border border-border/60 hover:border-primary/40 hover:bg-muted/50 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-all active:scale-95 whitespace-nowrap"
            >
              Chi tiết
            </button>
          </div>
        </div>
      </div>

      <SessionDetailModal isOpen={detailDialog.value} onClose={detailDialog.close} session={session} role="tutor" />

      <CancelSessionDialog 
        isOpen={cancelDialog.value}
        onClose={cancelDialog.close}
        onConfirm={handleCancelConfirm}
        isPending={cancelMutation.isPending}
      />
    </>
  );
}
