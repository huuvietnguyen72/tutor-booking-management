"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface ListFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function ListFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: ListFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-3xl border border-border/50">
      <div className="relative flex-1 group">
        <Search 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-600 transition-colors" 
          size={20} 
        />
        <Input 
          placeholder="Tìm theo môn học, lớp..." 
          className="pl-12 h-14 bg-card border-border rounded-2xl focus-visible:ring-blue-600 focus-visible:border-blue-600 font-bold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <select 
          className="h-14 px-6 bg-card border border-border rounded-2xl font-black text-sm focus:ring-2 focus:ring-blue-600 outline-none min-w-50 shadow-sm appearance-none cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đang tuyển">Chờ duyệt</option>
          <option value="Đã duyệt">Đang tìm gia sư</option>
          <option value="Đã kết thúc">Đã đóng</option>
        </select>
        <Button variant="outline" className="h-14 w-14 rounded-2xl border-border p-0 bg-card shadow-sm">
          <SlidersHorizontal size={20} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
