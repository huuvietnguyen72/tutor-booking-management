"use client";

import { useGetPendingTutors, useApproveTutor, useRejectTutor } from "@/server/_actions/admin-action";
import { TutorPendingResponse } from "@/server/_types/admin-type";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ShieldCheck, Eye, CheckCircle, XCircle, Search, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useState, useCallback, memo } from "react";
import { TutorDetailDialog } from "./_sections/TutorDetailDialog";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { formatErrorMessage } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";

const TutorCard = memo(function TutorCard({ tutor, isLoading, onDetail, onApprove, onReject }: any) {
  return (
    <Card className="p-4 md:p-5 border-none shadow-lg shadow-black/5 bg-card/60 backdrop-blur-sm group hover:bg-card hover:scale-[1.01] transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 relative rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl shadow-inner">
            <Image
              src={tutor.avatarUrl}
              alt={tutor.fullName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-lg leading-none tracking-tight group-hover:text-primary transition-colors">
              {tutor.fullName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1">
                {tutor.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-none font-black py-1 px-3 hidden sm:flex">
            ĐANG CHỜ
          </Badge>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDetail(tutor.id)}
              className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Eye size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={() => onApprove(tutor.id)}
              className="rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
            >
              <CheckCircle size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={() => onReject(tutor.id)}
              className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <XCircle size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

const TutorApprovalPage = () => {
  const { data: tutorsData, isLoading } = useGetPendingTutors();
  const tutors = tutorsData?.content || [];
  const approveMutation = useApproveTutor();
  const rejectMutation = useRejectTutor();

  const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Quick actions state
  const [actionTutorId, setActionTutorId] = useState<number | null>(null);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleOpenDetail = useCallback((id: number) => {
    setSelectedTutorId(id);
    setIsDetailOpen(true);
  }, []);

  const handleOpenApprove = useCallback((id: number) => {
    setActionTutorId(id);
    setIsApproveConfirmOpen(true);
  }, []);

  const handleOpenReject = useCallback((id: number) => {
    setActionTutorId(id);
    setIsRejectDialogOpen(true);
    setRejectReason("");
  }, []);

  const handleDirectApprove = useCallback(() => {
    if (!actionTutorId) return;
    const toastId = toast.loading("Đang tiến hành phê duyệt...");
    approveMutation.mutate(actionTutorId.toString(), {
      onSuccess: () => {
        toast.success("Đã phê duyệt gia sư thành công!", { id: toastId });
        setIsApproveConfirmOpen(false);
        setActionTutorId(null);
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi phê duyệt"), { id: toastId });
      }
    });
  }, [actionTutorId, approveMutation]);

  const handleDirectReject = useCallback(() => {
    if (!actionTutorId || !rejectReason.trim()) return toast.error("Vui lòng nhập lý do từ chối");
    const toastId = toast.loading("Đang tiến hành từ chối hồ sơ...");
    rejectMutation.mutate({ id: actionTutorId.toString(), reason: rejectReason }, {
      onSuccess: () => {
        toast.success("Đã từ chối hồ sơ thành công!", { id: toastId });
        setIsRejectDialogOpen(false);
        setActionTutorId(null);
        setRejectReason("");
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi từ chối hồ sơ"), { id: toastId });
      }
    });
  }, [actionTutorId, rejectReason, rejectMutation]);

  const isLoading2 = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Duyệt hồ sơ Gia sư</h1>
          <p className="text-muted-foreground font-medium">
            Kiểm tra và xác minh năng lực của các gia sư mới đăng ký.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl w-full md:w-fit border border-border">
          <div className="pl-3 pr-1 text-muted-foreground">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm gia sư..." 
            className="bg-transparent border-none focus:outline-none text-sm font-medium w-full md:w-60 py-1.5"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-3xl" />
          ))
        ) : tutors?.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 flex flex-col items-center gap-4 bg-muted/5">
            <div className="p-4 bg-muted/20 rounded-full">
              <ShieldCheck size={40} className="text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="font-black uppercase tracking-widest text-muted-foreground text-sm">Trống</p>
              <p className="text-xs text-muted-foreground font-medium">Không có hồ sơ nào đang chờ duyệt.</p>
            </div>
          </Card>
        ) : (
          tutors?.map((tutor: TutorPendingResponse) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              isLoading={isLoading2}
              onDetail={handleOpenDetail}
              onApprove={handleOpenApprove}
              onReject={handleOpenReject}
            />
          ))
        )}
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-primary/5 border-none rounded-3xl overflow-hidden relative group">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-primary/20 rounded-2xl">
            <ShieldCheck className="text-primary" size={24} />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-black text-sm uppercase tracking-wider">Lưu ý kiểm duyệt</h4>
            <p className="text-xs text-muted-foreground font-medium max-w-2xl">
              Vui lòng kiểm tra kỹ các bằng cấp, chứng chỉ và hồ sơ kinh nghiệm trước khi phê duyệt. 
              Các hồ sơ được duyệt sẽ ngay lập tức được hiển thị trên trang tìm kiếm gia sư công khai.
            </p>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 opacity-5 translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-1000">
           <ShieldCheck size={180} />
        </div>
      </Card>

      {/* Detail Dialog */}
      <TutorDetailDialog 
        tutors={tutors}
        tutorId={selectedTutorId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* Quick Approval Confirm Dialog */}
      <ConfirmDialog
        isOpen={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        onConfirm={handleDirectApprove}
        title="Xác nhận duyệt hồ sơ"
        description="Bạn có chắc chắn muốn duyệt nhanh hồ sơ của gia sư này không? Gia sư sẽ được cấp quyền nhận lớp ngay lập tức."
        confirmText="DUYỆT NGAY"
        cancelText="HỦY"
        variant="primary"
      />

      {/* Quick Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-4xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 text-xl font-black">
              <XCircle className="w-6 h-6" />
              Lý do từ chối
            </DialogTitle>
            <DialogDescription className="font-medium">
              Vui lòng nhập lý do cụ thể để gia sư biết cần gửi lại hồ sơ như thế nào.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Vd: Ảnh chứng chỉ mờ, không thể đọc được nội dung..."
              className="min-h-30 rounded-2xl border-muted focus-visible:ring-rose-500 font-medium p-4 text-sm"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl font-bold"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              HỦY
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600 border-none text-white rounded-xl font-black px-6"
              onClick={handleDirectReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "ĐANG GỬI..." : "XÁC NHẬN"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorApprovalPage;
