
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { Users, BookOpen, Award, Target } from 'lucide-react';

const CapacityBuilding = () => {
  const buildingAreas = [
    {
      title: "Institutional Capacity",
      description: "Strengthening organizational systems, governance, and management capabilities.",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Technical Skills",
      description: "Developing specialized legal knowledge and service delivery competencies.",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: "Leadership Development",
      description: "Building leadership capabilities within legal aid organizations.",
      icon: <Award className="h-6 w-6" />
    }
  ];

  const programs = [
    "Paralegal Certification Program",
    "Legal Aid Management Training",
    "Community Mobilization Workshops",
    "Digital Literacy for Legal Workers",
    "Leadership Development Initiative"
  ];

  return (
    <Layout>
      <HeroSection
        icon={<Users className="h-8 w-8" />}
        badge="What We Do"
        title="Capacity Building"
        description="LSF strengthens both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Typography variant="h1" className="mb-6">
                Building Sustainable Capacity
              </Typography>
              <Typography variant="body" className="mb-6 text-neutral-gray">
                Our capacity building approach focuses on creating sustainable improvements in both individual 
                competencies and organizational systems. We work closely with legal aid providers, paralegals, 
                and community-based organizations to strengthen their ability to deliver quality services.
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                Through comprehensive training programs, mentorship, and ongoing support, we ensure that 
                capacity building translates into improved service delivery and greater impact for the 
                communities we serve.
              </Typography>
            </div>
            <Card className="bg-secondary-teal/5">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-secondary-teal mr-3" />
                <Typography variant="display" className="text-secondary-teal">
                  500+
                </Typography>
              </div>
              <Typography variant="body" className="text-neutral-gray">
                Paralegals and legal aid providers trained through our capacity building programs
              </Typography>
            </Card>
          </div>

          <div className="mb-16">
            <Typography variant="h1" className="text-center mb-12">
              Capacity Building Focus Areas
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {buildingAreas.map((area, index) => (
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
              Training Programs
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program, index) => (
                <Card key={index} variant="flat" padding="md">
                  <Typography variant="h4" className="text-primary">
                    {program}
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

export default CapacityBuilding;
