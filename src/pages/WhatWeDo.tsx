
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicFocusSection from '../components/what-we-do/StrategicFocusSection';
import ProjectsCarousel from '../components/what-we-do/ProjectsCarousel';
import StrategicPartnershipsSection from '../components/what-we-do/StrategicPartnershipsSection';
import SuccessStoriesSection from '../components/what-we-do/SuccessStoriesSection';
import ResourcesToolsSection from '../components/what-we-do/ResourcesToolsSection';
import Breadcrumb from '../components/shared/Breadcrumb';
import { Container, Heading, Text } from '../components/design-system';
import Card from '../components/shared/Card';
import { Button } from '../components/ui/button';
import { 
  DollarSign, 
  Users, 
  Network, 
  BookOpen, 
  Megaphone, 
  ArrowRight,
  Target,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatWeDo = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const whatWeDoAreas = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Grant Making",
      description: "Results-driven grants to strengthen legal empowerment around land rights, property ownership, and justice for women and girls.",
      link: "/what-we-do/grant-making",
      stats: "$2.5M+ Distributed",
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Capacity Building",
      description: "Training and strengthening local organizations and paralegals to expand access to legal aid services.",
      link: "/what-we-do/capacity-building",
      stats: "4,000+ Trained",
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <Network className="h-6 w-6" />,
      title: "Partnerships & Networking",
      description: "Building strategic alliances with civil society, government, and international partners.",
      link: "/what-we-do/partnerships-networking",
      stats: "200+ Partners",
      color: "from-primary to-primary-dark"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Learning & Research",
      description: "Generating evidence and insights to inform policy and improve legal aid delivery.",
      link: "/what-we-do/learning-research",
      stats: "50+ Studies",
      color: "from-secondary-yellow to-secondary-yellow/80"
    },
    {
      icon: <Megaphone className="h-6 w-6" />,
      title: "Policy & Advocacy",
      description: "Influencing policy frameworks and legal systems to create enabling environments for justice.",
      link: "/what-we-do/policy-advocacy",
      stats: "15+ Policies",
      color: "from-green-500 to-green-600"
    }
  ];

  const impactStats = [
    { value: "2.8M+", label: "Tanzanians Reached", change: "+12%" },
    { value: "78%", label: "Cases Resolved", change: "+8%" },
    { value: "31", label: "Regions Covered", change: "+3" },
    { value: "85%", label: "Community Satisfaction", change: "+5%" }
  ];

  return (
    <Layout>
      {/* Modern Breadcrumb Section */}
      <section className="bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100">
        <Container size="xl" className="py-4">
          <Breadcrumb />
        </Container>
      </section>
      
      <WhatWeDoHero />
      
      {/* Enhanced Overview Section */}
      <section className="py-20 bg-gradient-to-br from-white via-neutral-50/30 to-white relative overflow-hidden">
        {/* Modern background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,30,92,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(89,181,176,0.03)_0%,transparent_50%)]"></div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary-teal/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <Target className="h-5 w-5 mr-3 text-primary" />
              <Text variant="overline" className="text-primary font-bold tracking-wider">
                OUR STRATEGIC APPROACH
              </Text>
            </div>
            <Heading variant="section" className="mb-8 text-5xl md:text-6xl font-bold">
              Five Pillars of
              <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                Legal Empowerment
              </span>
            </Heading>
            <Text variant="body" className="text-neutral-600 max-w-4xl mx-auto text-lg leading-relaxed">
              Our comprehensive approach combines strategic grant-making, capacity building, partnerships, 
              research, and advocacy to create lasting change in Tanzania's justice landscape.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {whatWeDoAreas.map((area, index) => (
              <Card key={index} className="group overflow-hidden bg-white hover:scale-[1.02] transition-all duration-300 border-0 shadow-sm hover:shadow-md">
                <div className={`bg-gradient-to-br ${area.color} p-8 relative`}>
                  <div className="absolute top-6 right-6 text-3xl font-black text-white/15">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">
                        {area.icon}
                      </div>
                    </div>
                    <Heading variant="card" className="text-white mb-3 text-xl">
                      {area.title}
                    </Heading>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-white/80" />
                      <Text variant="body-small" className="text-white/90 font-semibold">
                        {area.stats}
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <Text variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                    {area.description}
                  </Text>
                  <Link to={area.link}>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-secondary-teal font-semibold group-hover:translate-x-2 transition-all duration-300 flex items-center">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Enhanced Impact Stats */}
          <div className="bg-gradient-to-br from-white to-neutral-50/50 rounded-3xl p-12 border border-neutral-100/50 backdrop-blur-sm">
            <div className="text-center mb-12">
              <Heading variant="section" className="mb-6 text-4xl">
                Measurable Impact
              </Heading>
              <Text variant="body" className="text-neutral-600 text-lg">
                Our work creates tangible results across Tanzania's legal landscape
              </Text>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-2xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-semibold text-sm">{stat.change}</span>
                    </div>
                  </div>
                  <div className="text-neutral-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      
      <StrategicFocusSection />
      <SuccessStoriesSection />
      <StrategicPartnershipsSection />
      <ResourcesToolsSection />
      <ProjectsCarousel />
      
      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        {/* Modern background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(89,181,176,0.1)_0%,transparent_50%)]"></div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
              <Heart className="h-5 w-5 mr-3 text-secondary-orange" />
              <Text variant="overline" className="text-secondary-orange font-bold tracking-wider">
                JOIN OUR MISSION
              </Text>
            </div>
            <Heading variant="section" className="mb-8 text-white text-5xl">
              Partner With Us for Justice
            </Heading>
            <Text variant="body" className="text-white/90 mb-12 max-w-3xl mx-auto text-lg leading-relaxed">
              Join our mission to strengthen legal empowerment across Tanzania. 
              Whether you're seeking legal assistance or want to support our work, we're here to collaborate.
            </Text>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
                  Partner With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/legal-help">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
                  Get Legal Help
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
