
import Layout from '@/components/layout/Layout';
import { TrendingUp, Users, Scale, Target } from 'lucide-react';
import HeroSection from '@/components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Breadcrumb from '@/components/shared/Breadcrumb';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

const Impact = () => {
  const impactStats = [
    {
      value: "500000",
      suffix: "+",
      label: "People Reached",
      icon: <Users className="h-8 w-8" />
    },
    {
      value: "1200",
      suffix: "+",
      label: "Legal Cases Supported",
      icon: <Scale className="h-8 w-8" />
    },
    {
      value: "85",
      suffix: "%",
      label: "Success Rate",
      icon: <Target className="h-8 w-8" />
    },
    {
      value: "150",
      suffix: "+",
      label: "Partner Organizations",
      icon: <TrendingUp className="h-8 w-8" />
    }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <Section variant="secondary" padding="sm">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </Section>

      <HeroSection
        icon={<TrendingUp className="h-8 w-8" />}
        badge="OUR IMPACT"
        title="Transforming Lives Through Justice"
        description="Over 15 years of strengthening access to justice across Tanzania. See how LSF's comprehensive approach has created lasting change in communities nationwide."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6">
              Impact by the Numbers
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto mb-12">
              Our data-driven approach ensures that every program creates measurable, lasting change 
              in the communities we serve.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-xl border border-neutral-light p-8 hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={parseInt(stat.value)} suffix={stat.suffix} />
                </div>
                <Typography variant="body" className="text-neutral-gray font-semibold">
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-2xl p-12 text-center">
            <Typography variant="h2" className="mb-6">
              Creating Lasting Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-lg leading-relaxed">
              Through strategic partnerships, capacity building, and innovative programs, LSF has established 
              a sustainable foundation for justice in Tanzania. Our holistic approach ensures that legal 
              empowerment reaches every corner of society, from rural communities to urban centers.
            </Typography>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Impact;
