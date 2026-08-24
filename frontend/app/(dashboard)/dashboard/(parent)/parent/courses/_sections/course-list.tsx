"use client";

import { IBooking, BookingStatus } from "@/server/_types/booking-type";
import { ISession } from "@/server/_types/session-type";
import { 
  Calendar, 
  ChevronRight, 
  GraduationCap, 
  Star, 
  User, 
  Clock,
  MoreVertical,
  Pause,
  Play
} from "lucide-react";
import Image from "next/image";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { memo, useCallback, useMemo, useState } from "react";
import { BookingDetailModal } from "./booking-detail-modal";
import { ReviewModal } from "../../schedules/_sections/review-modal";
import { useSubmitReview } from "@/server/_actions/review-action";
import { toast } from "sonner";

interface CourseListProps {
  courses?: IBooking[];
  isLoading: boolean;
}

export const CourseList = ({ courses, isLoading }: CourseListProps) => {
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<IBooking | null>(null);

  const { mutate: submitReview, isPending: isSubmitting } = useSubmitReview();

  const handleReviewSubmit = useCallback((rating: number, comment: string, tags: string[]) => {
    if (!reviewingBooking) return;

    submitReview(
      {
        bookingId: reviewingBooking.id,
        rating,
        comment: tags.length > 0 ? `[${tags.join(", ")}] ${comment}` : comment,
      },
      {
        onSuccess: () => {
          toast.success("Cảm ơn bạn đã đánh giá!");
          setReviewingBooking(null);
        },
        onError: (error: any) => {
          toast.error(formatErrorMessage(error, "Không thể gửi đánh giá"));
        },
      }
    );
  }, [reviewingBooking, submitReview]);

  const handleCloseSelectedBooking = useCallback(() => setSelectedBooking(null), []);
  const handleCloseReviewingBooking = useCallback(() => setReviewingBooking(null), []);

  const courseCards = useMemo(
    () =>
      courses?.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onViewDetail={() => setSelectedBooking(course)}
          onReview={() => setReviewingBooking(course)}
        />
      )),
    [courses]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-70 w-full rounded-4xl" />
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border-2 border-dashed border-border bg-card/5 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <GraduationCap size={40} />
        </div>
        <h3 className="mt-6 text-xl font-black text-foreground">Chưa có hợp đồng nào</h3>
        <p className="mt-2 max-w-sm font-medium text-muted-foreground">
          Bạn chưa có hợp đồng dạy học nào. Hãy tìm kiếm gia sư phù hợp ngay hôm nay!
        </p>
        <button className="mt-8 rounded-2xl bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105 hover:bg-primary/90">
          Tìm gia sư ngay
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {courseCards}
      </div>

      <BookingDetailModal 
        booking={selectedBooking} 
        isOpen={selectedBooking !== null} 
        onClose={handleCloseSelectedBooking} 
      />

      {reviewingBooking && (
        <ReviewModal
          isOpen={!!reviewingBooking}
          onClose={handleCloseReviewingBooking}
          onSubmit={handleReviewSubmit}
          tutorName={reviewingBooking.tutorName || "Gia sư"}
          subject={reviewingBooking.subjectName || "Môn học"}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};


const CourseCard = ({ 
  course, 
  onViewDetail,
  onReview
}: { 
  course: IBooking; 
  onViewDetail: () => void;
  onReview: () => void;
}) => {
  const statusConfig: Record<BookingStatus, any> = {
    WAITING_TUTOR_CONFIRM: {
      label: "Chờ xác nhận",
      color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
      dot: "bg-slate-500",
    },
    PENDING_PAYMENTS: {
      label: "Đang học",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-500",
    },
    ACTIVE: {
      label: "Đang học",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-500",
    },
    PAUSED: {
      label: "Tạm dừng",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-500",
    },
    COMPLETED: {
      label: "Hoàn thành",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-500",
    },
    CANCELLED: {
      label: "Đã hủy",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      dot: "bg-rose-500",
    },
    PENDING: {
      label: "Chờ duyệt",
      color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
      dot: "bg-slate-500",
    }
  };

  const config = statusConfig[course.status] || statusConfig.PENDING;
  
  // Calculate accurately based on actual sessions (sections)
  const totalSessions = Math.max(course.sessions?.length || 0, course.totalSessions || 0);
  const completedSessions = course.sessions?.filter(s => s.status === "COMPLETED" || s.status === "CONFIRMED").length || course.completedSessions || 0;
  const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  // Check if booking has been reviewed
  const isReviewed = useMemo(() => {
    if (course.status !== "COMPLETED" || !course.sessions) return false;
    const completedSessionsList = course.sessions.filter(s => s.status === "COMPLETED" || s.status === "CONFIRMED");
    return completedSessionsList.length > 0 && completedSessionsList.every(s => s.reviewId);
  }, [course.status, course.sessions]);

  const handleViewDetailClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onViewDetail();
    },
    [onViewDetail]
  );

  const handleReviewClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onReview();
    },
    [onReview]
  );

  return (
    <div 
      onClick={onViewDetail}
      className="group relative cursor-pointer overflow-hidden rounded-4xl border border-border bg-card p-6 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99]"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-background shadow-lg shadow-black/5 ring-1 ring-border/50 bg-muted dark:bg-muted/50 flex items-center justify-center">
            <Image
              src={course.tutorAvatar || "https://api.dicebear.com/7.x/avataaars/png?seed=" + course.tutorName}
              alt={course.tutorName || "Tutor"}
              fill
              sizes="64px"
              className="object-cover rounded-xl"
            />
          </div>
          <div>
            <h4 className="text-[17px] font-black text-foreground tracking-tight underline-offset-4 group-hover:underline">
              {course.tutorName || "Gia sư"}
            </h4>
            <div className="mt-1 flex items-center gap-2">
              <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase", isReviewed && course.status === "COMPLETED" ? "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" : config.color)}>
                {(isReviewed && course.status === "COMPLETED") ? (
                  <>
                    <span className="h-1.5 w-1.5 shadow-sm rounded-full bg-cyan-500" />
                    Đã đánh giá
                  </>
                ) : (
                  <>
                    {config.dot && <span className={cn("h-1.5 w-1.5 shadow-sm rounded-full", config.dot)} />}
                    {config?.label || "---"}
                  </>
                )}
              </div>
              {course.subjectName && (
                <span className="text-xs font-bold text-muted-foreground">• {course.subjectName}</span>
              )}
            </div>
          </div>
        </div>
        <button className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Info Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-3xl bg-muted/50 dark:bg-muted/20 p-4 ring-1 ring-border/5">
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            <User size={12} className="text-primary" /> Học viên
          </p>
          <p className="text-sm font-black text-foreground truncate">{course.studentName}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            <GraduationCap size={12} className="text-primary" /> Lớp
          </p>
          <p className="text-sm font-black text-foreground">Khối {course.gradeLevel}</p>
        </div>
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            <Calendar size={12} className="text-primary" /> Bắt đầu
          </p>
          <p className="text-sm font-black text-foreground">{ (course.startDate || course.recurringStartDate) ? new Date(course.startDate || course.recurringStartDate).toLocaleDateString("vi-VN") : "---"}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
             {course.status === "COMPLETED" ? (
               <><Clock size={12} className="text-primary" /> Kết thúc</>
             ) : (
               <><Clock size={12} className="text-primary" /> Dự kiến</>
             )}
          </p>
          <p className="text-sm font-black text-foreground">{ (course.endDate || course.recurringEndDate) ? new Date(course.endDate || course.recurringEndDate).toLocaleDateString("vi-VN") : "---"}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground">
          <span>Tiến độ học tập</span>
          <span className="text-primary">{completedSessions}/{totalSessions} Buổi</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted shadow-inner">
          <div 
            className="h-full rounded-full bg-linear-to-r from-primary to-primary-foreground shadow-lg transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={handleViewDetailClick}
          className="flex-1 rounded-2xl border-2 border-border py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all duration-300 hover:bg-muted hover:border-foreground/20 active:scale-95"
        >
          Chi tiết khóa học
        </button>
        {course.status === "COMPLETED" && !isReviewed && (
          <button 
            onClick={handleReviewClick}
            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105 hover:bg-amber-600 active:scale-95"
          >
            <Star size={16} fill="currentColor" /> Đánh giá
          </button>
        )}
        <button 
          onClick={handleViewDetailClick}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white"
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};


