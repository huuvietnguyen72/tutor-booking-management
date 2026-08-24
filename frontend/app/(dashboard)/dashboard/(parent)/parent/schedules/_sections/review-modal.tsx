"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string, tags: string[]) => void;
  tutorName: string;
  subject: string;
  isSubmitting?: boolean;
}

const QUICK_TAGS = [
  "Tâm huyết",
  "Đúng giờ",
  "Dễ hiểu",
  "Chuyên nghiệp",
  "Nhiệt tình",
  "Tương tác tốt"
];

export function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  tutorName,
  subject,
  isSubmitting = false
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment, selectedTags);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg bg-card rounded-3xl shadow-2xl border border-border p-6 sm:p-8 [&>button]:hidden">
        <DialogHeader className="text-center space-y-2 mb-8">
          <DialogTitle className="text-2xl font-black text-foreground">Đánh giá khóa học</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Môn <span className="font-bold text-primary">{subject}</span> cùng gia sư <span className="font-bold text-foreground">{tutorName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={40}
                    className={cn(
                      "transition-all duration-200",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-semibold text-muted-foreground h-5">
              {rating === 1 && "Kém"}
              {rating === 2 && "Chưa hài lòng"}
              {rating === 3 && "Bình thường"}
              {rating === 4 && "Hài lòng"}
              {rating === 5 && "Cực kỳ hài lòng!"}
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">Nhận xét nhanh (chọn nhiều)</label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">Chia sẻ thêm (không bắt buộc)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Gia sư dạy dỗ tận tình, phương pháp dễ hiểu..."
              className="w-full min-h-25 p-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className={cn(
              "w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
              rating > 0 && !isSubmitting
                ? "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
