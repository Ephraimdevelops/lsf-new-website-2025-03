import { ArrowRight, Scale, GraduationCap, Heart, FileText, Building, Lightbulb, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const StrategicFocusAreasSection = () => {
  const focusAreas = [
    {
      icon: <Scale className="h-12 w-12" />,
      title: "Expanding Access to Legal Aid",
      description: "Scaling affordable, high-quality legal aid for rural areas, women, and underserved communities.",
      stats: [
        "426,000+ beneficiaries served",
        "105,000+ legal providers supported"
      ],
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600&h=400&fit=crop&crop=faces",
      color: "from-secondary-orange to-secondary-orange/80",
      link: "/focus-areas/accessible-legal-aid",
      cta: "Explore Legal Aid"
    },
    {
      icon: <GraduationCap className="h-12 w-12" />,
      title: "Advancing Legal Empowerment",
      description: "Boosting legal literacy and rights awareness to empower community advocacy.",
      stats: [
        "39.8M+ reached via education",
        "Legal clubs and paralegal outreach"
      ],
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop&crop=faces",
      color: "from-secondary-teal to-secondary-teal/80",
      link: "/focus-areas/empowered-communities",
      cta: "Learn Empowerment"
    },
    {
      icon: <Heart className="h-12 w-12" />,
      title: "Strengthening Gender Justice",
      description: "Fighting gender-based violence and promoting equality in law and practice.",
      stats: [
        "Sauti ya Mwanamke program",
        "Survivors aided with services"
      ],
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop&crop=faces",
      color: "from-primary to-primary-dark",
      link: "/resources/gender-justice",
      cta: "Discover Gender Justice"
    },
    {
      icon: <FileText className="h-12 w-12" />,
      title: "Supporting Legal Reform",
      description: "Engaging policymakers to align laws with justice and human rights.",
      stats: [
        "Constitutional and code reforms",
        "Influenced key legal policies"
      ],
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop&crop=faces",
      color: "from-secondary-yellow to-secondary-yellow/80",
      link: "/what-we-do/advocacy-policy",
      cta: "See Policy Impact"
    },
    {
      icon: <Building className="h-12 w-12" />,
      title: "Building Justice Systems",
      description: "Strengthening paralegal units and CSOs for sustainable legal aid.",
      stats: [
        "Toolkits and capacity building",
        "Monitoring justice systems"
      ],
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop&crop=faces",
      color: "from-green-500 to-green-600",
      link: "/focus-areas/institutional-development",
      cta: "Explore Sustainability"
    },
    {
      icon: <Lightbulb className="h-12 w-12" />,
      title: "Promoting Inclusive Innovation",
      description: "Scaling digital justice for youth, disabled, and tech-desert communities.",
      stats: [
        "Haki Yangu App + WhatsApp bots",
        "Legal aid via SMS & USSD"
      ],
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=400&fit=crop&crop=faces",
      color: "from-purple-500 to-purple-600",
      link: "/focus-areas/digital-transformation",
      cta: "Discover Innovation"
    }
  ];

  return (
    <section id="focus-areas" className="py-24 bg-primary">
      <Container size="xl">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/10 rounded-full px-6 py-3 mb-6">
            <DesignIcon 
              icon={<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-3"
            />
            <Text variant="overline" color="white" className="font-semibold text-base tracking-wider">
              OUR PRIORITIES
            </Text>
          </div>
          <Typography variant="h2" className="text-4xl md:text-5xl font-semibold text-white mb-6">
            Strategic Focus Areas
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Driving Justice Innovation
            </span>
          </Typography>
          <Typography variant="body" className="text-lg text-white/80 leading-relaxed">
            Our six focus areas empower communities, reform systems, and scale sustainable justice across Tanzania with impact and innovation.
          </Typography>
        </div>

        {/* Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {focusAreas.map((area, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden relative max-w-sm mx-auto"
              style={{
                backgroundImage: `url(${area.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <div className="p-6 flex flex-col items-center gap-5">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${area.color} group-hover:scale-110 transition-transform duration-500 ease-in-out`}>
                  {area.icon}
                </div>

                {/* Title */}
                <Typography variant="h4" className="text-2xl font-semibold text-neutral-900 text-center">
                  {area.title}
                </Typography>

                {/* Description */}
                <Typography variant="body" className="text-neutral-600 text-base leading-relaxed text-center max-w-xs">
                  {area.description}
                </Typography>

                {/* Infographic Stats */}
                <div className="flex flex-col items-center gap-2">
                  {area.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-neutral-400" />
                      <Typography variant="bodySmall" className={`text-neutral-600 font-medium bg-gradient-to-r ${area.color} bg-clip-text text-transparent`}>
                        {stat}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link to={area.link}>
                  <Button 
                    className={`w-fit rounded-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r ${area.color} hover:opacity-90 transition-all duration-300 ease-in-out flex items-center gap-2`}
                  >
                    {area.cta}
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

export default StrategicFocusAreasSection;