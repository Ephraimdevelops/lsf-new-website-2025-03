import { ArrowRight, DollarSign, Users, Megaphone, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const StrategicApproachesSection = () => {
  const approaches = [
    {
      icon: <DollarSign className="h-12 w-12" />,
      title: "Grant-Making and Management",
      description: "Funding over 100 organizations to deliver frontline legal aid in underserved regions.",
      image: "public/lovable-uploads/7.png",
      color: "from-secondary-orange to-secondary-orange/80",
      link: "/what-we-do/grant-making",
      cta: "Explore Grant-Making"
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Direct Project Implementation",
      description: "Designing high-impact programs like Wanawake Tunaweza for legal interventions.",
      image: "public/lovable-uploads/8.png",
      color: "from-secondary-teal to-secondary-teal/80",
      link: "/what-we-do/direct-implementation",
      cta: "Discover Our Programs"
    },
    {
      icon: <Megaphone className="h-12 w-12" />,
      title: "Policy Influence and Advocacy",
      description: "Pushing for justice-centered laws from communities to parliament.",
      image: "public/lovable-uploads/9.png",
      color: "from-primary to-primary-dark",
      link: "/what-we-do/advocacy-policy",
      cta: "Learn About Advocacy"
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Research, Monitoring, and Learning",
      description: "Translating evidence into action to improve programs and reforms.",
      image: "public/lovable-uploads/10.png",
      color: "from-secondary-yellow to-secondary-yellow/80",
      link: "/what-we-do/learning-research",
      cta: "Explore Our Research"
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "Partnerships & Networking",
      description: "Scaling digital tools like Haki Yangu App for low-tech communities.",
      image: "public/lovable-uploads/11.png",
      color: "from-purple-500 to-purple-600",
      link: "/what-we-do/partnerships-networking",
      cta: "Join Our Network"
    }
  ];

  return (
    <section id="approaches" className="py-24 bg-gray-50">
      <Container size="xl">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary-teal/10 rounded-full px-6 py-3 mb-6">
            <DesignIcon 
              icon={<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-3"
            />
            <Text variant="overline" color="primary" className="font-semibold text-base tracking-wider">
              HOW WE WORK
            </Text>
          </div>
          <Typography variant="h2" className="text-4xl md:text-5xl font-semibold text-neutral-900 mb-6">
            Strategic Approaches
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Scaling Justice Innovation
            </span>
          </Typography>
          <Typography variant="body" className="text-lg text-neutral-600 leading-relaxed">
            Our five approaches drive impactful, sustainable change, empowering communities and transforming justice systems across Tanzania.
          </Typography>
        </div>

        {/* Approaches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {approaches.map((approach, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden relative max-w-sm mx-auto"
              style={{
                backgroundImage: `url(${approach.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <div className="p-6 flex flex-col items-center gap-5">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${approach.color} group-hover:scale-110 transition-transform duration-500 ease-in-out`}>
                  {approach.icon}
                </div>

                {/* Title */}
                <Typography variant="h4" className="text-2xl font-semibold text-neutral-900 text-center">
                  {approach.title}
                </Typography>

                {/* Description */}
                <Typography variant="body" className="text-neutral-600 text-base leading-relaxed text-center max-w-xs">
                  {approach.description}
                </Typography>

                {/* CTA */}
                <Link to={approach.link}>
                  <Button 
                    className={`w-fit rounded-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r ${approach.color} hover:opacity-90 transition-all duration-300 ease-in-out flex items-center gap-2`}
                  >
                    {approach.cta}
                    <ArrowRight className="h-4 w-4" />
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