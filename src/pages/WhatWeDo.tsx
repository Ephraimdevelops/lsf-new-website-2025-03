
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicApproachesSection from '../components/what-we-do/StrategicApproachesSection';
import StrategicFocusAreasSection from '../components/what-we-do/StrategicFocusAreasSection';
import ImpactShowcaseSection from '../components/what-we-do/ImpactShowcaseSection';
import StrategicPartnershipsSection from '../components/what-we-do/StrategicPartnershipsSection';
import StrategicFocusSection from '@/components/what-we-do/StrategicFocusSection';
import WhatWeDoHighlight from '@/components/what-we-do/WhatWeDoHighlight';

const WhatWeDo = () => {

  return (
    <Layout>
      <WhatWeDoHero />
      <WhatWeDoHighlight />
      <StrategicApproachesSection />
      <StrategicFocusAreasSection />
      <StrategicFocusSection />
      <ImpactShowcaseSection />
      <StrategicPartnershipsSection />
    </Layout>
  );
};

export default WhatWeDo;
