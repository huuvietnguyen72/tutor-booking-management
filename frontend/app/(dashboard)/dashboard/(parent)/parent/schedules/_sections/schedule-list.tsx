"use client";

import { useMemo } from "react";
import { ScheduleCard } from "./schedule-card";
import { ScheduleStatus } from "./schedule-tabs";
import { Inbox, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetMySessions } from "@/server/_actions/session-action";
import { ISession } from "@/server/_types/session-type";

interface ScheduleListProps {
  filter: ScheduleStatus;
}

export function ScheduleList({ filter }: ScheduleListProps) {
  const { data: response, isLoading, error } = useGetMySessions({
    size: 100, // Fetch relative large amount to filter locally for instant tab switching
  });

  const sessions = response?.content || [];

  const filteredSessions = useMemo(() => {
    if (filter === "all") return sessions;
    
    if (filter === "upcoming") {
        return sessions.filter((s: ISession) => s.status === "PENDING" || s.status === "CONFIRMED");
    }
    if (filter === "completed") {
        return sessions.filter((s: ISession) => s.status === "COMPLETED");
    }
    if (filter === "cancelled") {
        return sessions.filter((s: ISession) => s.status === "CANCELLED");
    }
    return sessions;
  }, [sessions, filter]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-muted/5 rounded-4xl border border-border/50">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Đang tải lịch học...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-red-500/5 rounded-4xl border border-red-500/10">
        <Inbox className="text-red-500/30 mb-6" size={40} />
        <h3 className="text-lg font-black text-red-600 tracking-tight mb-2">Đã có lỗi xảy ra</h3>
        <p className="text-muted-foreground text-sm text-center max-w-70">
          Không thể tải danh sách lịch học. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  if (filteredSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-4xl border-2 border-dashed border-border/60">
        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <Inbox className="text-muted-foreground opacity-30" size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Trống danh sách</h3>
        <p className="text-muted-foreground font-medium text-sm text-center max-w-[320px] mb-6">
          {filter === "all" 
            ? "Bạn hiện chưa có lịch học nào. Nếu bạn vừa đặt lịch, vui lòng chờ gia sư xác nhận tại mục Khóa học." 
            : `Không tìm thấy bất kỳ lịch học nào trong mục "${
                filter === "upcoming" ? "Sắp tới" : 
                filter === "completed" ? "Đã hoàn thành" : "Đã hủy"
              }".`
          }
        </p>
        <Link 
          href="/dashboard/parent/courses"
          className="text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider bg-primary/10 px-6 py-2.5 rounded-xl hover:bg-primary/20"
        >
          Tới trang Khóa Học
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredSessions.map((session) => (
        <ScheduleCard key={session.id} session={session} />
      ))}
    </div>
  );
}
