"use client";

import { IRequest } from "@/server/_types/request-type";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ListStatsProps {
  requests: IRequest[];
  isLoading?: boolean;
}

export function ListStats({ requests, isLoading }: ListStatsProps) {
  const stats = [
    { label: "Tổng yêu cầu", value: requests.length },
    {
      label: "Số gia sư ứng tuyển",
      value: requests.reduce(
        (acc, curr) => acc + (curr.applicantsCount || 0),
        0,
      ),
    },
    {
      label: "Đang tìm kiếm",
      value: requests.filter(
        (r) => r.status === "SEARCHING" || r.status === "HAS_APPLICANTS",
      ).length,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-card border border-border p-6 rounded-3xl group hover:border-blue-500/50 transition-all shadow-sm"
        >
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">
            {stat.label}
          </span>
          {isLoading ? (
            <Skeleton className="h-10 w-16 mt-2" />
          ) : (
            <p className="text-4xl font-black text-foreground mt-2 tracking-tight">
              {stat.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
