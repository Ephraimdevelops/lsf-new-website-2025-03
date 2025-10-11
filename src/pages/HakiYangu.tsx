import Layout from '@/components/layout/Layout';
import HakiYanguHero from '@/components/haki-yangu/HakiYanguHero';
import HakiYanguFeatures from '@/components/haki-yangu/HakiYanguFeatures';
import HakiYanguStats from '@/components/haki-yangu/HakiYanguStats';
import HakiYanguTestimonials from '@/components/haki-yangu/HakiYanguTestimonials';
import HakiYanguDownload from '@/components/haki-yangu/HakiYanguDownload';
import HakiYanguFAQ from '@/components/haki-yangu/HakiYanguFAQ';
import HakiYanguCallToAction from '@/components/haki-yangu/HakiYanguCallToAction';

const HakiYangu = () => {
  return (
    <Layout>
      <HakiYanguHero />
      <HakiYanguFeatures />
      <HakiYanguStats />
      <HakiYanguTestimonials />
      <HakiYanguDownload />
      <HakiYanguFAQ />
      <HakiYanguCallToAction />
    </Layout>
  );
};

export default HakiYangu;
