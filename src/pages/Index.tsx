
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import SuccessStories from '../components/home/SuccessStories';
import Partners from '../components/home/Partners';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import CompactNewsUpdates from '../components/home/CompactNewsUpdates';
import Publications from '../components/home/Publications';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <CompactNewsUpdates />
        <Publications />
        <ImpactStats />
        <SuccessStories />
        <Partners />
        <HakiYanguHighlight />
      </div>
    </Layout>
  );
};

export default Index;
