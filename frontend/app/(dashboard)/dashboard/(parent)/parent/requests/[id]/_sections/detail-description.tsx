"use client";

import { Info, FileText } from "lucide-react";

interface DetailDescriptionProps {
  description?: string;
  additionalNotes?: string;
}

export function DetailDescription({
  description,
  additionalNotes,
}: DetailDescriptionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8">
      {/* Description */}
      <div className="bg-card border border-border p-6 md:p-8 rounded-4xl shadow-sm">
        <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <FileText size={20} />
          </div>
          <h2 className="text-xl font-bold">Ghi chú thêm</h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 p-6 rounded-2xl border border-border/50 italic font-medium">
          {description ? `"${description}"` : "Không có ghi chú thêm."}
        </p>
      </div>
    </div>
  );
}
