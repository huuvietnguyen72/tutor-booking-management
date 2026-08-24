"use client";

import { useGetMyApplications, useWithdrawApplication } from "@/server/_actions/request-action";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { 
  Loader2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Undo2,
  DollarSign,
  User,
  BookOpen
} from "lucide-react";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { useState } from "react";

export function MyApplications() {
  const { data: applications = [], isLoading, refetch } = useGetMyApplications();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawApplication();
  const [withdrawId, setWithdrawId] = useState<number | null>(null);

  const handleWithdraw = () => {
    if (!withdrawId) return;
    const toastId = toast.loading("Đang rút hồ sơ...");
    withdraw(withdrawId, {
      onSuccess: () => {
        toast.success("Đã rút hồ sơ thành công", { id: toastId });
        setWithdrawId(null);
        refetch();
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Không thể rút hồ sơ"), { id: toastId });
      }
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return {
          label: "Đang chờ",
          icon: Clock,
          className: "bg-blue-500/10 text-blue-600 border-blue-200",
          desc: "Phụ huynh đang xem xét hồ sơ của bạn"
        };
      case "ACCEPTED":
        return {
          label: "Đã chấp nhận",
          icon: CheckCircle2,
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
          desc: "Phụ huynh đã chấp nhận! Hãy chờ liên hệ"
        };
      case "REJECTED":
        return {
          label: "Từ chối",
          icon: XCircle,
          className: "bg-rose-500/10 text-rose-600 border-rose-200",
          desc: "Rất tiếc, hồ sơ chưa phù hợp lần này"
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          className: "bg-muted text-muted-foreground border-border",
          desc: ""
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="animate-spin text-primary mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Đang tải danh sách hồ sơ...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-4xl border-2 border-dashed border-border opacity-50 bg-card/30">
        <div className="p-6 rounded-full bg-muted/50 mb-6">
          <BookOpen size={48} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-black text-foreground mb-2">Chưa có ứng tuyển nào</h3>
        <p className="text-sm font-medium text-muted-foreground max-w-xs uppercase tracking-tight">
          Hãy truy cập "Cơ hội mới" để tìm kiếm lớp học phù hợp với bạn
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">HỒ SƠ CỦA TÔI</h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bạn đã ứng tuyển {applications.length} lớp học</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {applications.map((app) => {
          const status = getStatusConfig(app.status);
          const Icon = status.icon;

          return (
            <div 
              key={app.id}
              className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between mb-6">
                <Badge 
                  variant="outline" 
                  className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest", status.className)}
                >
                  <Icon size={12} className="mr-1.5" />
                  {status.label}
                </Badge>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("vi-VN") : "N/A"}
                </span>
              </div>

              {/* Course Info */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {app.request?.subjectName || "N/A"}
                </h3>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                      <User size={14} className="text-primary/60" />
                      Phụ huynh: {app.request?.studentName}
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                      <DollarSign size={14} className="text-primary/60" />
                      Đề xuất: <span className="text-primary font-black">{app.proposedPrice.toLocaleString()}đ</span>
                   </div>
                </div>
              </div>

              {/* Cover Letter Snippet */}
              <div className="flex-1 mb-6">
                 <p className="text-xs font-medium text-muted-foreground line-clamp-3 bg-muted/30 p-4 rounded-xl italic">
                   "{app.coverLetter}"
                 </p>
              </div>

              {/* Action */}
              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight max-w-37.5">
                  {status.desc}
                </p>
                
                {app.status.toUpperCase() === "PENDING" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest group"
                    onClick={() => setWithdrawId(app.requestId)}
                  >
                    <Undo2 size={12} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    Rút hồ sơ
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={withdrawId !== null}
        onClose={() => setWithdrawId(null)}
        onConfirm={handleWithdraw}
        title="Xác nhận rút hồ sơ?"
        description="Hành động này không thể hoàn tác. Bạn sẽ mất cơ hội ứng tuyển lớp học này trừ khi nộp lại hồ sơ mới."
        confirmText="Xác nhận rút"
        cancelText="Quay lại"
        variant="danger"
      />
    </div>
  );
}
