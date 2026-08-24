"use client";

import Image from "next/image";
import { Star, MapPin, Clock, Check, X, ChevronRight, GraduationCap } from "lucide-react";
import { IApplicant } from "@/server/_types/request-type";
import { toSlug, cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

import { useState, useEffect } from "react";

interface ApplicantCardProps {
  applicant: IApplicant;
  onAccept?: () => void;
  onDecline?: () => void;
}

export function ApplicantCard({
  applicant,
  onAccept,
  onDecline,
}: ApplicantCardProps) {
  const [localStatus, setLocalStatus] = useState<typeof applicant.status>(applicant.status);

  useEffect(() => {
    setLocalStatus(applicant.status);
  }, [applicant.status]);

  const handleAcceptClick = () => {
    onAccept?.();
  };

  const handleDeclineClick = () => {
    onDecline?.();
  };

  return (
    <div
      className="group bg-card rounded-3xl border border-border transition-all relative overflow-hidden p-4 md:p-5 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-muted/50 relative bg-muted/20 shadow-sm">
            <Image
              src={applicant.tutorAvatar || "https://api.dicebear.com/7.x/avataaars/png?seed=" + applicant.tutorName}
              alt={applicant.tutorName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 96px, 112px"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-3 md:space-y-4 w-full text-center md:text-left">
          <div className="flex flex-col lg:flex-row justify-between gap-3 items-center lg:items-start">
            <div className="min-w-0 flex-1 flex flex-col items-center lg:items-start w-full">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center lg:justify-start w-full">
                <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-full">
                  {applicant.tutorName}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 mt-1 flex-wrap justify-center lg:justify-start">
                <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                  <Star size={12} fill="currentColor" strokeWidth={0} />
                  <span className="text-xs md:text-sm font-bold">
                    {(applicant.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">•</span>
                <span className={cn(
                  "text-[10px] md:text-xs font-bold truncate capitalize py-0.5 px-2 rounded-full",
                  localStatus === "ACCEPTED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  localStatus === "REJECTED" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                )}>
                  {localStatus === "ACCEPTED" ? "Đã duyệt" : localStatus === "REJECTED" ? "Từ chối" : "Đang xét duyệt"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end bg-blue-50 dark:bg-blue-900/20 px-3 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl border border-blue-100 dark:border-blue-900/30 w-fit shrink-0">
              <span className="text-base md:text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {applicant.proposedPrice?.toLocaleString()}₫
              </span>
              <span className="text-blue-500/70 dark:text-blue-400/70 text-[8px] md:text-[10px] font-bold uppercase tracking-tighter">
                /buổi đề xuất
              </span>
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2 flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-[11px] md:text-sm font-semibold text-foreground/80 flex items-center gap-2 bg-muted/30 w-fit px-2.5 py-1 rounded-full border border-border/50">
              <GraduationCap size={14} className="text-blue-600" />
              <span className="truncate max-w-[200px] sm:max-w-none">
                {applicant.education || "Gia sư tự do"}
              </span>
            </p>
            {applicant.coverLetter && (
              <p className="text-muted-foreground text-[11px] md:text-sm line-clamp-2 leading-relaxed italic relative pl-0 md:pl-4 md:before:content-[''] md:before:absolute md:before:left-0 md:before:top-1.5 md:before:bottom-1.5 md:before:w-0.5 md:before:bg-blue-200 md:dark:before:bg-blue-800">
                &quot;{applicant.coverLetter}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Action Section */}
        {localStatus === "PENDING" ? (
          <div className="flex flex-row md:flex-col flex-wrap justify-center md:justify-start gap-2 md:gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border/50 w-full md:w-auto md:min-w-[140px] shrink-0">
            <Button
              onClick={handleAcceptClick}
              className="flex-1 md:flex-none md:w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 md:h-11 gap-1.5 md:gap-2 shadow-lg shadow-blue-500/20 text-[11px] md:text-sm min-w-[100px]"
            >
              <Check size={16} />
              <span className="hidden sm:inline">Chấp nhận</span>
              <span className="sm:hidden">OK</span>
            </Button>
            <Button
              onClick={handleDeclineClick}
              variant="outline"
              className="flex-1 md:flex-none md:w-full border border-destructive/30 dark:border-destructive/40 text-destructive bg-destructive/5 dark:bg-destructive/10 hover:bg-destructive hover:text-white transition-all font-bold rounded-xl h-10 md:h-11 gap-1.5 md:gap-2 text-[11px] md:text-sm min-w-[100px]"
            >
              <X size={16} />
              <span className="hidden sm:inline">Từ chối</span>
              <span className="sm:hidden">Hủy</span>
            </Button>
            <Link
              href={`/tutor/${toSlug(applicant.tutorName)}-${applicant.tutorId}`}
              className="md:w-full"
            >
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 font-bold rounded-xl h-9 md:h-10 gap-1.5 md:gap-2 text-[10px] md:text-xs"
              >
                <span>Xem hồ sơ</span>
                <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-border/50 w-full md:w-auto md:min-w-[140px] shrink-0">
            {localStatus === "ACCEPTED" && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 w-full text-center rounded-xl font-bold flex items-center justify-center gap-2">
                <Check size={16} /> Đã chấp nhận
              </div>
            )}
            {localStatus === "REJECTED" && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 w-full text-center rounded-xl font-bold flex items-center justify-center gap-2">
                <X size={16} /> Đã từ chối
              </div>
            )}
            <Link
              href={`/tutor/${toSlug(applicant.tutorName)}-${applicant.tutorId}`}
              className="md:w-full"
            >
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 font-bold rounded-xl h-9 md:h-10 gap-1.5 md:gap-2 text-[10px] md:text-xs"
              >
                <span>Xem hồ sơ</span>
                <ChevronRight size={12} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
