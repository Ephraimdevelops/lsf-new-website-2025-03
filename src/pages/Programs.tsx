
import Layout from '../components/layout/Layout';
import ProgramsHero from '../components/programs/ProgramsHero';
import FlagshipPrograms from '../components/programs/FlagshipPrograms';
import OngoingProjects from '../components/programs/OngoingProjects';
import ProjectMap from '../components/programs/ProjectMap';
import MeasureImpact from '../components/programs/MeasureImpact';
import PartnerWithUs from '../components/programs/PartnerWithUs';

const Programs = () => {
  return (
    <Layout>
      <ProgramsHero />
      <FlagshipPrograms />
      <ProjectMap />
      <MeasureImpact />
    </Layout>
  );
};

export default Programs;
