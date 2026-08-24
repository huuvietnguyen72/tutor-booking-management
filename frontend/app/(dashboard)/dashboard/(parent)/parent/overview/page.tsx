import { Metadata } from "next";
import { ParentDashboardContent } from "./_sections/dashboard-content";

export const metadata: Metadata = {
  title: "Tổng quan phụ huynh",
  description: "Bảng điều khiển dành cho phụ huynh - Xem hoạt động và quản lý con cái.",
};

const ParentPage = () => {
  return (
    <div className="flex-1">
      <ParentDashboardContent />
    </div>
  );
};

export default ParentPage;