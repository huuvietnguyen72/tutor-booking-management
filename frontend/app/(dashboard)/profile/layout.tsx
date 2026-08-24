import { cookies } from "next/headers";
import { 
  AdminDashboardSidebar, 
  ParentDashboardSidebar, 
  TutorDashboardSidebar 
} from "@/shared/components/layout/sidebar";
import { DashboardNavbar } from "@/shared/components/layout/dashboard-navbar";
import { Bell, Search, UserCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { APP_SAVE_KEY } from "@/shared/constants/app";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get(APP_SAVE_KEY.USER_ROLE)?.value;

  // Nếu là Admin, bọc Profile bằng giao diện Dashboard Admin
  if (userRole === "ADMIN") {
    return (
      <div className="flex flex-col md:flex-row min-h-dvh bg-background">
        <AdminDashboardSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <DashboardNavbar 
            breadcrumbs={[
              { label: "Hồ sơ cá nhân" }
            ]}
            actionSlot={
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2 px-9 py-2 h-9 w-[300px] rounded-full bg-muted/50 border border-border text-sm text-muted-foreground">
                    <span>Tìm kiếm nhanh (Ctrl + K)...</span>
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  <UserCheck className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center border-2 border-background animate-in zoom-in duration-500">
                    3
                  </Badge>
                </Button>

                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted/50">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute top-1 right-1 h-2 w-2 p-0 border-2 border-background" />
                </Button>
              </div>
            }
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-[90px] md:pb-8 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (userRole === "PARENT") {
    return (
      <div className="flex flex-col md:flex-row min-h-dvh bg-background">
        <ParentDashboardSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <DashboardNavbar 
             breadcrumbs={[
              { label: "Hồ sơ cá nhân" }
            ]}
          />
          <main className="flex-1 overflow-y-auto pb-[90px] md:pb-0">{children}</main>
        </div>
      </div>
    );
  }

  if (userRole === "TUTOR") {
    return (
      <div className="flex flex-col md:flex-row min-h-dvh bg-background">
        <TutorDashboardSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <DashboardNavbar 
            breadcrumbs={[
              { label: "Hồ sơ cá nhân" }
            ]}
          />
          <main className="flex-1 overflow-y-auto pb-[90px] md:pb-0">{children}</main>
        </div>
      </div>
    );
  }

  // Với các Role khác, giữ nguyên (sẽ kế thừa Navbar chung từ RootLayout)
  return <>{children}</>;
}

