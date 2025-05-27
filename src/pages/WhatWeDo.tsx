
import Layout from '../components/layout/Layout';
import Projects from '../components/home/Projects';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import FocusAreasGrid from '../components/what-we-do/FocusAreasGrid';
import ImpactStatsSection from '../components/what-we-do/ImpactStatsSection';
import HowWeWorkSection from '../components/what-we-do/HowWeWorkSection';
import GetInvolvedCTA from '../components/what-we-do/GetInvolvedCTA';

const WhatWeDo = () => {
  return (
    <Layout>
      <WhatWeDoHero />
      <FocusAreasGrid />
      <ImpactStatsSection />
      <Projects />
      <HowWeWorkSection />
      <GetInvolvedCTA />
    </Layout>
  );
};

export default WhatWeDo;
