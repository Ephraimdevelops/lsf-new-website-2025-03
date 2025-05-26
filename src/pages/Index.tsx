
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import FocusAreas from '../components/home/FocusAreas';
import About from '../components/home/About';
import NewsSection from '../components/home/NewsSection';
import Publications from '../components/home/Publications';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import ImpactStats from '../components/home/ImpactStats';
import Contact from '../components/home/Contact';
import NewsTicker from '../components/home/NewsTicker';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <NewsTicker />
        <FocusAreas />
        <About />
        <ImpactStats />
        <div className="bg-gray-50">
          <NewsSection />
          <Publications />
        </div>
        <HakiYanguHighlight />
        <Contact />
      </div>
    </Layout>
  );
};

export default Index;
