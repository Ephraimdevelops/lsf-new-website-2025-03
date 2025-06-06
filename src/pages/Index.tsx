
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import About from '../components/home/About';
import FocusAreas from '../components/home/FocusAreas';
import WhatWeDo from '../components/home/WhatWeDo';
import KeyPrinciples from '../components/home/KeyPrinciples';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import Contact from '../components/home/Contact';
import CompactNewsUpdates from '../components/home/CompactNewsUpdates';
import Partners from '../components/home/Partners';
import Publications from '../components/home/Publications';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <CompactNewsUpdates />
        <ImpactStats />
        <About />
        <FocusAreas />
        <WhatWeDo />
        <Publications />
        <Partners />
        <KeyPrinciples />
        <HakiYanguHighlight />
        <Contact />
      </div>
    </Layout>
  );
};

export default Index;
