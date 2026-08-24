"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Briefcase,
  Shield,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import StarIcon from "@/shared/components/icons/star-icon";
import { TutorHeaderProps } from "@/shared/types/tutor-detail";

export const TutorHeader = ({ tutor }: TutorHeaderProps) => {
  const experienceYears = 5; // static for now – can be added to data model
  const [liked, setLiked] = useState(false);

  // Share to Facebook
  const handleShare = useCallback(() => {
    const pageUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`Gia sư ${tutor.name} - TutorConnect`);
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${title}`;
    window.open(
      fbShareUrl,
      "_blank",
      "width=600,height=500,noopener,noreferrer",
    );
  }, [tutor.name]);

  // Toggle Heart
  const handleLike = () => setLiked((prev) => !prev);

  return (
    <div className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-5">
        {/* Back Button */}
        <Link
          href="/tutor"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-blue-600 transition-colors text-sm font-medium mb-6"
        >
          <ChevronLeft size={18} />
          Quay lại tìm kiếm
        </Link>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-card shadow-xl shrink-0">
            <Image
              src={tutor.avatar}
              alt={tutor.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 112px, 128px"
            />
          </div>

          {/* Info block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {tutor.name}
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full">
                <Shield size={11} />
                Đã xác minh
              </Badge>
              {tutor.isTopRated && (
                <Badge className="bg-orange-100/20 text-orange-600 dark:text-orange-400 border-orange-200/30 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full">
                  ⭐ Top Rated
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-3 font-medium">
              Gia sư {tutor.subjects.slice(0, 2).join(" & ")}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 font-semibold">
                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-foreground">{tutor.rating}</span>
                <span className="text-muted-foreground font-normal">
                  ({tutor.reviewCount} đánh giá)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase size={15} className="text-muted-foreground/70" />
                {experienceYears} năm kinh nghiệm
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={15} className="text-muted-foreground/70" />
                {tutor.location}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Share → Facebook */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              title="Chia sẻ lên Facebook"
              className="rounded-xl h-10 w-10 border-border hover:border-primary/50 hover:text-primary transition-colors bg-card"
            >
              <Share2 size={17} />
            </Button>

            {/* Heart – toggles fill */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleLike}
              title={liked ? "Bỏ yêu thích" : "Yêu thích"}
              className={[
                "rounded-xl h-10 w-10 border-border transition-all active:scale-90 bg-card",
                liked
                  ? "border-red-200/50 bg-red-50/50 dark:bg-red-950/20 text-red-500 hover:bg-red-100/50 hover:border-red-300/50"
                  : "hover:border-red-200/50 hover:text-red-400 dark:hover:text-red-400",
              ].join(" ")}
            >
              <Heart
                size={17}
                className="transition-all"
                fill={liked ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
