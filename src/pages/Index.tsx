
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import Programs from '../components/home/Programs';
import About from '../components/home/About';
import News from '../components/home/News';
import Contact from '../components/home/Contact';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ImpactStats />
      <Programs />
      <About />
      <News />
      <Contact />
    </Layout>
  );
};

export default Index;
