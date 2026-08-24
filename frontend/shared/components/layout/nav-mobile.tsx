"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn, isActiveLink } from "@/shared/lib/utils";
import { AuthButtons } from "./auth-buttons";
import { IUserProfile } from "@/server/_types/auth-type";
import { INavLink } from "@/shared/constants/nav-config";

interface NavMobileProps {
  isOpen: boolean;
  onClose: () => void;
  isMounted: boolean;
  isLoading: boolean;
  user: IUserProfile | null | undefined;
  roleLinks: INavLink[] | null;
  guestLinks: (INavLink & { noActiveState?: boolean })[];
}

export const NavMobile = ({ 
  isOpen, 
  onClose, 
  isMounted, 
  isLoading, 
  user, 
  roleLinks, 
  guestLinks 
}: NavMobileProps) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "absolute w-full bg-card backdrop-blur-3xl border-b border-border transition-all duration-500 ease-in-out md:hidden overflow-hidden shadow-2xl",
        isOpen
          ? "max-h-[600px] opacity-100 py-8"
          : "max-h-0 opacity-0 py-0",
      )}
    >
      <div className="px-6 flex flex-col space-y-2">
        {!isMounted || isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        ) : user ? (
          roleLinks?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-3 rounded-2xl text-base font-bold transition-all",
                isActiveLink(pathname, link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))
        ) : (
          <>
            {guestLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-4 py-3 rounded-2xl text-base font-bold transition-all",
                  !link.noActiveState && isActiveLink(pathname, link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <AuthButtons vertical className="pt-2" />
          </>
        )}
      </div>
    </div>
  );
};
