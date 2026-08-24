"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  User, 
  LogOut, 
  Lock, 
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { IUserProfile } from "@/server/_types/auth-type";
import { useLogout } from "@/server/_actions/auth-action";
import { Dropdown, useDropdown } from "@/shared/components/ui/dropdown";
import { ROUTES } from "@/shared/constants/app";
import { toast } from "sonner";
import { formatErrorMessage } from "@/shared/lib/utils";
import { memo, useCallback, useMemo } from "react";

const MENU_ITEMS = [
  {
    label: "Hồ sơ cá nhân",
    href: ROUTES.PROFILE,
    icon: User,
    iconColor: "text-blue-500",
  },
  {
    label: "Đổi mật khẩu",
    href: ROUTES.CHANGE_PASSWORD,
    icon: Lock,
    iconColor: "text-amber-500",
  },
] as const;

const DASHBOARD_MENU_BY_ROLE = {
  TUTOR: ROUTES.TUTOR.DASHBOARD,
  PARENT: ROUTES.PARENT.DASHBOARD,
} as const;

export const UserDropdown = ({ user }: { user: IUserProfile }) => {
  const { mutateAsync: logout } = useLogout();

  const Trigger = (
    <div className="group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-border bg-muted/30 transition-all duration-500 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 sm:h-12 sm:w-12">
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.fullName}
          width={48}
          height={48}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary">
          <User size={22} strokeWidth={2.5} />
        </div>
      )}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  return (
    <Dropdown
      trigger={Trigger}
      hoverable
      contentClassName="w-64 origin-top-right overflow-hidden rounded-[2.5rem] border border-border bg-card p-2 shadow-2xl shadow-primary/5 transition-all duration-300 ring-1 ring-black/5"
    >
      <UserDropdownContent user={user} logout={logout} />
    </Dropdown>
  );
};

const UserDropdownContent = memo(function UserDropdownContent({
  user,
  logout,
}: {
  user: IUserProfile;
  logout: () => Promise<void>;
}) {
  const { close } = useDropdown();
  const pathname = usePathname();

  const menuItems = useMemo(() => {
    if (user.role === "TUTOR" || user.role === "PARENT") {
      return [
        ...MENU_ITEMS,
        {
          label: "Bảng điều khiển",
          href: DASHBOARD_MENU_BY_ROLE[user.role],
          icon: LayoutDashboard,
          iconColor: "text-indigo-500",
        },
      ];
    }

    return MENU_ITEMS;
  }, [user.role]);

  const handleLogout = useCallback(async () => {
    close();
    toast.promise(logout(), {
      loading: "Đang đăng xuất...",
      success: () => {
        setTimeout(() => {
          window.location.href = ROUTES.HOME;
        }, 800);
        return "Đăng xuất thành công!";
      },
      error: (err) => formatErrorMessage(err) || "Đăng xuất thất bại",
    });
  }, [close, logout]);

  return (
    <div className="flex flex-col">
      {/* User Info Section */}
      <div className="flex items-center gap-4 border-b rounded-t-4xl border-border bg-muted/30 px-6 py-6 mb-2">
        <div className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-background shadow-lg">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.fullName}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary text-white">
              <User size={28} strokeWidth={2.5} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-black text-foreground truncate leading-tight tracking-tight">
            {user.fullName}
          </p>
          <div className="mt-1.5 inline-flex items-center rounded-lg bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary uppercase tracking-widest ring-1 ring-primary/20">
            {user.role === "TUTOR" ? "GIA SƯ" : user.role === "PARENT" ? "PHỤ HUYNH" : user.role}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-1 space-y-1">
        {menuItems.map((item, index) => {
          const isDashboardLink = item.label === "Bảng điều khiển";
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href + '/')) ||
            (isDashboardLink && pathname.startsWith("/dashboard"));

          return (
            <Link
              key={index}
              href={item.href}
              onClick={close}
              className={cn(
                "group flex items-center gap-3.5 rounded-[1.25rem] px-4 py-3 text-sm font-bold transition-all duration-300 active:scale-[0.98]",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 shadow-xs",
                isActive 
                  ? "bg-primary text-white scale-110" 
                  : cn("bg-muted/50 group-hover:bg-background group-hover:scale-110", item.iconColor)
              )}>
                <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className="tracking-tight">{item.label}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="my-3 border-t border-border mx-4" />

      {/* Logout Button */}
      <div className="px-2 pb-2">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3.5 rounded-[1.25rem] px-4 py-3.5 text-left text-sm font-black uppercase tracking-widest text-rose-500 transition-all duration-300 hover:bg-rose-500 hover:text-white active:scale-[0.98] shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 transition-all duration-300 group-hover:bg-white group-hover:scale-110">
            <LogOut size={18} strokeWidth={3} />
          </div>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
});
