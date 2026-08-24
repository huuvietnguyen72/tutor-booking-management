"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn, formatCurrency } from "@/shared/lib/utils";
import { TrendingUp, Users, DollarSign } from "lucide-react";

const MOCK_DATA = [
  { date: "01/04", revenue: 4500000, users: 12 },
  { date: "02/04", revenue: 5200000, users: 15 },
  { date: "03/04", revenue: 4800000, users: 10 },
  { date: "04/04", revenue: 6100000, users: 22 },
  { date: "05/04", revenue: 5900000, users: 18 },
  { date: "06/04", revenue: 7200000, users: 28 },
  { date: "07/04", revenue: 8500000, users: 35 },
];

export function GrowthChart() {
  const [activeTab, setActiveTab] = useState<"revenue" | "users">("revenue");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm border-none rounded-4xl overflow-hidden group">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 pb-4">
        <div>
          <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Biểu đồ tăng trưởng
          </CardTitle>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Hiệu suất hệ thống trong 7 ngày gần nhất
          </p>
        </div>
        
        <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/50">
          <button
            onClick={() => setActiveTab("revenue")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
              activeTab === "revenue" 
                ? "bg-background text-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <DollarSign size={14} />
            Doanh thu
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
              activeTab === "users" 
                ? "bg-background text-primary shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users size={14} />
            Người dùng
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-8 pt-0 h-87.5 w-full" style={{ minWidth: 0 }}>
        {!mounted ? (
          <div className="w-full h-full bg-muted/10 animate-pulse rounded-2xl" />
        ) : (
          <ResponsiveContainer width="100%" height={350} minHeight={350}>
            <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="var(--border)" 
                opacity={0.4} 
              />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: "var(--muted-foreground)" }}
                dy={10}
              />
              <YAxis 
                hide 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderRadius: "16px", 
                  border: "1px solid var(--border)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  padding: "12px"
                }}
                itemStyle={{
                  fontSize: "12px",
                  fontWeight: "900",
                  color: "var(--primary)"
                }}
                labelStyle={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "var(--muted-foreground)",
                  marginBottom: "4px"
                }}
                formatter={(value: any) => [
                  activeTab === "revenue" ? formatCurrency(Number(value)) : `${value} TV mới`,
                  activeTab === "revenue" ? "Doanh thu" : "Thành viên"
                ]}
              />
              <Area
                type="monotone"
                dataKey={activeTab}
                stroke="var(--primary)"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
