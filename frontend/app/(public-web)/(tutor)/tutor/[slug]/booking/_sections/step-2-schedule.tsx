"use client";

import { useCallback, useMemo } from "react";
import { cn, formatToYYYYMMDD } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, Clock, CalendarIcon, Loader2 } from "lucide-react";
import { useGetTutorAvailability } from "@/server/_actions/tutor-action";

import { Slot } from "../page";

import { AvailabilityGrid, DAYS } from "@/shared/components/features/availability-grid";
import { DatePickerInput } from "@/shared/components/ui/calendar";

interface Step2Props {
  tutorId: number;
  bookingType: "one-time" | "long-term";
  onBookingTypeChange: (type: "one-time" | "long-term") => void;
  selectedSlots: Slot[];
  onSlotToggle: (slot: Slot) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Schedule({
  tutorId,
  bookingType,
  onBookingTypeChange,
  selectedSlots,
  onSlotToggle,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onBack,
  onNext,
}: Step2Props) {
  const { data: availabilityResponse, isLoading } = useGetTutorAvailability(tutorId);
  const availability = availabilityResponse || [];

  // Map tutor availability to the format expected by the grid
  const availableSlots = useMemo(() => {
    const initial: Record<number, string[]> = {};
    availability.forEach((s: any) => {
      if (!initial[s.dayOfWeek]) initial[s.dayOfWeek] = [];
      const start = parseInt(s.startTime.split(":")[0]);
      const end = parseInt(s.endTime.split(":")[0]);
      for (let h = start; h < end; h += 2) {
        initial[s.dayOfWeek].push(h.toString().padStart(2, "0") + ":00");
      }
    });
    return initial;
  }, [availability]);

  // Map selectedSlots to the format expected by the grid
  const gridSelectedSlots = useMemo(() => {
    const initial: Record<number, string[]> = {};
    selectedSlots.forEach(s => {
      if (!initial[s.day]) initial[s.day] = [];
      initial[s.day].push(s.slot); // slot stores the "08:00" start time
    });
    return initial;
  }, [selectedSlots]);

  const handleGridToggle = useCallback((day: number, hour: string) => {
    onSlotToggle({
      day,
      slot: hour,
      time: `${hour} - ${(parseInt(hour) + 2).toString().padStart(2, "0")}:00`
    });
  }, [onSlotToggle]);

  const isValid = selectedSlots.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Booking Type Tabs */}
      <div className="space-y-4">
        <Label className="text-base font-bold text-foreground">Loại hình</Label>
        <Tabs 
          value={bookingType} 
          onValueChange={(val: string) => onBookingTypeChange(val as "one-time" | "long-term")}
          className="w-full"
        >
          <TabsList className="w-full h-14 p-1.5 bg-muted dark:bg-muted/50 rounded-2xl border-none">
            <TabsTrigger 
              value="one-time" 
              className="flex-1 rounded-xl h-full text-muted-foreground font-bold text-sm data-[state=active]:bg-card data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
            >
              Học 1 buổi
            </TabsTrigger>
            <TabsTrigger 
              value="long-term" 
              className="flex-1 rounded-xl h-full text-muted-foreground font-bold text-sm data-[state=active]:bg-card data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
            >
              Học lâu dài
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Date Range Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card dark:bg-muted/10 rounded-3xl border border-border shadow-sm">
        <div className="space-y-3">
          <Label className="text-sm font-bold text-foreground flex items-center gap-2">
            <CalendarIcon size={16} className="text-primary" />
            {bookingType === "one-time" ? "Ngày học" : "Ngày bắt đầu"}
          </Label>
          <DatePickerInput
            value={startDate ? new Date(startDate) : null}
            onChange={(date) => onStartDateChange(formatToYYYYMMDD(date))}
            minDate={new Date()}
            className="h-12 bg-muted/50 border-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {bookingType === "long-term" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-sm font-bold text-foreground flex items-center gap-2">
              <CalendarIcon size={16} className="text-primary" />
              Ngày kết thúc
            </Label>
            <DatePickerInput
              value={endDate ? new Date(endDate) : null}
              onChange={(date) => onEndDateChange(formatToYYYYMMDD(date))}
              minDate={startDate ? new Date(startDate) : new Date()}
              className="h-12 bg-muted/50 border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}
      </div>

      {/* Schedule Grid */}
      <div className="space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <Label className="text-base font-bold text-foreground">Chọn lịch học</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
              <span>Đã chọn</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full border border-dashed border-blue-600/40" />
              <span>Có sẵn</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-muted/20 rounded-3xl border border-dashed border-border">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
             <p className="text-sm font-bold text-muted-foreground">Đang tải lịch rảnh của gia sư...</p>
          </div>
        ) : (
          <div className="bg-card/50 dark:bg-muted/10 rounded-[2.5rem] border border-border overflow-hidden shadow-sm shadow-primary/5">
            <AvailabilityGrid 
              mode="select"
              availableSlots={availableSlots}
              selectedSlots={gridSelectedSlots}
              onSlotToggle={handleGridToggle}
            />
          </div>
        )}
      </div>


      {/* Helper Info */}
      <div className="bg-muted/50 dark:bg-muted/20 rounded-2xl p-4 flex items-start gap-3 border border-border">
        <div className="h-8 w-8 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground shrink-0 shadow-sm">
          <CalendarIcon size={18} />
        </div>
        <div className="space-y-1">
          <p className="text-[13px] font-bold text-foreground">Lưu ý về lịch học</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bạn có thể chọn các ô thời gian <span className="text-blue-600 dark:text-blue-400 font-bold">màu trắng/xanh</span> là lúc gia sư rảnh. Các ô <span className="font-bold">màu xám</span> là gia sư đã bận hoặc không làm việc.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-14 rounded-2xl border-border bg-card text-muted-foreground hover:bg-muted transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          QUAY LẠI
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-2 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:grayscale"
        >
          TIẾP TỤC
        </Button>
      </div>
    </div>
  );
}
