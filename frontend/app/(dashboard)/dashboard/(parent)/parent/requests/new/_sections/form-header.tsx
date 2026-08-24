"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";

interface FormHeaderProps {
  title: string;
  description: string;
}

export function FormHeader({ title, description }: FormHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-start gap-3 md:gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        type="button"
        className="rounded-full hover:bg-muted shrink-0 mt-1"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </Button>
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xs md:text-base text-muted-foreground font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
