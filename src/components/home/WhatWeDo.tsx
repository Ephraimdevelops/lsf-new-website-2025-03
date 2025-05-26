
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Users, LayoutGrid, BookOpen, Lightbulb } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ServiceCard = ({ icon, title, description, link }: ServiceCardProps) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-lg p-6 hover:shadow-md transition-all duration-300 border border-gray-100 h-full">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
            <div className="text-primary group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          </div>
          
          <div className="flex-1">
            <Typography variant="h4" className="mb-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </Typography>
            
            <Typography variant="bodySmall" className="text-neutral-gray mb-3 leading-relaxed">
              {description}
            </Typography>
            
            <span className="inline-flex items-center text-primary font-medium text-sm group-hover:underline">
              Learn more
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
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
    <Section variant="default" padding="lg">
      <Container size="xl">
        <div className="mb-12">
          <Typography variant="h2" className="mb-4 text-neutral-dark">
            Our work
          </Typography>
          
          <Typography variant="body" className="max-w-2xl text-neutral-gray mb-6">
            We work with partners around Tanzania to tackle big challenges and improve people's lives.
          </Typography>
          
          <Link 
            to="/what-we-do" 
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Learn more about our work
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </Container>
    </Section>
  );
};

export default WhatWeDo;
