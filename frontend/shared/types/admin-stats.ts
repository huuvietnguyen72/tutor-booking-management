export interface ChartDataPoint {
  date: string;
  users: number;
}

export interface ActivityLog {
  id: string;
  type: "TUTOR_REGISTERED" | "COURSE_ACCEPTED" | "COURSE_BOOKED" | "SYSTEM_ALERT" | "USER_JOINED";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "info" | "error";
}
