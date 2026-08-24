"use client";

import Image from "next/image";
import { memo } from "react";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react";
import { formatPrice, toSlug } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { ITutorDetail } from "@/server/_types/tutor-type";

interface TutorCardProps {
  tutor: ITutorDetail | any; // Accept ITutorDetail or legacy Tutor for transitions
}

function TutorCardBase({ tutor }: TutorCardProps) {
  // Mapping API fields to UI terms with fallbacks
  const name = tutor.fullName || tutor.name || "Gia sư";
  const avatar = tutor.avatarUrl || tutor.avatar || "https://api.dicebear.com/7.x/avataaars/png?seed=" + name;
  const rating = tutor.rating || 5.0;
  const reviewCount = tutor.reviewCount || 0;
  
  // Handling price - Search API currently missing this
  // We'll use a placeholder or try to find it in the object
  const price = tutor.price ? formatPrice(tutor.price) : "Từ 150k₫";
  
  // Handling subjects - Search API missing this
  const subjects = Array.isArray(tutor.subjects) ? tutor.subjects : ["Toán học", "Tiếng Anh"]; 

  const education = tutor.educationLevel || tutor.university || "Đại học";
  const major = tutor.qualifications || tutor.major || "Sư phạm";
  const bio = tutor.experience || tutor.bio || "Tận tâm, nhiệt tình với học viên...";
  const location = tutor.teachingArea || tutor.location || "Toàn quốc";
  const responseTime = tutor.responseTime || "Trả lời nhanh";

  return (
    <div className="group bg-card rounded-3xl border border-border p-5 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Section */}
        <div className="relative shrink-0 self-center md:self-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-muted/50 relative bg-muted/20 shadow-sm">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 96px, 128px"
            />
          </div>
          {tutor.isTopRated && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-blue-500/30 uppercase tracking-wider z-10">
              TOP RATE
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-y-2">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                  <Star size={14} fill="currentColor" strokeWidth={0} />
                  <span className="text-sm font-bold">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  ({reviewCount} đánh giá)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground/80 flex items-center gap-2 bg-muted/30 w-fit px-3 py-1 rounded-full border border-border/50">
              <span className="text-blue-600 dark:text-blue-400">🎓</span>
              {education} • {major}
            </p>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed italic relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200 dark:before:bg-blue-800">
              &quot;{bio}&quot;
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {subjects.map((subject: string) => (
              <Badge
                key={subject}
                variant="outline"
                className="bg-muted/50 text-foreground/70 border-border font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 hover:border-transparent transition-colors rounded-lg px-2.5 py-0.5 text-[11px]"
              >
                {subject}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
              <MapPin size={14} className="text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
              {location}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
              <Clock size={14} className="text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
              {responseTime}
            </div>
          </div>
        </div>

        {/* Action Section (Mobile layout adjustment) */}
        <div className="flex md:flex-col items-center md:items-stretch justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
          <Link href={`/tutor/${toSlug(name)}-${tutor.id}`} className="w-full">
            <Button
              variant="outline"
              className="w-full md:w-32 border-blue-600/30 text-blue-600 dark:text-blue-400 dark:border-blue-400/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all font-bold rounded-xl h-11 group/btn gap-2"
            >
              Hồ sơ
              <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const TutorCard = memo(TutorCardBase);
TutorCard.displayName = "TutorCard";
