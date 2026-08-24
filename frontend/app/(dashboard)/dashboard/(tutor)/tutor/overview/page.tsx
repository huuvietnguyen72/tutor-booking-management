import { Metadata } from "next";
import { TutorDashboardContent } from "./_sections/dashboard-content";

export const metadata: Metadata = {
  title: "Bảng điều khiển Gia sư | Tutor Management",
  description: "Trang quản lý dành cho Gia sư, theo dõi lịch dạy, thu nhập và hồ sơ cá nhân.",
};

export default function TutorHomePage() {
  return <TutorDashboardContent />;
}
