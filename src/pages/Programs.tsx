
import Layout from '../components/layout/Layout';
import ProgramsHero from '../components/programs/ProgramsHero';
import FlagshipPrograms from '../components/programs/FlagshipPrograms';
import ProjectMap from '../components/programs/ProjectMap';
import MeasureImpact from '../components/programs/MeasureImpact';

const Programs = () => {
  return (
    <Layout>
      <ProgramsHero />
      <FlagshipPrograms />
      <MeasureImpact />
    </Layout>
  );
};

export default Programs;
