
import { Scale, Users, Shield, Target, ArrowRight } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const StrategicFocusSection = () => {
  const strategicAreas = [
    {
      icon: Scale,
      number: "01",
      title: "Increasing Accessibility to Quality Legal Aid Services",
      description: "We bring affordable, community-based legal aid to Tanzania's most vulnerable populations. Our paralegals—over 4,000 strong—provide legal support that is free, local, and inclusive.",
      stats: "4,000+ Paralegals",
      color: "primary",
      gradient: "from-primary to-primary-dark"
    },
    {
      icon: Users,
      number: "02", 
      title: "Promoting Legally Empowered Communities",
      description: "We empower citizens to know and use the law through legal education, awareness campaigns, and rights-based dialogue. Community paralegals are the frontline agents of change.",
      stats: "184 Communities",
      color: "secondary-teal",
      gradient: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: Shield,
      number: "03",
      title: "Enhancing a Conducive Environment for Sustainable Access to Justice", 
      description: "We strengthen the legal ecosystem by influencing policy reforms, building institutional capacity, and advocating for inclusive laws that support sustainable access to justice.",
      stats: "15+ Policy Reforms",
      color: "secondary-orange",
      gradient: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: Target,
      number: "04",
      title: "Institutional Development and Sustainability",
      description: "We invest in the resilience of LSF and the wider legal aid sector by enhancing operational systems, partner capacity, and financial sustainability.",
      stats: "200+ Partners",
      color: "secondary-yellow",
      gradient: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
      <Container size="xl" className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
            <Target className="h-6 w-6 mr-4 text-primary" />
            <Typography variant="overline" className="text-primary font-bold text-lg">
              STRATEGIC FOCUS AREAS
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
            Four Enduring Pillars of 
            <span className="block text-primary">Systemic Change</span>
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
            Our work is structured around four strategic pillars that drive meaningful, systemic change across Tanzania's justice landscape.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {strategicAreas.map((area, index) => (
            <div key={index} className="group relative">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full group-hover:-translate-y-4">
                {/* Header with Number */}
                <div className={`bg-gradient-to-br ${area.gradient} p-8 relative`}>
                  <div className="absolute top-4 right-4 text-8xl font-black text-white/20">
                    {area.number}
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                      <area.icon className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h3" className="text-white mb-4 leading-tight">
                      {area.title}
                    </Typography>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                      <span className="text-white font-bold text-sm">{area.stats}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <Typography variant="body" className="text-neutral-gray leading-relaxed mb-6 text-lg">
                    {area.description}
                  </Typography>
                  
                  <div className="flex items-center text-primary font-semibold group-hover:text-secondary-teal transition-colors">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StrategicFocusSection;
