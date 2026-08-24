"use client";

import { useMemo } from "react";
import { ScheduleCard } from "./schedule-card";
import { ScheduleStatus } from "./schedule-tabs";
import { Inbox, Loader2 } from "lucide-react";
import { ISession } from "@/server/_types/session-type";

interface ScheduleListProps {
  filter: ScheduleStatus;
  sessions: ISession[];
  isLoading: boolean;
}

export function ScheduleList({ filter, sessions, isLoading }: ScheduleListProps) {
  const filteredSessions = useMemo(() => {
    if (filter === "all") return sessions;
    if (filter === "upcoming") return sessions.filter(s => s.status === "CONFIRMED");
    if (filter === "pending") return sessions.filter(s => s.status === "PENDING");
    if (filter === "completed") return sessions.filter(s => s.status === "COMPLETED");
    if (filter === "cancelled") return sessions.filter(s => s.status === "CANCELLED");
    return sessions;
  }, [filter, sessions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-bold animate-pulse">Đang tải lịch dạy...</p>
      </div>
    );
  }

  if (filteredSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-4xl border-2 border-dashed border-border/60">
        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <Inbox className="text-muted-foreground opacity-30" size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Không có buổi dạy nào</h3>
        <p className="text-muted-foreground font-medium text-sm text-center max-w-[280px]">
          Danh sách hiện tại đang trống cho bộ lọc này.
        </p>
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
