"use client";

import { useMemo } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// --- Constants ---
export const HOURS = Array.from({ length: 9 }, (_, i) => 6 + i * 2); // 06:00, 08:00, ..., 22:00
export const DAYS = [
  { value: 1, label: "Thứ 2", short: "T2" },
  { value: 2, label: "Thứ 3", short: "T3" },
  { value: 3, label: "Thứ 4", short: "T4" },
  { value: 4, label: "Thứ 5", short: "T5" },
  { value: 5, label: "Thứ 6", short: "T6" },
  { value: 6, label: "Thứ 7", short: "T7" },
  { value: 7, label: "Chủ Nhật", short: "CN" },
];

/**
 * Utility to merge consecutive slots into a single range
 */
export const mergeToRanges = (daySlots: string[]) => {
  if (daySlots.length === 0) return [];
  
  const sorted = [...daySlots].sort();
  const ranges: { startTime: string; endTime: string }[] = [];
  
  let start = sorted[0];
  let current = sorted[0];
  
  for (let i = 1; i <= sorted.length; i++) {
    const next = sorted[i];
    const currentHour = parseInt(current.split(":")[0]);
    const nextHour = next ? parseInt(next.split(":")[0]) : -1;
    
    if (nextHour !== currentHour + 2) {
      ranges.push({
        startTime: `${start}:00`,
        endTime: `${(currentHour + 2).toString().padStart(2, "0")}:00:00`
      });
      start = next;
    }
    current = next;
  }
  
  return ranges;
};

interface AvailabilityGridProps {
  mode: "edit" | "select";
  selectedSlots: Record<number, string[]>;
  onSlotToggle: (day: number, hour: string) => void;
  availableSlots?: Record<number, string[]>; // Used in "select" mode
  className?: string;
  disabled?: boolean;
}

export function AvailabilityGrid({
  mode,
  selectedSlots,
  onSlotToggle,
  availableSlots,
  className,
  disabled
}: AvailabilityGridProps) {
  
  const isSlotAvailable = (day: number, hour: string) => {
    if (mode === "edit") return true; // In edit mode, all slots are "interactable"
    return availableSlots?.[day]?.includes(hour) ?? false;
  };

  const isSlotSelected = (day: number, hour: string) => {
    return selectedSlots[day]?.includes(hour) ?? false;
  };

  return (
    <div className={cn("relative overflow-x-auto custom-scrollbar", className)}>
      <div className="min-w-[800px]">
        {/* Day Header */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-border sticky top-0 z-10 bg-card/80 backdrop-blur-sm">
          <div className="p-6 border-r border-border" />
          {DAYS.map((day) => (
            <div key={day.value} className="p-6 text-center border-r border-border last:border-0 group/header transition-colors hover:bg-primary/5">
              <div className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-60 group-hover/header:text-primary transition-colors">
                {day.label}
              </div>
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        <div className="relative">
          {HOURS.map((hour) => {
            const timeStr = `${hour.toString().padStart(2, "0")}:00`;
            return (
              <div key={hour} className="grid grid-cols-[100px_repeat(7,1fr)] group">
                {/* Time Label */}
                <div className="sticky left-0 z-20 p-4 text-center border-r border-border bg-card flex items-center justify-center backdrop-blur-xs">
                  <span className="text-[10px] font-black tracking-widest text-muted-foreground opacity-60">{timeStr}</span>
                  <div className="absolute right-0 top-0 w-1 h-full bg-primary/0 group-hover:bg-primary/20 transition-all" />
                </div>

                {/* Cells */}
                {DAYS.map((day) => {
                  const available = isSlotAvailable(day.value, timeStr);
                  const selected = isSlotSelected(day.value, timeStr);

                  return (
                    <div 
                      key={day.value}
                      onClick={() => !disabled && available && onSlotToggle(day.value, timeStr)}
                      className={cn(
                        "h-20 border-r border-b border-border/50 last:border-r-0 relative transition-all duration-200 group/cell",
                        available && !disabled ? "cursor-pointer" : "cursor-not-allowed bg-muted/20 opacity-40",
                        selected ? "bg-primary/5" : available && !disabled ? "hover:bg-muted/30" : ""
                      )}
                    >
                      {selected && (
                        <div className={cn(
                          "absolute inset-1.5 rounded-2xl flex items-center justify-center animate-in zoom-in-95 duration-200 group-hover/cell:scale-105 transition-transform shadow-lg",
                          mode === "edit" ? "bg-primary shadow-primary/20" : "bg-blue-600 shadow-blue-600/20"
                        )}>
                          <span className="text-[9px] font-black tracking-widest text-white uppercase opacity-90">
                            {mode === "edit" ? "TRỐNG" : "ĐÃ CHỌN"}
                          </span>
                        </div>
                      )}
                      
                      {!selected && available && (
                        <div className="absolute inset-0 opacity-0 group-hover/cell:opacity-100 flex items-center justify-center">
                          {mode === "edit" ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600/30" />
                          )}
                        </div>
                      )}

                      {!selected && mode === "select" && available && (
                         <div className="absolute inset-1.5 rounded-2xl border border-dashed border-blue-600/20 flex items-center justify-center">
                            <span className="text-[8px] font-black text-blue-600/40 uppercase tracking-tighter">CÓ SẴN</span>
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
