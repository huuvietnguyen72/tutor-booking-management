"use client";

import { cn } from "@/shared/lib/utils";

export type ScheduleStatus = "all" | "upcoming" | "pending" | "completed" | "cancelled";

interface ScheduleTabsProps {
  activeTab: ScheduleStatus;
  onChange: (tab: ScheduleStatus) => void;
}

export function ScheduleTabs({ activeTab, onChange }: ScheduleTabsProps) {
  const tabs: { label: string; value: ScheduleStatus; count?: number }[] = [
    { label: "Tất cả", value: "all" },
    { label: "Sắp diễn ra", value: "upcoming" },
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đã hoàn thành", value: "completed" },
    { label: "Đã hủy", value: "cancelled" },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1">
      <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-3xl w-fit border border-border/50">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 text-[11px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-[1.25rem] whitespace-nowrap",
                isActive
                  ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  "flex items-center justify-center min-w-4 h-4 md:min-w-5 md:h-5 px-1 md:px-1.5 rounded-full text-[9px] md:text-[10px] font-black",
                  isActive ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
