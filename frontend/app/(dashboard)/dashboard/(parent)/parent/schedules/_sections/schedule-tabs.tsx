"use client";

import { cn } from "@/shared/lib/utils";

export type ScheduleStatus = "all" | "upcoming" | "completed" | "cancelled";

interface ScheduleTabsProps {
  activeTab: ScheduleStatus;
  onChange: (tab: ScheduleStatus) => void;
}

const TABS: { label: string; value: ScheduleStatus }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Sắp tới", value: "upcoming" },
  { label: "Đã hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

export function ScheduleTabs({ activeTab, onChange }: ScheduleTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border mb-8 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative px-6 py-4 text-sm font-bold transition-all uppercase tracking-widest whitespace-nowrap",
              isActive 
                ? "text-primary bg-primary/5" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary),0.3)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
