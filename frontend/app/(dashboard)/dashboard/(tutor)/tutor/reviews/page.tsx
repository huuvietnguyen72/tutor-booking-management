"use client";

import { 
  Star, 
  MessageSquare, 
  Search, 
  Filter, 
  Quote,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react";
import { useGetTutorReviews, useGetTutorProfile } from "@/server/_actions/tutor-action";
import { cn } from "@/shared/lib/utils";
import { getReviewAvatarUrl, getReviewDisplayName, normalizeTutorReviewResponses } from "@/shared/lib/review-utils";

export default function TutorReviewsPage() {
  const { data: profile, isLoading: isProfileLoading } = useGetTutorProfile();
  const { data: reviewsSummary, isLoading: isReviewsLoading } = useGetTutorReviews(profile?.id || "");

  const isLoading = isProfileLoading || isReviewsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8 animate-pulse">
        <div className="h-60 w-full bg-muted rounded-4xl" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-3xl" />)}
        </div>
      </div>
    );
  }

   const averageRating = Number(reviewsSummary?.averageRating ?? 0).toFixed(1);
  const totalReviews = reviewsSummary?.totalReviews || 0;
   const reviewsList = normalizeTutorReviewResponses(reviewsSummary?.reviews);

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
            Đánh giá & <span className="text-primary">Phản hồi</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2">
            Lắng nghe ý kiến từ học sinh để không ngừng cải thiện chất lượng giảng dạy.
          </p>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-card border border-border shadow-sm">
           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Award size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Thứ hạng</p>
              <p className="text-xs font-black text-foreground uppercase tracking-tight">Top 5% Gia sư xuất sắc</p>
           </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="rounded-4xl border border-border bg-card p-10 shadow-xl shadow-primary/5 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Quote size={120} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
           <div className="text-center md:text-left space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Đánh giá trung bình</h4>
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <span className="text-6xl font-black text-foreground tracking-tighter">{averageRating}</span>
                 <div className="space-y-1">
                    <div className="flex gap-1">
                       {[1, 2, 3, 4, 5].map((s) => (
                         <Star 
                           key={s} 
                           size={16} 
                           className={cn(
                             "fill-current",
                             s <= Math.round(Number(averageRating)) ? "text-amber-400" : "text-muted"
                           )} 
                         />
                       ))}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dựa trên {totalReviews} đánh giá</p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-4 py-8 md:py-0 border-y md:border-y-0 md:border-x border-border px-0 md:px-12">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                 <span className="flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500" /> Tỉ lệ hài lòng</span>
                 <span className="text-emerald-600">98%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                 <div className="h-full w-[98%] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                Đánh giá cao giúp bạn nổi bật hơn trên kết quả tìm kiếm.
              </p>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary">
                    <Star size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Môn dạy tốt nhất</p>
                    <p className="text-sm font-black text-foreground">Toán học (Lớp 12)</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-500/5 text-amber-500">
                    <MessageSquare size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tốc độ phản hồi</p>
                    <p className="text-sm font-black text-foreground">~ 15 phút</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Tất cả nhận xét</h3>
            <div className="flex items-center gap-4">
               <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-card border border-border text-muted-foreground hover:border-primary transition-all">
                  <Search size={16} />
               </button>
               <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-card border border-border text-muted-foreground hover:border-primary transition-all">
                  <Filter size={16} />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {reviewsList.length > 0 ? (
                     reviewsList.map((review) => (
                <div 
                  key={review.id} 
                  className="group relative rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                >
                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="h-12 w-12 rounded-2xl border-2 border-primary/20 bg-primary/5 overflow-hidden">
                                                   <img
                                                      src={getReviewAvatarUrl(review)}
                                                      alt="Reviewer"
                                                   />
                               </div>
                               <div>
                                                   <h4 className="text-sm font-black text-foreground uppercase tracking-tight">
                                                      {getReviewDisplayName(review)}
                                                   </h4>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{review.subjectName || "Môn học"}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-1">
                               {[1, 2, 3, 4, 5].map((s) => (
                                 <Star 
                                   key={s} 
                                   size={14} 
                                   className={cn(
                                     "fill-current",
                                                       s <= Number(review.rating || 0) ? "text-amber-400" : "text-muted"
                                   )} 
                                 />
                               ))}
                            </div>
                         </div>
  
                         <div className="relative">
                            <Quote className="absolute -left-2 -top-2 h-4 w-4 text-primary/10" />
                            <p className="text-sm font-medium leading-relaxed text-foreground/80 pl-4 py-1">
                              {review.comment}
                            </p>
                         </div>
  
                         <div className="pt-4 flex items-center justify-between border-t border-border/50">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                               <Calendar size={12} />
                               {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                                 day: "2-digit",
                                 month: "2-digit",
                                 year: "numeric"
                               })}
                            </div>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                              Phản hồi
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-card rounded-4xl border border-dashed border-border/60">
                <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-muted/30 text-muted-foreground mb-6">
                  <MessageSquare size={40} strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-black text-foreground uppercase tracking-tight">Chưa có đánh giá nào</h4>
                <p className="text-sm text-muted-foreground font-medium mt-2">
                  Bạn hiện chưa nhận được phản hồi nào từ học sinh.
                </p>
              </div>
            )}
         </div>

         {reviewsList.length > 0 && (
           <div className="pt-8 flex justify-center">
              <button className="h-14 px-10 rounded-2xl bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all active:scale-95">
                 Xem thêm đánh giá
              </button>
           </div>
         )}
      </div>
    </div>
  );
}
