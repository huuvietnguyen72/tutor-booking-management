"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/components/ui/button";
import { Dropdown } from "@/shared/components/ui/dropdown";
import { cn } from "@/shared/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full w-10 h-10 border border-border/50 opacity-50"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      </Button>
    );
  }

  const themes = [
    { name: "light", label: "Sáng", icon: Sun, color: "text-amber-500" },
    { name: "dark", label: "Tối", icon: Moon, color: "text-blue-400" },
    { name: "system", label: "Hệ thống", icon: Monitor, color: "text-slate-400" },
  ];

  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;
  const iconColor = resolvedTheme === "dark" ? "text-blue-400" : "text-amber-500";

  return (
    <Dropdown
      hoverable
      trigger={
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-10 h-10 hover:bg-secondary/40 border border-border/50 transition-all hover:scale-105 active:scale-95 group relative flex items-center justify-center overflow-hidden"
        >
          <CurrentIcon className={cn("h-[1.2rem] w-[1.2rem] transition-all duration-300 animate-in zoom-in-50 fade-in-0", iconColor)} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      }
      contentClassName="w-40 min-w-max bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-2xl p-1.5"
    >
      <div className="flex flex-col gap-1">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.name;
          
          return (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group/item",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "hover:bg-muted text-foreground/70 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={cn("transition-colors", isActive ? t.color : "text-muted-foreground group-hover/item:text-foreground")} />
                <span>{t.label}</span>
              </div>
              {isActive && <Check size={14} className="animate-in fade-in zoom-in-50 duration-300" />}
            </button>
          );
        })}
      </div>
    </Dropdown>
  );
}
