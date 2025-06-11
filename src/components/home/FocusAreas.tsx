
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, Gavel, Building, Cloud, Smartphone } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  stats: string;
  color: string;
}

const FocusAreaCard = ({ icon, title, description, link, stats, color }: FocusAreaProps) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full group-hover:-translate-y-4">
        {/* Header */}
        <div className={`bg-gradient-to-br from-${color} to-${color}/80 p-8 relative overflow-hidden`}>
          <div className="absolute top-4 right-4 text-6xl font-black text-white/20">
            0{stats}
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <div className="text-white">
                {icon}
              </div>
            </div>
            <Typography variant="h3" className="text-white mb-4 leading-tight">
              {title}
            </Typography>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <Typography variant="body" className="text-neutral-gray leading-relaxed mb-6 text-lg">
            {description}
          </Typography>
          
          <div className="flex items-center text-primary font-semibold group-hover:text-secondary-teal transition-colors">
            Learn More
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const FocusAreas = () => {
  const strategicFocusAreas = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Increasing Accessibility to Quality Legal Aid Services",
      description: "We prioritize the provision of accessible, affordable, and quality legal aid services to marginalized populations, with a strong emphasis on women and girls. Our approach focuses on community-based solutions and trained paralegals.",
      link: "/focus-areas/accessible-legal-aid",
      stats: "1",
      color: "primary"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Promoting Legally Empowered Communities",
      description: "We advance community legal empowerment—particularly for women, girls, and other marginalized groups—through comprehensive legal education, awareness programs, and strengthening paralegal networks across Tanzania.",
      link: "/focus-areas/empowered-communities",
      stats: "2",
      color: "secondary-teal"
    },
    {
      icon: <Gavel className="h-8 w-8" />,
      title: "Enhancing a Conducive Environment for Sustainable Access to Justice",
      description: "We support policy reform, legal frameworks, and advocacy initiatives that create enabling conditions for inclusive, sustainable, and equitable access to justice for all Tanzanians.",
      link: "/focus-areas/conducive-environment",
      stats: "3",
      color: "secondary-orange"
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Institutional Development and Sustainability",
      description: "We strengthen the organizational capacity, financial sustainability, and operational effectiveness of LSF and the broader legal aid sector to ensure long-term impact and resilience.",
      link: "/focus-areas/institutional-development",
      stats: "4",
      color: "secondary-yellow"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Climate Justice",
      description: "Recognizing that climate change disproportionately affects women and marginalized communities, LSF integrates climate justice into programming, including legal empowerment on land rights, environmental governance, and climate-related disputes.",
      link: "/focus-areas/climate-justice",
      stats: "5",
      color: "green-500"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Digital Transformation",
      description: "LSF embraces innovation to modernize operations and expand reach through digitalization of legal aid service delivery, case tracking, training, and data systems to enhance accessibility and transparency.",
      link: "/focus-areas/digital-transformation",
      stats: "6",
      color: "blue-500"
    }
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container size="xl">
         <div className="text-center mb-20">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
              <Target className="h-6 w-6 mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-lg">
                OUR FOCUS
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              Empowering Communities
              <span className="block text-primary">Through Legal Access</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
              We work tirelessly to ensure every Tanzanian has access to justice, legal education, and the support they need to live with dignity and security.
            </Typography>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strategicFocusAreas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
              stats={area.stats}
              color={area.color}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreas;
