
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, BookOpen, LayoutGrid, Smartphone, Leaf } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const FocusAreaCard = ({ icon, title, description, link }: FocusAreaProps) => {
  return (
    <Link to={link} className="block group h-full">
      <Card variant="elevated" hover={true} className="h-full group-hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className="w-12 h-12 bg-secondary-teal/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary-teal group-hover:scale-110 transition-all duration-300">
            <div className="text-secondary-teal group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          </div>
          
          <Typography variant="h4" className="mb-3 group-hover:text-secondary-teal transition-colors duration-300">
            {title}
          </Typography>
          
          <Typography variant="bodySmall" className="text-neutral-gray mb-4 flex-grow leading-relaxed">
            {description}
          </Typography>
          
          <div className="mt-auto">
            <span className="inline-flex items-center text-secondary-teal font-medium text-sm group-hover:underline">
              Learn more
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Card>
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
    <Section variant="secondary" padding="xl">
      <Container size="xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-secondary-teal to-secondary-orange rounded-full"></div>
            <Typography variant="overline" className="text-secondary-teal">
              Strategic Focus
            </Typography>
            <div className="w-12 h-1 bg-gradient-to-r from-secondary-orange to-secondary-teal rounded-full"></div>
          </div>
          
          <Typography variant="h2" className="mb-4 bg-gradient-to-r from-secondary-teal to-secondary-orange bg-clip-text text-transparent">
            We Focus On Delivering In 6 Key Areas
          </Typography>
          
          <Typography variant="body" className="max-w-3xl mx-auto text-neutral-gray">
            Our strategic approach focuses on these primary areas to ensure comprehensive access to justice throughout Tanzania
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        <div className="text-center mt-12">
          <Link 
            to="/programs" 
            className="inline-flex items-center bg-gradient-to-r from-secondary-teal to-secondary-orange hover:from-secondary-teal/90 hover:to-secondary-orange/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Learn About Our Approach
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreas;
