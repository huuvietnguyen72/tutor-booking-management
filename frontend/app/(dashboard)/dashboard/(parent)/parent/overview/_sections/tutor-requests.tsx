"use client";

import Link from "next/link";
import { ChevronRight, Eye, SearchX, Inbox } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/constants/app";
import { useGetMyRequests } from "@/server/_actions/request-action";
import { RequestStatus } from "@/server/_types/request-type";
import { Skeleton } from "@/shared/components/ui/skeleton";

// ─── Status Config ────────────────────────────────────────────────────────────

const REQUEST_STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  SEARCHING: { 
    label: "Đang tìm", 
    className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" 
  },
  HAS_APPLICANTS: {
    label: "Có người ứng tuyển",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
  },
  MATCHED: {
    label: "Đã khớp",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
  },
  CANCELLED: { 
    label: "Đã hủy", 
    className: "bg-muted text-muted-foreground border-border" 
  },
};

// ─── Main Export ───────────────────────────────────────────────────────────────

export function TutorRequests() {
  const { data: requests = [], isLoading } = useGetMyRequests();

  return (
    <section className="xl:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-200 fill-mode-both">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-black text-foreground tracking-tight">Yêu cầu tìm gia sư</h2>
        </div>
        <Link
          href={`${ROUTES.PARENT.REQUESTS}`}
          className="group flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-all"
        >
          Xem tất cả
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Request Table / List */}
      <div className="rounded-4xl bg-card shadow-sm border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full bg-muted" />
            <Skeleton className="h-12 w-full bg-muted" />
            <Skeleton className="h-12 w-full bg-muted" />
          </div>
        ) : requests.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                  Môn học
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {requests.slice(0, 5).map((req) => {
                const statusCfg = REQUEST_STATUS_CONFIG[req.status] || REQUEST_STATUS_CONFIG.SEARCHING;
                return (
                  <tr
                    key={req.id}
                    className="group hover:bg-muted/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {req.subjectName || "Chưa xác định"}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                        Lớp {req.gradeLevel}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          statusCfg.className,
                        )}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`${ROUTES.PARENT.REQUESTS}/${req.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Inbox size={32} className="text-muted-foreground/50" />
            </div>
            <p className="text-sm font-bold text-foreground">Chưa có yêu cầu nào</p>
            <p className="text-xs text-muted-foreground mt-1">
              Các yêu cầu tìm gia sư của bạn sẽ xuất hiện tại đây.
            </p>
          </div>
        )}
      </div>

      {/* Quick Create Request */}
      <Link
        href={`${ROUTES.PARENT.REQUESTS}/new`}
        className="group relative flex w-full flex-col items-center justify-center gap-3 rounded-4xl border-2 border-dashed border-border py-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          <SearchX size={24} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-black text-foreground">Tạo yêu cầu mới</p>
          <p className="text-xs text-muted-foreground font-medium mt-0.5 px-6">
            Chúng tôi sẽ giúp bạn tìm gia sư phù hợp nhất cho con bạn.
          </p>
        </div>
      </Link>
    </section>
  );
}
