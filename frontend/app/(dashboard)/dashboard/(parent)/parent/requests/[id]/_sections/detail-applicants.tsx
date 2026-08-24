"use client";

import { CheckCircle, AlertCircle, Users } from "lucide-react";
import { ApplicantCard } from "./applicant-card";
import { IApplicant } from "@/server/_types/request-type";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface DetailApplicantsProps {
  applicants: IApplicant[];
  isLoading?: boolean;
  onBook: (applicant: IApplicant) => void;
  onReject?: (applicant: IApplicant) => void;
}

export function DetailApplicants({
  applicants,
  isLoading,
  onBook,
  onReject,
}: DetailApplicantsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">{applicants.length} Gia sư ứng tuyển</h2>
            <p className="text-sm text-muted-foreground font-medium">Tìm kiếm gia sư phù hợp nhất cho con bạn.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onAccept={() => onBook(applicant)}
              onDecline={() => onReject?.(applicant)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-muted/20 border-2 border-dashed border-border/50 rounded-[3rem] flex flex-col items-center">
            <AlertCircle size={48} className="text-muted-foreground opacity-30 mb-4" />
            <p className="text-lg font-black tracking-tight">Chưa có ứng cử viên nào</p>
            <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto mt-1 leading-relaxed">
              Yêu cầu của bạn đang được công khai. Gia sư sẽ sớm ứng tuyển!
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-4xl flex gap-4 mt-8 shadow-sm">
        <CheckCircle className="text-blue-600 shrink-0" size={24} />
        <div className="space-y-1">
          <p className="text-sm md:text-base text-blue-900 dark:text-blue-300 font-black">Lưu ý cho phụ huynh:</p>
          <p className="text-xs md:text-sm text-blue-700/80 dark:text-blue-400 font-medium leading-relaxed">
            Hãy xem xét kỹ hồ sơ, bằng cấp và đánh giá của các gia sư trước khi đưa ra quyết định chấp nhận yêu cầu giảng dạy.
          </p>
        </div>
      </div>
    </div>
  );
}
