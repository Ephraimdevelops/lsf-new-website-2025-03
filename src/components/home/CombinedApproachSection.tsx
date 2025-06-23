
import { Link } from 'react-router-dom';
import { Scale, Users, Shield, Building, DollarSign, Wrench, Megaphone, BookOpen, Globe, ArrowRight, Target, Sparkles } from 'lucide-react';
import { Section, Container, Heading, Text } from '../design-system';

const CombinedApproachSection = () => {
  const combinedAreas = [
    {
      icon: Scale,
      title: "Quality Legal Aid",
      subtitle: "Grant Making & Implementation",
      description: "Breaking barriers to justice with accessible, affordable legal aid—empowering 4,000+ paralegals across 184 communities through proven fund management.",
      stats: "4,000+ Paralegals",
      color: "primary",
      gradient: "from-primary to-primary-dark",
      link: "/focus-areas/accessible-legal-aid"
    },
    {
      icon: Users,
      title: "Community Empowerment",
      subtitle: "Direct Implementation & Advocacy",
      description: "Building legal knowledge from the ground up through strategic projects like 'Sauti ya Mwanamke' and 'Wanawake Tunaweza'—training communities for sustainable change.",
      stats: "184 Communities",
      color: "secondary-teal",
      gradient: "from-secondary-teal to-secondary-teal/80",
      link: "/focus-areas/empowered-communities"
    },
    {
      icon: Shield,
      title: "Policy & Justice Reform",
      subtitle: "Research & Policy Influence",
      description: "Driving systemic change through the Legal Aid Act, Mama Samia Campaign, and evidence-based advocacy for long-term institutional impact.",
      stats: "15+ Policy Reforms",
      color: "secondary-orange",
      gradient: "from-secondary-orange to-secondary-orange/80",
      link: "/focus-areas/conducive-environment"
    },
    {
      icon: Building,
      title: "Strategic Partnerships",
      subtitle: "Networking & Sustainability",
      description: "Amplifying impact through diverse partnerships with 200+ organizations—bridging grassroots efforts with national policy for lasting change.",
      stats: "200+ Partners",
      color: "secondary-yellow",
      gradient: "from-secondary-yellow to-secondary-yellow/80",
      link: "/focus-areas/institutional-development"
    }
  ];

  return (
    <Section variant="default" size="xl" className="relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-teal/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary-orange/2 rounded-full blur-3xl"></div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-neutral-100/50">
            <Target className="h-5 w-5 mr-4 text-primary" />
            <Text variant="overline" className="text-primary font-bold text-sm tracking-wider">
              OUR INTEGRATED APPROACH
            </Text>
          </div>
          
          <Heading variant="hero" className="mb-6 font-heading text-4xl md:text-5xl lg:text-6xl">
            Four Pillars of 
            <span className="block text-primary mt-2">Legal Transformation</span>
          </Heading>
          
          <Text variant="body-large" color="neutral" className="max-w-4xl mx-auto leading-relaxed text-lg mb-8">
            Our comprehensive methodology combines strategic focus areas with proven approaches—from grant management 
            to direct implementation, policy advocacy to community empowerment.
          </Text>

          {/* Key stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">USD 47M+</div>
              <div className="text-sm text-neutral-600">Managed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary-teal mb-1">4K+</div>
              <div className="text-sm text-neutral-600">Paralegals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary-orange mb-1">184</div>
              <div className="text-sm text-neutral-600">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary-yellow mb-1">200+</div>
              <div className="text-sm text-neutral-600">Partners</div>
            </div>
          </div>
        </div>

        {/* Combined approach grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {combinedAreas.map((area, index) => (
            <Link key={index} to={area.link} className="group block">
              <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 border border-neutral-100 h-full group-hover:-translate-y-2 relative overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Icon and title section */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${area.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <area.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <Heading variant="h4" className="text-neutral-800 mb-1 group-hover:text-primary transition-colors duration-300">
                          {area.title}
                        </Heading>
                        <Text variant="caption" className="text-neutral-500 font-medium uppercase tracking-wider">
                          {area.subtitle}
                        </Text>
                      </div>
                    </div>
                    
                    {/* Stats badge */}
                    <div className={`bg-gradient-to-br ${area.gradient} text-white px-4 py-2 rounded-full text-sm font-bold`}>
                      {area.stats}
                    </div>
                  </div>

                  {/* Description */}
                  <Text variant="body" className="text-neutral-600 leading-relaxed mb-6">
                    {area.description}
                  </Text>
                  
                  {/* CTA */}
                  <div className="flex items-center text-primary font-semibold group-hover:text-secondary-teal transition-colors duration-300">
                    <span className="mr-3">Explore This Pillar</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Methodology showcase */}
        <div className="bg-gradient-to-br from-neutral-50 to-white rounded-3xl p-12 border border-neutral-100 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-40 h-40 bg-secondary-teal/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 mb-6 border border-neutral-200">
              <Sparkles className="h-5 w-5 mr-3 text-secondary-orange" />
              <Text variant="overline" className="text-secondary-orange font-bold">
                PROVEN METHODOLOGY
              </Text>
            </div>
            
            <Heading variant="section" className="mb-4 text-3xl">
              Five Interconnected Approaches
            </Heading>
            
            <Text variant="body-large" color="neutral" className="max-w-3xl mx-auto mb-8">
              Each pillar is strengthened by our five core approaches: Grant Making, Direct Implementation, 
              Policy Advocacy, Research & Learning, and Strategic Partnerships.
            </Text>

            {/* Approach icons */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { icon: DollarSign, label: "Grant Making" },
                { icon: Wrench, label: "Implementation" },
                { icon: Megaphone, label: "Advocacy" },
                { icon: BookOpen, label: "Research" },
                { icon: Globe, label: "Partnerships" }
              ].map((approach, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="w-12 h-12 bg-white border border-neutral-200 rounded-xl flex items-center justify-center mb-2 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                    <approach.icon className="h-6 w-6 text-neutral-600 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <Text variant="caption" className="text-neutral-600 font-medium">
                    {approach.label}
                  </Text>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/what-we-do" className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1">
                Explore Our Methodology
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/focus-areas" className="inline-flex items-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1">
                View All Focus Areas
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CombinedApproachSection;
