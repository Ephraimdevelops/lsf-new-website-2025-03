
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import FocusAreas from '../components/home/FocusAreas';
import Publications from '../components/home/Publications';
import SuccessStories from '../components/home/SuccessStories';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import NewsTicker from '../components/home/NewsTicker';
import LegalAidFinder from '../components/home/LegalAidFinder';
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
      {/* Section 1: Hero with News Ticker */}
      <Hero />
      <NewsTicker />
      
      {/* Section 2: Our Impact & Strategic Focus Areas */}
      <ImpactStats />
      <FocusAreas />
      
      {/* Section 3: What We Do */}
      <WhatWeDo />
      
      {/* Section 4: Publications */}
      <Publications />
      
      {/* Section 5: Testimonials / Our Heroes */}
      <SuccessStories />

      {/* Section 6: About Us */}
      <About />
      
      {/* Section 7: Haki Yangu Highlight */}
      <HakiYanguHighlight />
      
      {/* Section 8: Get Legal Help */}
      <LegalAidFinder />
      
      {/* Contact section at bottom */}
      <Contact />
    </Layout>
  );
};

export default Index;
