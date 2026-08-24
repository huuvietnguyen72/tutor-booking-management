"use client";

import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';

export const CtaSection = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-background transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 flex flex-col items-center justify-center gap-12">
            <div className="max-w-3xl text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Bạn đã sẵn sàng để nâng tầm tri thức?
              </h2>
              <p className="text-blue-50/90 text-lg md:text-xl font-medium mb-0">
                Đăng ký ngay để nhận tư vấn miễn phí và tìm gia sư phù hợp nhất cho con bạn.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Button 
                size="xl" 
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 transition-all duration-300 shadow-xl shadow-black/10 hover:scale-105 active:scale-95" 
                onClick={() => router.push("/signup/parent")}
              >
                <span>Bắt đầu ngay</span>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="group w-full sm:w-auto border-white/40 text-white bg-transparent hover:bg-white/10 hover:border-white hover:text-white font-bold px-10 transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95" 
                onClick={() => router.push("/contact")}
              >
                <span>Liên hệ tư vấn</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
