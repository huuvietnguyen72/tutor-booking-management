export type BookingStatus = "WAITING_TUTOR_CONFIRM" | "PENDING_PAYMENTS" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED" | "PENDING";
export type SessionStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface ISession {
  id: number;
  bookingId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  reviewId?: number;
}

export interface ISchedule {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
} 

export interface IBooking {
  id: number;
  parentId: number;
  tutorId: number;
  studentId: number;
  subjectId: number;
  parentAvatar?: string;
  tutorAvatar?: string;
  gradeLevel: number;
  pricePerSession: number;
  teachingMode: "ONLINE" | "OFFLINE";
  isRecurring: boolean;
  schedules: ISchedule[];
  recurringStartDate: string;
  recurringEndDate: string;
  status: BookingStatus;
  sessions?: ISession[];
  completedSessions?: number;
  totalSessions?: number;
  tutorName?: string;
  subjectName?: string;
  studentName?: string;
  startDate?: string;
  endDate?: string;
  paymentId?: number;
  isReviewed?: boolean;
}

export interface IBookingStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalSpent: number;
}
