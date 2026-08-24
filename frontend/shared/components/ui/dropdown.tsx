"use client";
import { useState, ReactNode, createContext, useContext, useRef } from "react";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { cn } from "@/shared/lib/utils";

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    return { isOpen: false, setIsOpen: () => {}, close: () => {} };
  }
  return context;
};

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  align?: "left" | "right";
  hoverable?: boolean;
}

export const Dropdown = ({
  trigger,
  children,
  className,
  contentClassName,
  align = "right",
  hoverable = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useClickOutside(dropdownRef, close);

  const handleMouseEnter = () => {
    if (hoverable && typeof window !== "undefined" && window.innerWidth >= 768) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverable && typeof window !== "undefined" && window.innerWidth >= 768) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, close }}>
      <div 
        className={cn("relative inline-block", className)} 
        ref={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>

        {isOpen && (
          <div
            className={cn(
              "absolute mt-3 z-50 animate-in fade-in zoom-in duration-200",
              align === "right" ? "right-0" : "left-0",
              contentClassName
            )}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
};
