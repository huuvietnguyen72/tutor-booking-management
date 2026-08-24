"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetRequestDetail,
  useGetApplicants,
  useAcceptApplicant,
  useRejectApplicant,
} from "@/server/_actions/request-action";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toSlug, formatErrorMessage } from "@/shared/lib/utils";

// UI Components
import { BookingModal } from "./booking-modal";

// Refactored Sections
import { DetailHeader } from "./detail-header";
import { DetailInfo } from "./detail-info";
import { DetailSchedule } from "./detail-schedule";
import { DetailDescription } from "./detail-description";
import { DetailApplicants } from "./detail-applicants";
import { IApplicant, ApplicationStatus } from "@/server/_types/request-type";
import Link from "next/link";

interface RequestDetailClientProps {
  id: string | number;
}

export function RequestDetailClient({ id }: RequestDetailClientProps) {
  const router = useRouter();
  const {
    data: requestRes,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: requestError,
  } = useGetRequestDetail(id);
  const { data: applicantsRes, isLoading: isLoadingApplicants } =
    useGetApplicants(id);
  const acceptMutation = useAcceptApplicant(id);
  const rejectMutation = useRejectApplicant(id);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<IApplicant | null>(null);
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string | number, ApplicationStatus>>({});

  const request = requestRes;
  const applicants = applicantsRes || [];
  
  const modifiedApplicants: IApplicant[] = applicants.map((applicant) => ({
    ...applicant,
    status: optimisticStatuses[applicant.id] || applicant.status,
  }));

  const handleBook = (applicant: IApplicant) => {
    setSelectedTutor(applicant);
    setIsBookingOpen(true);
  };

  const handleAccept = async () => {
    if (selectedTutor) {
      const toastId = toast.loading("Đang xử lý chấp nhận gia sư...");
      try {
        await acceptMutation.mutateAsync(selectedTutor.applicationId || selectedTutor.id);
        setIsBookingOpen(false);
        setOptimisticStatuses((prev) => ({ ...prev, [selectedTutor.id]: "ACCEPTED" }));
        toast.success(`Đã chấp nhận gia sư ${selectedTutor.tutorName} thành công!`, { id: toastId });
        
        // Redirect to booking page
        const tutorSlug = `${toSlug(selectedTutor.tutorName)}-${selectedTutor.tutorId}`;
        const bookingUrl = `/tutor/${tutorSlug}/booking?subjectId=${request?.subjectId || ""}`;
        router.push(bookingUrl);
      } catch (error) {
        console.error("Accept error:", error);
        toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi chấp nhận gia sư."), { id: toastId });
      }
    }
  };

  const handleReject = async (applicant: IApplicant) => {
    const toastId = toast.loading("Đang từ chối gia sư...");
    try {
      await rejectMutation.mutateAsync(applicant.applicationId || applicant.id);
      setOptimisticStatuses((prev) => ({ ...prev, [applicant.id]: "REJECTED" }));
      toast.success(`Đã từ chối gia sư ${applicant.tutorName}.`, { id: toastId });
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi từ chối."), { id: toastId });
    }
  };

  if (isLoadingDetail) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 p-4 md:p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-64 w-full rounded-4xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isErrorDetail || !request) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-xl font-bold">Không tìm thấy yêu cầu</h2>
        <p className="text-muted-foreground">
          {formatErrorMessage(requestError, "Có lỗi xảy ra khi tải dữ liệu hoặc yêu cầu không tồn tại.")}
        </p>
        <Link href="/dashboard/parent/requests">
          <Button variant="outline" className="rounded-xl gap-2">
            <ChevronLeft size={16} /> Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 md:space-y-12 p-4 md:p-8">
      <DetailHeader request={request} />

      <DetailInfo
        subject={request.subjectName || "Chưa xác định"}
        grade={`Lớp ${request.gradeLevel}`}
        salary={request.desiredPrice}
        method={request.teachingMode}
        sessionsPerWeek={request.sessionsPerWeek}
        location={request.preferredArea || request.address}
      />

      {/* Note: IRequest detail response should ideally include schedule, if not, we display common placeholder or fetch separately if DB allows */}
      <DetailSchedule schedule={request.schedule} />

      <DetailDescription
        description={request.scheduleNote || request.description}
        additionalNotes={""} // Add fields to IRequest if available
      />

      <DetailApplicants
        applicants={modifiedApplicants}
        isLoading={isLoadingApplicants}
        onBook={handleBook}
        onReject={handleReject}
      />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tutor={selectedTutor}
        request={request}
        onConfirm={handleAccept}
        isLoading={acceptMutation.isPending}
      />
    </div>
  );
}
