
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import FocusAreas from '../components/home/FocusAreas';
import About from '../components/home/About';
import FeaturedNewsCarousel from '../components/home/FeaturedNewsCarousel';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import ImpactStats from '../components/home/ImpactStats';
import Contact from '../components/home/Contact';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FocusAreas />
      <About />
      <ImpactStats />
      <FeaturedNewsCarousel />
      <HakiYanguHighlight />
      <Contact />
    </Layout>
  );
};

export default Index;
