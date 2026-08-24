import React from 'react';
import { Metadata } from 'next';
import { AboutHero } from './_sections/hero';
import { VisionMission } from './_sections/vision-mission';
import { AboutStats } from './_sections/stats';
import { CoreValues } from './_sections/core-values';
import { OurTeam } from './_sections/team';
import { AboutCTA } from './_sections/cta';

export const metadata: Metadata = {
  title: 'Về chúng tôi | Sapphire Clarity',
  description: 'Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ sáng lập của Sapphire Clarity - Nền tảng kết nối giáo dục hàng đầu.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-5 bg-background">
      <AboutHero />
      <VisionMission />
      <AboutStats />
      <CoreValues />
      <OurTeam />
      <AboutCTA />
    </main>
  );
}
