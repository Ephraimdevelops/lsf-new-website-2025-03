
import { Link } from 'react-router-dom';
import { DollarSign, Users, LayoutGrid, BookOpen, Lightbulb, Scale, Smartphone, Leaf } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

const FocusAreasGrid = () => {
  const focusAreas = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Grant Making',
      description: 'Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls.',
      link: '/what-we-do#grant-making',
      color: 'primary'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Capacity Building',
      description: 'LSF strengthens both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations.',
      link: '/what-we-do#capacity-building',
      color: 'secondary-teal'
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: 'Partnerships & Networking',
      description: 'We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors.',
      link: '/what-we-do#partnerships-networking',
      color: 'primary'
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Learning and Research',
      description: 'Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn\'t.',
      link: '/what-we-do#learning-research',
      color: 'secondary-teal'
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: 'Policy and Advocacy',
      description: 'Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all.',
      link: '/what-we-do#policy-advocacy',
      color: 'primary'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Accessible Legal Services',
      description: 'Increasing accessibility of quality legal aid services to marginalized communities, particularly women.',
      link: '/programs/legal-empowerment',
      color: 'secondary-teal'
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Digital Transformation',
      description: 'LSF is embracing innovation to modernize operations and expand its reach through digitalization of legal aid service delivery.',
      link: '/programs/digital-transformation',
      color: 'primary'
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Climate Justice',
      description: 'Recognizing that climate change disproportionately affects women and marginalized communities, LSF is integrating climate justice into its programming.',
      link: '/programs/climate-justice',
      color: 'secondary-teal'
    }
  ];

  return (
    <Section variant="default" padding="lg">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-6 text-neutral-dark">
            Our Strategic Focus Areas
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
            We work across eight key areas to ensure justice is accessible to all Tanzanians, 
            particularly women and marginalized communities.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {focusAreas.map((area, index) => (
            <Link key={index} to={area.link} className="group">
              <div className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/20 h-full">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  area.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary group-hover:text-white' :
                  'bg-secondary-teal/10 group-hover:bg-secondary-teal group-hover:text-white'
                } transition-all duration-300`}>
                  <div className={`${
                    area.color === 'primary' ? 'text-primary group-hover:text-white' : 'text-secondary-teal group-hover:text-white'
                  } transition-colors duration-300`}>
                    {area.icon}
                  </div>
                </div>
                
                <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors duration-300">
                  {area.title}
                </Typography>
                
                <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                  {area.description}
                </Typography>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreasGrid;
