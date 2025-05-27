import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Typography from '../components/shared/Typography';
import Section from '../components/shared/Section';
import Container from '../components/shared/Container';
import Card from '../components/shared/Card';
import { DollarSign, Target, Users, CheckCircle } from 'lucide-react';

const GrantMaking = () => {
  const grantAreas = [
    {
      title: "Land Rights",
      description: "Supporting communities in securing land tenure and property ownership rights.",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Women & Girls Justice",
      description: "Advancing safety, legal protection, and empowerment for women and girls.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Legal Empowerment",
      description: "Strengthening community-based legal aid and paralegal services.",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const outcomes = [
    "15,000+ individuals received direct legal assistance",
    "200+ paralegals trained and certified",
    "85% success rate in land dispute resolutions",
    "50+ community-based organizations strengthened"
  ];

  return (
    <Layout>
      <HeroSection
        icon={<DollarSign className="h-8 w-8" />}
        badge="What We Do"
        title="Grant Making"
        description="Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Typography variant="h2" className="mb-6">
                Strategic Approach
              </Typography>
              <Typography variant="body" className="mb-6 text-neutral-gray">
                Our grant-making strategy focuses on results-driven investments that strengthen legal empowerment 
                at the grassroots level. We prioritize initiatives that directly address the most pressing justice 
                gaps affecting marginalized communities, particularly women and girls.
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                Through targeted funding, we support innovative approaches to legal aid delivery, capacity building, 
                and systemic reforms that create lasting change in Tanzania's justice landscape.
              </Typography>
            </div>
            <div className="bg-primary/5 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-primary mr-3" />
                <Typography variant="h3" className="text-primary">
                  $2.5M+
                </Typography>
              </div>
              <Typography variant="body" className="text-neutral-gray">
                Total grants distributed to strengthen legal empowerment initiatives across Tanzania
              </Typography>
            </div>
          </div>

          <div className="mb-16">
            <Typography variant="h2" className="text-center mb-12">
              Key Grant Areas
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {grantAreas.map((area, index) => (
                <Card key={index} variant="elevated" hover className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {area.icon}
                    </div>
                  </div>
                  <Typography variant="h4" className="mb-3">
                    {area.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray">
                    {area.description}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-secondary-teal/5 rounded-xl p-8">
            <Typography variant="h2" className="text-center mb-8">
              Measurable Outcomes
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary-teal mr-3 mt-1 flex-shrink-0" />
                  <Typography variant="body" className="text-neutral-gray">
                    {outcome}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default GrantMaking;
