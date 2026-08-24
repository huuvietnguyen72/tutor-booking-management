"use client";

import { Sparkles, TrendingUp, Users, Inbox, Search } from "lucide-react";
import { JobList } from "./_sections/job-list";
import { DirectInvitations } from "./_sections/direct-invitations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useSearchTutors } from "@/server/_actions/tutor-action";

export default function MarketplacePage() {
  const { data } = useSearchTutors({ page: 1, perPage: 1 })
  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
            Yêu cầu <span className="text-primary">Dạy học</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2">
            Quản lý các lời mời trực tiếp và khám phá các lớp học mới từ thị trường.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-linear-to-r from-primary/5 to-primary/10 px-6 py-4 rounded-3xl border border-primary/10 shadow-sm backdrop-blur-md">
           <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/png?seed=${i + 20}`} alt="User" />
                </div>
              ))}
           </div>
           <div className="text-[10px] font-black uppercase tracking-widest text-primary leading-tight">
             <span className="text-foreground">+{data?.totalElements}</span> gia sư <br/> đang hoạt động
           </div>
        </div>
      </div>

      <Tabs defaultValue="direct" className="space-y-8">
        <div className="flex items-center justify-center md:justify-start">
          <TabsList className="bg-muted/40 p-1 rounded-2xl border border-border/50 h-auto gap-1">
            <TabsTrigger 
              value="direct" 
              className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl shadow-primary/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
            >
              <Inbox size={14} />
              Lời mời riêng
            </TabsTrigger>
            <TabsTrigger 
              value="market" 
              className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl shadow-primary/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
            >
              <Search size={14} />
              Chợ lớp học
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="direct" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <DirectInvitations />
        </TabsContent>

        <TabsContent value="market" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {/* Market Stats - only for marketplace */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tỉ lệ chốt lớp</p>
                  <p className="text-xl font-black text-foreground">85%</p>
                </div>
              </div>
            </div>

            <div className="group rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Yêu cầu mới/ngày</p>
                  <p className="text-xl font-black text-foreground">50+</p>
                </div>
              </div>
            </div>

            <div className="group rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-amber-500/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Học sinh đăng ký</p>
                  <p className="text-xl font-black text-foreground">3,500+</p>
                </div>
              </div>
            </div>
          </div>

          <JobList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
