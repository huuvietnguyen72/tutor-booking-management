import {
  Trophy,
  ShieldCheck,
  Star,
  ArrowRight,
  Clock,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ApprovalStatus, ITutorDetail } from "@/server/_types/tutor-type";

const statusConfig: Record<
  ApprovalStatus,
  {
    accentClassName: string;
    cardClassName: string;
    Icon: LucideIcon;
    iconClassName: string;
    badge: string;
    BadgeIcon?: LucideIcon;
    badgeIconClassName?: string;
    heading: string;
    description: string;
    usesRejectionReason?: boolean;
    reputation: string;
    reputationIconClassName: string;
    actionHref: string;
    actionClassName: string;
    actionLabel: string;
  }
> = {
  APPROVED: {
    accentClassName: "bg-emerald-500",
    cardClassName:
      "bg-linear-to-br from-emerald-500 to-teal-700 shadow-emerald-500/20 dark:from-emerald-950/80 dark:to-teal-950/80 dark:border-emerald-500/20 dark:shadow-none",
    Icon: Trophy,
    iconClassName: "text-amber-300",
    badge: "Đối tác chính thức",
    BadgeIcon: Star,
    badgeIconClassName: "fill-amber-300 text-amber-300",
    heading: "Hồ sơ đã được phê duyệt chuyên môn",
    description:
      "Chúc mừng! Bạn đã trở thành đối tác chính thức. Hãy bắt đầu kết nối với phụ huynh ngay.",
    reputation: "Cao",
    reputationIconClassName: "text-white",
    actionHref: "/dashboard/tutor/availability",
    actionClassName: "bg-white text-emerald-700 hover:bg-emerald-50",
    actionLabel: "Cập nhật lịch rảnh",
  },
  PENDING: {
    accentClassName: "bg-amber-500",
    cardClassName:
      "bg-linear-to-br from-amber-500 to-orange-600 shadow-amber-500/20 dark:from-amber-950/80 dark:to-orange-950/80 dark:border-amber-500/20 dark:shadow-none",
    Icon: Clock,
    iconClassName: "text-white",
    badge: "Đang xác thực",
    heading: "Hồ sơ của bạn đang được xét duyệt",
    description:
      "Chúng tôi đang thẩm định bằng cấp của bạn. Quá trình này thường hoàn tất trong vòng 24h.",
    reputation: "Trung bình",
    reputationIconClassName: "text-white/70",
    actionHref: "/dashboard/tutor/profile",
    actionClassName: "bg-white text-amber-700 hover:bg-amber-50",
    actionLabel: "Xem chi tiết hồ sơ",
  },
  REJECTED: {
    accentClassName: "bg-rose-500",
    cardClassName:
      "bg-linear-to-br from-rose-500 to-red-700 shadow-rose-500/20 dark:from-rose-950/80 dark:to-red-950/80 dark:border-rose-500/20 dark:shadow-none",
    Icon: AlertCircle,
    iconClassName: "text-white",
    badge: "Cần cập nhật",
    heading: "Hồ sơ cần được hoàn thiện lại",
    description:
      "Vui lòng kiểm tra lại thông tin cá nhân và bằng cấp chuyên môn theo hướng dẫn từ Admin.",
    usesRejectionReason: true,
    reputation: "Trung bình",
    reputationIconClassName: "text-white/70",
    actionHref: "/dashboard/tutor/profile",
    actionClassName: "bg-white text-rose-700 hover:bg-rose-50",
    actionLabel: "Chỉnh sửa ngay",
  },
};

interface ProfileStatusProps {
  tutorProfile?: ITutorDetail;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function ProfileStatus({ tutorProfile, isLoading, isError, onRetry }: ProfileStatusProps) {
  if (isError) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
          <h2 className="text-lg font-black text-foreground tracking-tight">Trạng thái hồ sơ</h2>
        </div>
        <div role="alert" className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-8 text-center">
          <p className="text-sm font-black text-rose-700">Không thể tải trạng thái hồ sơ</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-2xl bg-rose-500 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-rose-600"
            >
              Thử lại
            </button>
          )}
        </div>
      </section>
    );
  }

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

  if (!tutorProfile) {
    return null;
  }

  const status = statusConfig[tutorProfile.approvalStatus];
  const Icon = status.Icon;
  const BadgeIcon = status.BadgeIcon;
  const description = status.usesRejectionReason
    ? tutorProfile.rejectionReason ?? status.description
    : status.description;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className={cn(
          "w-1.5 h-6 rounded-full transition-colors duration-500",
           status.accentClassName,
        )} />
        <h2 className="text-lg font-black text-foreground tracking-tight">Trạng thái hồ sơ</h2>
      </div>

      <div className={cn(
        "rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden transition-all duration-500 border border-transparent",
         status.cardClassName,
      )}>
        {/* Decorations */}
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Icon size={24} className={status.iconClassName} />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
              {BadgeIcon && <BadgeIcon size={12} className={status.badgeIconClassName} />}
              <span>{status.badge}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black leading-tight">
              {status.heading}
            </h3>
            <p className="mt-2 text-sm font-medium opacity-90 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Uy tín</span>
              <div className="mt-1 flex items-center gap-1">
                <ShieldCheck size={16} className={status.reputationIconClassName} />
                <span className="text-lg font-black">{status.reputation}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
              <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Đánh giá</span>
              <span className="mt-1 text-lg font-black">---</span>
            </div>
          </div>

          <Link 
            href={status.actionHref}
            className={cn(
               "group flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
               status.actionClassName,
            )}
          >
            {status.actionLabel}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
