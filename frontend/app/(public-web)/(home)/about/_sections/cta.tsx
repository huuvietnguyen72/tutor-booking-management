'use client';

import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function AboutCTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden bg-primary-deep rounded-[3rem] p-12 lg:p-24 text-center text-white shadow-2xl shadow-primary/40 group">
          {/* Background patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm font-semibold animate-pulse">
              <Sparkles className="w-4 h-4" />
              Sẵn sàng tỏa sáng cùng tri thức
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Bắt đầu hành trình <br className="hidden md:block" /> kiến tạo hôm nay?
            </h2>
            
            <p className="text-xl text-blue-100 font-medium">
              Gia nhập cộng đồng Sapphire Clarity để trải nghiệm giáo dục 
              thế hệ mới, minh bạch và tận tâm.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 rounded-2xl w-full sm:w-auto shadow-lg group">
                Tham gia ngay
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
              </Button>
              <Button variant="outline" size="xl" className="border-white/30 bg-transparent text-white hover:bg-white/10 font-bold px-10 rounded-2xl w-full sm:w-auto">
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
