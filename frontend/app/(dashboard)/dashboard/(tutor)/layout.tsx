"use client";

import { TutorDashboardSidebar } from "@/shared/components/layout/sidebar";
import { DashboardNavbar } from "@/shared/components/layout/dashboard-navbar";

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-dvh bg-background">
      <TutorDashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNavbar role="TUTOR" />
        <main className="flex-1 pb-10 md:pb-0 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
