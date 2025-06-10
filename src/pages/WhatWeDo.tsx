
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicFocusSection from '../components/what-we-do/StrategicFocusSection';
import ProjectsCarousel from '../components/what-we-do/ProjectsCarousel';

const WhatWeDo = () => {
  return (
    <Layout>
      <WhatWeDoHero />
      <StrategicFocusSection />
      <ProjectsCarousel />
    </Layout>
  );
};

export default WhatWeDo;
