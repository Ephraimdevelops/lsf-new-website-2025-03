
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
import CompactNewsUpdates from '../components/home/CompactNewsUpdates';
import KeyPrinciples from '../components/home/KeyPrinciples';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <CompactNewsUpdates />
        <About />
        <FocusAreas />
        <ImpactStats />
        <KeyPrinciples />
        <HakiYanguHighlight />
        <Contact />
      </div>
    </Layout>
  );
};

export default Index;
