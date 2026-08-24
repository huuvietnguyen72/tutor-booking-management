"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis-1");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis-2");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (typeof page === "string") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                "h-10 w-10 rounded-xl font-bold transition-all duration-300",
                currentPage === page
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                  : "hover:bg-primary/10 hover:text-primary"
              )}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </nav>
  );
}
