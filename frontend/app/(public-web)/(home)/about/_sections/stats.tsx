'use client';

import { cn } from '@/shared/lib/utils';

interface StatProps {
  number: string;
  label: string;
  isAccent?: boolean;
}

function StatCard({ number, label }: Omit<StatProps, 'isAccent'>) {
  return (
    <div className={cn(
      "group p-10 rounded-[2.5rem] text-center transition-all duration-500 border border-border bg-card text-foreground",
      "hover:bg-primary hover:text-white hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-4 hover:border-transparent"
    )}>
      <div className="text-5xl lg:text-6xl font-black mb-4 tracking-tighter transition-transform duration-500 group-hover:scale-110">
        {number}
      </div>
      <div className="text-sm lg:text-base font-bold uppercase tracking-widest text-muted-foreground transition-colors duration-500 group-hover:text-blue-100/80">
        {label}
      </div>
    </div>
  );
}

export function AboutStats() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <StatCard number="5+" label="Năm kinh nghiệm" />
          <StatCard number="10k+" label="Học sinh tin dùng" />
          <StatCard number="2k+" label="Gia sư chất lượng" />
          <StatCard number="98%" label="Độ hài lòng" />
        </div>
      </div>
    </section>
  );
}
