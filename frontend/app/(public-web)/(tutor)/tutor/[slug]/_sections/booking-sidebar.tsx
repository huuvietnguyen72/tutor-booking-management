"use client";

import { useState, useMemo } from "react";
import { DatePickerInput } from "@/shared/components/ui/calendar";
import {
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useRouter, useParams } from "next/navigation";
import { BookingSidebarProps } from "@/shared/types/tutor-detail";
import { useGetMe } from "@/server/_actions/auth-action";
import { toast } from "sonner";
import { getCookie } from "cookies-next";
import { APP_SAVE_KEY } from "@/shared/constants/app";
import { formatPrice, formatToYYYYMMDD } from "@/shared/lib/utils";

export function BookingSidebar({ price, subjects, apiSubjects = [] }: BookingSidebarProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Only fetch user identity if a token exists to avoid 401 redirects for guests
  const hasToken = !!getCookie(APP_SAVE_KEY.TOKEN_KEY);
  const { data: user, isLoading } = useGetMe({ enabled: hasToken });

  // Find selected subject price
  const activeSubject = useMemo(() => {
    if (apiSubjects.length > 0) {
      return apiSubjects.find(s => s.id.toString() === selectedSubjectId);
    }
    return null;
  }, [apiSubjects, selectedSubjectId]);

  const currentPrice = activeSubject ? activeSubject.pricePerSession : price;

  const handleBookingClick = () => {
    if (isLoading) return;

    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt lịch học!");
      const callbackUrl = `/tutor/${slug}/booking`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (!selectedSubjectId) {
      toast.warning("Vui lòng chọn môn học bạn muốn đăng ký!");
      return;
    }

    const dateParam = selectedDate ? `&startDate=${formatToYYYYMMDD(selectedDate)}` : "";
    router.push(`/tutor/${slug}/booking?subjectId=${selectedSubjectId}${dateParam}`);
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-8">
      {/* Booking Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-5">
        <h3 className="text-lg font-bold text-foreground text-center">Đăng ký học ngay</h3>

        {/* Subject Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Chọn môn học
          </label>
          <Select onValueChange={setSelectedSubjectId} value={selectedSubjectId}>
            <SelectTrigger className="rounded-xl border border-border bg-card h-10 text-sm text-foreground">
              <SelectValue placeholder="Chọn môn học..." />
            </SelectTrigger>
            <SelectContent>
              {apiSubjects.length > 0 ? (
                apiSubjects.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.subjectName} – {formatPrice(s.pricePerSession)}
                  </SelectItem>
                ))
              ) : (
                subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s} – {formatPrice(price)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Date Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Buổi học đầu tiên
          </label>
          <DatePickerInput
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Chọn ngày..."
            minDate={new Date()}
          />
        </div>

        {/* Price Summary */}
        <div className="bg-secondary/30 dark:bg-secondary/10 border border-border/50 rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>Đơn giá</span>
            <span className="font-medium text-foreground">{formatPrice(currentPrice)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>Thời lượng</span>
            <span className="font-medium text-foreground">90 phút</span>
          </div>
          <div className="border-t border-border/60 pt-2 flex justify-between font-bold text-foreground">
            <span>Tạm tính</span>
            <span className="text-primary text-base">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={handleBookingClick}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl text-sm shadow-md shadow-primary/20 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Calendar size={16} />
          Đặt lịch học ngay
        </Button>

        <p className="text-center text-[11px] text-muted-foreground font-medium">
          Miễn phí thay đổi lịch • Không mất phí đặt cọc
        </p>
      </div>

      {/* Safety Badge */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-emerald-950/20 flex items-center justify-center text-green-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm mb-0.5">
              Đảm bảo an toàn
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hồ sơ gia sư đã được xác minh danh tính và bằng cấp bởi đội ngũ
              của chúng tôi.
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            "Đã xác minh danh tính",
            "Bằng cấp được kiểm duyệt",
            "Hoàn phí buổi đầu nếu không hài lòng",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
            >
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Consultant CTA */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="font-bold mb-1 text-sm flex items-center gap-1.5">
            <MessageSquare size={15} />
            Cần hỗ trợ tư vấn?
          </p>
          <p className="text-blue-100 text-xs mb-3 leading-relaxed opacity-90">
            Chúng tôi sẽ giúp bạn tìm được gia sư phù hợp nhất.
          </p>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl w-full h-9 text-sm transition-all">
            Kết nối ngay
          </Button>
        </div>
        <div className="absolute -right-6 -bottom-6 h-24 w-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
