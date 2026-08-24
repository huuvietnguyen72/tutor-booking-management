import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

export const AuthButtons = ({
  className,
  vertical,
}: {
  className?: string;
  vertical?: boolean;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 sm:gap-3",
      vertical && "flex-col items-stretch gap-3",
      className,
    )}
  >
    <Link href="/login" className={cn(vertical && "w-full")}>
      <Button
        variant="ghost"
        className={cn(
          "font-bold rounded-xl transition-all border border-border",
          vertical && "w-full py-6 text-base",
        )}
      >
        Đăng nhập
      </Button>
    </Link>
    <Link href="/signup/parent" className={cn(vertical && "w-full")}>
      <Button
        className={cn(
          "font-bold px-5 sm:px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/20",
          vertical && "w-full py-6 text-base",
        )}
      >
        Đăng ký
      </Button>
    </Link>
  </div>
);
