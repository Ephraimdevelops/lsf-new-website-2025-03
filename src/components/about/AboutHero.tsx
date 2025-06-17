
import { Users, Heart, Scale } from 'lucide-react';
import HeroSection from '@/components/shared/HeroSection';

const AboutHero = () => {
  return (
    <HeroSection
      icon={<Users className="h-8 w-8" />}
      badge="ABOUT US"
      title="Empowering Justice Through Legal Innovation"
      description="For over 15 years, the Legal Services Facility has been at the forefront of strengthening legal empowerment across Tanzania, ensuring that every citizen has access to justice regardless of their economic status or social background."
      backgroundImage="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=1200&h=800&fit=crop"
    />
  );
};

export default AboutHero;
