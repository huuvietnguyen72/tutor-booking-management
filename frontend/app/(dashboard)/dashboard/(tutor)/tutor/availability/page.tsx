"use client";

import { Calendar, Info } from "lucide-react";
import { WeeklyAvailability } from "./_sections/weekly-availability";

export default function TutorAvailabilityPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
            Quản lý <span className="text-primary">Lịch trống</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2">
            Mở rộng cơ hội nhận lớp bằng cách cập nhật chính xác các khoảng thời gian bạn có thể dạy.
          </p>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
          <Calendar size={14} />
          Lịch dạy định kỳ hàng tuần
        </div>
      </div>

      <div className="space-y-8">
        {/* Header Notice */}
        <div className="rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 p-6 flex flex-col md:flex-row gap-6 items-center">
           <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl bg-white dark:bg-card shadow-lg shadow-primary/10 border border-primary/20">
              <Info size={24} className="text-primary" />
           </div>
           <div className="flex-1 space-y-1 text-center md:text-left">
              <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Bạn có biết?</h4>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Hệ thống sẽ dựa trên lịch trống này để gợi ý các yêu cầu học phù hợp nhất với bạn trên <span className="text-primary font-bold underline underline-offset-4 decoration-primary/20">Marketplace</span>. 
                Gia sư có lịch trống linh hoạt thường nhận được nhiều yêu cầu hơn 40%.
              </p>
           </div>
        </div>

        <div className="rounded-4xl border border-border bg-card p-6 md:p-8 shadow-2xl shadow-primary/5">
          <WeeklyAvailability />
        </div>
      </div>
    </div>
  );
}
