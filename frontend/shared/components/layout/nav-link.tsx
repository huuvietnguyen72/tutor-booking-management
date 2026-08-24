import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { memo } from "react";

const NavLinkBase = ({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 xl:px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full whitespace-nowrap",
        active
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
          : "text-muted-foreground hover:text-primary hover:bg-secondary/50",
      )}
    >
      {label}
    </Link>
  );
};

export const NavLink = memo(NavLinkBase);
