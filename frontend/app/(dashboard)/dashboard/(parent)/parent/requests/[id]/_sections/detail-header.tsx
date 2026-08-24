"use client";

import { ChevronLeft, Calendar } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { IRequest, RequestStatus } from "@/server/_types/request-type";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

import { EditRequestModal } from "./edit-request-modal";

interface DetailHeaderProps {
  request: IRequest;
}

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  SEARCHING: { 
    label: "Đang tìm", 
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
  },
  HAS_APPLICANTS: {
    label: "Có người ứng tuyển",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  MATCHED: {
    label: "Đã khớp",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  CANCELLED: { 
    label: "Đã hủy", 
    className: "bg-muted text-muted-foreground" 
  },
};

export function DetailHeader({ request }: DetailHeaderProps) {
  const router = useRouter();
  const status = request.status;
  const createdAt = request.createdAt;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SEARCHING;
  
  const formattedDate = createdAt 
    ? format(parseISO(createdAt), "dd/MM/yyyy HH:mm", { locale: vi })
    : "N/A";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <button
          onClick={() => router.back()}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span>Yêu cầu của tôi</span>
        </button>
        <span className="opacity-40">/</span>
        <span className="text-foreground font-bold">Chi tiết yêu cầu</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Chi tiết yêu cầu</h1>
            <Badge className={cn("px-3 py-1 rounded-full border-none shadow-none text-xs font-bold", config.className)}>
              {status === "HAS_APPLICANTS" && request.applicantsCount > 0
                ? `Có ${request.applicantsCount} người ứng tuyển`
                : config.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={14} />
            <span className="text-xs md:text-sm font-medium">Ngày đăng: {formattedDate}</span>
          </div>
        </div>

        {status === "SEARCHING" || status === "HAS_APPLICANTS" ? (
          <div className="pt-2 md:pt-0">
            <EditRequestModal request={request} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
