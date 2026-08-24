"use client";

import { Calendar } from "lucide-react";

import { ISchedule } from "@/server/_types/request-type";

interface DetailScheduleProps {
  schedule?: ISchedule[];
}

export function DetailSchedule({ schedule }: DetailScheduleProps) {
  const getDayName = (day: number) => {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return days[day % 7];
  };

  return (
    <div className="bg-card border border-border p-6 md:p-8 rounded-4xl shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
          <Calendar size={20} />
        </div>
        <h2 className="text-xl font-bold">Lịch học chi tiết</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {!schedule || schedule.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-4 italic">Chưa có lịch học cụ thể</p>
        ) : (
          schedule.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50 group hover:border-blue-500/30 transition-all">
              <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center font-black text-blue-600 shadow-sm border border-border/50 group-hover:scale-110 transition-transform">
                {item.dayOfWeek === 1 ? "CN" : `T${item.dayOfWeek}`}
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">{getDayName(item.dayOfWeek - 1)}</p>
                <p className="text-xs text-muted-foreground font-medium">{item.startTime} - {item.endTime}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
