import { NotificationList } from "./_sections/notification-list";
import { Bell, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Thông báo hệ thống | Admin Dashboard",
  description: "Quản lý thông báo và hoạt động hệ thống",
};

export default function AdminNotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Premium Header */}
      <header className="mb-12 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative w-16 h-16 rounded-4xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 self-center sm:self-auto ring-8 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <Bell size={32} strokeWidth={2.5} className="animate-wiggle" />
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
              <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight uppercase font-heading">
                Thông báo
              </h1>
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm">
                <ShieldAlert size={12} strokeWidth={3} />
                Hệ thống
              </span>
            </div>
            <p className="text-muted-foreground font-medium max-w-lg leading-relaxed text-sm sm:text-base">
              Theo dõi và quản lý toàn bộ các hoạt động, yêu cầu và thông báo quan trọng trên hệ thống.
            </p>
          </div>
        </div>
      </header>

      {/* Main List Section */}
      <main className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-in-out fill-mode-both">
        <NotificationList />
      </main>

      {/* Modern Footer Info */}
      <footer className="mt-16 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-muted/30 border border-border/50">
          <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.3em]">
            Admin Control Panel
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
          <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.3em]">
            Notification Center v2.1
          </p>
        </div>
      </footer>
    </div>
  );
}
