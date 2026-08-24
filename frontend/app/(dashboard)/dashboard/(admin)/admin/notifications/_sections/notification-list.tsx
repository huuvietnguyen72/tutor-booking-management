"use client";

import { useCallback, useMemo, useState } from "react";
import { MOCK_NOTIFICATIONS } from "@/shared/constants/notification-data";
import { NotificationItem } from "./notification-item";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, CheckCheck } from "lucide-react";

export function NotificationList() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const notificationItems = useMemo(
    () => notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />),
    [notifications]
  );

  return (
    <div className="bg-card rounded-[2.5rem] shadow-xl shadow-foreground/2 border border-border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/4">
      <div className="p-6 sm:p-8 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <h3 className="text-[11px] font-black text-foreground/50 uppercase tracking-[0.2em] px-2">
          DANH SÁCH MỚI NHẤT
        </h3>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-bold text-primary hover:text-primary/80 active:scale-95 transition-all flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-primary/10 group"
        >
          <CheckCheck size={16} className="group-hover:scale-110 transition-transform" />
          ĐÁNH DẤU TẤT CẢ LÀ ĐÃ ĐỌC
        </button>
      </div>

      <div className="divide-y divide-border/30">
        {notifications.length > 0 ? (
          notificationItems
        ) : (
          <div className="p-20 text-center">
            <p className="text-muted-foreground font-medium">Bạn hiện không có thông báo nào.</p>
          </div>
        )}
      </div>

      <div className="p-8 flex justify-center bg-muted/10 border-t border-border/30">
        <Button variant="outline" className="h-12 px-8 rounded-2xl border-border text-muted-foreground font-extrabold hover:bg-background flex items-center gap-2 group transition-all hover:text-primary hover:border-primary/30 active:scale-95">
          XEM THÊM THÔNG BÁO CŨ
          <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
