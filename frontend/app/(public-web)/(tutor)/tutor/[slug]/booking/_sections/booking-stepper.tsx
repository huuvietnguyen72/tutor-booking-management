"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface BookingStepperProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, title: "Chọn con" },
  { id: 2, title: "Chọn lịch" },
  { id: 3, title: "Hình thức" },
  { id: 4, title: "Xác nhận" },
];

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                  currentStep > step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : currentStep === step.id
                    ? "bg-card border-blue-600 text-blue-600 shadow-lg shadow-blue-600/10 ring-4 ring-blue-600/5 dark:ring-blue-900/30"
                    : "bg-card border-border text-muted-foreground/60 dark:text-muted-foreground/40"
                )}
              >
                {currentStep > step.id ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "absolute -bottom-7 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300",
                  currentStep >= step.id ? "text-blue-600" : "text-muted-foreground/60 dark:text-muted-foreground/40"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connecting Line */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-12 sm:w-20 md:w-32 h-[2px] mx-2 transition-colors duration-500",
                  currentStep > step.id ? "bg-blue-600 shadow-sm shadow-blue-600/20" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
