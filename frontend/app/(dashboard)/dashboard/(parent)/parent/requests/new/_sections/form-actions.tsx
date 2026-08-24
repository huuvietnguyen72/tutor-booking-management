"use client";

import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { RequestFormValues } from "./schema";

export function FormActions() {
  const router = useRouter();
  const {
    formState: { isSubmitting },
  } = useFormContext<RequestFormValues>();

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/5">
      <Button
        type="button"
        variant="outline"
        className="group h-12 md:h-14 px-8 rounded-xl md:rounded-2xl font-bold w-full sm:min-w-[160px] text-base border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Hủy bỏ
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="group h-12 md:h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl md:rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 gap-2 w-full sm:min-w-[180px] text-base transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
      >
        {isSubmitting ? (
          <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Send size={18} className="transition-transform group-hover:translate-x-1" />
            Đăng yêu cầu
          </>
        )}
      </Button>
    </div>
  );
}
