
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, BookOpen, LayoutGrid, Smartphone, Leaf } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const FocusAreaCard = ({ icon, title, description, link }: FocusAreaProps) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-lg p-6 hover:shadow-md transition-all duration-300 border border-gray-100 h-full">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-secondary-teal/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary-teal group-hover:scale-105 transition-all duration-300">
            <div className="text-secondary-teal group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          </div>
          
          <div className="flex-1">
            <Typography variant="h4" className="mb-2 group-hover:text-secondary-teal transition-colors duration-300">
              {title}
            </Typography>
            
            <Typography variant="bodySmall" className="text-neutral-gray mb-3 leading-relaxed">
              {description}
            </Typography>
            
            <span className="inline-flex items-center text-secondary-teal font-medium text-sm group-hover:underline">
              Learn more
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FocusAreas = () => {
  const areas = [
    {
      icon: <Scale className="h-6 w-6" />,
      title: "Accessible Legal Update",
      description: "Increasing accessibility of quality legal aid services to the marginalized communities in particular women.",
      link: "/programs/legal-empowerment"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Empowered Communities",
      description: "Promoting legally empowered communities, in particular women, through legal awareness and education.",
      link: "/programs/gender-justice"
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: "Conducive Environment",
      description: "Enhancing a conducive environment for sustainable access to justice and advocating for justice reform.",
      link: "/programs/justice-reform"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Institutional Sustainability",
      description: "Institutional development and sustainability of LSF and the legal aid sector across Tanzania.",
      link: "/programs/institutional-development"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Digital Transformation",
      description: "LSF is embracing innovation to modernize operations and expand its reach. Efforts include the digitalization of legal aid service delivery, case tracking, training, and data systems.",
      link: "/programs/digital-transformation"
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Climate Justice",
      description: "Recognizing that climate change disproportionately affects women and marginalized communities, LSF is integrating climate justice into its programming.",
      link: "/programs/climate-justice"
    }
  ];

  return (
    <Section variant="secondary" padding="lg">
      <Container size="xl">
        <div className="mb-12">
          <Typography variant="h2" className="mb-4 text-neutral-dark">
            Our story
          </Typography>
          
          <Typography variant="body" className="max-w-2xl text-neutral-gray mb-6">
            For over 25 years, the Legal Services Facility has been committed to tackling the greatest inequities in access to justice across Tanzania.
          </Typography>
          
          <Link 
            to="/programs" 
            className="inline-flex items-center text-secondary-teal font-medium hover:underline"
          >
            Explore our story
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreas;
