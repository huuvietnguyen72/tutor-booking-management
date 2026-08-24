"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/lib/utils";

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const SHORT_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const SLOTS = [
  { id: "morning", label: "Sáng", time: "08:00 - 12:00" },
  { id: "afternoon", label: "Chiều", time: "13:00 - 17:00" },
  { id: "evening", label: "Tối", time: "18:00 - 21:00" },
  { id: "night", label: "Đêm", time: "21:00 - 23:00" },
];

export interface ScheduleSlot {
  day: number; // 0-6 (Mon-Sun)
  slotId: string;
}

interface ScheduleSelectorProps {
  value: ScheduleSlot[];
  onChange: (value: ScheduleSlot[]) => void;
  className?: string;
}

export function ScheduleSelector({ value, onChange, className }: ScheduleSelectorProps) {
  const toggleSlot = (day: number, slotId: string) => {
    const exists = value.find((s) => s.day === day && s.slotId === slotId);
    if (exists) {
      onChange(value.filter((s) => !(s.day === day && s.slotId === slotId)));
    } else {
      onChange([...value, { day, slotId }]);
    }
  };

  return (
    <div className={cn("bg-card border border-border rounded-2xl p-2 md:p-6 space-y-2 md:space-y-4 shadow-sm", className)}>
      <div className="overflow-x-auto rounded-xl border border-border bg-muted/5">
        <table className="w-full border-collapse min-w-[320px] md:min-w-0">
          <thead>
            <tr className="bg-muted/10">
              <th className="p-0 md:p-3 font-bold text-[7.5px] md:text-[11px] uppercase tracking-wider text-muted-foreground w-11 md:w-28 border-b border-border text-center">Buổi</th>
              {SHORT_DAYS.map((day, i) => (
                <th key={i} className="p-0 md:p-3 text-center font-bold text-[8px] md:text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot.id} className="hover:bg-muted/10 transition-colors">
                <td className="p-0 md:p-4 border-b border-r border-border shrink-0">
                  <div className="flex flex-col items-center justify-center leading-none h-7 md:h-auto">
                    <span className="font-bold text-foreground text-[8.5px] md:text-sm">{slot.label}</span>
                    <span className="text-[10px] text-muted-foreground font-medium opacity-50 scale-90 origin-center truncate max-w-[40px]">{slot.time.split(' - ')[0]}</span>
                  </div>
                </td>
                {DAYS.map((_, dayIndex) => {
                  const isChecked = !!value.find((s) => s.day === dayIndex && s.slotId === slot.id);
                  return (
                    <td key={dayIndex} className="p-0 md:p-4 text-center border-b border-border">
                      <div className="flex items-center justify-center py-3 px-1">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSlot(dayIndex, slot.id)}
                          className="w-3.5 h-3.5 md:w-6 md:h-6 border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all rounded-[3px] md:rounded-lg scale-90 md:scale-100"
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground italic px-2">
        * Nhấn vào ô để chọn khung giờ bạn/con bạn có thể học. Gia sư sẽ dựa vào đây để ứng tuyển.
      </p>
    </div>
  );
}
