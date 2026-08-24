"use client";

import { CheckCircle2, Clock, Calendar, BarChart3, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useGetMySessions } from "@/server/_actions/session-action";
import { ISession } from "@/server/_types/session-type";

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  bgColorClass: string;
  isLoading?: boolean;
}

function StatItem({ label, value, icon: Icon, colorClass, bgColorClass, isLoading }: StatItemProps) {
  return (
    <div className="flex items-center gap-4 bg-card p-5 rounded-3xl border border-border shadow-sm group hover:border-primary/30 transition-all duration-300">
      <div className={cn("flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 transition-transform group-hover:scale-110 shadow-sm", bgColorClass)}>
        <Icon size={28} strokeWidth={2.5} className={colorClass} />
      </div>
      <div>
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</h4>
        {isLoading ? (
          <div className="h-8 w-12 bg-muted animate-pulse rounded-md" />
        ) : (
          <p className="text-3xl font-black text-foreground leading-none tracking-tighter">{value}</p>
        )}
      </div>
    </div>
  );
}

export function ScheduleStats() {
  const { data: response, isLoading } = useGetMySessions({ size: 1000 }); // Get all for stats
  
  const sessions = response?.content || [];
  
  const stats = {
    total: sessions.length,
    completed: sessions.filter((s: ISession) => s.status === "COMPLETED").length,
    upcoming: sessions.filter((s: ISession) => (s.status === "PENDING" || s.status === "CONFIRMED")).length,
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black text-foreground flex items-center gap-2 uppercase tracking-widest px-1">
        <BarChart3 size={18} strokeWidth={3} className="text-primary" />
        Thống kê học tập
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <StatItem 
          label="Tổng buổi học" 
          value={stats.total} 
          icon={Calendar} 
          colorClass="text-blue-600 dark:text-blue-400" 
          bgColorClass="bg-blue-500/10" 
          isLoading={isLoading}
        />
        <StatItem 
          label="Đã hoàn thành" 
          value={stats.completed} 
          icon={CheckCircle2} 
          colorClass="text-emerald-600 dark:text-emerald-400" 
          bgColorClass="bg-emerald-500/10" 
          isLoading={isLoading}
        />
        <StatItem 
          label="Sắp tới" 
          value={stats.upcoming} 
          icon={Clock} 
          colorClass="text-orange-600 dark:text-orange-400" 
          bgColorClass="bg-orange-500/10" 
          isLoading={isLoading}
        />
      </div>

      <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary hover:text-white border border-primary/20 rounded-2xl transition-all shadow-lg shadow-primary/5 active:scale-[0.98]">
        Xem báo cáo chi tiết
      </button>
    </div>
  );
}
