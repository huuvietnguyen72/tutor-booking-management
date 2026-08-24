"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  CreditCard,
  Star,
  LifeBuoy,
  Phone,
  Smile,
  CalendarRange,
  Search,
  User,
  Wallet,
  BookOpen,
  Clock,
  ShieldCheck,
  BarChart3,
  LucideIcon,
} from "lucide-react";
import { cn, isActiveLink } from "@/shared/lib/utils";
import { Logo } from "@/shared/components/layout/logo";
import { ROUTES } from "@/shared/constants/app";

// --- Types ---
interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

// --- Constants ---
const NAV_ITEMS_PARENT: NavItem[] = [
  { icon: LayoutDashboard, label: "Tổng quan", href: ROUTES.PARENT.DASHBOARD },
  { icon: CalendarRange, label: "Lịch học", href: ROUTES.PARENT.SCHEDULES },
  { icon: BookOpen, label: "Khóa học", href: ROUTES.PARENT.COURSES },
  { icon: Smile, label: "Quản lý con cái", href: ROUTES.PARENT.CHILDREN },
  { icon: ClipboardList, label: "Yêu cầu của tôi", href: ROUTES.PARENT.REQUESTS },
];

const NAV_ITEMS_TUTOR: NavItem[] = [
  { icon: LayoutDashboard, label: "Tổng quan", href: ROUTES.TUTOR.DASHBOARD },
  { icon: CalendarRange, label: "Lịch dạy", href: ROUTES.TUTOR.SCHEDULE },
  { icon: Clock, label: "Cập nhật lịch rảnh", href: ROUTES.TUTOR.AVAILABILITY },
  { icon: BookOpen, label: "Môn học & Giá", href: ROUTES.TUTOR.SUBJECTS },
  { icon: Search, label: "Yêu cầu dạy học", href: ROUTES.TUTOR.MARKETPLACE },
  { icon: User, label: "Hồ sơ gia sư", href: ROUTES.TUTOR.PROFILE },
  { icon: Star, label: "Đánh giá", href: ROUTES.TUTOR.REVIEWS },
];

const NAV_ITEMS_ADMIN: NavItem[] = [
  { icon: BarChart3, label: "Thống kê", href: ROUTES.ADMIN.DASHBOARD },
  { icon: ShieldCheck, label: "Duyệt Gia sư", href: ROUTES.ADMIN.TUTOR_APPROVAL },
  { icon: User, label: "Người dùng", href: ROUTES.ADMIN.USERS },
  { icon: BookOpen, label: "Môn học", href: ROUTES.ADMIN.SUBJECTS },
];

// --- Shared Components ---

const SidebarLink = memo(function SidebarLink({ icon: Icon, label, href, isActive }: NavItem & { isActive: boolean }) {
  return (
  <Link
    href={href}
    className={cn(
      "flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-3.5 rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-[10px] md:text-sm font-bold transition-all duration-300 shrink-0 min-w-19 md:min-w-0 group",
      isActive
        ? "text-primary md:bg-primary/5 shadow-sm shadow-primary/5"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    )}
  >
    <Icon
      size={22}
      strokeWidth={isActive ? 3 : 2}
      className={cn(
        "shrink-0 md:w-5 md:h-5 transition-all duration-300 group-hover:scale-110",
        isActive
          ? "text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
          : "text-muted-foreground/60 group-hover:text-foreground",
      )}
    />
    <span className="truncate max-w-20 md:max-w-none tracking-tight">
      {label}
    </span>
    {isActive && (
      <div className="hidden md:block ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
    )}
  </Link>
  );
});

const BaseSidebar = ({ items, children }: { items: NavItem[]; children?: React.ReactNode }) => {
  const pathname = usePathname();
  const itemsWithActive = useMemo(
    () => items.map((item) => ({ ...item, isActive: isActiveLink(pathname, item.href) })),
    [items, pathname]
  );
  
  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 flex flex-row md:sticky md:top-0 md:h-dvh md:flex-col w-full md:w-60 border-t md:border-r md:border-t-0 border-border bg-card/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] md:shadow-none shrink-0 pb-safe transition-all duration-300">
      <div className="hidden md:block p-4 border-b border-border">
        <Logo />
      </div>

      <nav className="flex-1 flex flex-row overflow-x-auto md:flex-col md:overflow-visible gap-1 md:gap-1.5 md:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {itemsWithActive.map((item) => (
          <SidebarLink 
            key={item.href} 
            {...item} 
            isActive={item.isActive} 
          />
        ))}
      </nav>

      {children}
    </aside>
  );
};

const HelpCard = ({ 
  title = "Cần hỗ trợ?", 
  description = "Đội ngũ chăm sóc khách hàng 24/7." 
}: { 
  title?: string; 
  description?: string;
}) => (
  <div className="hidden md:block m-6 relative group">
    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="relative overflow-hidden rounded-3xl bg-primary/10 dark:bg-primary/5 border border-primary/20 p-4 text-foreground shadow-2xl shadow-primary/5 transition-all duration-500">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl group-hover:scale-125 transition-transform duration-700" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-md shadow-inner border border-primary/20">
          <LifeBuoy
            size={20}
            strokeWidth={2.5}
            className="text-primary animate-pulse"
          />
        </div>

        <h4 className="mb-1.5 text-sm font-black leading-tight tracking-tight uppercase">
          {title}
        </h4>
        <p className="mb-5 text-[11px] font-medium text-muted-foreground leading-relaxed">
          {description}
        </p>

        <a
          href="tel:1900xxxx"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Phone size={14} fill="currentColor" strokeWidth={0} />
          GỌI HOTLINE
        </a>
      </div>
    </div>
  </div>
);

// --- Exported Components ---

export function ParentDashboardSidebar() {
  return (
    <BaseSidebar items={NAV_ITEMS_PARENT}>
      {/* <HelpCard /> */}
    </BaseSidebar>
  );
}

export function TutorDashboardSidebar() {
  return (
    <BaseSidebar items={NAV_ITEMS_TUTOR}>
      {/* <HelpCard 
        title="Hỗ trợ gia sư?" 
        description="Dành riêng cho gia sư của hệ thống." 
      /> */}
    </BaseSidebar>
  );
}

export function AdminDashboardSidebar() {
  return (
    <BaseSidebar items={NAV_ITEMS_ADMIN}>
      <div className="hidden md:block m-6 relative group">
        <div className="relative overflow-hidden rounded-3xl bg-secondary/50 dark:bg-secondary/20 border border-border p-4 text-foreground transition-all duration-500">
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 backdrop-blur-md border border-orange-500/20">
              <ShieldCheck
                size={20}
                strokeWidth={2.5}
                className="text-orange-500"
              />
            </div>
            <h4 className="mb-1 text-sm font-black leading-tight tracking-tight uppercase">
              Quản trị viên
            </h4>
            <p className="text-[11px] font-medium text-muted-foreground">
              Quyền hạn tối cao
            </p>
          </div>
        </div>
      </div>
    </BaseSidebar>
  );
}
