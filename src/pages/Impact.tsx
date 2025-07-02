import Layout from '../components/layout/Layout';
import ResponsiveContainer from '../components/shared/ResponsiveContainer';
import { ImpactHero } from './impact/ImpactHero';
import { ImpactStats } from './impact/ImpactStats';
import { ThematicImpact } from './impact/ThematicImpact';
import { ImpactStories } from './impact/ImpactStories';
import { RegionalImpact } from './impact/RegionalImpact';
import { ImpactReports } from './impact/ImpactReports';
import { ImpactCTA } from './impact/ImpactCTA';

const Impact = () => {
  return (
    <Layout>
      <ImpactHero />
      <ImpactStats />
      <ThematicImpact />
      <ImpactStories />
      <RegionalImpact />
      <ImpactReports />
      <ImpactCTA />
    </Layout>
  );
};

export default Impact;