
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import Programs from '../components/home/Programs';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import FeaturedNewsCarousel from '../components/home/FeaturedNewsCarousel';
import Publications from '../components/home/Publications';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedNewsCarousel />
      <ImpactStats />
      <Programs />
      <Publications />
      <About />
      <Contact />
    </Layout>
  );
};

export default Index;
