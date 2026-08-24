"use client";

import { useCallback, useMemo, useState } from "react";
import { MOCK_NOTIFICATIONS } from "@/shared/constants/notification-data";
import { NotificationItem } from "./notification-item";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, Check } from "lucide-react";

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
    <div className="bg-card rounded-[2.5rem] shadow-sm border border-border overflow-hidden transition-colors duration-500">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-black text-foreground uppercase tracking-widest px-2">
          DANH SÁCH MỚI NHẤT
        </h3>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-bold text-primary hover:text-primary/80 active:scale-95 transition-all flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-primary/10"
        >
          <Check size={14} strokeWidth={3} />
          ĐÁNH DẤU TẤT CẢ LÀ ĐÃ ĐỌC
        </button>
      </div>

      <div className="divide-y divide-border/50">
        {notificationItems}
      </div>

      <div className="p-8 flex justify-center bg-muted/30">
        <Button variant="outline" className="h-12 px-8 rounded-2xl border-border text-muted-foreground font-bold hover:bg-background flex items-center gap-2 group transition-all">
          XEM THÊM THÔNG BÁO CŨ
          <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
