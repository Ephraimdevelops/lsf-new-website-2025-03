
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicFocusSection from '../components/what-we-do/StrategicFocusSection';
import ProjectsCarousel from '../components/what-we-do/ProjectsCarousel';
import Breadcrumb from '../components/shared/Breadcrumb';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
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
  Heart
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
    { value: "2.8M+", label: "Tanzanians Reached" },
    { value: "78%", label: "Cases Resolved" },
    { value: "31", label: "Regions Covered" },
    { value: "85%", label: "Community Satisfaction" }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>
      
      <WhatWeDoHero />
      
      {/* Interactive Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container size="xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <Target className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                OUR APPROACH
              </Typography>
            </div>
            <Typography variant="h1" className="mb-6 text-4xl md:text-5xl font-bold">
              Five Pillars of
              <span className="block text-primary">Legal Empowerment</span>
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg">
              Our comprehensive approach combines strategic grant-making, capacity building, partnerships, 
              research, and advocacy to create lasting change in Tanzania's justice landscape.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {whatWeDoAreas.map((area, index) => (
              <Card key={index} variant="elevated" hover className="group overflow-hidden">
                <div className={`bg-gradient-to-br ${area.color} p-6 relative`}>
                  <div className="absolute top-4 right-4 text-2xl font-bold text-white/20">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-white">
                        {area.icon}
                      </div>
                    </div>
                    <Typography variant="h4" className="text-white mb-2">
                      {area.title}
                    </Typography>
                    <Typography variant="bodySmall" className="text-white/90 font-medium">
                      {area.stats}
                    </Typography>
                  </div>
                </div>
                <div className="p-6">
                  <Typography variant="body" className="text-neutral-gray mb-4 leading-relaxed">
                    {area.description}
                  </Typography>
                  <Link to={area.link}>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-secondary-teal font-semibold group-hover:translate-x-1 transition-transform">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Impact Stats */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <Typography variant="h2" className="mb-4">
                Measurable Impact
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                Our work creates tangible results across Tanzania's legal landscape
              </Typography>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-neutral-gray text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      
      <StrategicFocusSection />
      <ProjectsCarousel />
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container size="xl">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 rounded-full px-6 py-3 mb-6">
              <Heart className="h-5 w-5 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold">
                GET INVOLVED
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6 text-white">
              Partner With Us for Justice
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join our mission to strengthen legal empowerment across Tanzania. 
              Whether you're seeking legal assistance or want to support our work.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
                  Partner With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/legal-help">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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
