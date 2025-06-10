
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Briefcase, Users, Scale, BookOpen, Megaphone, Globe, ArrowRight, Heart, Target, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const WhatWeDo = () => {
  const focusAreas = [
    {
      icon: Scale,
      title: "Legal Empowerment",
      description: "Empowering communities with legal knowledge and skills to claim their rights and access justice.",
      features: ["Paralegal Training", "Legal Literacy Programs", "Community Advocacy"],
      color: "primary",
      link: "/focus-areas/legal-empowerment"
    },
    {
      icon: Users,
      title: "Gender Justice",
      description: "Promoting gender equality and combating gender-based violence through legal reforms and community action.",
      features: ["Women's Rights Advocacy", "GBV Prevention", "Economic Empowerment"],
      color: "secondary-teal",
      link: "/focus-areas/gender-justice"
    },
    {
      icon: Globe,
      title: "Climate Justice",
      description: "Addressing climate change impacts on vulnerable communities through environmental law and advocacy.",
      features: ["Environmental Rights", "Climate Adaptation", "Policy Advocacy"],
      color: "secondary-orange",
      link: "/focus-areas/climate-justice"
    },
    {
      icon: BookOpen,
      title: "Legal Research",
      description: "Conducting evidence-based research to inform policy and improve legal service delivery.",
      features: ["Policy Analysis", "Impact Assessment", "Best Practices"],
      color: "secondary-yellow",
      link: "/focus-areas/legal-research"
    }
  ];

  const approaches = [
    {
      icon: Users,
      title: "Community-Based Approach",
      description: "Working directly with communities to build local capacity and sustainable solutions.",
      impact: "400,000+ people reached"
    },
    {
      icon: Megaphone,
      title: "Policy Advocacy",
      description: "Influencing legal and policy reforms to create systemic change.",
      impact: "15+ policy changes"
    },
    {
      icon: Target,
      title: "Strategic Partnerships",
      description: "Collaborating with government, civil society, and international partners.",
      impact: "50+ active partnerships"
    },
    {
      icon: Shield,
      title: "Rights Protection",
      description: "Defending human rights and providing legal protection to vulnerable groups.",
      impact: "10,000+ cases resolved"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Briefcase className="h-8 w-8" />}
        badge="What We Do"
        title="Transforming Lives Through Justice"
        description="We work across multiple domains to ensure that every Tanzanian has access to justice, legal protection, and the tools needed to claim their rights."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Focus Areas Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
              <Target className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                FOCUS AREAS
              </Typography>
            </div>
            
            <Typography variant="h2" className="mb-6">
              Where We Make Impact
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our work spans four critical areas that address the most pressing justice needs in Tanzania
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {focusAreas.map((area, index) => (
              <Link key={index} to={area.link} className="group">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-2 h-full">
                  {/* Header */}
                  <div className={`bg-gradient-to-br from-${area.color}/5 to-${area.color}/10 p-8 border-b border-gray-100`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br from-${area.color}/10 to-${area.color}/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <area.icon className={`h-8 w-8 text-${area.color}`} />
                      </div>
                      <Typography variant="h3" className="group-hover:text-secondary-teal transition-colors">
                        {area.title}
                      </Typography>
                    </div>
                    
                    <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                      {area.description}
                    </Typography>
                  </div>

                  {/* Features */}
                  <div className="p-8">
                    <Typography variant="h4" className="mb-4">
                      Key Activities:
                    </Typography>
                    
                    <ul className="space-y-3 mb-6">
                      {area.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-neutral-gray">
                          <div className={`w-2 h-2 bg-${area.color} rounded-full mr-3 flex-shrink-0`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center text-secondary-teal font-semibold group-hover:text-secondary-teal/80 transition-colors text-sm">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-6 py-3 mb-8">
              <Heart className="h-5 w-5 mr-3 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold">
                OUR APPROACH
              </Typography>
            </div>
            
            <Typography variant="h2" className="mb-6">
              How We Create Change
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our multi-faceted approach ensures sustainable impact and lasting transformation
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {approaches.map((approach, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-2 h-full">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <approach.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Typography variant="h3" className="mb-3 group-hover:text-secondary-teal transition-colors">
                        {approach.title}
                      </Typography>
                      <div className="bg-secondary-orange/10 text-secondary-orange px-3 py-1 rounded-full text-xs font-bold inline-block">
                        {approach.impact}
                      </div>
                    </div>
                  </div>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                    {approach.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-white">
        <Container size="xl">
          <div className="bg-gradient-to-br from-primary to-secondary-teal rounded-3xl shadow-2xl p-12 text-white">
            <div className="text-center mb-12">
              <Typography variant="h2" className="text-white mb-6">
                Our Impact in Numbers
              </Typography>
              <Typography variant="body" className="text-white/90">
                Real results from our commitment to justice and equality
              </Typography>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "426K+", label: "Lives Transformed", icon: Users },
                { number: "184", label: "Districts Reached", icon: Globe },
                { number: "96%", label: "Success Rate", icon: Target },
                { number: "15+", label: "Policy Changes", icon: Scale }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="h2" className="text-white mb-2">
                    {stat.number}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/80">
                    {stat.label}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container size="xl">
          <div className="text-center">
            <Typography variant="h2" className="mb-6">
              Ready to Make a Difference?
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray mb-12 max-w-2xl mx-auto">
              Join us in our mission to transform access to justice across Tanzania
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/programs">
                <Button size="lg" className="bg-primary hover:bg-primary-dark font-bold px-8 py-4">
                  Explore Our Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/opportunities">
                <Button size="lg" variant="outline" className="border-2 border-secondary-teal text-secondary-teal hover:bg-secondary-teal hover:text-white font-bold px-8 py-4">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default WhatWeDo;
