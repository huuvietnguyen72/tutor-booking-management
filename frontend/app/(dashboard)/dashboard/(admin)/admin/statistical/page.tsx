"use client";

import { useGetAdminStats, useGetTopTutors } from "@/server/_actions/admin-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { 
  Users, 
  ShieldCheck, 
  BarChart3, 
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { cn, formatCurrency } from "@/shared/lib/utils";
import { GrowthChart } from "./_sections/growth-chart";
import Image from "next/image";


const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  colorClass 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  description?: string;
  trend?: string;
  colorClass: string;
}) => (
  <Card className="overflow-hidden border-none shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm group hover:scale-[1.02] transition-all duration-500">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-black tracking-widest text-muted-foreground uppercase">
        {title}
      </CardTitle>
      <div className={cn("p-2.5 rounded-2xl transition-all duration-500 group-hover:scale-110", colorClass)}>
        <Icon size={18} className="text-white drop-shadow-sm" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-black tracking-tighter mb-1.5">{value}</div>
      <div className="flex items-center gap-1.5">
        {trend && (
          <span className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-lg">
            <ArrowUpRight size={10} strokeWidth={3} className="mr-0.5" />
            {trend}
          </span>
        )}
        <p className="text-[11px] font-bold text-muted-foreground leading-none">
          {description}
        </p>
      </div>
    </CardContent>
    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
      <Icon size={120} strokeWidth={1} />
    </div>
  </Card>
);

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetAdminStats();


  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          <span className="p-3 bg-primary/10 rounded-3xl">
            <BarChart3 className="text-primary" size={32} />
          </span>
          Trung tâm Quản trị
        </h1>
        <p className="text-muted-foreground font-medium pl-1">
          Theo dõi hiệu suất và quản lý tài nguyên hệ thống theo thời gian thực.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-35 w-full rounded-3xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Tổng Người Dùng"
              value={stats?.totalUsers || 0}
              icon={Users}
              description="Người dùng đã đăng ký"
              trend="+12%"
              colorClass="bg-blue-500 shadow-lg shadow-blue-500/30"
            />
            <StatCard
              title="Tổng Gia Sư"
              value={stats?.totalTutors || 0}
              icon={BarChart3}
              description="Gia sư đã được duyệt"
              trend="+8%"
              colorClass="bg-indigo-500 shadow-lg shadow-indigo-500/30"
            />
            <StatCard
              title="Chờ Phê Duyệt"
              value={stats?.pendingTutors || 0}
              icon={ShieldCheck}
              description="Hồ sơ mới cần kiểm tra"
              colorClass="bg-orange-500 shadow-lg shadow-orange-500/30"
            />
            <StatCard
              title="Tổng Doanh Thu"
              value={formatCurrency(stats?.totalRevenue || 0)}
              icon={CreditCard}
              description="Giao dịch thành công"
              trend="+24%"
              colorClass="bg-emerald-500 shadow-lg shadow-emerald-500/30"
            />
          </>
        )}
      </div>

      {/* Charts & Activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <GrowthChart />
        </div>
        <div className="lg:col-span-2">
          <TopTutorsSection />
        </div>
      </div>
    
    </div>
  );
};

const TopTutorsSection = () => {
  const { data: topTutorsData, isLoading } = useGetTopTutors();
  const topTutors = Array.isArray(topTutorsData) ? topTutorsData : (topTutorsData as any)?.content || [];

  return (
    <Card className="border-none shadow-xl shadow-black/5 bg-card/40 backdrop-blur-md rounded-4xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black tracking-tight">Gia Sư Top Đầu</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(topTutors || []).slice(0, 5).map((tutor: any, index: number) => (
              <div key={tutor.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary overflow-hidden">
                      {tutor.avatarUrl ? (
                        <Image src={tutor.avatarUrl} alt={tutor.fullName} fill className="object-cover" />
                      ) : (
                        tutor.fullName?.charAt(0) || "T"
                      )}
                    </div>
                    <div className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-yellow-400 border-2 border-background flex items-center justify-center text-[10px] font-black text-yellow-900 shadow-sm">
                      #{index + 1}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{tutor.fullName}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{tutor.subjectCount || 0} môn học • {tutor.totalSessions || 0} buổi dạy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-emerald-600">{formatCurrency(tutor.earnings || 0)}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;