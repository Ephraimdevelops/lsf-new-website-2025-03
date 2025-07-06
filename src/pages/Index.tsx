
import Layout from '@/components/layout/Layout';
import SlidingHero from '@/components/home/hero/SlidingHero';
import SuccessStories from '@/components/home/SuccessStories';
import Partners from '@/components/home/Partners';

const Index = () => (
  <Layout>
    {/* Sliding Hero Section */}
    <SlidingHero />

    {/* Success Stories Section */}
    <SuccessStories />

    {/* Partners Network */}
    <Partners />
  </Layout>
);

export default Index;
