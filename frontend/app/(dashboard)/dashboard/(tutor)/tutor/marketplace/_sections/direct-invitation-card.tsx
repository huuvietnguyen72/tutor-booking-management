"use client";

import { useRespondToInvitation } from "@/server/_actions/booking-action";
import { IDirectInvitation } from "@/server/_types/marketplace-type";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card"; 
import { User, BookOpen, GraduationCap, DollarSign, Calendar, MessageSquare, Check, X, Quote } from "lucide-react";
import { toast } from "sonner";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { useState, useEffect } from "react";

interface DirectInvitationCardProps {
  invitation: IDirectInvitation;
}

export function DirectInvitationCard({ invitation }: DirectInvitationCardProps) {
  const { mutate: respond, isPending } = useRespondToInvitation();
  const [localStatus, setLocalStatus] = useState(invitation.status);

  useEffect(() => {
    setLocalStatus(invitation.status);
  }, [invitation.status]);

  const handleRespond = (status: "ACCEPTED" | "DECLINED") => {
    const toastId = toast.loading("Đang xử lý...");
    respond({ id: invitation.id, status }, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message, { id: toastId });
        setLocalStatus(status);
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Có lỗi xảy ra, vui lòng thử lại."), { id: toastId });
      }
    });
  };

  const statusColors: Record<IDirectInvitation["status"], string> = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    ACCEPTED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    DECLINED: "bg-red-500/10 text-red-500 border-red-500/20",
    PENDING_PAYMENTS: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <Card className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-0.5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      {/* Top Background Decor */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="relative p-5 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Avatar & Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-primary to-primary/60 p-0.5 rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-md shadow-primary/10">
                    <div className="h-full w-full rounded-[0.9rem] bg-background flex items-center justify-center overflow-hidden -rotate-3 group-hover:-rotate-6 transition-transform duration-500">
                      <img 
                        src={invitation.parentAvatar || `https://api.dicebear.com/7.x/avataaars/png?seed=${invitation.parentName}`} 
                        alt={invitation.parentName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-background" />
                </div>
                
                <div>
                  <h3 className="text-lg font-black text-foreground tracking-tight leading-tight">{invitation.parentName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="rounded-full font-black text-[8px] uppercase tracking-widest px-1.5 py-0 border-primary/20 text-primary bg-primary/5">
                      CMHS
                    </Badge>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight opacity-70">
                      {new Date(invitation.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              <Badge className={cn("rounded-xl font-black text-[9px] uppercase tracking-widest px-3 py-1 shadow-xs", statusColors[localStatus])}>
                {localStatus === "PENDING" ? "Chờ phản hồi" : 
                 localStatus === "ACCEPTED" || localStatus === "PENDING_PAYMENTS" ? "Đã đồng ý" : 
                 "Đã từ chối"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-y border-border/40">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Môn học</p>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={12} className="text-primary/70" />
                  <span className="text-xs font-black text-foreground">{invitation.subjectName}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Học sinh</p>
                <div className="flex items-center gap-1.5">
                  <User size={12} className="text-primary/70" />
                  <span className="text-xs font-black text-foreground">{invitation.studentName}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Khối</p>
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={12} className="text-primary/70" />
                  <span className="text-xs font-black text-foreground">{invitation.grade}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Học phí</p>
                <div className="flex items-center gap-1.5">
                  <DollarSign size={12} className="text-emerald-500" />
                  <span className="text-xs font-black text-emerald-600">
                    {invitation.budget.toLocaleString()}đ/buổi
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group/msg">
              <Quote size={18} className="absolute -top-2 -left-1.5 text-primary/10 -scale-x-100 z-10 transition-colors group-hover/msg:text-primary/20" />
              <div className="rounded-xl bg-muted/20 p-4 border border-border/30 backdrop-blur-[2px]">
                <p className="text-xs text-muted-foreground font-medium underline-offset-4 decoration-primary/10 leading-relaxed italic line-clamp-2 hover:line-clamp-none transition-all cursor-help">
                  "{invitation.message}"
                </p>
              </div>
            </div>

          </div>

          {/* Right Side: Actions */}
          {localStatus === "PENDING" && (
            <div className="flex md:flex-col gap-3 justify-center shrink-0 md:w-40 border-l border-transparent md:border-border/30 md:pl-6">
              <Button
                onClick={() => handleRespond("ACCEPTED")}
                disabled={isPending}
                className="flex-1 h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all gap-2 group/btn"
              >
                {isPending ? (
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check size={14} className="group-hover/btn:scale-110 transition-transform" />
                )}
                {isPending ? "Đang xử lý..." : "Chấp nhận"}
              </Button>
              <Button
                onClick={() => handleRespond("DECLINED")}
                disabled={isPending}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-border/50 bg-card font-black uppercase tracking-widest text-[9px] hover:bg-red-50 text-red-500 hover:text-red-600 hover:border-red-100 transition-all gap-2"
              >
                {isPending ? (
                  <div className="h-3 w-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <X size={14} />
                )}
                {isPending ? "..." : "Từ chối"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
