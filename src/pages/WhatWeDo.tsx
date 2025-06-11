
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicFocusSection from '../components/what-we-do/StrategicFocusSection';
import ProjectsCarousel from '../components/what-we-do/ProjectsCarousel';
import Breadcrumb from '../components/shared/Breadcrumb';
import Container from '../components/shared/Container';

const WhatWeDo = () => {
  const breadcrumbItems = [
    { label: "What We Do" }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>
      
      <WhatWeDoHero />
      <StrategicFocusSection />
      <ProjectsCarousel />
    </Layout>
  );
};

export default WhatWeDo;
