
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicApproachesSection from '../components/what-we-do/StrategicApproachesSection';
import StrategicFocusAreasSection from '../components/what-we-do/StrategicFocusAreasSection';
import ImpactShowcaseSection from '../components/what-we-do/ImpactShowcaseSection';
import StrategicPartnershipsSection from '@/components/what-we-do/StrategicPartnershipsSection';

const WhatWeDo = () => {

  return (
    <Layout>
      <WhatWeDoHero />
      <StrategicFocusAreasSection />
      <ImpactShowcaseSection />
      <StrategicPartnershipsSection />

    </Layout>
  );
};

export default WhatWeDo;
