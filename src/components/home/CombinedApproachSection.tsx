
import { Link } from 'react-router-dom';
import { Scale, Users, Shield, Building, ArrowRight, Target } from 'lucide-react';
import { Section, Container, Heading, Text } from '../design-system';

const CombinedApproachSection = () => {
  const focusAreas = [
    {
      icon: Scale,
      title: "Quality Legal Aid",
      description: "Breaking barriers to justice with accessible, affordable legal aid—empowering 4,000+ paralegals across 184 communities.",
      stats: "4,000+ Paralegals",
      color: "primary",
      link: "/focus-areas/accessible-legal-aid"
    },
    {
      icon: Users,
      title: "Community Empowerment", 
      description: "Building legal knowledge from the ground up through strategic projects and community-driven training programs.",
      stats: "184 Communities",
      color: "secondary-teal",
      link: "/focus-areas/empowered-communities"
    },
    {
      icon: Shield,
      title: "Policy & Justice Reform",
      description: "Driving systemic change through evidence-based advocacy and comprehensive policy reform initiatives.",
      stats: "15+ Policy Reforms",
      color: "secondary-orange",
      link: "/focus-areas/conducive-environment"
    },
    {
      icon: Building,
      title: "Strategic Partnerships",
      description: "Amplifying impact through diverse partnerships with organizations bridging grassroots efforts with national policy.",
      stats: "200+ Partners",
      color: "secondary-yellow",
      link: "/focus-areas/institutional-development"
    }
  ];

  return (
    <Container size="xl">
      {/* Clean, centered header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-white rounded-full px-6 py-3 mb-6 shadow-sm border border-neutral-100">
          <Target className="h-5 w-5 mr-3 text-primary" />
          <Text variant="overline" className="text-primary font-bold text-sm">
            OUR STRATEGIC FOCUS
          </Text>
        </div>
        
        <Heading variant="hero" className="mb-6 font-heading text-4xl md:text-5xl">
          Four Pillars of 
          <span className="block text-primary mt-2">Legal Transformation</span>
        </Heading>
        
        <Text variant="body-large" color="neutral" className="max-w-3xl mx-auto text-lg leading-relaxed">
          Our comprehensive approach combines strategic focus areas with proven methodologies—
          from grant management to community empowerment, policy advocacy to lasting partnerships.
        </Text>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-primary mb-2">USD 47M+</div>
          <div className="text-sm text-neutral-600 font-medium">Managed</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-secondary-teal mb-2">4K+</div>
          <div className="text-sm text-neutral-600 font-medium">Paralegals</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-secondary-orange mb-2">184</div>
          <div className="text-sm text-neutral-600 font-medium">Communities</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <div className="text-3xl font-bold text-secondary-yellow mb-2">200+</div>
          <div className="text-sm text-neutral-600 font-medium">Partners</div>
        </div>
      </div>

      {/* Focus areas grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {focusAreas.map((area, index) => (
          <Link key={index} to={area.link} className="group block">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 h-full group-hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 bg-${area.color} rounded-lg flex items-center justify-center`}>
                  <area.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`bg-${area.color}/10 text-${area.color} px-3 py-1 rounded-full text-sm font-semibold`}>
                  {area.stats}
                </div>
              </div>

              <Heading variant="h4" className="text-neutral-800 mb-3 group-hover:text-primary transition-colors">
                {area.title}
              </Heading>

              <Text variant="body" className="text-neutral-600 leading-relaxed mb-6">
                {area.description}
              </Text>
              
              <div className="flex items-center text-primary font-semibold group-hover:text-secondary-teal transition-colors">
                <span className="mr-2">Learn More</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to action */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-100">
          <Heading variant="section" className="mb-4 text-2xl">
            Ready to Make an Impact?
          </Heading>
          <Text variant="body" color="neutral" className="mb-6 max-w-2xl mx-auto">
            Join us in transforming lives through accessible justice. Explore our work, 
            partnership opportunities, and ways to get involved.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/what-we-do" 
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Explore Our Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CombinedApproachSection;
