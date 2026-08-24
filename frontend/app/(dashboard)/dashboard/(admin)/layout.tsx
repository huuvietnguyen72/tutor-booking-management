"use client";

import { AdminDashboardSidebar } from "@/shared/components/layout/sidebar";
import { DashboardNavbar } from "@/shared/components/layout/dashboard-navbar";
import { useGetPendingTutors } from "@/server/_actions/admin-action";
import { UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/app";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: pendingTutors } = useGetPendingTutors();

  const adminActions = (
    <Link href={ROUTES.ADMIN.TUTOR_APPROVAL}>
      <Button variant="ghost" size="icon" className="relative group hover:bg-warning/10 transition-all active:scale-95 rounded-xl">
        <UserCheck className="w-5 h-5 text-muted-foreground/80 group-hover:text-warning group-hover:scale-110 transition-all" />
        {pendingTutors && pendingTutors.totalElements > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-black bg-warning text-warning-foreground rounded-full border-2 border-background shadow-lg animate-bounce">
            {pendingTutors.totalElements}
          </span>
        )}
      </Button>
    </Link>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-dvh bg-background">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardNavbar 
          role="ADMIN" 
          showSearch 
          actionSlot={adminActions} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-22.5 md:pb-8 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
