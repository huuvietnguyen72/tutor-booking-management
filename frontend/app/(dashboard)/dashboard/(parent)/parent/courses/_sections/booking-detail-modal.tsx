"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/shared/components/ui/dialog";
import { useDeclineBooking, usePauseBooking, useResumeBooking } from "@/server/_actions/booking-action";
import { 
  Calendar, 
  Clock, 
  GraduationCap, 
  User, 
  BookOpen, 
  MapPin, 
  AlertCircle,
  Loader2,
  ListTodo,
  PauseCircle,
  PlayCircle
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { IBooking } from "@/server/_types/booking-type";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import Image from "next/image";

interface BookingDetailModalProps {
  booking: IBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDetailModal = ({ booking, isOpen, onClose }: BookingDetailModalProps) => {
  const { mutate: cancelBooking, isPending: isCancelling } = useDeclineBooking();
  const { mutate: pauseBooking, isPending: isPausing } = usePauseBooking();
  const { mutate: resumeBooking, isPending: isResuming } = useResumeBooking();
  
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showConfirmPause, setShowConfirmPause] = useState(false);
  const [showConfirmResume, setShowConfirmResume] = useState(false);

  const handleCancel = () => {
    if (!booking?.id) return;
    cancelBooking(booking.id, {
      onSuccess: () => {
        toast.success("Đã hủy khóa học thành công");
        setShowConfirmCancel(false);
        onClose();
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Không thể hủy khóa học"));
      }
    });
  };

  const handlePause = () => {
    if (!booking?.id) return;
    pauseBooking(booking.id, {
      onSuccess: () => {
        toast.success("Đã tạm dừng khóa học thành công");
        setShowConfirmPause(false);
        onClose();
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Không thể tạm dừng khóa học"));
      }
    });
  };

  const handleResume = () => {
    if (!booking?.id) return;
    resumeBooking(booking.id, {
      onSuccess: () => {
        toast.success("Đã tiếp tục khóa học thành công");
        setShowConfirmResume(false);
        onClose();
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Không thể tiếp tục khóa học"));
      }
    });
  };
  const getDayName = (day: number) => {
    const days = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return days[day - 1] || `Thứ ${day}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl rounded-3xl p-0 border-none shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
          
          <DialogHeader className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen size={24} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-foreground">
                  Chi tiết <span className="text-primary italic">khóa học</span>
                </DialogTitle>
                <DialogDescription className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  Mã hợp đồng: #{booking?.id}
                  {booking?.status && (
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase", 
                      booking.status === "ACTIVE" || booking.status === "PENDING_PAYMENTS" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                      booking.status === "WAITING_TUTOR_CONFIRM" ? "text-slate-500 bg-slate-500/10 border-slate-500/20" :
                      booking.status === "PENDING" ? "text-slate-500 bg-slate-500/10 border-slate-500/20" :
                      booking.status === "PAUSED" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                      booking.status === "COMPLETED" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                      booking.status === "CANCELLED" ? "text-rose-500 bg-rose-500/10 border-rose-500/20" :
                      "text-slate-500 bg-slate-500/10 border-slate-500/20"
                    )}>
                      {booking.status === "ACTIVE" || booking.status === "PENDING_PAYMENTS" ? "Đang học" :
                       booking.status === "WAITING_TUTOR_CONFIRM" ? "Chờ xác nhận" :
                       booking.status === "PENDING" ? "Chờ duyệt" :
                       booking.status === "PAUSED" ? "Tạm dừng" :
                       booking.status === "COMPLETED" ? "Hoàn thành" :
                       booking.status === "CANCELLED" ? "Đã hủy" : "---"}
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {!booking ? (
            <div className="p-8 text-center text-muted-foreground font-bold italic">Đang tải thông tin...</div>
          ) : (
            <div className="p-8 pt-4 max-h-[70vh]">
              {/* Progress Tracker */}
              <div className="mb-8 rounded-3xl bg-primary/5 dark:bg-primary/10 p-6 border border-primary/10 dark:border-primary/20">
                {(() => {
                  const totalSessions = Math.max(booking.sessions?.length || 0, booking.totalSessions || 0);
                  const completedSessions = booking.sessions?.filter(s => s.status === "COMPLETED" || s.status === "CONFIRMED").length || booking.completedSessions || 0;
                  const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          <span className="text-sm font-black uppercase text-foreground">Tiến độ học tập</span>
                        </div>
                        <span className="text-sm font-black text-primary">
                          {completedSessions}/{totalSessions} Buổi
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted border border-border/50 p-0.5 shadow-inner">
                        <div 
                          className="h-full rounded-full bg-linear-to-r from-primary to-primary-foreground shadow-lg transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tutor & Student Info */}
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                      <User size={14} className="text-primary" /> Thông tin gia sư
                    </h4>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 dark:bg-muted/20 border border-border/50">
                      <div className="h-10 w-10 relative rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-black text-primary">
                        <Image
                          src={booking?.tutorAvatar || "https://api.dicebear.com/7.x/avataaars/png?seed=" + booking.tutorName}
                          alt={booking.tutorName || "Tutor"}
                          fill
                          sizes="40px"
                          className="object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">{booking.tutorName || "Gia sư"}</p>
                        <p className="text-xs font-medium text-muted-foreground italic">Gia sư chuyên nghiệp</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                      <GraduationCap size={14} className="text-primary" /> Học viên
                    </h4>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 dark:bg-muted/20 border border-border/50">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center font-black text-amber-600 dark:text-amber-500">
                        {booking.studentName?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">{booking.studentName}</p>
                        <p className="text-xs font-medium text-muted-foreground italic">Khối {booking.gradeLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                      <MapPin size={14} className="text-primary" /> Hình thức & Địa chỉ
                    </h4>
                    <div className="p-4 rounded-2xl bg-muted/50 dark:bg-muted/20 border border-border/50">
                      <p className="text-sm font-black text-foreground mb-1">
                        {booking.teachingMode === "ONLINE" ? "Học trực tuyến (Online)" : "Học tại nhà (Offline)"}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                        Phí: <span className="text-primary font-bold">{booking.pricePerSession?.toLocaleString("vi-VN")}đ</span> / buổi
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                      <Calendar size={14} className="text-primary" /> Lịch học ổn định
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {booking.schedules && booking.schedules.length > 0 ? (
                        booking.schedules.map((s, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20 text-[11px] font-black text-primary">
                            {getDayName(s.dayOfWeek)} • {s.startTime.substring(0, 5)} - {s.endTime.substring(0, 5)}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Chưa cập nhật lịch học</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Range Section */}
              <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Ngày bắt đầu</p>
                  <p className="text-sm font-bold text-foreground">
                    {(booking.startDate || booking.recurringStartDate) ? new Date(booking.startDate || booking.recurringStartDate).toLocaleDateString("vi-VN", { dateStyle: "long" }) : "---"}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Ngày kết thúc dự kiến</p>
                  <p className="text-sm font-bold text-foreground">
                    {(booking.endDate || booking.recurringEndDate) ? new Date(booking.endDate || booking.recurringEndDate).toLocaleDateString("vi-VN", { dateStyle: "long" }) : "---"}
                  </p>
                </div>
              </div>

              {/* Sessions Section */}
              {booking.sessions && booking.sessions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                    <ListTodo size={14} className="text-primary" /> Chi tiết {booking.sessions.length} buổi học
                  </h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {booking.sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 dark:bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-primary/10 dark:bg-primary/20 min-w-[50px] border border-primary/10">
                            <span className="text-[10px] font-black uppercase text-primary">Th {new Date(session.sessionDate).getMonth() + 1}</span>
                            <span className="text-sm font-black text-primary leading-none">{new Date(session.sessionDate).getDate()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground">
                              {session.startTime.substring(0, 5)} - {session.endTime.substring(0, 5)}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground italic">ID: #{session.id}</p>
                          </div>
                        </div>
                        <div>
                          <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase", 
                            session.status === "PENDING" ? "text-slate-500 bg-slate-500/10 border border-slate-500/20" :
                            session.status === "CONFIRMED" ? "text-blue-500 bg-blue-500/10 border border-blue-500/20" :
                            session.status === "COMPLETED" ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" :
                            "text-rose-500 bg-rose-500/10 border border-rose-500/20"
                          )}>
                            {session.status === "PENDING" ? "Sắp tới" :
                             session.status === "CONFIRMED" ? "Đã dạy" :
                             session.status === "COMPLETED" ? "Đã chốt" : "Đã hủy"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="p-8 bg-muted/30 dark:bg-muted/10 border-t border-border/50 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-border font-black text-xs uppercase tracking-widest text-foreground transition-all duration-300 hover:bg-muted active:scale-95"
            >
              Đóng
            </button>
            {booking && booking.status === "ACTIVE" && (
              <button 
                onClick={() => setShowConfirmPause(true)}
                className="flex-1 px-6 py-4 rounded-2xl bg-amber-500 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-amber-500/20 transition-all duration-300 hover:bg-amber-600 active:scale-95 flex justify-center items-center gap-2"
              >
                Tạm dừng
              </button>
            )}
            {booking && booking.status === "PAUSED" && (
              <button 
                onClick={() => setShowConfirmResume(true)}
                className="flex-1 px-6 py-4 rounded-2xl bg-blue-500 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:bg-blue-600 active:scale-95 flex justify-center items-center gap-2"
              >
                Tiếp tục
              </button>
            )}
            {booking && (booking.status === "ACTIVE" || booking.status === "PAUSED" || booking.status === "WAITING_TUTOR_CONFIRM") && (
              <button 
                onClick={() => setShowConfirmCancel(true)}
                className="flex-1 px-6 py-4 rounded-2xl bg-rose-500 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-rose-500/20 transition-all duration-300 hover:bg-rose-600 active:scale-95"
              >
                Hủy khóa học
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Cancellation */}
      <Dialog open={showConfirmCancel} onOpenChange={setShowConfirmCancel}>
        <DialogContent className="max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-500 animate-bounce-slow">
              <AlertCircle size={40} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-foreground mb-2">
                Xác nhận hủy <span className="text-rose-500">khóa học</span>?
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                Hành động này không thể hoàn tác. Khóa học sẽ bị dừng ngay lập tức và gia sư sẽ được thông báo. Bạn có chắc chắn muốn tiếp tục?
              </DialogDescription>
            </div>
            <div className="flex w-full gap-4 pt-2">
              <button 
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-border font-black text-xs uppercase tracking-widest text-foreground transition-all duration-300 hover:bg-muted active:scale-95"
                disabled={isCancelling}
              >
                Giữ lại
              </button>
              <button 
                onClick={handleCancel}
                className="flex-1 px-6 py-4 rounded-2xl bg-rose-500 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-rose-500/20 transition-all duration-300 hover:bg-rose-600 active:scale-95 flex items-center justify-center gap-2"
                disabled={isCancelling}
              >
                {isCancelling && <Loader2 size={16} className="animate-spin" />}
                {isCancelling ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Pause */}
      <Dialog open={showConfirmPause} onOpenChange={setShowConfirmPause}>
        <DialogContent className="max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 animate-bounce-slow">
              <PauseCircle size={40} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-foreground mb-2">
                Tạm dừng <span className="text-amber-500">khóa học</span>?
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                Tạm dừng khóa học sẽ hủy tất cả các buổi học sắp tới có trong lịch để trống thời gian cho gia sư. Những buổi học trong quá khứ không bị ảnh hưởng. Bạn có muốn tạm dừng không?
              </DialogDescription>
            </div>
            <div className="flex w-full gap-4 pt-2">
              <button 
                onClick={() => setShowConfirmPause(false)}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-border font-black text-xs uppercase tracking-widest text-foreground transition-all duration-300 hover:bg-muted active:scale-95"
                disabled={isPausing}
              >
                Hủy
              </button>
              <button 
                onClick={handlePause}
                className="flex-1 px-6 py-4 rounded-2xl bg-amber-500 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-amber-500/20 transition-all duration-300 hover:bg-amber-600 active:scale-95 flex items-center justify-center gap-2"
                disabled={isPausing}
              >
                {isPausing && <Loader2 size={16} className="animate-spin" />}
                {isPausing ? "Đang xử lý..." : "Xác nhận tạm dừng"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Resume */}
      <Dialog open={showConfirmResume} onOpenChange={setShowConfirmResume}>
        <DialogContent className="max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-500 animate-bounce-slow">
              <PlayCircle size={40} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-foreground mb-2">
                Tiếp tục <span className="text-blue-500">khóa học</span>?
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                Khi tiếp tục khóa học, hệ thống sẽ tự động tạo lại các buổi học dựa trên lịch học hiện tại cho số buổi học còn lại. Bạn có chắc chắn muốn tiếp tục không?
              </DialogDescription>
            </div>
            <div className="flex w-full gap-4 pt-2">
              <button 
                onClick={() => setShowConfirmResume(false)}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-border font-black text-xs uppercase tracking-widest text-foreground transition-all duration-300 hover:bg-muted active:scale-95"
                disabled={isResuming}
              >
                Hủy
              </button>
              <button 
                onClick={handleResume}
                className="flex-1 px-6 py-4 rounded-2xl bg-blue-500 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:bg-blue-600 active:scale-95 flex items-center justify-center gap-2"
                disabled={isResuming}
              >
                {isResuming && <Loader2 size={16} className="animate-spin" />}
                {isResuming ? "Đang xử lý..." : "Xác nhận tiếp tục"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
