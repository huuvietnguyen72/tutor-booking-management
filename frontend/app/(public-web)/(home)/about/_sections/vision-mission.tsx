'use client';

import React from 'react';
import { Eye, Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactElement<{ className?: string }>;
  variant?: 'light' | 'dark';
}

function VisionMissionCard({ title, description, icon, variant = 'light' }: CardProps) {
  const isDark = variant === 'dark';
  
  return (
    <div 
      className={cn(
        "relative p-8 lg:p-12 rounded-4xl flex flex-col gap-8 transition-all hover:scale-[1.02] overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both",
        isDark ? "bg-primary-deep text-white shadow-2xl shadow-primary/20" : "bg-muted/50 text-foreground border border-border"
      )}
    >
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
        isDark ? "bg-white/20" : "bg-white shadow-sm"
      )}>
        {React.cloneElement(icon, { 
          className: cn("w-8 h-8", isDark ? "text-white" : "text-primary", icon.props.className) 
        })}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-3xl font-extrabold tracking-tight">{title}</h3>
        <p className={cn("text-lg leading-relaxed", isDark ? "text-blue-50/90 dark:text-blue-100/80" : "text-muted-foreground")}>
          {description}
        </p>
      </div>

      {/* Decorative patterns */}
      <div className={cn(
        "absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl",
        isDark ? "bg-white/10" : "bg-blue-200/20"
      )} />
    </div>
  );
}

export function VisionMission() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <VisionMissionCard
            title="Tầm nhìn"
            description="Số hóa tri thức, phổ cập giáo dục chất lượng cao đến mọi gia đình Việt Nam thông qua nền tảng công nghệ thông minh, minh bạch và tận tâm."
            icon={<Eye />}
            variant="light"
          />
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <VisionMissionCard
              title="Sứ mệnh"
              description="Kiến tạo hệ sinh thái giáo dục hiện đại, nơi học sinh được thắp sáng tiềm năng và gia sư được tôn vinh giá trị thực sự của nghề giáo."
              icon={<Star />}
              variant="dark"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
