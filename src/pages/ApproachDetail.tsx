
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { DollarSign, Wrench, Megaphone, BookOpen, Users } from 'lucide-react';
import Heading from '@/components/design-system/Heading';
import Text from '@/components/design-system/Text';
import DesignCard from '@/components/design-system/DesignCard';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Breadcrumb from '@/components/shared/Breadcrumb';

const ApproachDetail = () => {
  const { approachId } = useParams();

  const approachData: Record<string, any> = {
    'grant-making': {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Grant Making and Management',
      description: 'For over a decade, LSF has established itself as a trusted and capable fund manager, overseeing more than USD 47 million in donor contributions through robust grant-making architecture.',
      details: [
        'Successfully managed over 200 subgrantees across Tanzania',
        'Proven financial accountability systems and compliance',
        'Partner capacity-building and technical support',
        'Comprehensive monitoring and evaluation frameworks'
      ]
    },
    'direct-implementation': {
      icon: <Wrench className="h-8 w-8" />,
      title: 'Direct Project Implementation',
      description: 'Since 2023, LSF has strategically expanded to include direct project implementation, enhancing agility and impact through high-impact initiatives.',
      details: [
        "'Sauti ya Mwanamke' - EU-funded women's access to justice",
        "'Wanawake Tunaweza' - women's economic and legal empowerment",
        'Enhanced operational flexibility and community reach',
        'Direct community engagement and support'
      ]
    },
    'advocacy-policy': {
      icon: <Megaphone className="h-8 w-8" />,
      title: 'Advocacy and Policy Influence',
      description: 'LSF has played a pivotal role in shaping Tanzania\'s access to justice landscape, championing the Legal Aid Act and driving nationwide campaigns.',
      details: [
        'Led development of the Legal Aid Act and regulations',
        'Spearheaded Mama Samia Legal Aid Campaign',
        'National framework for coordinated stakeholder engagement',
        'Policy reform advocacy based on evidence'
      ]
    },
    'research-learning': {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Research, Learning, and Innovation',
      description: 'LSF actively invests in research, monitoring, and learning to ensure evidence-based programming and informed policy engagement.',
      details: [
        'Evidence-based program design and evaluation',
        'Academic institution partnerships for research',
        'Data-driven policy reform advocacy',
        'Innovation in legal empowerment approaches'
      ]
    },
    'partnerships-networking': {
      icon: <Users className="h-8 w-8" />,
      title: 'Strategic Partnerships and Networking',
      description: 'LSF\'s impact is amplified through diverse partnerships with civil society, development partners, government entities, and private sector actors.',
      details: [
        'Multi-stakeholder collaboration and coordination',
        'Bridging grassroots efforts with national policy',
        'Convening power for systemic change in access to justice',
        'Co-creation of innovative solutions'
      ]
    }
  };

  const approach = approachData[approachId || ''] || approachData['grant-making'];
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'What We Do', href: '/what-we-do' },
    { label: approach.title }
  ];

  return (
    <Layout>
      <HeroSection
        icon={approach.icon}
        badge="Our Approach"
        title={approach.title}
        description={approach.description}
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Heading level={2} variant="section" className="mb-8 text-center">
              Key Components
            </Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approach.details.map((detail: string, index: number) => (
                <DesignCard key={index} variant="elevated" padding="lg" className="border border-gray-100">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-4 flex-shrink-0"></div>
                    <Text variant="body" color="muted">
                      {detail}
                    </Text>
                  </div>
                </DesignCard>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default ApproachDetail;
