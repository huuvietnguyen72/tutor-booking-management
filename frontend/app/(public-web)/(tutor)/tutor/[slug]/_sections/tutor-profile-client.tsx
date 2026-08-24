"use client";

import { useGetTutorDetail, useGetTutorSubjects, useGetTutorAvailability } from "@/server/_actions/tutor-action";
import { TutorHeader } from "./tutor-header";
import { TutorBio } from "./tutor-bio";
import { TutorTabs } from "./tutor-tabs";
import { BookingSidebar } from "./booking-sidebar";
import { formatErrorMessage } from "@/shared/lib/utils";

interface TutorProfileClientProps {
  tutorId: number;
}

export function TutorProfileClient({ tutorId }: TutorProfileClientProps) {
  // Fetch all data from API
  const { data: apiTutor, isLoading: isLoadingTutor, isError: isErrorTutor, error: tutorError } = useGetTutorDetail(tutorId);
  const { data: apiSubjects = [], isLoading: isLoadingSubjects } = useGetTutorSubjects(tutorId);
  const { data: apiAvailability = [], isLoading: isLoadingAvailability } = useGetTutorAvailability(tutorId);

  if (isLoadingTutor || isLoadingSubjects || isLoadingAvailability) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Đang tải hồ sơ gia sư...</p>
      </div>
    );
  }

  if (isErrorTutor || !apiTutor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Không tìm thấy gia sư</h2>
          <p className="text-muted-foreground">
            {formatErrorMessage(tutorError, "Thông tin gia sư không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.")}
          </p>
          <button 
            onClick={() => window.location.href = '/tutor'}
            className="text-primary font-semibold hover:underline"
          >
            Quay lại trang tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  const subjectsList = apiSubjects.map((s) => s.subjectName);
  const basePrice = apiSubjects[0]?.pricePerSession || 200000;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <TutorHeader
        tutor={{
          name: apiTutor.fullName,
          avatar: apiTutor.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${apiTutor.fullName}`,
          university: apiTutor.educationLevel,
          major: apiTutor.qualifications || "",
          rating: apiTutor.rating,
          reviewCount: apiTutor.totalReviews,
          location: apiTutor.teachingArea || "",
          responseTime: "Thường trả lời trong 1h",
          subjects: subjectsList,
          isTopRated: apiTutor.rating >= 4.8,
          experience: apiTutor.experience || "",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TutorBio bio={apiTutor.experience || "Gia sư chưa cập nhật giới thiệu bản thân."} />
            <TutorTabs
              subjects={subjectsList}
              price={basePrice}
              levels={["Tiểu học", "THCS", "THPT"]} // Mock levels for now
              format={apiTutor.teachingMode === "ONLINE" ? ["Online"] : apiTutor.teachingMode === "OFFLINE" ? ["Trực tiếp"] : ["Cả hai"]}
              rating={apiTutor.rating}
              reviewCount={apiTutor.totalReviews}
              tutorId={tutorId.toString()}
              apiAvailability={apiAvailability}
              apiSubjects={apiSubjects}
            />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar 
              price={basePrice} 
              subjects={subjectsList} 
              apiSubjects={apiSubjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
