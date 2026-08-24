"use client";

import { TutorCard } from "./tutor-card";
import { Search } from "lucide-react";
import { useTutorFilter } from "@/shared/hooks/use-tutor-filter";
import { formatErrorMessage } from "@/shared/lib/utils";

export function TutorList() {
  const { paginatedTutors, totalCount, isLoading, isError, error } = useTutorFilter();

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <p className="text-muted-foreground font-medium">
          Tìm thấy{" "}
          <span className="text-primary font-bold">
            {totalCount}
          </span>{" "}
          gia sư phù hợp
        </p>
        {/* Tạm thời ẩn phần Sắp xếp
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-sm font-bold text-muted-foreground/70 uppercase tracking-wider">
            Sắp xếp:
          </span>
          <Select key={sortBy} value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] rounded-xl border-border h-10 focus:ring-primary bg-card cursor-pointer text-foreground">
              <SelectValue placeholder="Tên (A-Z)" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-card border-border">
              <SelectItem value="fullName-asc" className="cursor-pointer text-foreground focus:bg-muted focus:text-foreground">
                Tên (A-Z)
              </SelectItem>
              <SelectItem value="fullName-desc" className="cursor-pointer text-foreground focus:bg-muted focus:text-foreground">
                Tên (Z-A)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        */}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          // Skeleton Loading
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-62.5 w-full bg-muted animate-pulse rounded-3xl" />
          ))
        ) : isError ? (
          <div className="py-20 text-center bg-card rounded-3xl border border-dashed border-red-200">
            <h3 className="text-xl font-bold text-red-500 mb-2">Đã có lỗi xảy ra</h3>
            <p className="text-muted-foreground">
              {formatErrorMessage(error, "Không thể kết nối với máy chủ. Vui lòng thử lại sau.")}
            </p>
          </div>
        ) : paginatedTutors.length > 0 ? (
          paginatedTutors.map((tutor: any) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))
        ) : (
          <div className="py-20 text-center bg-card rounded-3xl border border-dashed border-border">
            <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-muted-foreground/50" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Không tìm thấy gia sư
            </h3>
            <p className="text-muted-foreground">
              Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
