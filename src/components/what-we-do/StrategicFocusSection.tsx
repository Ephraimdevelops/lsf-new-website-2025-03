
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-48 h-48 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-secondary-yellow/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <Target className="h-6 w-6 mr-4 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
              STRATEGIC FOCUS AREAS
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold text-white">
            Four Enduring Pillars of 
            <span className="block text-secondary-orange">Systemic Change</span>
          </Typography>
          
          <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-xl leading-relaxed mb-12">
            Our work is structured around four strategic pillars that drive meaningful, systemic change across Tanzania's justice landscape.
          </Typography>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-orange/20 to-secondary-orange/40 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Scale className="h-10 w-10 text-secondary-orange" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2 text-secondary-orange">4K+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Paralegals Trained</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-teal/20 to-secondary-teal/40 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-secondary-teal" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2 text-secondary-teal">184</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Communities Served</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-yellow/20 to-secondary-yellow/40 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-10 w-10 text-secondary-yellow" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2 text-secondary-yellow">15+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Policy Reforms</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/40 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2 text-white">200+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Strategic Partners</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {strategicAreas.map((area, index) => (
            <Link key={index} to={area.link} className="group block">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-white/20 h-full group-hover:-translate-y-4 relative">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Header with Number */}
                <div className={`bg-gradient-to-br ${area.gradient} p-8 relative overflow-hidden`}>
                  <div className="absolute top-4 right-4 text-8xl font-black text-white/20 group-hover:text-white/30 transition-colors duration-300">
                    {area.number}
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                      <area.icon className="h-10 w-10 text-white" />
                    </div>
                    <Typography variant="h3" className="text-white mb-4 leading-tight text-2xl">
                      {area.title}
                    </Typography>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-white/30">
                      <span className="text-white font-bold text-sm">{area.stats}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 relative">
                  <Typography variant="body" className="text-white/90 leading-relaxed mb-8 text-lg">
                    {area.description}
                  </Typography>
                  
                  <div className="flex items-center text-secondary-orange font-semibold group-hover:text-white transition-colors duration-300">
                    <span className="mr-3">Explore Focus Area</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-secondary-orange/20 to-secondary-teal/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/20 p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-orange/10 via-secondary-teal/10 to-secondary-yellow/10"></div>
            <div className="absolute top-4 left-4 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-40 h-40 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
                <Sparkles className="h-6 w-6 mr-4 text-secondary-orange" />
                <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
                  JOIN THE MISSION
                </Typography>
              </div>

              <Typography variant="h2" className="text-white mb-6 text-4xl md:text-5xl font-bold">
                Ready to Drive Change?
              </Typography>
              
              <Typography variant="body" className="text-white/90 mb-10 max-w-2xl mx-auto text-xl leading-relaxed">
                Partner with us to strengthen justice systems and empower communities across Tanzania.
              </Typography>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/opportunities">
                  <button className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-4 text-lg rounded-full shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center">
                    Explore Opportunities
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </button>
                </Link>
                
                <Link to="/contact">
                  <button className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-4 text-lg rounded-full shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center">
                    <Target className="mr-3 h-6 w-6" />
                    Partner With Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default StrategicFocusSection;
