"use client";

import { Search, UserCircle2 } from "lucide-react";
import { IStudent } from "@/server/_types/student-type";
import { useCallback, useMemo } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/shared/components/ui/select";

interface CourseFiltersProps {
  onSearch: (value: string) => void;
  onChildFilter: (value: string) => void;
  onStatusFilter: (value: string) => void;
  students?: IStudent[];
}

export const CourseFilters = ({ onSearch, onChildFilter, onStatusFilter, students = [] }: CourseFiltersProps) => {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value),
    [onSearch]
  );

  const handleChildFilterChange = useCallback(
    (v: string) => onChildFilter(v === "all" ? "" : v),
    [onChildFilter]
  );

  const studentOptions = useMemo(
    () =>
      students.map((student) => (
        <SelectItem key={student.id} value={student.fullName}>
          {student.fullName}
        </SelectItem>
      )),
    [students]
  );

  void onStatusFilter;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên gia sư hoặc môn học..."
          className="h-14 w-full rounded-2xl border border-border bg-card/10 pl-12 pr-4 text-sm font-medium transition-all duration-300 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Child Filter */}
        <div className="min-w-45">
          <Select onValueChange={handleChildFilterChange}>
            <SelectTrigger className="h-12 w-full rounded-2xl border border-border bg-card/10 pl-4 pr-10 text-sm font-bold transition-all duration-300 focus:bg-card focus:ring-2 focus:ring-primary/20">
               <div className="flex items-center gap-3">
                 <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                 <SelectValue placeholder="Tất cả học viên" />
               </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-md">
              <SelectItem value="all">Tất cả học viên</SelectItem>
              {studentOptions}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
