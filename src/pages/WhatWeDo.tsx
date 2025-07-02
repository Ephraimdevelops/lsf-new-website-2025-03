
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicApproachesSection from '../components/what-we-do/StrategicApproachesSection';
import StrategicFocusAreasSection from '../components/what-we-do/StrategicFocusAreasSection';
import ImpactShowcaseSection from '../components/what-we-do/ImpactShowcaseSection';
import StrategicPartnershipsSection from '../components/what-we-do/StrategicPartnershipsSection';
import { Container } from '../components/design-system';
import Typography from '../components/shared/Typography';
const WhatWeDo = () => {

  return (
    <Layout>
      <WhatWeDoHero />
      
      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <Container size="xl">
          <div className="text-center">
            <Typography variant="body" className="text-neutral-600 max-w-5xl mx-auto text-lg leading-relaxed">
              At the Legal Services Facility (LSF), we champion access to justice through an integrated model grounded in legal empowerment. Our work is guided by two complementary pillars: <span className="font-semibold text-primary">Strategic Approaches</span> (how we work) and <span className="font-semibold text-secondary-teal">Strategic Focus Areas</span> (where we focus). These intersect to deliver lasting, rights-based change for women, marginalized communities, and the justice ecosystem at large.
            </Typography>
          </div>
        </Container>
      </section>

      <StrategicApproachesSection />
      <StrategicFocusAreasSection />
      <ImpactShowcaseSection />
      <StrategicPartnershipsSection />
    </Layout>
  );
};

export default WhatWeDo;
