"use client";

import { memo } from "react";
import {
  Users,
  MapPin,
  ChevronRight,
  GraduationCap,
  Clock,
} from "lucide-react";
import { IRequest, RequestStatus } from "@/server/_types/request-type";
import { cn, formatPrice } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface RequestCardProps {
  request: IRequest;
}

const REQUEST_STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  SEARCHING: {
    label: "Đang tìm",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  HAS_APPLICANTS: {
    label: "Có người ứng tuyển",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  MATCHED: {
    label: "Đã khớp",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function RequestCardBase({ request }: RequestCardProps) {
  const statusCfg =
    REQUEST_STATUS_CONFIG[request.status] || REQUEST_STATUS_CONFIG.SEARCHING;

  const formattedDate = request.createdAt
    ? format(parseISO(request.createdAt), "dd/MM/yyyy", { locale: vi })
    : "N/A";

  return (
    <div className="group bg-card rounded-3xl border border-border p-5 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 relative flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {request.subjectName} - Lớp {request.gradeLevel}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Đăng ngày {formattedDate}
              </p>
            </div>
          </div>
          <Badge
            className={cn("font-bold rounded-lg border", statusCfg.className)}
          >
            {request.status === "HAS_APPLICANTS" && request.applicantsCount > 0
              ? `Có ${request.applicantsCount} người ứng tuyển`
              : statusCfg.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
              Học phí
            </span>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono italic underline decoration-blue-500/30 underline-offset-4">
              {formatPrice(request.desiredPrice, " / buổi")}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
              Hình thức
            </span>
            <p className="text-sm font-bold text-foreground">
              {request.teachingMode}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
              Khu vực
            </span>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-muted-foreground" />
              <p className="text-sm font-bold text-foreground line-clamp-1">
                {request.preferredArea || "Liên hệ"}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
              Ứng tuyển
            </span>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-muted-foreground" />
              <p className="text-sm font-bold text-foreground">
                {request.applicantsCount || 0} gia sư
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end md:border-l border-border/50 md:pl-6">
        <Link href={`/dashboard/parent/requests/${request.id}`}>
          <Button
            variant="outline"
            className="rounded-2xl h-14 px-6 border-blue-600/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all font-bold gap-2 group/btn"
          >
            Quản lý ứng tuyển
            <ChevronRight
              size={18}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export const RequestCard = memo(RequestCardBase);
RequestCard.displayName = "RequestCard";
