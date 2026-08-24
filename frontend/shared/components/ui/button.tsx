import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/shared/lib/utils";

const buttonVariants = {
  default:
    "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  destructive: "bg-red-500 text-white hover:bg-red-500/90",
  outline:
    "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-muted text-muted-foreground hover:bg-muted/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  "ghost-blue":
    "text-gray-600 hover:text-blue-600 font-medium transition-colors",
  hero: "bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 active:scale-95 flex items-center justify-center gap-2",
  "cta-white":
    "bg-white text-blue-600 hover:bg-gray-50 font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group",
  "cta-blue":
    "bg-blue-700 hover:bg-blue-800 text-white border border-blue-500/50 font-bold transition-all active:scale-95 flex items-center justify-center gap-2 group",
  "link-blue":
    "text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all p-0 h-auto bg-transparent",
};

const buttonSizes = {
  default: "h-10 px-4 py-2 rounded-xl",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  xl: "px-8 py-4 rounded-xl text-base",
  icon: "h-10 w-10",
  navbar: "px-5 py-2.5 rounded-xl",
  none: "",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants, buttonSizes };
