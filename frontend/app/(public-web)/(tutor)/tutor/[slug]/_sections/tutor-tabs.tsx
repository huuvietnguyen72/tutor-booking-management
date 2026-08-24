"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, Calendar, MessageSquare } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatTimeAgo } from "@/shared/lib/utils";
import { mapTutorReviewResponsesToDisplayReviews, normalizeTutorReviewResponses } from "@/shared/lib/review-utils";
import StarIcon from "@/shared/components/icons/star-icon";
import { Review, TutorTabsProps } from "@/shared/types/tutor-detail";
import { useGetTutorReviews } from "@/server/_actions/review-action";
import { IReviewResponse } from "@/server/_types/review-type";
import { ITutorAvailability, ITutorSubject } from "@/server/_types/tutor-type";

// Static Constants

const DAYS_NAME = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const TIME_SLOTS = [
  { start: "08:00", end: "10:00", label: "08:00 - 10:00" },
  { start: "10:00", end: "12:00", label: "10:00 - 12:00" },
  { start: "14:00", end: "16:00", label: "14:00 - 16:00" },
  { start: "16:00", end: "18:00", label: "16:00 - 18:00" },
  { start: "18:00", end: "20:00", label: "18:00 - 20:00" },
  { start: "20:00", end: "22:00", label: "20:00 - 22:00" },
];

const MOCK_REVIEWS: Review[] = [
  {
    name: "Lê Thị B",
    comment:
      "Thầy A dạy rất nhiệt tình, các phương pháp giải toán mới giúp em hiểu bài nhanh hơn nhiều.",
    rating: 5,
    timeAgo: "2 ngày trước",
  },
];

// Sub-components

