"use client";

import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import TickIcon from '@/shared/components/icons/tick-icon';
import { useRouter } from 'next/navigation';
import { HomeSearchBar } from './home-search-bar';

export const HeroSection = () => {
  const router = useRouter();

  return (
    <>
      <section className="relative bg-muted/30 dark:bg-background pt-20 pb-10 overflow-hidden transition-colors duration-500">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-10 dark:opacity-5 blur-[100px]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* Left Column: Text & CTA */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight mb-8 leading-tight">
                Tìm gia sư phù hợp trong <span className="text-blue-600">5 phút</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Kết nối phụ huynh và học sinh với đội ngũ gia sư chất lượng cao, tận tâm và giàu kinh nghiệm tại khu vực của bạn.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Button onClick={() => router.push("/tutor")} size="xl" className="w-full sm:w-auto text-base font-bold px-8 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:bg-blue-600 hover:text-white">
                  Tìm gia sư ngay
                </Button>
                <Button onClick={() => router.push("/signup/tutor")} variant="outline" size="xl" className="w-full sm:w-auto text-base font-bold px-8 bg-background hover:bg-muted border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:text-foreground">
                  Đăng ký dạy
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-8">
                <div className="flex flex-col items-center lg:items-start group">
                  <span className="text-3xl font-black text-blue-600 group-hover:text-blue-600 transition-colors">500+</span>
                  <span className="text-sm font-medium text-muted-foreground mt-1">Gia sư chất lượng</span>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="flex flex-col items-center lg:items-start group">
                  <span className="text-3xl font-black text-blue-600 group-hover:text-blue-600 transition-colors">1000+</span>
                  <span className="text-sm font-medium text-muted-foreground mt-1">Học sinh tin dùng</span>
                </div>
              </div>
            </div>
            
            {/* Right Column: Image */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto mt-12 lg:mt-0">
              <div className="relative aspect-square md:aspect-4/3 lg:aspect-square drop-shadow-2xl">
                <Image 
                  src="/image.png"
                  alt="Gia sư và học sinh"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                
                {/* Decorative Element */}
                <div className="absolute bottom-4 left-0 md:-left-8 lg:bottom-12 lg:-left-12 bg-card rounded-2xl shadow-xl p-4 flex items-center gap-4 border border-border z-20 transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                    <TickIcon className="fill-current w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-foreground leading-tight">Gia sư uy tín</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground font-medium mt-0.5">Đã kiểm duyệt hồ sơ</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Styled Search Bar directly from Stitch Design */}
        <HomeSearchBar />
      </section>
    </>
  );
};
