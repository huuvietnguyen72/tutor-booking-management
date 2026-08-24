import { Trophy, ShieldCheck, Star, ArrowRight, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ITutorDetail } from "@/server/_types/tutor-type";

interface ProfileStatusProps {
  tutorProfile?: ITutorDetail;
  isLoading?: boolean;
}

export function ProfileStatus({ tutorProfile, isLoading }: ProfileStatusProps) {
  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-lg font-black text-foreground tracking-tight">Trạng thái hồ sơ</h2>
        </div>
        <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
      </section>
    );
  }

  const status = tutorProfile?.approvalStatus || "PENDING";

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className={cn(
          "w-1.5 h-6 rounded-full transition-colors duration-500",
          status === "APPROVED" ? "bg-emerald-500" :
          status === "PENDING" ? "bg-amber-500" :
          "bg-rose-500"
        )} />
        <h2 className="text-lg font-black text-foreground tracking-tight">Trạng thái hồ sơ</h2>
      </div>

      <div className={cn(
        "rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden transition-all duration-500 border border-transparent",
        status === "APPROVED" ? "bg-linear-to-br from-emerald-500 to-teal-700 shadow-emerald-500/20 dark:from-emerald-950/80 dark:to-teal-950/80 dark:border-emerald-500/20 dark:shadow-none" :
        status === "PENDING" ? "bg-linear-to-br from-amber-500 to-orange-600 shadow-amber-500/20 dark:from-amber-950/80 dark:to-orange-950/80 dark:border-amber-500/20 dark:shadow-none" :
        "bg-linear-to-br from-rose-500 to-red-700 shadow-rose-500/20 dark:from-rose-950/80 dark:to-red-950/80 dark:border-rose-500/20 dark:shadow-none"
      )}>
        {/* Decorations */}
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              {status === "APPROVED" ? <Trophy size={24} className="text-amber-300" /> :
               status === "PENDING" ? <Clock size={24} className="text-white" /> :
               <AlertCircle size={24} className="text-white" />}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
              {status === "APPROVED" ? (
                <>
                  <Star size={12} className="fill-amber-300 text-amber-300" />
                  <span>Đối tác chính thức</span>
                </>
              ) : status === "PENDING" ? (
                <span>Đang xác thực</span>
              ) : (
                <span>Cần cập nhật</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black leading-tight">
              {status === "APPROVED" ? "Hồ sơ đã được phê duyệt chuyên môn" :
               status === "PENDING" ? "Hồ sơ của bạn đang được xét duyệt" :
               "Hồ sơ cần được hoàn thiện lại"}
            </h3>
            <p className="mt-2 text-sm font-medium opacity-90 leading-relaxed">
              {status === "APPROVED" ? (
                "Chúc mừng! Bạn đã trở thành đối tác chính thức. Hãy bắt đầu kết nối với phụ huynh ngay."
              ) : status === "PENDING" ? (
                "Chúng tôi đang thẩm định bằng cấp của bạn. Quá trình này thường hoàn tất trong vòng 24h."
              ) : (
                tutorProfile?.rejectionReason || "Vui lòng kiểm tra lại thông tin cá nhân và bằng cấp chuyên môn theo hướng dẫn từ Admin."
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Uy tín</span>
              <div className="mt-1 flex items-center gap-1">
                <ShieldCheck size={16} className={status === "APPROVED" ? "text-white" : "text-white/70"} />
                <span className="text-lg font-black">{status === "APPROVED" ? "Cao" : "Trung bình"}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Đánh giá</span>
              <span className="mt-1 text-lg font-black">---</span>
            </div>
          </div>

          <Link 
            href={status === "APPROVED" ? "/dashboard/tutor/availability" : "/dashboard/tutor/profile"}
            className={cn(
               "group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
               status === "APPROVED" ? "bg-white text-emerald-700 hover:bg-emerald-50" :
               status === "PENDING" ? "bg-white text-amber-700 hover:bg-amber-50" :
               "bg-white text-rose-700 hover:bg-rose-50"
            )}
          >
            {status === "APPROVED" ? "Cập nhật lịch rảnh" :
             status === "PENDING" ? "Xem chi tiết hồ sơ" :
             "Chỉnh sửa ngay"}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
