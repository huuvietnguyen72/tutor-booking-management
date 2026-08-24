"use client";

import { Calendar, Clock, User, Video, Info } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { ISession } from "@/server/_types/session-type";
import { formatSessionDate, formatSessionTime } from "@/shared/lib/date-utils";
import { vi } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useAddSessionNote } from "@/server/_actions/session-action";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save, FileText } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ISession | null;
  role: "parent" | "tutor";
}

export function SessionDetailModal({ isOpen, onClose, session, role }: SessionDetailModalProps) {
  const [note, setNote] = useState(session?.sessionNote || "");
  const [isEditing, setIsEditing] = useState(false);
  const addNoteMutation = useAddSessionNote();

  useEffect(() => {
    if (session) {
      setNote(session.sessionNote || "");
    }
  }, [session]);

  if (!session) return null;

  const dayOfWeek = formatSessionDate(session.sessionDate, session.startTime, "EEEE", { locale: vi, fallback: "N/A" });
  const dateStr = formatSessionDate(session.sessionDate, session.startTime, "dd/MM/yyyy", { fallback: "--/--/----" });
  const startTime = formatSessionTime(session.sessionDate, session.startTime, "--:--");
  const endTime = formatSessionTime(session.sessionDate, session.endTime, "--:--");

  const handleSaveNote = () => {
    const toastId = toast.loading("Đang cập nhật tiến độ...");
    addNoteMutation.mutate(
      { id: session.id, note },
      {
        onSuccess: () => {
          toast.success("Đã cập nhật tiến độ buổi học!", { id: toastId });
          setIsEditing(false);
        },
        onError: () => {
          toast.error("Lỗi khi cập nhật tiến độ. Vui lòng thử lại.", { id: toastId });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 border-none bg-card rounded-[2.5rem] shadow-2xl">
        {/* Header with Background */}
        <div className="relative h-32 bg-linear-to-br from-primary/10 via-primary/5 to-background border-b border-border/10">
          <div className="absolute inset-0 flex items-center justify-center pt-8">
            <div className="flex flex-col items-center">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-foreground tracking-tight text-center">
                  Chi tiết buổi học
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">
                {session.subjectName || "Môn học"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Time & Date Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-muted/30 border border-border/50 space-y-1">
              <p className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                <Calendar size={14} className="text-primary" /> Ngày học
              </p>
              <p className="text-sm font-black text-foreground capitalize">{dayOfWeek}</p>
              <p className="text-xs font-bold text-muted-foreground">{dateStr}</p>
            </div>
            <div className="p-4 rounded-3xl bg-muted/30 border border-border/50 space-y-1">
              <p className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                <Clock size={14} className="text-primary" /> Thời gian
              </p>
              <p className="text-sm font-black text-foreground">{startTime} - {endTime}</p>
              <p className="text-xs font-bold text-muted-foreground">Thời lượng: 2h</p>
            </div>
          </div>

          {/* Participant Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
              {role === "parent" ? "Gia sư hướng dẫn" : "Học sinh học tập"}
            </h4>
            <div className="flex items-center justify-between p-4 rounded-3xl bg-card border border-border shadow-sm ring-1 ring-border/5">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                  <AvatarImage src={role === "parent" ? session.tutorAvatar : session.studentAvatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-black">
                    {(role === "parent" ? session.tutorName : session.studentName)?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black text-foreground">
                    {role === "parent" ? session.tutorName : session.studentName}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {role === "parent" ? "Professional Tutor" : `HS: ${session.studentName}`}
                  </p>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
                <User size={20} />
              </div>
            </div>
          </div>

          {/* Additional Info & Progress Section */}
          <div className="grid grid-cols-1 gap-6">
             <div className="flex items-center gap-3 p-4 rounded-3xl bg-muted/20 border border-border/50">
               <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                 <Video size={18} strokeWidth={2.5} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phương thức học</p>
                  <p className="text-sm font-black text-foreground">Trực tuyến qua Google Meet</p>
               </div>
             </div>

             {/* Session Progress / Notes Section */}
             <div className="p-5 rounded-4xl bg-card border border-border shadow-sm ring-1 ring-border/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tiến độ & Nội dung học</p>
                  </div>
                  {role === "tutor" && !isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] font-black text-primary uppercase border-b border-primary/30 hover:border-primary transition-all"
                    >
                      {session.sessionNote ? "Chỉnh sửa" : "Thêm nội dung"}
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Nhập tiến độ buổi học, nội dung đã dạy hoặc bài tập về nhà..."
                      className="min-h-30 rounded-2xl border-border bg-muted/10 font-medium text-sm focus:ring-1 focus:ring-primary/50"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button 
                        onClick={() => {
                          setIsEditing(false);
                          setNote(session.sessionNote || "");
                        }}
                        className="flex-1 h-10 rounded-xl bg-muted text-foreground text-[10px] font-black uppercase tracking-widest transition-all"
                       >
                         Hủy
                       </button>
                       <button 
                        onClick={handleSaveNote}
                        disabled={addNoteMutation.isPending}
                        className="flex-2 h-10 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:scale-[1.02] disabled:opacity-50"
                       >
                         {addNoteMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                         Lưu tiến độ
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className={cn(
                    "min-h-15 p-4 rounded-2xl border border-border/40",
                    session.sessionNote ? "bg-muted/5" : "bg-muted/10 border-dashed"
                  )}>
                    {session.sessionNote ? (
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {session.sessionNote}
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-muted-foreground italic text-center py-2">
                        {role === "tutor" ? "Bạn chưa cập nhật tiến độ cho buổi học này." : "Gia sư chưa cập nhật nội dung học."}
                      </p>
                    )}
                  </div>
                )}
             </div>
             
             {session.cancelReason && (
                <div className="p-4 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-red-500" />
                    <p className="text-[10px] font-black text-red-500/80 uppercase tracking-widest">Lý do hủy buổi</p>
                  </div>
                  <p className="text-sm font-medium text-foreground italic">"{session.cancelReason}"</p>
                </div>
              )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-2">
             <button 
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl bg-muted text-foreground text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/80 active:scale-95"
             >
                Đóng
             </button>
             {session.status === "CONFIRMED" && (
                <button className="flex-1 h-12 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                  Vào học
                </button>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
