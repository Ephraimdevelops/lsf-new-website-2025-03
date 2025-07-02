import { ArrowRight, DollarSign, Users, Megaphone, BookOpen, Zap, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

const StrategicApproachesSection = () => {
  const approaches = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Grant-Making and Management",
      description: "We fund and support over 100 organizations, enabling them to provide frontline legal aid and paralegal services in underserved regions.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-orange to-secondary-orange/80",
      link: "/what-we-do/grant-making"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Direct Project Implementation",
      description: "We design and implement high-impact programs like Wanawake Tunaweza and Sauti ya Mwanamke, reaching communities with custom legal interventions and rights-based empowerment.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-teal to-secondary-teal/80",
      link: "/programs"
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Policy Influence and Advocacy",
      description: "We push for laws and policies that center justice, gender equality, and human dignity. Our advocacy spans community mobilization to parliamentary engagement.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces",
      color: "from-primary to-primary-dark",
      link: "/approach/advocacy-policy"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Research, Monitoring, and Learning",
      description: "We generate and translate evidence into action—improving programs, influencing reform, and ensuring our partners have access to knowledge that matters.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-yellow to-secondary-yellow/80",
      link: "/approach/research-learning"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Technology and Innovation",
      description: "We invest in digital legal aid tools like the Haki Yangu App, USSD/IVR services, and WhatsApp bots, closing the access gap for low-literacy, remote, or low-tech communities.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=faces",
      color: "from-purple-500 to-purple-600",
      link: "/legal-help"
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Partnerships and Networking",
      description: "We build coalitions with CSOs, government, academia, and the private sector—amplifying our impact and ensuring justice is a shared responsibility.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=faces",
      color: "from-green-500 to-green-600",
      link: "/approach/partnerships-networking"
    }
  ];

  return (
    <section id="strategic-approaches" className="py-20 bg-neutral-50">
      <Container size="xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
            <Zap className="h-5 w-5 mr-3 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              HOW WE WORK
            </span>
          </div>
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl font-bold text-neutral-900">
            Our Strategic Approaches
          </Typography>
          <Typography variant="body" className="text-neutral-600 max-w-4xl mx-auto text-lg leading-relaxed">
            We use six synergistic approaches to deliver on our mission. These are not just methods; they are how we implement, scale, and sustain justice innovation across Tanzania.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approaches.map((approach, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Clean Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={approach.image} 
                  alt={approach.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
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