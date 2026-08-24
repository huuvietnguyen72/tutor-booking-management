"use client";

import Image from "next/image";
import { Pencil, Trash2, GraduationCap, School, User } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { IStudent } from "@/server/_types/student-type";
import { CHILD_STATUS_STYLES } from "@/shared/constants/child-styles";

interface ChildCardProps {
  child: IStudent;
  onEdit: () => void;
  onDelete: () => void;
}

export function ChildCard({ child, onEdit, onDelete }: ChildCardProps) {
  const academicLevel = child.academicLevel ?? "GOOD";
  const styles = CHILD_STATUS_STYLES[academicLevel];

  return (
    <div className="group flex flex-col overflow-hidden rounded-4xl border border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 sm:flex-row">
      {/* <div className={cn(
        "relative flex w-full items-center justify-center transition-colors py-8 sm:w-48 lg:w-56 shrink-0", 
        styles.avatar
      )}>
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-background shadow-xl border-4 border-card sm:h-32 sm:w-32 lg:h-36 lg:w-36 transition-transform group-hover:scale-105">
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <User className="text-muted-foreground opacity-50" size={48} />
          </div>
        </div>
      </div> */}

      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight truncate">{child.fullName}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50">
                <GraduationCap size={16} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lớp {child.grade}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50">
                <School size={16} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate max-w-37.5">{child.school || "Chưa cập nhật trường"}</span>
              </div>
            </div>
          </div>
          <Badge className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest border", styles.badge)}>
            {academicLevel}
          </Badge>
        </div>

        <div className="mt-6 relative rounded-2xl border border-border bg-muted/20 p-5 group/note">
          <div className="absolute -top-3 left-4 bg-muted px-2 py-0.5 rounded-full border border-border">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-70">GHI CHÚ PHỤ HUYNH</p>
          </div>
          <p className="text-sm font-medium leading-relaxed text-foreground/80 italic">
            &quot;{child.specialNotes || "Chưa có ghi chú đặc biệt..."}&quot;
          </p>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-border/50 pt-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="h-10 px-5 gap-2 rounded-xl border-border bg-transparent font-bold text-xs uppercase tracking-wider hover:bg-muted active:scale-95 transition-all"
          >
            <Pencil size={14} strokeWidth={3} />
            Sửa
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="h-10 px-5 gap-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
          >
            <Trash2 size={14} strokeWidth={3} />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}

