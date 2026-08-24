"use client";

import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { 
  CheckCircle2, 
  User, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Monitor,
  ArrowLeft,
  CreditCard
} from "lucide-react";
import { cn, formatPrice } from "@/shared/lib/utils";
import { IStudent } from "@/server/_types/student-type";
import { ITutorDetail, ITutorSubject } from "@/server/_types/tutor-type";

interface Slot {
  day: number;
  slot: string;
  time: string;
}

interface Step4Props {
  child: IStudent | undefined;
  tutor: ITutorDetail;
  subject: ITutorSubject | undefined;
  bookingType: "one-time" | "long-term";
  selectedSlots: Slot[];
  learningMode: "online" | "offline";
  onBack: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DAY_LABELS: Record<number, string> = {
  1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4", 4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7", 7: "Chủ nhật"
};

function Step4ConfirmationBase({
  child,
  tutor,
  subject,
  bookingType,
  selectedSlots,
  learningMode,
  onBack,
  onConfirm,
  isLoading
}: Step4Props) {
  const priceNum = subject?.pricePerSession || 0;
  const sessionCount = selectedSlots.length;
  const subtotal = priceNum * sessionCount;
  // Temporary discount logic for demonstration
  const discount = learningMode === "online" ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-4">
        <Label className="text-base font-bold text-foreground">Xác nhận thông tin</Label>
        
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-6">
            {/* Student & Subject */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <User size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Học sinh & Môn học</p>
                <p className="font-bold text-foreground">{child?.fullName} • Lớp {child?.grade}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                  <BookOpen size={14} className="text-blue-500" />
                  <span className="capitalize">{subject?.subjectName}</span>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-4 pt-4 border-t border-border/50">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500 shrink-0">
                <Calendar size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lịch học ({bookingType === "one-time" ? "1 buổi" : "Lâu dài"})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSlots.map((s, i) => (
                    <div key={i} className="bg-muted px-3 py-1.5 rounded-xl text-xs font-bold text-foreground flex items-center gap-1.5 border border-border">
                      <span>{DAY_LABELS[s.day]}</span>
                      <span className="text-border">|</span>
                      <span>{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mode */}
            <div className="flex items-start gap-4 pt-4 border-t border-border/50">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                learningMode === "online" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              )}>
                {learningMode === "online" ? <Monitor size={24} /> : <MapPin size={24} />}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hình thức học</p>
                <p className="font-bold text-foreground">{learningMode === "online" ? "Trực tuyến (Google Meet/Zoom)" : "Trực tiếp tại nhà"}</p>
                {learningMode === "online" && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block">Đã áp dụng giảm giá 10%</p>
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-card rounded-[2.5rem] p-8 text-foreground shadow-sm shadow-primary/5 border border-border transition-all duration-300">
            <h4 className="text-sm font-black mb-6 flex items-center gap-2.5 text-foreground uppercase tracking-wider">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CreditCard size={18} />
              </div>
              Chi tiết thanh toán
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Học phí ({sessionCount} buổi x {formatPrice(priceNum)})</span>
                <span className="text-foreground font-bold">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Giảm giá (Ưu đãi Online)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-6 mt-6 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-80">Tổng cộng thanh toán</p>
                  <p className="text-4xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">
                    {total.toLocaleString("vi-VN")}
                    <span className="text-xl ml-1 font-bold">đ</span>
                  </p>
                </div>
                <div className="text-right pb-1">
                  <p className="text-[10px] text-muted-foreground italic font-semibold opacity-60">Đã bao gồm VAT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-14 rounded-2xl border-border bg-card text-muted-foreground font-bold hover:bg-muted transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          QUAY LẠI
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-2 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>ĐANG XỬ LÝ...</span>
            </div>
          ) : (
            <>
              <CheckCircle2 size={18} />
              XÁC NHẬN ĐẶT LỊCH
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export const Step4Confirmation = memo(Step4ConfirmationBase);
Step4Confirmation.displayName = "Step4Confirmation";
