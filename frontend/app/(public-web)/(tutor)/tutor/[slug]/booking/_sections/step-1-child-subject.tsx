"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { Check, Info, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { IStudent } from "@/server/_types/student-type";
import { ITutorSubject } from "@/server/_types/tutor-type";
import Link from "next/link";

interface Step1Props {
  children: IStudent[];
  selectedChildId: string;
  onChildSelect: (id: string) => void;
  selectedSubject: string;
  onSubjectSelect: (subject: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  subjects: ITutorSubject[];
  onNext: () => void;
}

export function Step1ChildSubject({
  children,
  selectedChildId,
  onChildSelect,
  selectedSubject,
  onSubjectSelect,
  notes,
  onNotesChange,
  subjects,
  onNext,
}: Step1Props) {
  const isValid = selectedChildId && selectedSubject;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Child Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-bold text-foreground">Chọn học sinh</Label>
          <Link href="/dashboard/parent/children">
            <Button variant="ghost" className="text-primary dark:text-blue-400 text-xs font-bold hover:bg-primary/10 transition-colors flex items-center gap-1">
              <Plus size={14} />
              Quản lý bé
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => onChildSelect(child.id.toString())}
              type="button"
              className={cn(
                "relative flex flex-col items-center p-5 rounded-4xl border-2 transition-all duration-500 group",
                selectedChildId === child.id.toString()
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-xl shadow-primary/10 scale-[1.02]"
                  : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              {selectedChildId === child.id.toString() && (
                <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1 shadow-lg animate-in zoom-in-50 duration-300">
                  <Check size={12} strokeWidth={4} />
                </div>
              )}
              <div className={cn(
                "w-16 h-16 rounded-2xl mb-4 flex items-center justify-center overflow-hidden border-2 transition-transform duration-500 group-hover:scale-110 shadow-sm bg-muted/20",
                selectedChildId === child.id.toString() ? "border-primary/50" : "border-border"
              )}>
                {child.avatarUrl ? (
                  <Image 
                    src={child.avatarUrl} 
                    alt={child.fullName} 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-xl font-bold text-primary">{child.fullName.charAt(0)}</div>
                )}
              </div>
              <span className={cn(
                "font-black text-sm tracking-tight transition-colors duration-300 text-center",
                selectedChildId === child.id.toString() ? "text-primary" : "text-foreground"
              )}>
                {child.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-80">
                Lớp {child.grade}
              </span>
            </button>
          ))}
          {children.length === 0 && (
            <div className="col-span-full py-8 text-center rounded-4xl border-2 border-dashed border-border bg-muted/5">
              <p className="text-sm font-bold text-muted-foreground">Bạn chưa có hồ sơ học sinh nào.</p>
              <Link href="/dashboard/parent/students">
                <Button variant="link" className="mt-2 text-primary font-black uppercase text-[10px] tracking-widest">Tạo ngay</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subject Selection */}
      <div className="space-y-4">
        <Label className="text-base font-bold text-foreground">Môn học yêu cầu</Label>
        <Select value={selectedSubject} onValueChange={onSubjectSelect}>
          <SelectTrigger className="h-14 rounded-2xl border-border bg-card text-foreground font-bold focus:ring-primary/20 transition-all shadow-sm capitalize">
            <SelectValue placeholder="Chọn môn học..." />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border bg-card shadow-2xl">
            {subjects.map((s) => (
              <SelectItem 
                key={s.id} 
                value={s.id.toString()} 
                className="rounded-xl font-bold py-3 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer capitalize"
              >
                {s.subjectName} (Lớp {s.gradeLevel}) - {s.pricePerSession.toLocaleString()}đ
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-bold text-foreground">Ghi chú cho gia sư</Label>
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Info size={12} />
          </div>
        </div>
        <Textarea
          placeholder="Nhập yêu cầu đặc biệt của bạn cho gia sư..."
          className="min-h-[140px] rounded-3xl border-border bg-card text-foreground resize-none focus:ring-primary/10 transition-all p-5 font-medium leading-relaxed"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      {/* Action Button */}
      <div className="pt-6">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:grayscale uppercase"
        >
          TIẾP TỤC
        </Button>
      </div>
    </div>
  );
}
