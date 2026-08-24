import { NotificationList } from "./_sections/notification-list";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-10 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-4xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 self-center sm:self-auto ring-8 ring-primary/10 transition-transform hover:scale-110">
            <Bell size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              Thông báo
            </h1>
            <p className="text-muted-foreground font-medium max-w-lg leading-relaxed">
              Cập nhật những hoạt động mới nhất từ lớp học và hệ thống của bạn.
            </p>
          </div>
        </div>
      </header>

      {/* Main List */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <NotificationList />
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center">
        <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-[0.2em] opacity-50">
          Tutors Booking Notification System v1.0
        </p>
      </footer>
    </div>
  );
}
