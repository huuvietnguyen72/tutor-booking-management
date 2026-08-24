"use client";

import { BookOpen, Sparkles, AlertCircle } from "lucide-react";
import { SubjectPricingList } from "./_sections/subject-pricing-list";

export default function TutorSubjectsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
            Môn học & <span className="text-primary">Học phí</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2">
            Thiết lập các môn học bạn có thể dạy và mức phí tương ứng cho mỗi giờ dạy.
          </p>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-black uppercase tracking-widest">
          <AlertCircle size={14} />
          Yêu cầu cập nhật định kỳ
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="rounded-[2.5rem] border border-border bg-card p-4 md:p-10 shadow-xl shadow-primary/5">
            <SubjectPricingList />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="rounded-3xl bg-primary/5 border border-primary/10 p-6 space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/20 text-primary">
                 <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-primary">Mẹo tối ưu thu nhập</h4>
              <ul className="space-y-3">
                 <li className="text-[11px] font-medium text-muted-foreground leading-relaxed flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Mức giá trung bình cho khối tiểu học là 150k - 200k/giờ.
                 </li>
                 <li className="text-[11px] font-medium text-muted-foreground leading-relaxed flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Luyện thi Đại học (Lớp 12) thường có mức phí cao hơn 20 - 30%.
                 </li>
                 <li className="text-[11px] font-medium text-muted-foreground leading-relaxed flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Cập nhật môn học mới sẽ giúp hồ sơ của bạn nổi bật hơn.
                 </li>
              </ul>
           </div>

           <div className="rounded-3xl bg-muted/30 border border-border p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Lưu ý quan trọng</h4>
              <p className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed italic">
                "Việc thay đổi giá chỉ áp dụng cho các yêu cầu học mới. Các lớp học đang diễn ra vẫn giữ nguyên mức phí đã thỏa thuận."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