function SubjectsTab({
  subjects,
  price,
  levels,
  format,
  apiSubjects,
}: Pick<TutorTabsProps, "subjects" | "price" | "levels" | "format" | "apiSubjects">) {
  // If we have API subjects, use them, otherwise fallback to mock
  const displaySubjects = apiSubjects && apiSubjects.length > 0
    ? apiSubjects.map(s => ({
        name: s.subjectName,
        price: s.pricePerSession,
        grade: s.gradeLevel === 0 ? "Mọi khối lớp" : `Khối ${s.gradeLevel}`
      }))
    : subjects.map(s => ({
        name: s,
        price: price,
        grade: levels[0] || "Dành cho mọi trình độ"
      }));

  return (
    <div className="space-y-6">
      {/* Subjects & Pricing */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Môn giảng dạy &amp; Giá
        </h3>
        <div className="space-y-2">
          {displaySubjects.map((subject, idx) => (
            <div
              key={`${subject.name}-${idx}`}
              className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/50"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground font-medium text-sm">
                    {subject.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] py-0 h-4 border-primary/20 bg-primary/5 text-primary">
                    {subject.grade}
                  </Badge>
                </div>
              </div>
              <span className="text-primary font-bold text-sm">
                {subject.price.toLocaleString("vi-VN")}đ / buổi
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Đối tượng học viên
        </h3>
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <Badge
              key={level}
              className="bg-card text-foreground border border-border px-3 py-1 rounded-lg text-xs font-semibold"
            >
              {level}
            </Badge>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Hình thức học
        </h3>
        <div className="flex flex-wrap gap-2">
          {format.map((f) => (
            <Badge
              key={f}
              className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-lg text-xs font-semibold"
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScheduleTab({ availability = [] }: { availability?: ITutorAvailability[] }) {
  // Helper to convert time string to minutes
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const isSlotAvailable = (dayIdx: number, startStr: string, endStr: string) => {
    const dayOfWeek = dayIdx + 1; // 1 (Mon) to 7 (Sun)
    const slotStart = timeToMinutes(startStr);
    const slotEnd = timeToMinutes(endStr);

    return availability.some(a => {
      if (!a.isActive || a.dayOfWeek !== dayOfWeek) return false;
      
      const availStart = timeToMinutes(a.startTime as unknown as string);
      const availEnd = timeToMinutes(a.endTime as unknown as string);
      
      // Check for overlap: max(start1, start2) < min(end1, end2)
      return Math.max(slotStart, availStart) < Math.min(slotEnd, availEnd);
    });
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Lịch rảnh trong tuần
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-muted-foreground/60 font-medium text-left pl-1 py-1 w-28">
                Khung giờ
              </th>
              {DAYS_NAME.map((day) => (
                <th
                  key={day}
                  className="text-muted-foreground font-semibold text-center py-1 min-w-13"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.label}>
                <td className="text-muted-foreground font-medium text-left py-1.5 pl-1 pr-2 text-[11px]">
                  {slot.label}
                </td>
                {DAYS_NAME.map((_, dayIdx) => {
                  const available = isSlotAvailable(dayIdx, slot.start, slot.end);
                  return (
                    <td key={dayIdx} className="text-center py-1">
                      {available ? (
                        <span className="inline-block bg-primary/15 text-primary font-bold px-1.5 py-0.5 rounded-md text-[10px]">
                          Trống
                        </span>
                      ) : (
                        <span className="inline-block w-4 h-4 rounded-sm bg-muted/40" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground/60 mt-3">
        * Lịch trống được cập nhật từ phía gia sư. Vui lòng nhắn tin để xác nhận chính xác.
      </p>
    </div>
  );
}

function ReviewsTab({
  rating,
  reviewCount,
  tutorId,
}: Pick<TutorTabsProps, "rating" | "reviewCount" | "tutorId">) {
  const PREVIEW_LIMIT = 5;
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviewPageSize = showAllReviews ? Math.max(reviewCount, PREVIEW_LIMIT) : PREVIEW_LIMIT;

  const { data: apiReviews, isLoading, isFetching } = useGetTutorReviews(tutorId, {
    page: 0,
    size: reviewPageSize,
  });

  const reviewItems = normalizeTutorReviewResponses(apiReviews?.reviews);

  const averageRating = Number(apiReviews?.averageRating ?? rating ?? 0);
  const totalReviews = Number(apiReviews?.totalReviews ?? reviewCount ?? reviewItems.length);

  const reviews: Review[] = mapTutorReviewResponsesToDisplayReviews(reviewItems) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Đang tải đánh giá...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <div className="text-4xl font-black text-foreground">{averageRating.toFixed(1)}</div>
        <div>
          <div className="flex gap-0.5 mb-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <StarIcon
                  key={i}
                  className={
                    i < Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted fill-muted"
                  }
                />
              ))}
          </div>
          <p className="text-xs text-muted-foreground">{totalReviews} đánh giá</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, i) => (
            <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                    {review.avatar ? (
                      <Image 
                        src={review.avatar} 
                        alt={review.name} 
                        width={32}
                        height={32}
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      review.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{review.timeAgo}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array(Math.max(0, Math.min(5, Math.round(review.rating))))
                    .fill(0)
                    .map((_, idx) => (
                      <StarIcon
                        key={idx}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                &quot;{review.comment}&quot;
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-2xl bg-muted/20 border border-dashed border-border/50">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageSquare className="text-muted-foreground/50" size={24} />
            </div>
            <p className="text-sm font-medium text-foreground/70">Chưa có đánh giá nào</p>
            <p className="text-xs text-muted-foreground mt-1">Hãy là người đầu tiên để lại nhận xét!</p>
          </div>
        )}
      </div>

      {reviews.length > 0 && (totalReviews > PREVIEW_LIMIT || showAllReviews) && (
        <Button
          variant="ghost"
          className="w-full text-primary font-semibold hover:bg-primary/10 rounded-xl text-sm"
          onClick={() => setShowAllReviews((current) => !current)}
          disabled={isFetching && showAllReviews}
        >
          {showAllReviews
            ? (isFetching ? "Đang tải thêm đánh giá..." : "Thu gọn đánh giá")
            : (isFetching ? "Đang tải tất cả đánh giá..." : `Xem tất cả ${totalReviews} đánh giá`)}
        </Button>
      )}
    </div>
  );
}

// Main Component

const TABS = [
  { id: "subjects", label: "Môn dạy & Giá", icon: BookOpen },
  { id: "schedule", label: "Lịch rảnh", icon: Calendar },
  { id: "reviews", label: "Đánh giá", icon: MessageSquare },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TutorTabs({
  subjects,
  price,
  levels,
  format,
  rating,
  reviewCount,
  tutorId,
  apiAvailability,
  apiSubjects,
}: TutorTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("subjects");

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-border/50">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-semibold transition-colors relative ${
              activeTab === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            {activeTab === id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === "subjects" && (
          <SubjectsTab
            subjects={subjects}
            price={price}
            levels={levels}
            format={format}
            apiSubjects={apiSubjects}
          />
        )}
        {activeTab === "schedule" && <ScheduleTab availability={apiAvailability} />}
        {activeTab === "reviews" && (
          <ReviewsTab
            rating={rating}
            reviewCount={reviewCount}
            tutorId={tutorId}
          />
        )}
      </div>
    </div>
  );
}
