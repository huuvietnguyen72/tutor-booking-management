"use client";

import { memo } from "react";
import { NotificationRecord } from "@/shared/types/notification";
import { 
  FileText, 
  CheckCircle2, 
  Bell, 
  Settings,
  Circle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const getIconStyle = (type: NotificationRecord["type"]) => {
  switch (type) {
    case "REQUEST":
      return {
        Icon: FileText,
        iconClassName: "text-destructive",
        bgColor: "bg-destructive/10",
        borderColor: "border-destructive/20",
      };
    case "APPROVAL":
      return {
        Icon: CheckCircle2,
        iconClassName: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/20",
      };
    case "SUCCESS":
      return {
        Icon: CheckCircle2,
        iconClassName: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
      };
    case "REMINDER":
      return {
        Icon: Bell,
        iconClassName: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
      };
    case "SYSTEM":
      return {
        Icon: AlertCircle,
        iconClassName: "text-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20",
      };
    default:
      return {
        Icon: Settings,
        iconClassName: "text-primary/60",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/10",
      };
  }
};

const NotificationItemBase = ({ notification }: { notification: NotificationRecord }) => {
  const style = getIconStyle(notification.type);

  return (
    <div className={cn(
      "group relative p-4 sm:p-6 transition-all border-b border-border/50 last:border-0",
      "hover:bg-muted/30 transition-colors duration-300",
      !notification.isRead && "bg-primary/3 dark:bg-primary/5 hover:bg-primary/6"
    )}>
      <div className="flex gap-4 sm:gap-6">
        {/* Icon */}
        <div className={cn(
          "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 duration-500",
          style.bgColor,
          style.borderColor
        )}>
          <style.Icon size={20} className={style.iconClassName} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={cn(
              "text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300",
              !notification.isRead && "font-extrabold"
            )}>
              {notification.title}
            </h4>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mt-0.5 opacity-60">
              {notification.time}
            </span>
          </div>
          <p className="text-sm text-foreground/70 dark:text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
            {notification.description}
          </p>
        </div>

        {/* Unread dot */}
        {!notification.isRead && (
          <div className="pt-1 select-none flex items-center">
            <Circle className="fill-primary text-primary animate-pulse" size={8} />
          </div>
        )}
      </div>
    </div>
  );
};

export const NotificationItem = memo(NotificationItemBase);
