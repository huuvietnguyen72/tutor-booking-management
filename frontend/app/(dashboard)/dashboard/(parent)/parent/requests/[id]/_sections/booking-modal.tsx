"use client";

import { memo } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Check, Calendar, Clock, User, BookOpen } from "lucide-react";

import { IRequest, IApplicant } from "@/server/_types/request-type";
import { formatPrice } from "@/shared/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: IApplicant | null;
  request?: IRequest | null;
  onConfirm?: () => Promise<void>;
  isLoading?: boolean;
}

function BookingModalBase({
  isOpen,
  onClose,
  tutor,
  request,
  onConfirm,
  isLoading,
}: BookingModalProps) {
  if (!tutor) return null;
  const applicant = tutor;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background rounded-4xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Check size={120} strokeWidth={3} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight mb-2">
              Chấp nhận gia sư
            </DialogTitle>
            <DialogDescription className="text-blue-100 font-medium text-lg">
              Xác nhận thông tin cuối cùng để tiến hành đặt lịch học.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tutor Info */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                Gia sư được chọn
              </h4>
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="relative h-14 w-14 rounded-xl bg-blue-100 overflow-hidden shrink-0 border border-blue-200">
                  <Image
                    src={applicant.tutorAvatar || "https://api.dicebear.com/7.x/avataaars/png?seed=" + applicant.tutorName}
                    alt={applicant.tutorName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-black text-foreground">
                    {applicant.tutorName}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    {applicant.education || "Đại học chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            {/* Request Info Summary */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                <BookOpen size={14} className="text-blue-600" />
                Tóm tắt yêu cầu
              </h4>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium italic">
                    Môn học:
                  </span>
                  <span className="font-bold text-foreground">
                    {request?.subjectName || "N/A"} - Lớp{" "}
                    {request?.gradeLevel || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium italic">
                    Học phí chốt:
                  </span>
                  <span className="font-black text-blue-600 dark:text-blue-400">
                    {formatPrice(applicant?.proposedPrice || 0, " / buổi")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Confirmation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-blue-600" />
              Lịch học dự kiến
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {request?.schedule?.map((slot, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800"
                >
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-background flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Thứ {slot.dayOfWeek + 1}
                    </p>
                    <p className="font-bold text-foreground tracking-tight">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground italic px-2">
              * Lịch học này có thể được điều chỉnh sau khi gia sư và phụ huynh
              liên hệ trực tiếp.
            </p>
          </div>
        </div>

        <DialogFooter className="p-8 bg-muted/20 border-t border-border flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-2xl h-14 font-black text-muted-foreground hover:bg-muted"
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-black gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận & Hoàn tất"}
            {!isLoading && <Check size={20} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const BookingModal = memo(BookingModalBase);
BookingModal.displayName = "BookingModal";
