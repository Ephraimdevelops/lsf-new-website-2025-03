
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import ImpactHighlight from '../components/home/ImpactHighlight';
import About from '../components/home/About';
import FocusAreas from '../components/home/FocusAreas';
import WhatWeDo from '../components/home/WhatWeDo';
import KeyPrinciples from '../components/home/KeyPrinciples';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import CompactNewsUpdates from '../components/home/CompactNewsUpdates';
import Partners from '../components/home/Partners';
import Publications from '../components/home/Publications';
import SuccessStories from '../components/home/SuccessStories';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <CompactNewsUpdates />
        <ImpactStats />
        <ImpactHighlight />
        <About />
        <SuccessStories />
        <FocusAreas />
        <WhatWeDo />
        <Publications />
        <Partners />
        <KeyPrinciples />
        <HakiYanguHighlight />
      </div>
    </Layout>
  );
};

export default Index;
