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
    <section id="strategic-approaches" className="py-20 bg-gradient-to-br from-white via-neutral-50/30 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,30,92,0.02)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(89,181,176,0.02)_0%,transparent_50%)]"></div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary-teal/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8">
            <Zap className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold tracking-wider text-sm">
              HOW WE WORK
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
            Our Strategic
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Approaches
            </span>
          </Typography>
          <Typography variant="body" className="text-neutral-600 max-w-4xl mx-auto text-lg leading-relaxed">
            We use six synergistic approaches to deliver on our mission. These are not just methods; they are how we implement, scale, and sustain justice innovation across Tanzania.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approaches.map((approach, index) => (
            <Card key={index} className="group overflow-hidden bg-white hover:scale-[1.02] transition-all duration-300 border-0 shadow-sm hover:shadow-lg">
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={approach.image} 
                  alt={approach.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${approach.color} opacity-80`}></div>
                <div className="absolute top-6 left-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="text-white">
                      {approach.icon}
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 right-6 text-6xl font-black text-white/15">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <Typography variant="h4" className="text-xl font-bold mb-4 text-primary group-hover:text-secondary-teal transition-colors duration-300">
                  {approach.title}
                </Typography>
                
                <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                  {approach.description}
                </Typography>

                <Link to={approach.link}>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-secondary-teal font-semibold group-hover:translate-x-2 transition-all duration-300 flex items-center">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StrategicApproachesSection;