"use client";

import { useGetMyBookings } from "@/server/_actions/booking-action";
import { useGetMyStudents } from "@/server/_actions/student-action";
import { CourseStats } from "./_sections/course-stats";
import { CourseFilters } from "./_sections/course-filters";
import { CourseList } from "./_sections/course-list";
import { useState, useMemo } from "react";
import { GraduationCap, Clock, BookOpen, CheckCircle, CreditCard } from "lucide-react";
import { IBooking, BookingStatus } from "@/server/_types/booking-type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { toast } from "sonner";
import { formatErrorMessage } from "@/shared/lib/utils";
import { useEffect } from "react";

export default function CoursesPage() {
  const { data: bookingsResponse, isLoading, isError: isErrorBookings, error: bookingsError } = useGetMyBookings();
  const { data: studentsResponse, isError: isErrorStudents, error: studentsError } = useGetMyStudents();
  const students = studentsResponse || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [childFilter, setChildFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (isErrorBookings) {
      toast.error(formatErrorMessage(bookingsError, "Không thể tải danh sách khóa học"));
    }
  }, [isErrorBookings, bookingsError]);

  useEffect(() => {
    if (isErrorStudents) {
      toast.error(formatErrorMessage(studentsError, "Không thể tải danh sách học viên"));
    }
  }, [isErrorStudents, studentsError]);

  const filteredBookings = useMemo(() => {
    const list = bookingsResponse?.content || [];
    
    return list.filter((booking: IBooking) => {
      const matchesSearch = 
        (booking.tutorName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (booking.subjectName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      const matchesChild = !childFilter || (booking.studentName?.toLowerCase() || "").includes(childFilter.toLowerCase());
      const matchesStatus = !statusFilter || booking.status === statusFilter;

      return matchesSearch && matchesChild && matchesStatus;
    });
  }, [bookingsResponse, searchTerm, childFilter, statusFilter]);

  const finalBookings = useMemo(() => {
    return filteredBookings.filter((booking) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return booking.status === "WAITING_TUTOR_CONFIRM" || booking.status === "PENDING";
      if (activeTab === "learning") return booking.status === "ACTIVE" || booking.status === "PAUSED" || booking.status === "PENDING_PAYMENTS";
      if (activeTab === "completed") return booking.status === "COMPLETED" || booking.status === "CANCELLED";
      return true;
    });
  }, [filteredBookings, activeTab]);

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground lg:text-4xl">
          Lịch sử <span className="text-primary italic">học tập</span>
        </h1>
        <p className="max-w-2xl text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Theo dõi tiến độ, kết quả học tập và thông tin gia sư cho các con của bạn
        </p>
      </div>

      {/* Stats Section */}
      <CourseStats />

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList className="bg-card w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-row p-1 rounded-2xl border border-border h-auto">
            <TabsTrigger value="all" className="rounded-xl px-4 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl px-4 py-2 font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white flex items-center gap-2">
              <Clock size={16} /> Chờ duyệt
            </TabsTrigger>
            <TabsTrigger value="learning" className="rounded-xl px-4 py-2 font-bold data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center gap-2">
              <BookOpen size={16} /> Đang học
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-xl px-4 py-2 font-bold data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center gap-2">
              <CheckCircle size={16} /> Đã xong
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="flex flex-col gap-6 rounded-[2.5rem] border border-border bg-card/30 p-4 shadow-2xl shadow-primary/5 backdrop-blur-3xl lg:p-8">
            <div className="flex items-center gap-4 border-b border-border/50 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">Danh sách khóa học</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {finalBookings.length} khóa học được tìm thấy
                </p>
              </div>
            </div>

            {/* Filters */}
            <CourseFilters 
              onSearch={setSearchTerm}
              onChildFilter={setChildFilter}
              onStatusFilter={setStatusFilter}
              students={students}
            />

            {/* Content */}
            <CourseList 
              courses={finalBookings as any} 
              isLoading={isLoading} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
