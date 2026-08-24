"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Save, 
  Loader2,
  Clock,
  Info
} from "lucide-react";
import { 
  useGetTutorAvailability, 
  useAddTutorAvailability,
  useDeleteTutorAvailability,
  useGetTutorProfile,
} from "@/server/_actions/tutor-action";
import { toast } from "sonner";
import { 
  AvailabilityGrid, 
  mergeToRanges 
} from "@/shared/components/features/availability-grid";
import { cn, formatErrorMessage } from "@/shared/lib/utils";

export function WeeklyAvailability() {
  const { data: profile } = useGetTutorProfile();
  const tutorId = profile?.id;

  const { data: availability, isLoading } = useGetTutorAvailability(tutorId!, !!tutorId);
  const { mutateAsync: addSlotApi } = useAddTutorAvailability();
  const { mutateAsync: deleteSlotApi } = useDeleteTutorAvailability();
  
  const [selectedSlots, setSelectedSlots] = useState<Record<number, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize selected slots from API
  useEffect(() => {
    if (availability) {
      const initial: Record<number, string[]> = {};
      availability.forEach(s => {
        if (!initial[s.dayOfWeek]) initial[s.dayOfWeek] = [];
        const start = parseInt(s.startTime.split(":")[0]);
        const end = parseInt(s.endTime.split(":")[0]);
        for (let h = start; h < end; h += 2) {
          initial[s.dayOfWeek].push(h.toString().padStart(2, "0") + ":00");
        }
      });
      setSelectedSlots(initial);
    }
  }, [availability]);

  const totalHours = useMemo(() => {
    return Object.values(selectedSlots).reduce((acc, current) => acc + current.length * 2, 0);
  }, [selectedSlots]);

  const saveSchedule = async (slotsMap: Record<number, string[]>) => {
    if (!tutorId) return;
    setIsSaving(true);
    const toastId = toast.loading("Đang cập nhật lịch rảnh...");

    try {
      // 1. Convert current grid to discrete 2-hour ranges
      const newRanges: any[] = [];
      Object.entries(slotsMap).forEach(([day, hours]) => {
        hours.forEach(hour => {
          const startHour = parseInt(hour.split(":")[0]);
          newRanges.push({
            dayOfWeek: parseInt(day),
            isActive: true,
            startTime: `${hour}:00`,
            endTime: `${(startHour + 2).toString().padStart(2, "0")}:00:00`
          });
        });
      });

      // 2. Compute the Diff (Delta) to avoid deleting untouched slots
      const oldRanges = availability || [];
      const toDeleteIds: number[] = [];
      const toAddRanges: any[] = [];
      
      const matchedNewRanges = new Set();

      oldRanges.forEach(oldR => {
        // Look for an exact match in the new ranges
        const matchIndex = newRanges.findIndex(newR => 
          newR.dayOfWeek === oldR.dayOfWeek &&
          newR.startTime === oldR.startTime &&
          newR.endTime === oldR.endTime &&
          !matchedNewRanges.has(newR)
        );

        if (matchIndex !== -1) {
          // It's untouched, keep it
          matchedNewRanges.add(newRanges[matchIndex]);
        } else {
          // It was modified or removed
          toDeleteIds.push(oldR.id);
        }
      });

      newRanges.forEach(newR => {
        if (!matchedNewRanges.has(newR)) {
          toAddRanges.push(newR);
        }
      });

      // 3. Execute only necessary API calls sequentially and safely
      if (toDeleteIds.length > 0) {
        await Promise.all(toDeleteIds.map(id => deleteSlotApi(id)));
      }
      
      if (toAddRanges.length > 0) {
        await Promise.all(toAddRanges.map(r => addSlotApi(r)));
      }

      toast.success("Cập nhật lịch rảnh thành công", { id: toastId });
    } catch (error) {
      console.error("Save error:", error);
      toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi lưu"), { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSlot = async (day: number, hour: string) => {
    if (isSaving) return;

    // Use current state to figure out new state
    const newPrevMap = { ...selectedSlots };
    const daySlots = newPrevMap[day] || [];
    const isSelected = daySlots.includes(hour);
    const newDaySlots = isSelected 
      ? daySlots.filter(h => h !== hour)
      : [...daySlots, hour];
      
    newPrevMap[day] = newDaySlots;
    setSelectedSlots(newPrevMap);
    
    // Save immediately
    await saveSchedule(newPrevMap);
  };



  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-20 bg-muted rounded-3xl" />
        <div className="h-125 bg-muted rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-(--breakpoint-2xl) mx-auto space-y-8 pb-10">
      {/* --- Top Header Section --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
            Quản lý lịch rảnh
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            Thiết lập thời gian bạn có thể dạy để học sinh dễ dàng đặt lịch.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-primary/5 border border-primary/10 shadow-sm transition-all hover:bg-primary/10">
             <div className="bg-primary/20 p-2 rounded-xl">
               <Clock className="w-5 h-5 text-primary" />
             </div>
             <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Tổng cộng</div>
               <div className="text-lg font-black leading-none text-primary">
                 {totalHours.toFixed(1)} <span className="text-xs font-bold leading-none">giờ / tuần</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- Grid Container --- */}
      <div className="overflow-hidden bg-card rounded-[2.5rem] border border-border shadow-2xl shadow-black/5">
        
        {/* Grid Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4 border-b border-border bg-muted/5">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sẵn sàng</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Bận</span>
              </div>
           </div>

           {isSaving && (
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary">
               <Loader2 size={14} className="animate-spin" />
               <span className="text-xs font-bold uppercase tracking-widest">Đang cập nhật...</span>
             </div>
           )}
        </div>

        {/* The Grid Body */}
        <AvailabilityGrid 
          mode="edit"
          disabled={isSaving}
          selectedSlots={selectedSlots}
          onSlotToggle={toggleSlot}
        />
      </div>

      {/* Info Tip */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-500">
         <div className="p-2 bg-amber-500/10 rounded-xl"><Info size={18} /></div>
         <p className="text-xs font-bold leading-relaxed">Lưu ý: Bạn nên cập nhật lịch rảnh ít nhất 2 tuần trước để phụ huynh có thể chủ động sắp xếp thời gian cho con học.</p>
      </div>
    </div>
  );
}
