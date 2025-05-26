
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import About from '../components/home/About';
import FocusAreas from '../components/home/FocusAreas';
import KeyPrinciples from '../components/home/KeyPrinciples';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import Contact from '../components/home/Contact';
import WhatWeDo from '../components/home/WhatWeDo';
import CompactNewsUpdates from '../components/home/CompactNewsUpdates';
import Projects from '../components/home/Projects';
import Partners from '../components/home/Partners';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <CompactNewsUpdates />
        <ImpactStats />
        <About />
        <WhatWeDo />
        <FocusAreas />
        <Partners />
        <Projects />
        <HakiYanguHighlight />
        <Contact />
      </div>
    </Layout>
  );
};

export default Index;
