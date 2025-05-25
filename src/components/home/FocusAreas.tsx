
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, BookOpen, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Card from '@/components/shared/Card';
import Typography from '@/components/shared/Typography';
import IconWrapper from '@/components/shared/IconWrapper';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: 'primary' | 'secondary' | 'neutral' | 'white';
}

const FocusAreaCard = ({ icon, title, description, link, color }: FocusAreaProps) => {
  return (
    <Link to={link} className="block group h-full">
      <Card 
        variant="elevated" 
        hover={true}
        className="h-full group-hover:shadow-2xl group-hover:bg-gradient-to-br group-hover:from-primary/90 group-hover:to-primary group-hover:text-white transition-all duration-500"
      >
        <div className="flex flex-col h-full">
          <IconWrapper 
            size="lg" 
            variant={color}
            className="mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-primary transition-all duration-300"
          >
            {icon}
          </IconWrapper>
          
          <Typography 
            variant="h4" 
            className="mb-4 group-hover:text-white transition-colors duration-300"
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body" 
            className="mb-6 flex-grow group-hover:text-white/90 transition-colors duration-300"
          >
            {description}
          </Typography>
          
          <div className="mt-auto">
            <span className="inline-flex items-center text-primary-500 font-medium group-hover:text-white group-hover:underline transition-colors duration-300">
              Learn more
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
      icon: <Scale size={30} className="text-white" />,
      title: "Accessible Legal Update",
      description: "Increasing accessibility of quality legal aid services to the marginalized communities in particular women.",
      link: "/programs/legal-empowerment",
      color: "primary" as const
    },
    {
      icon: <Users size={30} className="text-white" />,
      title: "Empowered Communities",
      description: "Promoting legally empowered communities, in particular women, through legal awareness and education.",
      link: "/programs/gender-justice",
      color: "secondary" as const
    },
    {
      icon: <LayoutGrid size={30} className="text-white" />,
      title: "Conducive Environment",
      description: "Enhancing a conducive environment for sustainable access to justice and advocating for justice reform.",
      link: "/programs/climate-justice",
      color: "secondary" as const
    },
    {
      icon: <BookOpen size={30} className="text-white" />,
      title: "Institutional Sustainability",
      description: "Institutional development and sustainability of LSF and the legal aid sector across Tanzania.",
      link: "/programs/digital-transformation",
      color: "neutral" as const
    }
  ];

  return (
    <Section variant="secondary" padding="xl" className="relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-secondary-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-secondary-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-secondary-yellow/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="bg-neutral-400 rounded-full w-1 h-1"></div>
          ))}
        </div>
      </div>
      
      <Container size="xl" className="relative z-10">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-teal rounded-full"></div>
            <Typography variant="overline" className="text-primary-500">
              Our Focus
            </Typography>
            <div className="w-12 h-1 bg-gradient-to-r from-secondary-teal to-primary-500 rounded-full"></div>
          </div>
          
          <Typography 
            variant="h1" 
            className="mb-6 bg-gradient-to-r from-primary-500 via-secondary-teal to-primary-500 bg-clip-text text-transparent"
          >
            We Focus On Delivering In 4 Key Areas
          </Typography>
          
          <Typography 
            variant="body" 
            className="max-w-3xl mx-auto mb-12"
          >
            Our strategic approach focuses on these primary areas to ensure comprehensive access to justice throughout Tanzania
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {areas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
              color={area.color}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Card variant="elevated" padding="lg" className="bg-white/80 backdrop-blur-sm border-neutral-100 inline-block">
            <Link to="/what-we-do">
              <Button className="bg-gradient-to-r from-primary-500 to-secondary-teal hover:from-primary-600 hover:to-secondary-teal/80 text-white text-lg px-10 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Learn About Our Approach
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreas;
