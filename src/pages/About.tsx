
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import AnimatedStats from '../components/about/AnimatedStats';
import InteractiveTimeline from '../components/about/InteractiveTimeline';
import TestimonialCarousel from '../components/about/TestimonialCarousel';
import ImpactStorySection from '../components/focus-areas/ImpactStorySection';
import VisualHighlightSection from '../components/focus-areas/VisualHighlightSection';
import PartnersShowcaseSection from '../components/focus-areas/PartnersShowcaseSection';
import { Heart } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      title: "Our History",
      description: "Founded in 2009, LSF has grown from a small legal aid organization to Tanzania's leading legal empowerment institution.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "Read Our Story"
    },
    {
      title: "Our Team",
      description: "Meet the dedicated lawyers, paralegals, researchers, and advocates who make our mission possible every day.",
      backgroundImage: "/lovable-uploads/backgound lsf colours.png",
      buttonText: "Meet the Team"
    },
    {
      title: "Our Impact",
      description: "Discover how we've transformed lives and communities through innovative legal empowerment programs and advocacy.",
      backgroundImage: "/lovable-uploads/background with mother umage .png",
      buttonText: "See Our Impact"
    }
  ];

  const leaders = [
    {
      name: "Dr. Neema Lugalla",
      role: "Executive Director",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "For over a decade, we've been building bridges between law and community, ensuring justice reaches every corner of Tanzania."
    },
    {
      name: "Advocate Mary Mwalimu",
      role: "Programs Director",
      image: "/lovable-uploads/backgound lsf colours.png",
      quote: "Our strength lies in our community-centered approach - we don't just provide legal services, we build legal empowerment."
    },
    {
      name: "James Anderson",
      role: "Head of Research",
      image: "/lovable-uploads/background with mother umage .png",
      quote: "Evidence-based programming and policy advocacy are at the heart of everything we do - data drives our impact."
    }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<Heart className="h-8 w-8" />}
        badge="About Us"
        title="Legal and Human Rights Centre"
        description="We are Tanzania's leading legal empowerment organization, dedicated to ensuring that every person has access to justice and the tools to claim their rights."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <ImpactStorySection
        title="15 Years of Transforming Lives Through Law"
        subtitle="Our Journey"
        description="Since 2009, we've been on a mission to make justice accessible to all Tanzanians. From our humble beginnings as a small legal aid organization to becoming the country's premier legal empowerment institution, every step of our journey has been guided by one simple belief: everyone deserves access to justice."
        backgroundImage="/lovable-uploads/background with mother umage .png"
        ctaText="Read Our Full Story"
        stats={[
          { value: "15+", label: "Years of Service" },
          { value: "100K+", label: "Lives Changed" },
          { value: "184", label: "Communities Served" },
          { value: "4,000+", label: "Paralegals Trained" }
        ]}
      />

      <AnimatedStats />
      
      <VisualHighlightSection
        title="Discover Who We Are"
        subtitle="About LSF"
        highlights={highlights}
      />

      <PartnersShowcaseSection
        title="Leadership with Vision"
        subtitle="Our Leaders"
        description="Meet the visionary leaders who guide our work and ensure that our mission of legal empowerment reaches every corner of Tanzania."
        partners={leaders}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <InteractiveTimeline />
      <TestimonialCarousel />
    </Layout>
  );
};

export default About;
