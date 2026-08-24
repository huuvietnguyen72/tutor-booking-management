"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { isActiveLink } from "@/shared/lib/utils";
import { IUserProfile } from "@/server/_types/auth-type";
import { INavLink } from "@/shared/constants/nav-config";

interface NavDesktopProps {
  isMounted: boolean;
  isLoading: boolean;
  user: IUserProfile | null | undefined;
  roleLinks: INavLink[] | null;
  guestLinks: (INavLink & { noActiveState?: boolean })[];
}

export const NavDesktop = ({ 
  isMounted, 
  isLoading, 
  user, 
  roleLinks, 
  guestLinks 
}: NavDesktopProps) => {
  const pathname = usePathname();
  const links = useMemo(() => (user && roleLinks ? roleLinks : guestLinks), [guestLinks, roleLinks, user]);
  const linksWithActive = useMemo(
    () => links.map((link) => ({ ...link, active: !link.noActiveState && isActiveLink(pathname, link.href) })),
    [links, pathname]
  );

  if (!isMounted || isLoading) {
    return (
      <nav className="hidden md:flex shrink-0 items-center justify-center gap-1 xl:gap-2 px-1.5 py-1.5 rounded-full bg-secondary/15 border border-border/40 backdrop-blur-md">
        <div className="flex items-center gap-2 px-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex shrink-0 items-center justify-center gap-1 xl:gap-2 px-1.5 py-1.5 rounded-full bg-secondary/15 border border-border/40 backdrop-blur-md transition-all duration-300 shadow-sm shadow-black/5">
      {linksWithActive.map((link) => (
        <NavLink
          key={link.href}
          label={link.label}
          href={link.href}
          active={link.active}
        />
      ))}
    </nav>
  );
};
