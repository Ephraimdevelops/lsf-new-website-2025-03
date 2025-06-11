
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, Gavel, Building, Cloud, Smartphone, Target } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  stats: string;
  colorClass: string;
}

const FocusAreaCard = ({ icon, title, description, link, stats, colorClass }: FocusAreaProps) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full group-hover:-translate-y-4">
        {/* Header */}
        <div className={`bg-gradient-to-br ${colorClass} p-6 md:p-8 relative overflow-hidden`}>
          <div className="absolute top-4 right-4 text-4xl md:text-6xl font-black text-white/20">
            {stats}
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <div className="text-white text-6 md:text-8">
                {icon}
              </div>
            </div>
            <Typography variant="h3" className="text-white mb-3 md:mb-4 leading-tight text-lg md:text-xl lg:text-2xl">
              {title}
            </Typography>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <Typography variant="body" className="text-neutral-gray leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
            {description}
          </Typography>
          
          <div className="flex items-center text-primary font-semibold group-hover:text-secondary-teal transition-colors text-sm md:text-base">
            Learn More
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const FocusAreas = () => {
  const strategicFocusAreas = [
    {
      icon: <Scale className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Increasing Accessibility to Quality Legal Aid Services",
      description: "We prioritize the provision of accessible, affordable, and quality legal aid services to marginalized populations, with a strong emphasis on women and girls. Our approach focuses on community-based solutions and trained paralegals.",
      link: "/focus-areas/accessible-legal-aid",
      stats: "01",
      colorClass: "from-primary to-primary-dark"
    },
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Promoting Legally Empowered Communities",
      description: "We advance community legal empowerment—particularly for women, girls, and other marginalized groups—through comprehensive legal education, awareness programs, and strengthening paralegal networks across Tanzania.",
      link: "/focus-areas/empowered-communities",
      stats: "02",
      colorClass: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Gavel className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Enhancing a Conducive Environment for Sustainable Access to Justice",
      description: "We support policy reform, legal frameworks, and advocacy initiatives that create enabling conditions for inclusive, sustainable, and equitable access to justice for all Tanzanians.",
      link: "/focus-areas/conducive-environment",
      stats: "03",
      colorClass: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Building className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Institutional Development and Sustainability",
      description: "We strengthen the organizational capacity, financial sustainability, and operational effectiveness of LSF and the broader legal aid sector to ensure long-term impact and resilience.",
      link: "/focus-areas/institutional-development",
      stats: "04",
      colorClass: "from-secondary-yellow to-secondary-yellow/80"
    },
    {
      icon: <Cloud className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Climate Justice",
      description: "Recognizing that climate change disproportionately affects women and marginalized communities, LSF integrates climate justice into programming, including legal empowerment on land rights, environmental governance, and climate-related disputes.",
      link: "/focus-areas/climate-justice",
      stats: "05",
      colorClass: "from-green-500 to-green-600"
    },
    {
      icon: <Smartphone className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Digital Transformation",
      description: "LSF embraces innovation to modernize operations and expand reach through digitalization of legal aid service delivery, case tracking, training, and data systems to enhance accessibility and transparency.",
      link: "/focus-areas/digital-transformation",
      stats: "06",
      colorClass: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <Section variant="secondary" padding="xl">
      <Container size="xl">
        <div className="text-center mb-12 md:mb-20 px-4">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 md:px-8 py-3 md:py-4 mb-6 md:mb-8">
            <Target className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4 text-primary" />
            <Typography variant="overline" className="text-primary font-bold text-sm md:text-lg">
              OUR FOCUS
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-6 md:mb-8 text-3xl md:text-5xl lg:text-6xl font-bold">
            Empowering Communities
            <span className="block text-primary">Through Legal Access</span>
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
            We work tirelessly to ensure every Tanzanian has access to justice, legal education, and the support they need to live with dignity and security.
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {strategicFocusAreas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
              stats={area.stats}
              colorClass={area.colorClass}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FocusAreas;
