"use client";

import { memo, useMemo } from "react";
import { LucideIcon, Calendar, BookOpen, ClipboardList, Star } from "lucide-react";
import { useGetMySessions } from "@/server/_actions/session-action";
import { useGetMyBookings } from "@/server/_actions/booking-action";
import { useGetMyRequests } from "@/server/_actions/request-action";
import { Skeleton } from "@/shared/components/ui/skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  bgColor: string;
  borderColor: string;
  index: number;
  isLoading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SummaryCard = memo(function SummaryCard({ icon: Icon, label, value, color, bgColor, borderColor, index, isLoading }: SummaryCardProps) {
  return (
    <div 
      className="flex flex-col gap-4 rounded-3xl bg-card p-6 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`flex w-12 h-12 items-center justify-center rounded-2xl border ${bgColor} ${borderColor} transition-transform group-hover:scale-110 duration-300`}>
        <Icon size={24} className={color} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
        {isLoading ? (
          <Skeleton className="h-10 w-12 mt-1" />
        ) : (
          <p className="mt-1 text-4xl font-black text-foreground tracking-tight">{value}</p>
        )}
      </div>
    </div>
  );
});

export function SummaryCards() {
  const { data: sessionsRes, isLoading: isSessionsLoading } = useGetMySessions({ size: 1000 });
  const { data: bookingsRes, isLoading: isBookingsLoading } = useGetMyBookings({ size: 1000 });
  const { data: requestsRes, isLoading: isRequestsLoading } = useGetMyRequests();

  const sessions = useMemo(() => sessionsRes?.content || [], [sessionsRes?.content]);
  const bookings = useMemo(() => bookingsRes?.content || [], [bookingsRes?.content]);
  const requests = useMemo(() => requestsRes || [], [requestsRes]);

  const stats = useMemo(
    () => [
      {
        icon: Calendar,
        label: "Buổi học sắp tới",
        value: sessions.filter((s) => s.status === "PENDING" || s.status === "CONFIRMED").length,
        color: "text-primary dark:text-primary",
        bgColor: "bg-primary/10 dark:bg-primary/20",
        borderColor: "border-primary/20 dark:border-primary/30",
        isLoading: isSessionsLoading,
      },
      {
        icon: BookOpen,
        label: "Lớp đang học",
        value: bookings.filter((b) => b.status === "ACTIVE").length,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
        borderColor: "border-emerald-100 dark:border-emerald-500/20",
        isLoading: isBookingsLoading,
      },
      {
        icon: ClipboardList,
        label: "Yêu cầu đang chờ",
        value: requests.filter((r) => r.status === "SEARCHING" || r.status === "HAS_APPLICANTS").length,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-500/10",
        borderColor: "border-amber-100 dark:border-amber-500/20",
        isLoading: isRequestsLoading,
      },
      {
        icon: Star,
        label: "Chưa đánh giá",
        value: sessions.filter((s) => s.status === "COMPLETED" && !s.reviewId).length,
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-50 dark:bg-purple-500/10",
        borderColor: "border-purple-100 dark:border-purple-500/20",
        isLoading: isSessionsLoading,
      },
    ],
    [bookings, isBookingsLoading, isRequestsLoading, isSessionsLoading, requests, sessions]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-4">
      {stats.map((card, index) => (
        <SummaryCard key={card.label} {...card} index={index} />
      ))}
    </div>
  );
}
