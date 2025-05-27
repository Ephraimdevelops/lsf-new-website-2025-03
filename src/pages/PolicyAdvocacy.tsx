
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { Lightbulb, Scale, Users, FileText } from 'lucide-react';

const PolicyAdvocacy = () => {
  const advocacyLevels = [
    {
      title: "Grassroots Advocacy",
      description: "Empowering communities to advocate for their rights and influence local policies.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "National Policy",
      description: "Engaging with national institutions to shape laws and policies.",
      icon: <Scale className="h-6 w-6" />
    },
    {
      title: "Legal Reform",
      description: "Advocating for comprehensive reforms in the justice system.",
      icon: <FileText className="h-6 w-6" />
    }
  ];

  const achievements = [
    "Contributed to the Legal Aid Act amendments",
    "Advocated for improved land tenure laws",
    "Supported women's property rights legislation",
    "Influenced paralegal certification standards",
    "Promoted alternative dispute resolution mechanisms"
  ];

  return (
    <Layout>
      <HeroSection
        title="Policy and Advocacy"
        subtitle="Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Typography variant="h2" className="mb-6">
                Multi-Level Advocacy Strategy
              </Typography>
              <Typography variant="body" className="mb-6 text-neutral-gray">
                Our advocacy approach operates at multiple levels, from grassroots community mobilization 
                to national policy dialogue. We believe that sustainable change requires both bottom-up 
                pressure and top-down reform, creating a comprehensive approach to justice system transformation.
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                Through evidence-based advocacy, strategic partnerships, and community engagement, we work 
                to create laws and policies that protect the rights of all Tanzanians, particularly the most vulnerable.
              </Typography>
            </div>
            <div className="bg-primary/5 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-8 w-8 text-primary mr-3" />
                <Typography variant="h3" className="text-primary">
                  12+
                </Typography>
              </div>
              <Typography variant="body" className="text-neutral-gray">
                Major policy reforms influenced through our advocacy efforts over the past five years
              </Typography>
            </div>
          </div>

          <div className="mb-16">
            <Typography variant="h2" className="text-center mb-12">
              Advocacy Levels
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {advocacyLevels.map((level, index) => (
                <Card key={index} variant="elevated" hover className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {level.icon}
                    </div>
                  </div>
                  <Typography variant="h4" className="mb-3">
                    {level.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray">
                    {level.description}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-secondary-teal/5 rounded-xl p-8">
            <Typography variant="h2" className="text-center mb-8">
              Key Achievements
            </Typography>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <Scale className="h-5 w-5 text-secondary-teal mr-3 mt-1 flex-shrink-0" />
                  <Typography variant="body" className="text-neutral-gray">
                    {achievement}
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

export default PolicyAdvocacy;
