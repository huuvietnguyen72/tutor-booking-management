"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { NO_NAVBAR_ROUTES, APP_SAVE_KEY, ROUTES } from "@/shared/constants/app";
import { useGetMe } from "@/server/_actions/auth-action";
import { getCookie } from "cookies-next";
import { NAV_LINKS } from "@/shared/constants/nav-config";
import { Logo } from "./logo";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ThemeToggle } from "./theme-toggle";
import { UserActionArea } from "./user-action-area";
import { AuthButtons } from "./auth-buttons";
import { NavDesktop } from "./nav-desktop";
import { NavMobile } from "./nav-mobile";

// Guest navigation links — single source of truth for Desktop & Mobile
const GUEST_NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Tìm Gia Sư", href: "/tutor" },
  { label: "Trở Thành Gia Sư", href: "/signup/tutor", noActiveState: true },
  { label: "Về Chúng Tôi", href: "/about" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const pathname = usePathname();
  const token = getCookie(APP_SAVE_KEY.TOKEN_KEY);
  const roleFromCookie = getCookie(APP_SAVE_KEY.USER_ROLE);
  const { data: user, isLoading } = useGetMe({ enabled: !!token });

  const router = useRouter();

  // Redirect ADMIN to their dashboard if they are on public web
  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.push(ROUTES.ADMIN.DASHBOARD);
    }
  }, [user?.role, router]);

  // Handle scroll and mounting
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logic to hide navbar for specific routes
  const showNavbar = !NO_NAVBAR_ROUTES.some((route) => pathname.startsWith(route))

  if (!showNavbar) return null;

  const roleLinks =
    user?.role && user.role !== "ADMIN"
      ? NAV_LINKS[user.role as keyof typeof NAV_LINKS]
      : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-500 backdrop-blur-xl",
        isScrolled
          ? "bg-card/80 border-border shadow-sm shadow-primary/5"
          : "bg-background/50 border-transparent",
      )}
    >
      <div className="container mx-auto relative flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Logo Area */}
        <div className="flex-1 flex items-center justify-start min-w-0">
          <Logo />
        </div>

        {/* Center: Desktop Navigation */}
        <NavDesktop 
          isMounted={isMounted}
          isLoading={isLoading}
          user={user}
          roleLinks={roleLinks}
          guestLinks={GUEST_NAV_LINKS}
        />

        {/* Right: Actions Area */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
          <ThemeToggle />

          {!isMounted || isLoading ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <Skeleton className="h-4 w-20 xl:w-24 rounded-full" />
                <Skeleton className="h-3 w-10 xl:w-12 rounded-full" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ) : user ? (
            <UserActionArea user={user} />
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <AuthButtons className="hidden md:flex text-sm xl:text-base px-3 xl:px-4" />
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <NavMobile 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isMounted={isMounted}
        isLoading={isLoading}
        user={user}
        roleLinks={roleLinks}
        guestLinks={GUEST_NAV_LINKS}
      />
    </header>
  );
};
