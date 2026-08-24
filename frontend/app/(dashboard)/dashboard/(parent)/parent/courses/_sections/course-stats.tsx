"use client";

import { useGetCourseStats } from "@/server/_actions/course-action";
import { memo, useMemo } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Layers 
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { toast } from "sonner";
import { useEffect } from "react";

const StatCard = memo(function StatCard({
  card,
  isLoading,
}: {
  card: {
    label: string;
    value: number | string;
    icon: any;
    color: string;
    shadow: string;
  };
  isLoading: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-4xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
        card.shadow
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {card.label}
          </p>
          {isLoading ? (
            <Skeleton className="h-9 w-20 rounded-xl" />
          ) : (
            <h3 className="text-3xl font-black tracking-tight text-foreground">
              {card.value}
            </h3>
          )}
        </div>
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
            card.color
          )}
        >
          <card.icon className="h-7 w-7 text-white" />
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-foreground/2 transition-transform duration-500 group-hover:scale-150" />
    </div>
  );
});

export const CourseStats = () => {
  const { data: stats, isLoading, isError, error } = useGetCourseStats();

  useEffect(() => {
    if (isError) {
      toast.error(formatErrorMessage(error, "Không thể tải thống kê khóa học"));
    }
  }, [isError, error]);

  const statCards = useMemo(
    () => [
      {
        label: "Tổng khóa học",
        value: stats?.totalCourses || 0,
        icon: BookOpen,
        color: "from-blue-600 to-indigo-600",
        shadow: "shadow-blue-500/20",
      },
      {
        label: "Đang diễn ra",
        value: stats?.activeCourses || 0,
        icon: Layers,
        color: "from-amber-500 to-orange-600",
        shadow: "shadow-amber-500/20",
      },
      {
        label: "Đã hoàn thành",
        value: stats?.completedCourses || 0,
        icon: CheckCircle2,
        color: "from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/20",
      },
      {
        label: "Tổng giờ học",
        value: `${stats?.totalHours || 0}h`,
        icon: Clock,
        color: "from-rose-500 to-pink-600",
        shadow: "shadow-rose-500/20",
      },
    ],
    [stats?.activeCourses, stats?.completedCourses, stats?.totalCourses, stats?.totalHours]
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <StatCard key={index} card={card} isLoading={isLoading} />
      ))}
    </div>
  );
};
