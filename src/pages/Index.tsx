
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import FocusAreas from '../components/home/FocusAreas';
import Publications from '../components/home/Publications';
import SuccessStories from '../components/home/SuccessStories';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import NewsTicker from '../components/home/NewsTicker';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import WhatWeDo from '../components/home/WhatWeDo';
import { useEffect } from 'react';
import { analyticsService } from '@/services/api';

const Index = () => {
  // Track homepage visits
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await analyticsService.recordPageView('/');
      } catch (error) {
        console.error("Failed to record page view:", error);
      }
    };
    
    trackPageView();
  }, []);

  return (
    <Layout>
      {/* Section 1: Hero with Paralegal Finder integrated */}
      <Hero />
      
      {/* Section 2: News Ticker - provides latest updates */}
      <NewsTicker />
      
      {/* Section 3: Our Impact - shows the organization's reach */}
      <ImpactStats />
      
      {/* Section 4: Strategic Focus Areas */}
      <FocusAreas />
      
      {/* Section 5: What We Do - services overview */}
      <WhatWeDo />
      
      {/* Section 6: Who We Are */}
      <About />
      
      {/* Section 7: Testimonials / Success Stories */}
      <SuccessStories />
      
      {/* Section 8: Publications */}
      <Publications />
      
      {/* Section 9: Haki Yangu App Highlight */}
      <HakiYanguHighlight />
      
      {/* Contact section at bottom */}
      <Contact />
    </Layout>
  );
};

export default Index;
