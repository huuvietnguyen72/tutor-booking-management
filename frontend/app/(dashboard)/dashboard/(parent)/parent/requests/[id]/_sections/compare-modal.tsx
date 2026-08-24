"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Applicant } from "@/shared/types/request";
import Image from "next/image";
import { Star, ShieldCheck } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { formatPrice } from "@/shared/lib/utils";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
}

function CompareModalBase({
  isOpen,
  onClose,
  applicants,
}: CompareModalProps) {
  if (applicants.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl rounded-3xl p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-6 md:p-8 border-b border-border bg-muted/30">
          <DialogTitle className="text-2xl md:text-3xl font-black flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={32} />
            So sánh ứng viên ({applicants.length})
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">So sánh chi tiết các tiêu chí để chọn gia sư phù hợp nhất.</DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto p-4 md:p-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left font-bold text-muted-foreground w-40 min-w-40">
                  Tiêu chí
                </th>
                {applicants.map((app) => (
                  <th key={app.id} className="p-4 min-w-50">
                    <div className="flex flex-col items-center gap-3 group">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-muted/50 group-hover:border-blue-500/50 transition-all">
                        <Image
                          src={app.avatar}
                          alt={app.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="96px"
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-foreground">{app.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                          {app.major}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {/* Row: Rating */}
              <tr>
                <td className="p-4 font-bold text-sm">Đánh giá</td>
                {applicants.map((app) => (
                  <td key={app.id} className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-200/50">
                      <Star
                        size={14}
                        className="fill-yellow-500 text-yellow-500"
                      />
                      <span className="font-bold text-yellow-700 dark:text-yellow-400">
                        {app.rating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-yellow-600/70">
                        ({app.reviewCount})
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row: Price */}
              <tr>
                <td className="p-4 font-bold text-sm">Học phí đề xuất</td>
                {applicants.map((app) => (
                  <td
                    key={app.id}
                    className="p-4 text-center font-mono font-black text-blue-600 dark:text-blue-400 text-lg"
                  >
                    {formatPrice(app.price)}
                  </td>
                ))}
              </tr>

              {/* Row: Education */}
              <tr>
                <td className="p-4 font-bold text-sm">Trình độ / Trường</td>
                {applicants.map((app) => (
                  <td
                    key={app.id}
                    className="p-4 text-center text-sm font-medium"
                  >
                    <p className="text-foreground">{app.university}</p>
                    <p className="text-muted-foreground text-xs">{app.major}</p>
                  </td>
                ))}
              </tr>

              {/* Row: Match Rate */}
              <tr>
                <td className="p-4 font-bold text-sm">Mức độ phù hợp</td>
                {applicants.map((app) => (
                  <td key={app.id} className="p-4 text-center">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 font-bold">
                      {app.matchRate}%
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Row: Response Time */}
              <tr>
                <td className="p-4 font-bold text-sm">Phản hồi</td>
                {applicants.map((app) => (
                  <td
                    key={app.id}
                    className="p-4 text-center text-xs font-semibold text-muted-foreground"
                  >
                    {app.responseTime}
                  </td>
                ))}
              </tr>

              {/* Row: Experience Short Bio */}
              <tr>
                <td className="p-4 font-bold text-sm align-top">Giới thiệu</td>
                {applicants.map((app) => (
                  <td key={app.id} className="p-4 align-top">
                    <p className="text-xs text-muted-foreground line-clamp-4 italic leading-relaxed text-center">
                      &quot;{app.bio}&quot;
                    </p>
                  </td>
                ))}
              </tr>

              {/* Row: Actions */}
              <tr>
                <td className="p-4"></td>
                {applicants.map((app) => (
                  <td key={app.id} className="p-4 text-center">
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl font-bold h-10 shadow-lg shadow-blue-500/20"
                    >
                      Chọn gia sư
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const CompareModal = memo(CompareModalBase);
CompareModal.displayName = "CompareModal";
