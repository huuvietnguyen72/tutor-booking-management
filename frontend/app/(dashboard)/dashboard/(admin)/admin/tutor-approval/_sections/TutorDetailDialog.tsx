"use client";

import { useApproveTutor, useRejectTutor } from "@/server/_actions/admin-action";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  ShieldAlert,
  MapPin,
  Laptop
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { TutorPendingResponse } from "@/server/_types/admin-type";
import { formatErrorMessage } from "@/shared/lib/utils";
import { useToggle } from "@/shared/hooks/use-toggle";

interface TutorDetailDialogProps {
  tutors: TutorPendingResponse[] | undefined;
  tutorId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TutorDetailDialog = ({ tutors, tutorId, open, onOpenChange }: TutorDetailDialogProps) => {
  const tutor = tutors?.find(t => t.id === tutorId);
  const approveMutation = useApproveTutor();
  const rejectMutation = useRejectTutor();
  
  const approveConfirm = useToggle(false);
  const rejectDialog = useToggle(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    if (!tutorId) return;
    const toastId = toast.loading("Đang tiến hành phê duyệt...");
    approveMutation.mutate(tutorId.toString(), {
      onSuccess: () => {
        toast.success("Đã phê duyệt gia sư thành công!", { id: toastId });
        approveConfirm.close();
        onOpenChange(false);
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi phê duyệt"), { id: toastId });
      }
    });
  };

  const handleReject = () => {
    if (!tutorId || !rejectReason.trim()) return toast.error("Vui lòng nhập lý do từ chối");
    const toastId = toast.loading("Đang tiến hành từ chối hồ sơ...");
    rejectMutation.mutate({ id: tutorId.toString(), reason: rejectReason }, {
      onSuccess: () => {
        toast.success("Đã từ chối hồ sơ thành công!", { id: toastId });
        rejectDialog.close();
        onOpenChange(false);
        setRejectReason("");
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi từ chối hồ sơ"), { id: toastId });
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden border-none bg-background rounded-4xl shadow-2xl">
          <DialogHeader className="p-6 md:p-8 bg-muted/40 dark:bg-muted/20 border-b border-border/50 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl hidden sm:block">
                    <ShieldAlert size={20} className="text-primary" />
                  </div>
                  Chi tiết hồ sơ gia sư
                </DialogTitle>
                <DialogDescription className="font-medium text-muted-foreground/80">
                  Xem xét kỹ thông tin trước khi quyết định phê duyệt.
                </DialogDescription>
              </div>
              <Badge variant="secondary" className="bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-none font-black py-1.5 px-4 rounded-full shadow-sm">
                CHỜ PHÊ DUYỆT
              </Badge>
            </div>
          </DialogHeader>

          <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {tutor ? (
              <div className="grid md:grid-cols-3 gap-8 text-foreground">
                {/* Left Column: Basic Info */}
                <div className="md:col-span-1 space-y-6">
                  <Card className="p-6 border-none shadow-lg shadow-black/5 bg-muted/20 rounded-3xl text-center flex flex-col items-center">
                    <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center font-black text-primary text-4xl shadow-inner mb-4 overflow-hidden relative">
                      {tutor.avatarUrl ? (
                         <img src={tutor.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${tutor.fullName}`} alt={tutor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        tutor.fullName.charAt(0)
                      )}
                    </div>
                    <h2 className="text-xl font-black tracking-tight mb-4">{tutor.fullName}</h2>

                    <div className="w-full space-y-4 text-left">
                      <InfoItem icon={<Mail size={16} />} label="Email" value={tutor.email} />
                      <InfoItem icon={<GraduationCap size={16} />} label="Trình độ" value={tutor.educationLevel} />
                      <InfoItem icon={<Laptop size={16} />} label="Hình thức" value={tutor.teachingMode === 'BOTH' ? 'Online & Offline' : tutor.teachingMode} />
                    </div>
                  </Card>
                </div>

                {/* Right Column: Detailed Experience */}
                <div className="md:col-span-2 space-y-8">
                  <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-primary">
                      <MapPin size={18} />
                      Khu vực giảng dạy
                    </h3>
                    <div className="p-6 bg-muted/20 rounded-3xl text-sm font-medium leading-relaxed text-muted-foreground shadow-inner">
                      {tutor.teachingArea || "Chưa cập nhật khu vực cụ thể."}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-primary">
                      <Briefcase size={18} />
                      Kinh nghiệm & Chuyên môn
                    </h3>
                    <div className="space-y-3">
                      <div className="p-5 bg-card border border-border/50 rounded-2xl space-y-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Chứng chỉ / Chuyên môn</p>
                        <p className="text-sm font-bold">{tutor.qualifications || "Chưa có thông tin chuyên môn."}</p>
                      </div>
                      <div className="p-5 bg-card border border-border/50 rounded-2xl space-y-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Kinh nghiệm làm việc</p>
                        <p className="text-sm font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                          {tutor.experience || "Chưa có thông tin kinh nghiệm."}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Qualifications summary */}
                  <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-primary">
                      <FileText size={18} />
                      Thông tin bổ sung
                    </h3>
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                       <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                         Hồ sơ này đang trong quá trình xác minh. Vui lòng đối chiếu các thông tin trên hệ thống với các giấy tờ tùy thân nếu cần thiết.
                       </p>
                    </div>
                  </section>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-muted-foreground/20">
                <ShieldAlert size={40} className="mx-auto text-muted-foreground/40 mb-4" />
                <p className="font-black text-muted-foreground uppercase tracking-widest text-sm">Không tìm thấy thông tin</p>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 md:p-8 bg-muted/40 dark:bg-muted/20 border-t border-border/50 backdrop-blur-md gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-bold px-6"
            >
              ĐÓNG
            </Button>
            <div className="flex gap-3 ml-auto">
              <Button 
                onClick={rejectDialog.open}
                variant="ghost"
                disabled={rejectMutation.isPending || approveMutation.isPending || !tutor}
                className="rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all font-black px-6"
              >
                <XCircle size={18} className="mr-2" />
                TỪ CHỐI
              </Button>
              <Button 
                onClick={approveConfirm.open}
                disabled={approveMutation.isPending || rejectMutation.isPending || !tutor}
                className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-black px-8"
              >
                <CheckCircle size={18} className="mr-2" />
                PHÊ DUYỆT
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Child Dialog */}
      <Dialog open={rejectDialog.value} onOpenChange={rejectDialog.setValue}>
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
              onClick={rejectDialog.close}
            >
              HỦY
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600 border-none text-white rounded-xl font-black px-6"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "ĐANG GỬI..." : "XÁC NHẬN"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Confirm Dialog */}
      <ConfirmDialog
        isOpen={approveConfirm.value}
        onClose={approveConfirm.close}
        onConfirm={handleApprove}
        title="Xác nhận duyệt hồ sơ"
        description="Bạn có chắc chắn muốn duyệt hồ sơ của gia sư này không? Gia sư sẽ nhận được thông báo và chính thức có thể nhận lớp."
        confirmText="DUYỆT NGAY"
        cancelText="KIỂM TRA LẠI"
        variant="primary"
      />
    </>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
      {icon}
      {label}
    </p>
    <p className="text-sm font-bold truncate pr-2">{value}</p>
  </div>
);
