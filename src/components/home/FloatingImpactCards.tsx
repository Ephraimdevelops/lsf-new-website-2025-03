
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Scale, Globe, ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const FloatingImpactCards = () => {
  const [activeCard, setActiveCard] = useState(0);

  const impactData = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      number: "$47M+",
      label: "Disbursed as Grants",
      description: "Financial support to legal aid organizations",
      gradient: "from-secondary-orange to-secondary-orange/80",
      delay: "0ms"
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: "105,562+",
      label: "Supported Groups",
      description: "Community organizations receiving assistance",
      gradient: "from-secondary-teal to-secondary-teal/80",
      delay: "200ms"
    },
    {
      icon: <Scale className="h-8 w-8" />,
      number: "426,349+",
      label: "Legal Aid Beneficiaries",
      description: "Individuals receiving direct legal support",
      gradient: "from-primary to-primary-dark",
      delay: "400ms"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      number: "39.8M+",
      label: "Legal Education Beneficiaries",
      description: "People reached through awareness programs",
      gradient: "from-secondary-yellow to-secondary-yellow/80",
      delay: "600ms"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % impactData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Sparkles className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold">
              MEASURABLE IMPACT
            </Typography>
          </div>
          
          <Typography variant="h2" className="mb-4 text-3xl font-bold">
            Transforming Lives Across Tanzania
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
            Our commitment to justice delivers measurable results for communities nationwide
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactData.map((item, index) => (
            <div
              key={index}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:-translate-y-2 ${
                activeCard === index ? 'ring-2 ring-primary/30 shadow-2xl' : ''
              }`}
              style={{ animationDelay: item.delay }}
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <Typography variant="h3" className="text-2xl font-bold mb-2 text-neutral-dark">
                  {item.number}
                </Typography>
                <Typography variant="h4" className="text-lg font-semibold mb-2 text-neutral-dark">
                  {item.label}
                </Typography>
                <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                  {item.description}
                </Typography>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA */}
        <div className="mt-12 text-center">
          <Typography variant="body" className="text-neutral-gray mb-6">
            Join us in creating lasting change across Tanzania
          </Typography>
          <button className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            Learn More About Our Impact
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
};

export default FloatingImpactCards;
