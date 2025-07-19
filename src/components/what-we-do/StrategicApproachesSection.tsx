import { ArrowRight, DollarSign, Users, Megaphone, BookOpen, Zap, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const StrategicApproachesSection = () => {
  const approaches = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Grant-Making and Management",
      description: "We fund and support over 100 organizations, enabling them to provide frontline legal aid and paralegal services in underserved regions.",
      image: "public/lovable-uploads/7.png",
      color: "from-secondary-orange to-secondary-orange/80",
      link: "/what-we-do/grant-making"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Direct Project Implementation",
      description: "We design and implement high-impact programs like Wanawake Tunaweza and Sauti ya Mwanamke, reaching communities with custom legal interventions and rights-based empowerment.",
      image: "public/lovable-uploads/8.png",
      color: "from-secondary-teal to-secondary-teal/80",
      link: "/programs"
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Policy Influence and Advocacy",
      description: "We push for laws and policies that center justice, gender equality, and human dignity. Our advocacy spans community mobilization to parliamentary engagement.",
      image: "public/lovable-uploads/9.png",
      color: "from-primary to-primary-dark",
      link: "/approach/advocacy-policy"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Research, Monitoring, and Learning",
      description: "We generate and translate evidence into action—improving programs, influencing reform, and ensuring our partners have access to knowledge that matters.",
      image: "public/lovable-uploads/10.png",
      color: "from-secondary-yellow to-secondary-yellow/80",
      link: "/approach/research-learning"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Technology and Innovation",
      description: "We invest in digital legal aid tools like the Haki Yangu App, USSD/IVR services, and WhatsApp bots, closing the access gap for low-literacy, remote, or low-tech communities.",
      image: "public/lovable-uploads/11.png",
      color: "from-purple-500 to-purple-600",
      link: "/legal-help"
    }
  ];

  return (
    <section id="strategic-approaches" className="py-20 bg-neutral-50">
      <Container size="xl">
         {/* Header */}
       <div className="text-center mb-12">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
            HOW WE WORK
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
          Our Strategic <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent"></span>
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
            Approaches 
            </span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We use five synergistic approaches to deliver on our mission. These are not just methods; they are how we implement, scale, and sustain justice innovation across Tanzania.
          </p>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approaches.map((approach, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Clean Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={approach.image} 
                  alt={approach.title}
                  className="w-100% h-full object-cover"
                />
                <div className="absolute text-center top-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <div className="text-primary">
                      {approach.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Content */}
              <div className="p-6">
                <Typography variant="h4" className="text-xl font-bold mb-3 text-neutral-900">
                  {approach.title}
                </Typography>
                
                <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                  {approach.description}
                </Typography>

                <Link to={approach.link}>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-secondary-teal font-semibold transition-colors duration-200 flex items-center">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StrategicApproachesSection;