
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Section from '../components/shared/Section';
import Typography from '../components/shared/Typography';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

const Impact = () => {
  const impactStats = [
    {
      title: "Lives Transformed",
      value: "2.8M+",
      description: "Tanzanians reached through our legal empowerment programs",
      icon: <Users className="h-8 w-8" />,
      trend: "+15% this year"
    },
    {
      title: "Cases Resolved",
      value: "75,000+",
      description: "Legal cases successfully resolved through our network",
      icon: <Target className="h-8 w-8" />,
      trend: "+22% this year"
    },
    {
      title: "Communities Served",
      value: "184",
      description: "Communities across Tanzania with active legal aid programs",
      icon: <BarChart3 className="h-8 w-8" />,
      trend: "12 new communities"
    },
    {
      title: "Success Rate",
      value: "87%",
      description: "Of legal cases achieved favorable outcomes for clients",
      icon: <TrendingUp className="h-8 w-8" />,
      trend: "+5% improvement"
    }
  ];

  const storyHighlights = [
    {
      title: "Land Rights Victory",
      description: "Helped 500+ families secure their ancestral land rights against illegal grabbing",
      impact: "2,500 people protected",
      region: "Dodoma Region"
    },
    {
      title: "Women's Economic Empowerment",
      description: "Supported women entrepreneurs to access credit and business registration",
      impact: "1,200 businesses registered",
      region: "Dar es Salaam"
    },
    {
      title: "Youth Legal Education",
      description: "Trained young people as community paralegals and rights advocates",
      impact: "800 youth trained",
      region: "Mwanza Region"
    }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<BarChart3 className="h-8 w-8" />}
        badge="OUR IMPACT"
        title="Transforming Lives Through Justice"
        description="Since 2012, LSF has been at the forefront of legal empowerment in Tanzania, creating measurable change in communities across the country. Our data-driven approach ensures that every intervention creates lasting impact."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Impact Statistics */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">
              Impact by the Numbers
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our commitment to transparency means we measure and report on every aspect of our work. 
              Here's how we're making a difference across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-neutral-light p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <Typography variant="display" className="mb-2 text-4xl font-bold">
                  {stat.value}
                </Typography>
                <Typography variant="h3" className="mb-3 text-lg">
                  {stat.title}
                </Typography>
                <Typography variant="body" className="text-neutral-gray mb-4">
                  {stat.description}
                </Typography>
                <div className="inline-flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Story Highlights */}
      <Section variant="secondary" padding="xl">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              Stories of Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Behind every statistic is a human story. Here are some highlights of how our work 
              is creating real change in communities across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storyHighlights.map((story, index) => (
              <div key={index} className="bg-white rounded-xl border border-neutral-light p-8">
                <Typography variant="h3" className="mb-4">
                  {story.title}
                </Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  {story.description}
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-neutral-gray">
                      Impact:
                    </Typography>
                    <Typography variant="small" className="font-semibold text-primary">
                      {story.impact}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-neutral-gray">
                      Region:
                    </Typography>
                    <Typography variant="small" className="font-semibold">
                      {story.region}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Impact;
