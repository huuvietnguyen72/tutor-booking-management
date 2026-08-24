'use client';

import StarIcon from '@/shared/components/icons/star-icon';
import { Quote } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/components/ui/carousel";
import Image from 'next/image';

import { useGetLatestReviews } from '@/server/_actions/review-action';

export const TestimonialsSection = () => {
  const { data: reviewsResponse, isLoading } = useGetLatestReviews(6);
  const reviews = reviewsResponse?.content || [];

  if (isLoading) {
    return (
      <section className="py-24 bg-muted/30 dark:bg-background/50 transition-colors duration-500">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-muted/30 dark:bg-background/50 overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Hàng ngàn phụ huynh tin tưởng</h2>
        </div>

        <div className="relative mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >

            <CarouselContent className="-ml-4">
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-card p-8 rounded-3xl shadow-sm border border-border relative h-full flex flex-col transition-colors duration-500">
                    <Quote className="absolute top-8 right-8 text-primary/10 w-12 h-12" />
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-5 h-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} 
                        />
                      ))}
                    </div>
                    <p className="text-foreground/90 leading-relaxed font-medium mb-8 relative z-10 text-base grow">
                      &quot;{review.comment}&quot;
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted border border-border">
                        <Image 
                          src={review.parentAvatar || `https://i.pravatar.cc/150?u=${review.id}`} 
                          alt={review.parentName || "Phụ huynh"} 
                          fill 
                          className="object-cover" 
                          sizes="48px" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground line-clamp-1">{review.parentName || "Phụ huynh"}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">Phụ huynh</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
