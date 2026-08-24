"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ChildrenHeaderProps {
  onAddClick: () => void;
}

export function ChildrenHeader({ onAddClick }: ChildrenHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-2">
      <div className="flex items-center gap-4">
        <div className="w-2 h-10 bg-blue-600 dark:bg-blue-500 rounded-full" />
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Danh sách con cái</h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground font-medium">
            Quản lý thông tin và theo dõi tiến trình học tập của các con
          </p>
        </div>
      </div>
      <Button 
        onClick={onAddClick}
        className="h-12 rounded-2xl bg-blue-600 px-8 font-black text-sm uppercase tracking-wider hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
      >
        <Plus strokeWidth={3} size={20} />
        Thêm con mới
      </Button>
    </div>
  );
}

