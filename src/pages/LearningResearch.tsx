import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { BookOpen, BarChart, Lightbulb, Search } from 'lucide-react';

const LearningResearch = () => {
  const breadcrumbItems = [
    { label: "What We Do", href: "/what-we-do" },
    { label: "Learning & Research" }
  ];

  const researchAreas = [
    {
      title: "Impact Assessment",
      description: "Measuring the effectiveness of legal aid interventions and their outcomes.",
      icon: <BarChart className="h-6 w-6" />
    },
    {
      title: "Innovation Pilots",
      description: "Testing new approaches and models for legal service delivery.",
      icon: <Lightbulb className="h-6 w-6" />
    },
    {
      title: "Best Practices",
      description: "Identifying and documenting successful strategies for replication.",
      icon: <Search className="h-6 w-6" />
    }
  ];

  const publications = [
    "Annual Impact Assessment Report",
    "Paralegal Effectiveness Study",
    "Women's Access to Justice Survey",
    "Digital Legal Aid Pilot Evaluation",
    "Community Legal Education Impact Study"
  ];

  return (
    <Layout>
      <HeroSection
        icon={<BookOpen className="h-8 w-8" />}
        badge="What We Do"
        title="Learning and Research"
        description="Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn't."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="xl">
        <Container size="xl">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Typography variant="h1" className="mb-6">
                Evidence-Based Approach
              </Typography>
              <Typography variant="body" className="mb-6 text-neutral-gray">
                Our commitment to continuous learning drives everything we do. We systematically collect data, 
                analyze outcomes, and use evidence to inform our strategies and improve our programs. This 
                approach ensures that our interventions are effective and our resources are used efficiently.
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                Through rigorous research and pilot programs, we test innovative approaches and document 
                lessons learned to benefit the broader legal aid community in Tanzania and beyond.
              </Typography>
            </div>
            <Card className="bg-secondary-teal/5">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-secondary-teal mr-3" />
                <Typography variant="display" className="text-secondary-teal">
                  25+
                </Typography>
              </div>
              <Typography variant="body" className="text-neutral-gray">
                Research studies and evaluations conducted to improve legal aid effectiveness
              </Typography>
            </Card>
          </div>

          <div className="mb-16">
            <Typography variant="h1" className="text-center mb-12">
              Research Focus Areas
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {researchAreas.map((area, index) => (
                <Card key={index} variant="elevated" hover className="text-center">
                  <div className="w-16 h-16 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-secondary-teal">
                      {area.icon}
                    </div>
                  </div>
                  <Typography variant="h3" className="mb-3">
                    {area.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray">
                    {area.description}
                  </Typography>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-primary/5">
            <Typography variant="h1" className="text-center mb-8">
              Key Publications & Studies
            </Typography>
            <div className="space-y-4">
              {publications.map((publication, index) => (
                <Card key={index} variant="flat" padding="md" className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-3" />
                  <Typography variant="h4" className="text-neutral-dark">
                    {publication}
                  </Typography>
                </Card>
              ))}
            </div>
          </Card>
        </Container>
      </Section>
    </Layout>
  );
};

export default LearningResearch;
