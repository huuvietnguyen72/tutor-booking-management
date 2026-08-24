"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronRight, 
  Search, 
  ShieldCheck,
  GraduationCap,
  User
} from "lucide-react";
import { useGetMe } from "@/server/_actions/auth-action";
import { BREADCRUMB_LABELS } from "@/shared/lib/breadcrumb-mapping";
import { UserActionArea } from "./user-action-area";
import { ThemeToggle } from "./theme-toggle"; 
import { Input } from "../ui/input";
import { ROUTES } from "@/shared/constants/app"; 
import { cn } from "@/shared/lib/utils";

interface IBreadcrumbItem {
  label: string;
  href?: string;
  isLast?: boolean;
}

interface DashboardNavbarProps {
  role?: "ADMIN" | "TUTOR" | "PARENT";
  showSearch?: boolean;
  actionSlot?: React.ReactNode;
  breadcrumbs?: IBreadcrumbItem[];
}

const ROLE_CONFIG = {
  ADMIN: {
    label: "Quản trị",
    icon: ShieldCheck,
    href: ROUTES.ADMIN.DASHBOARD,
    color: "bg-primary/10 text-primary"
  },
  TUTOR: {
    label: "Gia sư",
    icon: GraduationCap,
    href: ROUTES.TUTOR.DASHBOARD,
    color: "bg-indigo-500/10 text-indigo-500"
  },
  PARENT: {
    label: "Phụ huynh",
    icon: User,
    href: ROUTES.PARENT.DASHBOARD,
    color: "bg-emerald-500/10 text-emerald-500"
  }
};

export const DashboardNavbar = ({ 
  role = "ADMIN", 
  showSearch = false, 
  actionSlot,
  breadcrumbs: manualBreadcrumbs 
}: DashboardNavbarProps) => {
  const pathname = usePathname();
  const { data: userData } = useGetMe();
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  const breadcrumbSegments = React.useMemo(() => {
    const pathSegments = pathname.split("/").filter((segment) => segment !== "");

    if (manualBreadcrumbs) {
      return manualBreadcrumbs.map((b, i) => ({
        ...b,
        isLast: b.isLast !== undefined ? b.isLast : i === manualBreadcrumbs.length - 1,
      }));
    }

    return pathSegments
      .map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        return {
          id: segment,
          label: BREADCRUMB_LABELS[segment] || segment,
          href,
          isLast: index === pathSegments.length - 1,
        };
      })
      .filter((segment) => !["admin", "dashboard", "tutor", "parent"].includes(segment.id) || segment.isLast);
  }, [manualBreadcrumbs, pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur-xl transition-all duration-300 border-primary/5">
      <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-50" />
      
      <div className="flex h-16 items-center px-4 md:px-8">
        {/* Left: Breadcrumbs & Navigation status */}
        <div className="flex-1 flex items-center gap-4 min-w-0">
          <nav className="hidden md:flex items-center text-sm font-medium min-w-0">
            <Link 
              href={config.href} 
              className="flex items-center gap-1.5 text-primary/80 hover:text-primary transition-all duration-300 font-black tracking-tight shrink-0"
            >
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg shadow-xs transition-colors",
                config.color
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="ml-1 uppercase tracking-widest text-[10px]">{config.label}</span>
            </Link>
            
            {breadcrumbSegments.length > 0 && (
              <div className="flex items-center ml-2 min-w-0">
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/30 shrink-0" />
                <div className="flex items-center bg-muted/30 px-3 py-1.5 rounded-2xl border border-border/50 shadow-xs min-w-0">
                  {breadcrumbSegments.map((item, index) => (
                    <React.Fragment key={`${item.href}-${index}-${item.label}`}>
                      <div className={cn(
                        "flex items-center",
                        item.isLast ? "min-w-0" : "shrink-0"
                      )}>
                        {item.isLast ? (
                          <span className="text-foreground font-black truncate max-w-50 tracking-tight">
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            href={item.href || "#"}
                            className="text-muted-foreground hover:text-primary transition-colors font-bold whitespace-nowrap"
                          >
                            {item.label}
                          </Link>
                        )}
                        {!item.isLast && (
                          <ChevronRight className="w-3.5 h-3.5 mx-2 text-muted-foreground/20 shrink-0" />
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </nav>
          
          {/* Mobile indicator */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
             <div className={cn(
               "flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-lg",
               role === 'ADMIN' ? 'bg-primary shadow-primary/20' : 
               role === 'TUTOR' ? 'bg-indigo-500 shadow-indigo-500/20' : 
               'bg-emerald-500 shadow-emerald-500/20'
             )}>
                <Icon className="w-4 h-4" />
             </div>
             <span className="text-xs font-black uppercase tracking-tight">{config.label}</span>
          </div>
        </div>

        {/* Center: Search Bar - Fixed in middle */}
        <div className="hidden lg:flex items-center justify-center flex-1 px-4">
          {showSearch && (
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Tìm kiếm nhanh (Ctrl + K)..."
                className="w-full pl-10 pr-12 bg-muted/40 border-border/50 hover:border-primary/20 focus:bg-background focus:border-primary/50 transition-all rounded-[1.25rem] h-10 text-xs font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-md border border-border/60 bg-background px-1.5 font-mono text-[9px] font-bold opacity-60">
                  <kbd className="text-[10px] no-underline">⌘</kbd>K
                </kbd>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions & User Dropdown */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
          {actionSlot}
          
          <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block shrink-0" />
          
          <ThemeToggle />
          
          {userData && (
            <div className="ml-1 pl-1 border-l border-border/40 sm:border-none shrink-0">
              <UserActionArea user={userData} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
