
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Users, LayoutGrid, BookOpen, Lightbulb } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ServiceCard = ({ icon, title, description, link }: ServiceCardProps) => {
  return (
    <Link to={link} className="block group h-full">
      <Card variant="elevated" hover={true} className="h-full group-hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <div className="text-primary group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          </div>
          
          <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors duration-300">
            {title}
          </Typography>
          
          <Typography variant="bodySmall" className="text-neutral-gray mb-4 flex-grow leading-relaxed">
            {description}
          </Typography>
          
          <div className="mt-auto">
            <span className="inline-flex items-center text-primary font-medium text-sm group-hover:underline">
              Learn more
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const WhatWeDo = () => {
  const services = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Grant Making",
      description: "Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls.",
      link: "/what-we-do#grant-making"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Capacity Building",
      description: "LSF strengthens both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations.",
      link: "/what-we-do#capacity-building"
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: "Partnerships & Networking",
      description: "We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors.",
      link: "/what-we-do#partnerships-networking"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Learning and Research",
      description: "Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn't.",
      link: "/what-we-do#learning-research"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Policy and Advocacy",
      description: "Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all.",
      link: "/what-we-do#policy-advocacy"
    }
  ];
  
  return (
    <Section variant="default" padding="xl">
      <Container size="xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-teal rounded-full"></div>
            <Typography variant="overline" className="text-primary-500">
              Our Services
            </Typography>
            <div className="w-12 h-1 bg-gradient-to-r from-secondary-teal to-primary-500 rounded-full"></div>
          </div>
          
          <Typography variant="h2" className="mb-4 bg-gradient-to-r from-primary-500 to-secondary-teal bg-clip-text text-transparent">
            What We Do
          </Typography>
          
          <Typography variant="body" className="max-w-3xl mx-auto text-neutral-gray">
            Our comprehensive approach to promoting access to justice focuses on these key service areas
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/what-we-do" 
            className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore All Our Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default WhatWeDo;
