
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Heading from '@/components/design-system/Heading';
import Text from '@/components/design-system/Text';
import DesignCard from '@/components/design-system/DesignCard';
import DesignIcon from '@/components/design-system/DesignIcon';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { Users, BookOpen, Award, Target } from 'lucide-react';

const CapacityBuilding = () => {
  const breadcrumbItems = [
    { name: "What We Do", href: "/what-we-do" },
    { name: "Capacity Building" }
  ];

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
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Heading level={1} variant="hero" className="mb-6">
                Building Sustainable Capacity
              </Heading>
              <Text variant="body" color="muted" className="mb-6">
                Our capacity building approach focuses on creating sustainable improvements in both individual 
                competencies and organizational systems. We work closely with legal aid providers, paralegals, 
                and community-based organizations to strengthen their ability to deliver quality services.
              </Text>
              <Text variant="body" color="muted">
                Through comprehensive training programs, mentorship, and ongoing support, we ensure that 
                capacity building translates into improved service delivery and greater impact for the 
                communities we serve.
              </Text>
            </div>
            <DesignCard variant="minimal" padding="xl" className="bg-secondary-teal/5">
              <div className="flex items-center mb-4">
                <DesignIcon icon={<Users />} size="xl" color="secondary" className="mr-3" />
                <Heading level={1} variant="display" color="secondary" className="text-4xl">
                  500+
                </Heading>
              </div>
              <Text variant="body" color="muted">
                Paralegals and legal aid providers trained through our capacity building programs
              </Text>
            </DesignCard>
          </div>

          <div className="mb-16">
            <Heading level={1} variant="section" className="text-center mb-12">
              Capacity Building Focus Areas
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {buildingAreas.map((area, index) => (
                <DesignCard key={index} variant="elevated" padding="lg" hover className="text-center">
                  <DesignIcon 
                    icon={area.icon} 
                    size="xl" 
                    color="secondary" 
                    wrapper 
                    wrapperVariant="neutral" 
                    className="mx-auto mb-4" 
                  />
                  <Heading level={3} variant="subsection" className="mb-3">
                    {area.title}
                  </Heading>
                  <Text variant="body" color="muted">
                    {area.description}
                  </Text>
                </DesignCard>
              ))}
            </div>
          </div>

          <Des ignCard variant="minimal" padding="xl" className="bg-primary/5">
            <Heading level={1} variant="section" className="text-center mb-8">
              Training Programs
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((program, index) => (
                <DesignCard key={index} variant="flat" padding="md">
                  <Heading level={4} variant="card" color="primary">
                    {program}
                  </Heading>
                </DesignCard>
              ))}
            </div>
          </DesignCard>
        </Container>
      </Section>
    </Layout>
  );
};

export default CapacityBuilding;
