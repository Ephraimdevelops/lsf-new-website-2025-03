
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Users, LayoutGrid, BookOpen, Lightbulb, Scale, Smartphone, Leaf } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
  image: string;
  link: string;
  variant: 'primary' | 'secondary';
}

const ServiceCard = ({ icon, title, description, points, image, link, variant }: ServiceCardProps) => {
  const colorClass = variant === 'primary' ? 'text-primary' : 'text-secondary-teal';
  const bgClass = variant === 'primary' ? 'bg-primary/10' : 'bg-secondary-teal/10';
  const hoverBgClass = variant === 'primary' ? 'group-hover:bg-primary' : 'group-hover:bg-secondary-teal';
  
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 h-full overflow-hidden">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center flex-shrink-0 ${hoverBgClass} group-hover:scale-105 transition-all duration-300`}>
                <div className={`${colorClass} group-hover:text-white transition-colors duration-300`}>
                  {icon}
                </div>
              </div>
              <Typography variant="h4" className={`group-hover:${colorClass} transition-colors duration-300`}>
                {title}
              </Typography>
            </div>
            
            <Typography variant="bodySmall" className="text-neutral-gray mb-4 leading-relaxed">
              {description}
            </Typography>
            
            <ul className="space-y-2 mb-4">
              {points.slice(0, 3).map((point, index) => (
                <li key={index} className="flex items-start text-sm text-neutral-600">
                  <div className={`w-1.5 h-1.5 rounded-full ${variant === 'primary' ? 'bg-primary' : 'bg-secondary-teal'} mt-2 mr-3 flex-shrink-0`}></div>
                  {point}
                </li>
              ))}
            </ul>
            
            <span className={`inline-flex items-center ${colorClass} font-medium text-sm group-hover:underline`}>
              Learn more
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
          
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

const WhatWeDo = () => {
  const workAreas = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Grant Making",
      description: "Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls.",
      points: [
        "Strategic funding for legal aid organizations",
        "Capacity building grants for paralegals",
        "Emergency response funding for vulnerable communities"
      ],
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do#grant-making",
      variant: 'primary' as const
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Capacity Building",
      description: "LSF strengthens both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations.",
      points: [
        "Training programs for legal aid providers",
        "Technical assistance and mentorship",
        "Institutional development support"
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do#capacity-building",
      variant: 'secondary' as const
    },
    {
      icon: <LayoutGrid className="h-5 w-5" />,
      title: "Partnerships & Networking",
      description: "We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors.",
      points: [
        "Multi-stakeholder partnerships",
        "Knowledge sharing networks",
        "Coalition building for policy reform"
      ],
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do#partnerships-networking",
      variant: 'primary' as const
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Learning and Research",
      description: "Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn't.",
      points: [
        "Evidence-based research and evaluation",
        "Innovation in legal service delivery",
        "Best practice documentation and sharing"
      ],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do#learning-research",
      variant: 'secondary' as const
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Policy and Advocacy",
      description: "Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all.",
      points: [
        "Legislative advocacy and reform",
        "Policy research and analysis",
        "Grassroots advocacy training"
      ],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do#policy-advocacy",
      variant: 'primary' as const
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "Accessible Legal Services",
      description: "Increasing accessibility of quality legal aid services to marginalized communities, particularly women.",
      points: [
        "Mobile legal aid clinics",
        "Community-based legal services",
        "Free legal representation"
      ],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop&crop=faces",
      link: "/programs/legal-empowerment",
      variant: 'secondary' as const
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Digital Transformation",
      description: "LSF is embracing innovation to modernize operations and expand its reach through digitalization of legal aid service delivery.",
      points: [
        "Digital case management systems",
        "Mobile legal assistance apps",
        "Online training platforms"
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=faces",
      link: "/programs/digital-transformation",
      variant: 'primary' as const
    },
    {
      icon: <Leaf className="h-5 w-5" />,
      title: "Climate Justice",
      description: "Recognizing that climate change disproportionately affects women and marginalized communities, LSF is integrating climate justice into its programming.",
      points: [
        "Environmental legal advocacy",
        "Climate adaptation support",
        "Green legal initiatives"
      ],
      image: "https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=200&h=200&fit=crop&crop=faces",
      link: "/programs/climate-justice",
      variant: 'secondary' as const
    }
  ];
  
  return (
    <Section variant="default" padding="lg">
      <Container size="xl">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Typography variant="h2" className="mb-4 text-neutral-dark">
            Our Work & Strategic Focus
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray mb-6">
            We tackle Tanzania's greatest inequities in access to justice through comprehensive programs spanning legal aid, community empowerment, policy reform, and innovative digital solutions.
          </Typography>
          
          <Link 
            to="/what-we-do" 
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Explore our comprehensive approach
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workAreas.map((area, index) => (
            <ServiceCard 
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              points={area.points}
              image={area.image}
              link={area.link}
              variant={area.variant}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WhatWeDo;
