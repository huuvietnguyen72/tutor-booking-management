"use client";

import { memo, useMemo } from 'react';
import Image from 'next/image';
import StarIcon from '@/shared/components/icons/star-icon';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel';
import { toSlug } from '@/shared/lib/utils';
import Autoplay from 'embla-carousel-autoplay';

import { useSearchTutors } from '@/server/_actions/tutor-action';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface TutorCarouselCardProps {
  id: number;
  fullName: string;
  avatarUrl?: string | null;
  rating?: number | null;
  educationLevel?: string | null;
  qualifications?: string | null;
  teachingMode?: string | null;
  teachingArea?: string | null;
  animationDelay: number;
  profileHref: string;
}

const TutorCarouselCard = memo(function TutorCarouselCard({
  id,
  fullName,
  avatarUrl,
  rating,
  educationLevel,
  qualifications,
  teachingMode,
  teachingArea,
  animationDelay,
  profileHref,
}: TutorCarouselCardProps) {
  return (
    <CarouselItem
      className="pl-4 sm:pl-6 lg:pl-8 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Link href={profileHref}>
        <div className="bg-card rounded-3xl border border-border shadow-[0_4px_24px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_12px_44px_rgb(0,0,0,0.12)] dark:hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col group overflow-hidden">
          <div className="relative w-full aspect-4/5 bg-muted shrink-0 overflow-hidden">
            <Image
              src={avatarUrl || `https://i.pravatar.cc/400?u=${id}`}
              alt={fullName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            />
            <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md dark:shadow-none border border-border dark:border-white/10">
              <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 drop-shadow-sm" />
              <span className="text-sm font-bold text-foreground">
                {rating ? (Number.isInteger(rating) ? `${rating}.0` : rating) : '5.0'}
              </span>
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">{fullName}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-1 font-medium">
              {educationLevel || 'Gia sư'} {qualifications && `• ${qualifications}`}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-inset ring-primary/20">
                {teachingMode || 'Trực tuyến'}
              </span>
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-inset ring-primary/20">
                {teachingArea === 'All Areas' ? 'Toàn quốc' : teachingArea || 'Đang cập nhật'}
              </span>
            </div>

            <div className="mt-auto">
              <Button
                variant="outline"
                className="w-full border-primary/20 bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm font-bold rounded-xl h-11 transition-all duration-300 group-hover:scale-[1.02] active:scale-95"
              >
                Xem hồ sơ
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </CarouselItem>
  );
});

export const TutorsSection = () => {
  const { data: tutorsData, isLoading } = useSearchTutors({
    size: 8,
    approvalStatus: 'approved'
  });

  const tutors = useMemo(() => tutorsData?.content || [], [tutorsData?.content]);
  const carouselPlugins = useMemo(
    () => [
      Autoplay({
        delay: 3000,
        stopOnMouseEnter: true,
      }),
    ],
    []
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-background overflow-hidden transition-colors duration-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative">
            <div className="max-w-2xl">
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-6 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-3xl border border-border h-112.5 flex flex-col overflow-hidden">
                <Skeleton className="w-full aspect-4/5" />
                <div className="p-5 flex flex-col gap-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full mt-auto rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }



  if (tutors.length === 0) return null;

  return (
    <section className="py-20 bg-background overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          plugins={carouselPlugins}
          className="w-full relative"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                Gia sư tiêu biểu
              </h2>
              <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                Đội ngũ gia sư được đánh giá cao nhất hệ thống
              </p>
            </div>
            
            <div className="flex items-center gap-3 relative md:static self-end md:self-auto right-0 bottom-0 z-10 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <CarouselPrevious className="static transform-none h-12 w-12 border border-border hover:bg-primary/5 hover:border-primary/30 transition-all bg-background shadow-none text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0" />
              <CarouselNext className="static transform-none h-12 w-12 border border-border hover:bg-primary/5 hover:border-primary/30 transition-all bg-background shadow-none text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-0" />
            </div>
          </div>

          <CarouselContent className="-ml-4 sm:-ml-6 lg:-ml-8">
            {tutors.map((tutor, idx) => (
              <TutorCarouselCard
                key={tutor.id} 
                id={tutor.id}
                fullName={tutor.fullName}
                avatarUrl={tutor.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${tutor.fullName}`}
                rating={tutor.rating}
                educationLevel={tutor.educationLevel}
                qualifications={tutor.qualifications}
                teachingMode={tutor.teachingMode}
                teachingArea={tutor.teachingArea}
                animationDelay={(idx % 4) * 100 + 300}
                profileHref={`/tutor/${toSlug(tutor.fullName)}-${tutor.id}`}
              />
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
