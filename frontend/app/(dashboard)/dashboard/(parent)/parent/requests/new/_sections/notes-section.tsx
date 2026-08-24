"use client";

import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { RequestFormValues } from "./schema";

export function NotesSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RequestFormValues>();

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
          <Info size={20} />
        </div>
        <h2 className="text-xl font-bold">Ghi chú & Yêu cầu thêm</h2>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold ml-1">
          Ghi chú & Yêu cầu thêm (bao gồm lịch học mong muốn)
        </Label>
        <Textarea
          placeholder="Ví dụ: Cần gia sư nam, kinh nghiệm ôn thi đại học. Rảnh các buổi tối từ 18h-20h thứ 2, 4, 6..."
          className="min-h-[150px] rounded-2xl p-4 focus:ring-blue-600 resize-none"
          {...register("scheduleNote")}
        />
        {errors.scheduleNote && (
          <p className="text-xs text-destructive font-medium ml-1">
            {String(errors.scheduleNote.message)}
          </p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-2xl flex gap-3">
        <Info className="text-blue-600 shrink-0" size={20} />
        <p className="text-sm text-blue-700/80 dark:text-blue-400/80 font-medium">
          Yêu cầu của bạn sẽ được Admin duyệt trước khi đăng công khai cho
          gia sư ứng tuyển. Trạng thái mặc định là{" "}
          <span className="font-bold underline decoration-blue-500/50">
            Chờ duyệt
          </span>
          .
        </p>
      </div>
    </div>
  );
}
