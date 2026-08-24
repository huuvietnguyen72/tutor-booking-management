"use client";

import { Bell, Clock, CheckCircle2, Calendar, FileText, Settings, AlertCircle, BellOff, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Dropdown, useDropdown } from "@/shared/components/ui/dropdown";
import { Button } from "@/shared/components/ui/button";
import { MOCK_NOTIFICATIONS, MOCK_TUTOR_NOTIFICATIONS } from "@/shared/constants/notification-data";
import { NotificationType, NotificationRecord } from "@/shared/types/notification";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { IRole } from "@/server/_types/auth-type";
import { ROUTES } from "@/shared/constants/app";

interface NotificationDropdownProps {
  role: IRole;
}

const NotificationIcon = memo(function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "REQUEST":
      return (
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all group-hover:scale-110">
          <Calendar size={22} strokeWidth={2.5} />
        </div>
      );
    case "APPROVAL":
    case "SUCCESS":
      return (
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all group-hover:scale-110">
          <CheckCircle2 size={22} strokeWidth={2.5} />
        </div>
      );
    case "REMINDER":
      return (
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-all group-hover:scale-110">
          <FileText size={22} strokeWidth={2.5} />
        </div>
      );
    case "SYSTEM":
      return (
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-600 dark:text-slate-400 transition-all group-hover:scale-110">
          <Settings size={22} strokeWidth={2.5} />
        </div>
      );
    default:
      return (
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-all group-hover:scale-110">
          <AlertCircle size={22} strokeWidth={2.5} />
        </div>
      );
  }
});

export const NotificationDropdown = ({ role }: NotificationDropdownProps) => {
  const initialData = role === "TUTOR" ? MOCK_TUTOR_NOTIFICATIONS : MOCK_NOTIFICATIONS;
  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialData);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  return (
    <Dropdown
      hoverable
      trigger={<NotificationTrigger unreadCount={unreadCount} />}
      contentClassName="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-[72px] sm:top-auto sm:mt-4 w-auto sm:w-[420px] origin-top sm:origin-top-right overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-border bg-card shadow-2xl shadow-primary/10 transition-all duration-300"
    >
      <NotificationContent
        notifications={notifications}
        markAllAsRead={markAllAsRead}
        markAsRead={markAsRead}
        role={role}
      />
    </Dropdown>
  );
};

const NotificationTrigger = memo(function NotificationTrigger({ unreadCount }: { unreadCount: number }) {
  const { isOpen } = useDropdown();
  return (
    <div className="relative group p-2.5 rounded-2xl bg-muted/30 hover:bg-muted transition-all duration-300">
      <Bell
        size={22}
        strokeWidth={2.5}
        className={cn("text-muted-foreground transition-all duration-300 group-hover:scale-110", (isOpen || unreadCount > 0) && "text-primary")}
      />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-background shadow-lg shadow-rose-500/40 group-hover:scale-110 transition-transform translate-x-1/4 -translate-y-1/4">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
});

const NotificationContent = ({
  notifications,
  markAllAsRead,
  markAsRead,
  role,
}: {
  notifications: NotificationRecord[];
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  role: IRole;
}) => {
  const { setIsOpen } = useDropdown();
  const notificationPath =
    role === "PARENT"
      ? ROUTES.PARENT.NOTIFICATIONS
      : role === "TUTOR"
      ? ROUTES.TUTOR.NOTIFICATIONS
      : role === "ADMIN"
      ? ROUTES.ADMIN.NOTIFICATIONS
      : ROUTES.HOME;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/5 flex items-center justify-between bg-linear-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
            Thông báo
          </h3>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary transition-all hover:opacity-70 active:scale-95"
        >
          Đọc tất cả
        </button>
      </div>

      {/* List */}
      <div className="max-h-[60vh] sm:max-h-120 overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => {
                markAsRead(notification.id);
                setIsOpen(false);
              }}
            />
          ))
        ) : (
          <div className="px-4 sm:px-8 py-10 sm:py-12 flex flex-col items-center justify-center text-center opacity-40">
            <div className="p-3 sm:p-4 rounded-full bg-primary/5 mb-3 sm:mb-4">
              <BellOff className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <p className="text-xs sm:text-sm font-bold">Không có thông báo mới</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-white/5 bg-black/20">
        <Link href={notificationPath} onClick={() => setIsOpen(false)}>
          <Button
            variant="ghost"
            className="w-full h-10 sm:h-12 rounded-xl sm:rounded-2xl text-[11px] sm:text-[13px] font-black tracking-widest text-primary hover:bg-primary/10 hover:text-primary transition-all group"
          >
            XEM TẤT CẢ
            <ChevronRight className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const NotificationItem = memo(function NotificationItem({
  notification,
  onClick,
}: {
  notification: NotificationRecord;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-4 sm:px-8 py-3.5 sm:py-5 flex gap-3 sm:gap-4 cursor-pointer transition-all border-l-4",
        notification.isRead
          ? "border-transparent opacity-70 hover:opacity-100 hover:bg-white/2"
          : "border-primary bg-primary/3 hover:bg-primary/5",
      )}
    >
      <NotificationIcon type={notification.type} />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-0.5 sm:mb-1">
          <p className="text-[12px] sm:text-[14px] font-black text-foreground truncate group-hover:text-primary transition-colors">
            {notification.title}
          </p>
          <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground whitespace-nowrap opacity-60">
            {notification.time}
          </span>
        </div>
        <p className="text-[11px] sm:text-[13px] font-medium text-muted-foreground leading-relaxed line-clamp-2">
          {notification.description}
        </p>
      </div>
    </div>
  );
});
