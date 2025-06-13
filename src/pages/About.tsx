
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import AnimatedStats from '../components/about/AnimatedStats';
import InteractiveTimeline from '../components/about/InteractiveTimeline';
import TestimonialCarousel from '../components/about/TestimonialCarousel';
import { Heart } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <HeroSection
        icon={<Heart className="h-8 w-8" />}
        badge="About Us"
        title="Legal and Human Rights Centre"
        description="We are Tanzania's leading legal empowerment organization, dedicated to ensuring that every person has access to justice and the tools to claim their rights."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <AnimatedStats />
      <InteractiveTimeline />
      <TestimonialCarousel />
    </Layout>
  );
};

export default About;
