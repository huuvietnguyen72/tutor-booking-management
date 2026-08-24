'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { Play } from 'lucide-react';

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-32 lg:pb-48">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wider uppercase">
              About Sapphire Clarity
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1]">
              Kiến tạo tương lai <br />
              <span className="text-primary">học tập</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Chúng tôi không chỉ cung cấp giải pháp giáo dục, mà còn là người đồng hành thắp sáng 
              con đường tri thức, kết nối tinh hoa và dẫn bước thành công cho thế hệ tương lai.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="xl" className="bg-primary hover:bg-primary/90 text-white rounded-2xl w-full sm:w-auto">
                Bắt đầu ngay
              </Button>
              <Button variant="ghost" size="xl" className="group gap-3 text-foreground/80 hover:text-primary rounded-2xl w-full sm:w-auto">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </span>
                Xem video giới thiệu
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 group">
              <Image
                src="/images/about/hero.png"
                alt="Architecture for learning"
                width={800}
                height={600}
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Floating Badge */}
              <div className="absolute top-8 right-8 bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Chứng nhận</p>
                    <p className="text-sm font-bold text-foreground leading-tight">Quốc tế ISO</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 dark:opacity-20 -z-10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 dark:opacity-20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
