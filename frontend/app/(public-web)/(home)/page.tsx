import { HeroSection } from './_sections/hero-section';
import { TutorsSection } from './_sections/tutors-section';
import { StepsSection } from './_sections/steps-section';
import { TestimonialsSection } from './_sections/testimonials-section';
import { CtaSection } from './_sections/cta-section';


const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <HeroSection />
      <TutorsSection />
      <StepsSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;
