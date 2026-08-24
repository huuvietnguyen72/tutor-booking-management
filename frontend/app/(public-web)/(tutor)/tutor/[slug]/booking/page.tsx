"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FEATURED_TUTORS } from "@/shared/constants/tutor-data";
import { MOCK_CHILDREN } from "@/shared/constants/child-data";
import { BookingStepper } from "./_sections/booking-stepper";
import { Step1ChildSubject } from "./_sections/step-1-child-subject";
import { Step2Schedule } from "./_sections/step-2-schedule";
import { Step3LearningMode } from "./_sections/step-3-learning-mode";
import { Step4Confirmation } from "./_sections/step-4-confirmation";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useGetMe } from "@/server/_actions/auth-action";
import {
  useGetTutorDetail,
  useGetTutorSubjects,
} from "@/server/_actions/tutor-action";
import { useGetMyStudents } from "@/server/_actions/student-action";
import { useCreateBooking } from "@/server/_actions/booking-action";
import { formatErrorMessage } from "@/shared/lib/utils";

export interface Slot {
  day: number;
  slot: string;
  time: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const tutorId = useMemo(() => slug.split("-").pop() || "", [slug]);

  const { data: userResponse, isLoading: isUserLoading } = useGetMe();
  const { data: tutorResponse, isLoading: isTutorLoading } =
    useGetTutorDetail(tutorId);
  const tutor = tutorResponse;

  const { data: studentsResponse, isLoading: isStudentsLoading } =
    useGetMyStudents();
  const children = studentsResponse || [];

  const { data: subjectsResponse, isLoading: isSubjectsLoading } =
    useGetTutorSubjects(tutorId);
  const tutorSubjects = subjectsResponse || [];

  const { mutateAsync: createBooking } = useCreateBooking();

  const searchParams = useSearchParams();
  const urlSubjectId = searchParams.get("subjectId") || "";
  const urlStartDate = searchParams.get("startDate") || "";

  // Booking State
  const [step, setStep] = useState(1);
  const [childId, setChildId] = useState("");
  const [subject, setSubject] = useState(urlSubjectId);
  const [notes, setNotes] = useState("");
  const [bookingType, setBookingType] = useState<"one-time" | "long-term">(
    "one-time",
  );
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [learningMode, setLearningMode] = useState<"online" | "offline">(
    "online",
  );
  const [startDate, setStartDate] = useState(
    urlStartDate || new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (
    isUserLoading ||
    isTutorLoading ||
    isStudentsLoading ||
    isSubjectsLoading
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Không tìm thấy gia sư
          </h2>
          <Button
            onClick={() => router.push("/tutor")}
            variant="outline"
            className="rounded-2xl border-border"
          >
            Quay lại tìm kiếm
          </Button>
        </div>
      </div>
    );
  }

  const selectedChild = children.find((c) => c.id.toString() === childId);

  const toggleSlot = (slot: Slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.find(
        (s) => s.day === slot.day && s.slot === slot.slot,
      );
      if (exists) {
        return prev.filter(
          (s) => !(s.day === slot.day && s.slot === slot.slot),
        );
      }
      return [...prev, slot];
    });
  };

  const handleConfirm = async () => {
    if (!tutor || !childId || !subject) return;

    const selectedSubject = tutorSubjects.find(
      (s) => s.id.toString() === subject,
    );

    setIsSubmitting(true);
    try {
      await createBooking({
        tutorId: Number(tutorId),
        studentId: Number(childId),
        subjectId: selectedSubject?.subjectId,
        gradeLevel: selectedSubject?.gradeLevel,
        notes: notes,
        isRecurring: bookingType === "long-term",
        teachingMode: learningMode.toUpperCase(),
        recurringStartDate: startDate,
        recurringEndDate: bookingType === "long-term" ? endDate : startDate,
        schedules: selectedSlots.map((s) => {
          const [start, end] = s.time.split(" - ");
          return {
            dayOfWeek: s.day,
            startTime: `${start}:00`,
            endTime: `${end}:00`,
          };
        }),
      });
      setIsSuccess(true);
      toast.success("Đặt lịch thành công! Gia sư sẽ liên hệ với bạn sớm nhất.");
    } catch (err) {
      console.error(err);
      toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-8 border-4 border-emerald-500/20 shadow-lg shadow-emerald-500/10 ring-8 ring-emerald-500/5">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-4 text-center tracking-tight uppercase">
          Đặt lịch thành công!
        </h1>
        <p className="text-muted-foreground text-center max-w-sm mb-10 leading-relaxed font-medium">
          Yêu cầu của bạn đã được gửi đến gia sư{" "}
          <span className="font-bold text-foreground">{tutor.fullName}</span>.
          Vui lòng theo dõi trạng thái yêu cầu tại mục &quot;Khóa học&quot; của bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/dashboard/parent/courses" className="flex-1">
            <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
              XEM KHÓA HỌC
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-border text-muted-foreground font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              TRANG CHỦ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background transition-colors duration-500">
      {/* Header */}
      <header className="bg-background/80 border-b border-border sticky top-0 z-30 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center relative">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group z-10"
          >
            <div className="w-10 h-10 rounded-full bg-muted dark:bg-muted/20 flex items-center justify-center group-hover:bg-muted/80 group-active:scale-95 transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="hidden sm:inline font-bold text-sm uppercase tracking-wider">
              Quay lại
            </span>
          </button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center w-full max-w-50 sm:max-w-none">
            <h1 className="text-lg font-black text-foreground tracking-tight leading-tight uppercase">
              ĐẶT LỊCH HỌC
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">
              Gia sư {tutor.fullName}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Stepper */}
          <div className="mb-12">
            <BookingStepper currentStep={step} />
          </div>

          {/* Steps Container */}
          <div className="bg-card/40 backdrop-blur-sm rounded-[3rem] p-1 sm:p-2 border border-border/50 shadow-sm">
            <div className="bg-card rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-border/20">
              {step === 1 && (
                <Step1ChildSubject
                  children={children}
                  selectedChildId={childId}
                  onChildSelect={setChildId}
                  selectedSubject={subject}
                  onSubjectSelect={setSubject}
                  notes={notes}
                  onNotesChange={setNotes}
                  subjects={tutorSubjects}
                  onNext={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <Step2Schedule
                  tutorId={Number(tutorId)}
                  bookingType={bookingType}
                  onBookingTypeChange={setBookingType}
                  selectedSlots={selectedSlots}
                  onSlotToggle={toggleSlot}
                  startDate={startDate}
                  onStartDateChange={setStartDate}
                  endDate={endDate}
                  onEndDateChange={setEndDate}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                />
              )}

              {step === 3 && (
                <Step3LearningMode
                  learningMode={learningMode}
                  onModeChange={setLearningMode}
                  onBack={() => setStep(2)}
                  onNext={() => setStep(4)}
                />
              )}

              {step === 4 && (
                <Step4Confirmation
                  child={selectedChild}
                  tutor={tutor}
                  subject={tutorSubjects.find(
                    (s) => s.id.toString() === subject,
                  )}
                  bookingType={bookingType}
                  selectedSlots={selectedSlots}
                  learningMode={learningMode}
                  onBack={() => setStep(3)}
                  onConfirm={handleConfirm}
                  isLoading={isSubmitting}
                />
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Bằng việc nhấn xác nhận, bạn đồng ý với{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                Điều khoản dịch vụ
              </span>
              <br />
              và{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                Chính sách bảo mật
              </span>{" "}
              của chúng tôi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
