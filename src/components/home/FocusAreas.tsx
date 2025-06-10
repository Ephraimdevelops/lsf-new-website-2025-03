
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, Landmark, Building, Target, Gavel, Cloud, Smartphone } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  gradient: string;
}

const FocusAreaCard = ({ icon, title, description, link, gradient }: FocusAreaProps) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full relative overflow-hidden group-hover:-translate-y-2">
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary-teal/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <div className="text-primary group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          
          <Typography variant="h4" className="mb-4 group-hover:text-primary transition-colors duration-300">
            {title}
          </Typography>
          
          <Typography variant="bodySmall" className="text-neutral-gray mb-6 leading-relaxed">
            {description}
          </Typography>
          
          <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:underline">
            Learn more
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
};

const FocusAreas = () => {
  const areas = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Increasing Accessibility to Quality Legal Aid Services",
      description: "Prioritizing the provision of accessible, affordable, and quality legal aid services to marginalized populations, with a strong emphasis on women and girls.",
      link: "/focus-areas/accessible-legal-aid",
      gradient: "bg-gradient-to-br from-primary to-primary-dark"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Promoting Legally Empowered Communities",
      description: "Advancing community legal empowerment—particularly for women, girls, and other marginalized groups—through legal education, awareness, and strengthening paralegal networks.",
      link: "/focus-areas/empowered-communities",
      gradient: "bg-gradient-to-br from-secondary-teal to-secondary-teal-dark"
    },
    {
      icon: <Gavel className="h-8 w-8" />,
      title: "Enhancing a Conducive Environment for Sustainable Access to Justice",
      description: "Supporting policy reform, legal frameworks, and advocacy initiatives that create enabling conditions for inclusive, sustainable, and equitable access to justice.",
      link: "/focus-areas/conducive-environment",
      gradient: "bg-gradient-to-br from-secondary-orange to-secondary-orange-dark"
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Institutional Development and Sustainability",
      description: "Strengthening the organizational capacity, financial sustainability, and operational effectiveness of LSF and the broader legal aid sector to ensure long-term impact and resilience.",
      link: "/focus-areas/institutional-development",
      gradient: "bg-gradient-to-br from-secondary-yellow to-secondary-yellow-dark"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Climate Justice",
      description: "Recognizing that climate change disproportionately affects women and marginalized communities, LSF integrates climate justice into programming, including legal empowerment on land rights, environmental governance, and climate-related disputes.",
      link: "/focus-areas/climate-justice",
      gradient: "bg-gradient-to-br from-green-500 to-green-700"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Digital Transformation",
      description: "LSF embraces innovation to modernize operations and expand reach through digitalization of legal aid service delivery, case tracking, training, and data systems to enhance accessibility and transparency.",
      link: "/focus-areas/digital-transformation",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700"
    }
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
            Strategic Focus
          </span>
          <Typography variant="h2" className="mb-6 bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
            Our Strategic Focus Areas
          </Typography>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-teal mx-auto rounded-full mb-6"></div>
          
          <Typography variant="body" className="max-w-3xl mx-auto text-neutral-gray mb-8">
            LSF operates across six strategic focus areas that guide our comprehensive approach to increasing access to justice and legal empowerment across Tanzania.
          </Typography>
          
          <Link 
            to="/focus-areas" 
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Explore all focus areas
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
              gradient={area.gradient}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreas;
