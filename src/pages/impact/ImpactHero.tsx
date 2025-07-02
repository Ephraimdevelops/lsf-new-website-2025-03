import HeroSection from '../../components/shared/HeroSection';
import { BarChart3 } from 'lucide-react';

export const ImpactHero = () => {
  return (
    <HeroSection
      icon={<BarChart3 className="h-8 w-8" />}
      badge="OUR IMPACT"
      title="Justice that changes lives. Systems that work for people."
      description="Over the past decade, LSF has transformed the legal empowerment landscape in Tanzania, creating measurable change that reaches every corner of our nation."
      backgroundImage="/lovable-uploads/background with mother umage .png"
    />
  );
};