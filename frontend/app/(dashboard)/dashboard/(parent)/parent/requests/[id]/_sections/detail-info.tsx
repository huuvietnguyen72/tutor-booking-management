"use client";

import { memo } from "react";
import {
  MapPin,
  DollarSign,
  BookOpen,
  GraduationCap,
  Clock,
} from "lucide-react";
import { cn, formatPrice } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";

interface DetailInfoProps {
  subject: string;
  grade: string;
  salary: number;
  method: string;
  sessionsPerWeek: number;
  location?: string;
}

function DetailInfoBase({
  subject,
  grade,
  salary,
  method,
  sessionsPerWeek,
  location,
}: DetailInfoProps) {
  return (
    <div className="bg-card border border-border p-6 md:p-8 rounded-4xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-blue-500">
        <BookOpen size={160} />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <BookOpen size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {subject}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className="bg-muted/50 border-none font-bold text-xs uppercase tracking-wider px-3 text-muted-foreground"
            >
              {grade}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-border pt-8 relative z-10">
        {[
          {
            label: "Mức lương",
            value: formatPrice(salary || 0, " / buổi"),
            icon: DollarSign,
            color: "text-emerald-500 bg-emerald-500/10",
          },
          {
            label: "Hình thức",
            value: method,
            icon: GraduationCap,
            color: "text-blue-500 bg-blue-500/10",
          },
          {
            label: "Số buổi",
            value: `${sessionsPerWeek} buổi/tuần`,
            icon: Clock,
            color: "text-amber-500 bg-amber-500/10",
          },
          {
            label: "Khu vực",
            value: location || "Toàn quốc",
            icon: MapPin,
            color: "text-rose-500 bg-rose-500/10",
          },
        ].map((item, i) => (
          <div key={i} className="space-y-2 group">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", item.color)}>
                <item.icon size={14} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                {item.label}
              </span>
            </div>
            <p className="text-base md:text-lg font-bold tracking-tight text-foreground group-hover:text-blue-600 transition-colors">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const DetailInfo = memo(DetailInfoBase);
DetailInfo.displayName = "DetailInfo";
