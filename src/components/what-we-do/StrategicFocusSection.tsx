import { Scale, Users, Shield, Target, ArrowRight, Sparkles, TrendingUp, Globe, Building } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Link } from 'react-router-dom';

const StrategicFocusSection = () => {
  const strategicAreas = [
    {
      icon: Scale,
      number: "01",
      title: "Increasing Accessibility to Quality Legal Aid Services",
      description: "We bring affordable, community-based legal aid to Tanzania's most vulnerable populations. Our paralegals—over 4,000 strong—provide legal support that is free, local, and inclusive.",
      stats: "4,000+ Paralegals",
      color: "primary",
      gradient: "from-primary to-primary-dark",
      link: "/focus-areas/accessible-legal-aid"
    },
    {
      icon: Users,
      number: "02", 
      title: "Promoting Legally Empowered Communities",
      description: "We empower citizens to know and use the law through legal education, awareness campaigns, and rights-based dialogue. Community paralegals are the frontline agents of change.",
      stats: "184 Communities",
      color: "secondary-teal",
      gradient: "from-secondary-teal to-secondary-teal/80",
      link: "/focus-areas/empowered-communities"
    },
    {
      icon: Shield,
      number: "03",
      title: "Enhancing a Conducive Environment for Sustainable Access to Justice", 
      description: "We strengthen the legal ecosystem by influencing policy reforms, building institutional capacity, and advocating for inclusive laws that support sustainable access to justice.",
      stats: "15+ Policy Reforms",
      color: "secondary-orange",
      gradient: "from-secondary-orange to-secondary-orange/80",
      link: "/focus-areas/conducive-environment"
    },
    {
      icon: Building,
      number: "04",
      title: "Institutional Development and Sustainability",
      description: "We invest in the resilience of LSF and the wider legal aid sector by enhancing operational systems, partner capacity, and financial sustainability.",
      stats: "200+ Partners",
      color: "secondary-yellow",
      gradient: "from-secondary-yellow to-secondary-yellow/80",
      link: "/focus-areas/institutional-development"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-48 h-48 bg-secondary-orange/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-secondary-yellow/20 rounded-full blur-3xl"></div>
      </div>

      <Container size="xl" className="relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 rounded-full px-8 py-3 mb-6 border border-white/20">
            <Target className="h-6 w-6 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
              STRATEGIC FOCUS AREAS
            </Typography>
          </div>
          <Typography variant="h1" className="mb-4 text-5xl md:text-6xl font-bold">
            Four Enduring Pillars of 
            <span className="block text-secondary-orange">Systemic Change</span>
          </Typography>
          <Typography variant="body" className="text-white/80 max-w-3xl mx-auto text-lg">
            Our work is structured around four strategic pillars that drive meaningful, systemic change across Tanzania's justice landscape.
          </Typography>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: Scale, value: "4K+", label: "Paralegals Trained", color: "text-secondary-orange", bg: "from-secondary-orange/20 to-secondary-orange/40" },
            { icon: Users, value: "168", label: "Communities Served", color: "text-secondary-teal", bg: "from-secondary-teal/20 to-secondary-teal/40" },
            { icon: TrendingUp, value: "15+", label: "Policy Reforms", color: "text-secondary-yellow", bg: "from-secondary-yellow/20 to-secondary-yellow/40" },
            { icon: Globe, value: "200+", label: "Strategic Partners", color: "text-white", bg: "from-white/20 to-white/40" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${stat.bg} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-white/70 text-sm uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Strategic Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {strategicAreas.map((area, idx) => (
            <Link key={idx} to={area.link} className="group h-full">
              <div className="flex flex-col justify-between bg-white/10 rounded-3xl border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden">
                
                {/* Card Header */}
                <div className={`bg-gradient-to-br ${area.gradient} p-8 relative`}>
                  <div className="absolute top-4 right-4 text-7xl font-black text-white/20">{area.number}</div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <area.icon className="h-8 w-8 text-white" />
                  </div>
                  <Typography variant="h3" className="text-white text-2xl font-bold mb-2">{area.title}</Typography>
                  <div className="bg-white/20 rounded-full px-5 py-2 text-sm font-semibold inline-block">{area.stats}</div>
                </div>

                {/* Card Content */}
                <div className="p-8 flex flex-col justify-between flex-1">
                  <Typography variant="body" className="text-white/90 mb-6">{area.description}</Typography>
                  <div className="flex items-center text-secondary-orange font-semibold">
                    <span className="mr-2">Explore Focus Area</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StrategicFocusSection;