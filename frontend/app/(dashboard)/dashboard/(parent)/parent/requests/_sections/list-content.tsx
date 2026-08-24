"use client";

import { Filter } from "lucide-react";
import { RequestCard } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/_sections/request-card";
import { IRequest } from "@/server/_types/request-type";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ListContentProps {
  isLoading: boolean;
  requests: IRequest[];
}

function RequestsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card border border-border p-5 rounded-3xl flex flex-col md:flex-row gap-6 animate-pulse">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end md:border-l border-border/50 md:pl-6">
            <Skeleton className="h-14 w-40 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListContent({ isLoading, requests }: ListContentProps) {
  if (isLoading) {
    return <RequestsSkeleton />;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border/50 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Filter size={32} className="text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">Không tìm thấy yêu cầu</h3>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 leading-relaxed">
          Bạn chưa có yêu cầu nào phù hợp với bộ lọc. Hãy thử thay đổi bộ lọc hoặc đăng yêu cầu mới!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}
