"use client";

import { useState } from "react";
import { ScheduleTabs, ScheduleStatus } from "@/app/(dashboard)/dashboard/(parent)/parent/schedules/_sections/schedule-tabs";
import { ScheduleList } from "@/app/(dashboard)/dashboard/(parent)/parent/schedules/_sections/schedule-list";
import { ScheduleStats } from "@/app/(dashboard)/dashboard/(parent)/parent/schedules/_sections/schedule-stats";
import { SupportWidget } from "@/app/(dashboard)/dashboard/(parent)/parent/schedules/_sections/support-widget";
import { Calendar, Search } from "lucide-react";

export default function SchedulesPage() {
  const [activeTab, setActiveTab] = useState<ScheduleStatus>("all");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
              <Calendar className="text-blue-600 dark:text-blue-400" size={32} strokeWidth={3} />
              Lịch học của tôi
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium italic">
              Theo dõi và quản lý các buổi học sắp tới của con
            </p>
          </div>

          <div className="relative flex items-center max-w-md w-full">
            <Search className="absolute left-4 text-muted-foreground/60" size={18} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Tìm kiếm môn học, gia sư..." 
              className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main List Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-card rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-border">
              <ScheduleTabs activeTab={activeTab} onChange={setActiveTab} />
              
              <div className="mt-8">
                <ScheduleList filter={activeTab} />
              </div>
              
              <div className="mt-10 flex justify-center pt-8 border-t border-border/50">
                <button className="px-8 py-3.5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/20 active:scale-95 group">
                  Xem toàn bộ lịch sử <span className="opacity-50 group-hover:opacity-100 transition-opacity">(2024 - Hiện tại)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <ScheduleStats />
            <SupportWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
