"use client";

import { useState } from "react";
import { ScheduleTabs, ScheduleStatus } from "./_sections/schedule-tabs";
import { ScheduleList } from "./_sections/schedule-list";
import { ScheduleStats } from "./_sections/schedule-stats";
import { Calendar, Search, Filter } from "lucide-react";
import { useGetMySessions } from "@/server/_actions/session-action";

export default function TutorSchedulePage() {
  const [activeTab, setActiveTab] = useState<ScheduleStatus>("all");
  const { data: sessionsResponse, isLoading } = useGetMySessions({
    size: 100 // Lấy nhiều một chút để tính toán stats
  });
  const sessions = sessionsResponse?.content || [];

  return (
    <div className="min-h-screen bg-background px-3 py-6 md:p-8">
      <div className="max-w-350 mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-primary/10 text-primary">
                <Calendar size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                Lịch dạy của tôi
              </h1>
            </div>
            <p className="text-muted-foreground text-[13px] md:text-sm font-medium italic pl-1 md:pl-1">
              Theo dõi và quản lý các buổi giảng dạy sắp tới của bạn
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} strokeWidth={2.5} />
              <input 
                type="text" 
                placeholder="Tìm học sinh, môn học..." 
                className="w-full pl-10 pr-4 py-3 md:py-3.5 bg-card border border-border rounded-xl md:rounded-2xl text-[13px] md:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all shadow-xs placeholder:text-muted-foreground/50"
              />
            </div>
            <button className="p-3 md:p-3.5 bg-card border border-border rounded-xl md:rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-xs active:scale-95 shrink-0">
              <Filter size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Main List Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-card rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 shadow-xs border border-border">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                <ScheduleTabs activeTab={activeTab} onChange={setActiveTab} />
                <div className="text-[10px] md:text-xs font-black text-muted-foreground/60 uppercase tracking-tighter pl-1">
                  Đang hiển thị {activeTab === "all" ? "tất cả" : activeTab} • {sessions.length} buổi học
                </div>
              </div>
              
              <div className="mt-6 md:mt-8">
                <ScheduleList filter={activeTab} sessions={sessions} isLoading={isLoading} />
              </div>
              
              <div className="mt-8 md:mt-10 flex justify-center pt-8 border-t border-border/50">
                <button className="w-full md:w-auto px-8 py-3.5 text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-primary/20 active:scale-95 group">
                  Tải thêm lịch sử dạy <span className="hidden md:inline opacity-50 group-hover:opacity-100 transition-opacity">(Dữ liệu cũ hơn)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <ScheduleStats sessions={sessions} />
            
            {/* Quick Support Card */}
            <div className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-4xl p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-10 transition-transform duration-500 group-hover:scale-110">
                <Calendar size={140} strokeWidth={3} />
              </div>
              <h4 className="text-xl font-black mb-2 tracking-tight">Hỗ trợ giảng dạy</h4>
              <p className="text-sm text-white/80 font-medium mb-6 leading-relaxed">
                Bạn cần báo cáo học sinh vắng mặt hoặc gặp lỗi kỹ thuật trong buổi dạy?
              </p>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95">
                Gửi yêu cầu hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
