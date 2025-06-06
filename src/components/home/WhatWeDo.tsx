
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Wrench, Megaphone, BookOpen, Users } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';

interface ApproachCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  link: string;
  variant: 'primary' | 'secondary';
}

const ApproachCard = ({ icon, title, description, highlights, image, link, variant }: ApproachCardProps) => {
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
              {highlights.slice(0, 3).map((highlight, index) => (
                <li key={index} className="flex items-start text-sm text-neutral-600">
                  <div className={`w-1.5 h-1.5 rounded-full ${variant === 'primary' ? 'bg-primary' : 'bg-secondary-teal'} mt-2 mr-3 flex-shrink-0`}></div>
                  {highlight}
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
  const ourApproach = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Grant Making and Management",
      description: "For over a decade, LSF has established itself as a trusted fund manager, overseeing more than USD 47 million in donor contributions through robust grant-making architecture.",
      highlights: [
        "Over 200 subgrantees managed across Tanzania",
        "Proven financial accountability systems",
        "Partner capacity-building and compliance support"
      ],
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do/grant-making",
      variant: 'primary' as const
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Direct Project Implementation",
      description: "Since 2023, LSF has strategically expanded to include direct project implementation, enhancing agility and impact through high-impact initiatives.",
      highlights: [
        "'Sauti ya Mwanamke' - EU-funded women's access to justice",
        "'Wanawake Tunaweza' - women's economic and legal empowerment",
        "Enhanced operational flexibility and community reach"
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do/direct-implementation",
      variant: 'secondary' as const
    },
    {
      icon: <Megaphone className="h-5 w-5" />,
      title: "Advocacy and Policy Influence",
      description: "LSF has played a pivotal role in shaping Tanzania's access to justice landscape, championing the Legal Aid Act and driving nationwide legal empowerment initiatives.",
      highlights: [
        "Led development of the Legal Aid Act and regulations",
        "Spearheaded Mama Samia Legal Aid Campaign",
        "National framework for coordinated stakeholder engagement"
      ],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do/policy-advocacy",
      variant: 'primary' as const
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Research, Learning, and Innovation",
      description: "LSF actively invests in research, monitoring, and learning to ensure evidence-based programming and informed policy engagement through academic partnerships.",
      highlights: [
        "Evidence-based program design and evaluation",
        "Academic institution partnerships for research",
        "Data-driven policy reform advocacy"
      ],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do/learning-research",
      variant: 'secondary' as const
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Strategic Partnerships and Networking",
      description: "LSF's impact is amplified through diverse partnerships with civil society, development partners, government entities, and private sector actors to co-create solutions.",
      highlights: [
        "Multi-stakeholder collaboration and coordination",
        "Bridging grassroots efforts with national policy",
        "Convening power for systemic change in access to justice"
      ],
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop&crop=faces",
      link: "/what-we-do/partnerships-networking",
      variant: 'primary' as const
    }
  ];
  
  return (
    <Section variant="default" padding="lg">
      <Container size="xl">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Typography variant="h2" className="mb-4 text-neutral-dark">
            Our Approach to Legal Empowerment
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray mb-6">
            We tackle Tanzania's greatest inequities in access to justice through a comprehensive five-part approach 
            that combines proven fund management expertise with direct implementation, policy influence, research-driven 
            innovation, and strategic partnerships.
          </Typography>
          
          <Link 
            to="/what-we-do" 
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Explore our comprehensive approach
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ourApproach.map((approach, index) => (
            <ApproachCard 
              key={index}
              icon={approach.icon}
              title={approach.title}
              description={approach.description}
              highlights={approach.highlights}
              image={approach.image}
              link={approach.link}
              variant={approach.variant}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WhatWeDo;
