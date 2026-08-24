"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { useGetAllSubjects } from "@/server/_actions/tutor-action";
import { LEVEL_OPTIONS } from "@/shared/constants/filter-options";

export const HomeSearchBar = () => {
  const [subject, setSubject] = useState("all");
  const [level, setLevel] = useState("all");
  const router = useRouter();
  const { data: subjectData, isLoading: isLoadingSubjects } = useGetAllSubjects();
  const allSubjects = subjectData || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (subject !== "all") params.set("subject", subject);
    if (level !== "all") params.set("level", level);
    
    router.push(`/tutor?${params.toString()}`);
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-4 items-end w-full max-w-5xl mx-auto mt-auto relative z-10 border border-border transition-colors duration-500">
      {/* Môn học */}
      <div className="flex-1 w-full space-y-1.5 px-2">
        <div className="flex items-center gap-1.5">
          <BookOpen size={12} className="text-blue-500" />
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            MÔN HỌC
          </label>
        </div>
        <Select value={subject} onValueChange={setSubject} disabled={isLoadingSubjects}>
          <SelectTrigger className="w-full bg-muted/50 border-border border outline-none px-3 focus:ring-1 focus:ring-blue-500/20 text-foreground font-semibold cursor-pointer shadow-none transition-all">
            <SelectValue placeholder={isLoadingSubjects ? "Đang tải..." : "Chọn môn học"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="all">Tất cả môn học</SelectItem>
            {!isLoadingSubjects && allSubjects.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cấp học */}
      <div className="flex-1 w-full space-y-1.5 px-2">
        <div className="flex items-center gap-1.5">
          <GraduationCap size={12} className="text-blue-500" />
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
            CẤP HỌC
          </label>
        </div>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full bg-muted/50 border-border border outline-none px-3 focus:ring-1 focus:ring-blue-500/20 text-foreground font-semibold cursor-pointer shadow-none transition-all">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            {LEVEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nút Tìm kiếm */}
      <Button 
        onClick={handleSearch}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 h-10"
      >
        <Search size={20} />
        <span className="whitespace-nowrap">Tìm kiếm</span>
      </Button>
    </div>
  );
};
