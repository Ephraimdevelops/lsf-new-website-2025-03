
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import FocusAreas from '../components/home/FocusAreas';
import About from '../components/home/About';
import FeaturedNewsCarousel from '../components/home/FeaturedNewsCarousel';
import Publications from '../components/home/Publications';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import ImpactStats from '../components/home/ImpactStats';
import Contact from '../components/home/Contact';

const Index = () => {
  return (
    <Layout>
      <div className="pt-20">
        <Hero />
        <FocusAreas />
        <About />
        <ImpactStats />
        <FeaturedNewsCarousel />
        <Publications />
        <HakiYanguHighlight />
        <Contact />
      </div>
    </Layout>
  );
};

export default Index;
