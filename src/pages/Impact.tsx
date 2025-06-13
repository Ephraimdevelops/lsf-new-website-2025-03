
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Users, Scale, Heart, MapPin, Target, Award, 
  Globe, Briefcase, BookOpen, Shield, Lightbulb, ArrowRight,
  CheckCircle, Clock, Star, Calendar, Phone, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Impact = () => {
  const impactMetrics = [
    { value: "$47M+", label: "Disbursed as Grants", description: "Financial support to legal aid organizations", icon: Scale },
    { value: "105,562+", label: "Supported Groups", description: "Community organizations receiving assistance", icon: Users },
    { value: "426,349+", label: "Legal Aid Beneficiaries", description: "Individuals receiving direct legal support", icon: Heart },
    { value: "39.8M+", label: "Legal Education Beneficiaries", description: "People reached through awareness programs", icon: Globe }
  ];

  const strategicApproaches = [
    {
      title: "Grant Making",
      description: "Funding justice organizations to expand access",
      stats: { funded: "120+", amount: "$15M+", organizations: "85+" },
      impact: "Directly funded 85+ organizations across Tanzania",
      color: "from-primary to-primary-dark",
      icon: Scale
    },
    {
      title: "Capacity Building", 
      description: "Strengthening legal aid providers nationwide",
      stats: { trained: "4,000+", programs: "200+", districts: "150+" },
      impact: "Trained 4,000+ paralegals in 150+ districts",
      color: "from-secondary-teal to-secondary-teal/80",
      icon: Briefcase
    },
    {
      title: "Policy & Advocacy",
      description: "Driving systemic change through evidence",
      stats: { policies: "15+", reforms: "8", consultations: "50+" },
      impact: "Influenced 15+ policy changes and 8 major reforms",
      color: "from-secondary-orange to-secondary-orange/80",
      icon: Target
    },
    {
      title: "Learning & Research",
      description: "Evidence-based approaches to justice",
      stats: { studies: "25+", reports: "40+", briefs: "60+" },
      impact: "Published 40+ research reports and 60+ policy briefs",
      color: "from-secondary-green to-secondary-green/80",
      icon: BookOpen
    },
    {
      title: "Partnerships & Networking",
      description: "Building collaborative networks",
      stats: { partners: "200+", networks: "12", coalitions: "8" },
      impact: "Facilitated 200+ partnerships across 12 networks",
      color: "from-secondary-yellow to-secondary-yellow/80",
      icon: Users
    },
    {
      title: "Digital Innovation",
      description: "Technology-driven access to justice",
      stats: { users: "50K+", downloads: "100K+", queries: "25K+" },
      impact: "Reached 50K+ users through digital platforms",
      color: "from-purple-500 to-purple-700",
      icon: Lightbulb
    }
  ];

  const reachData = [
    { region: "Northern Tanzania", districts: 47, population: "8.2M", coverage: 89 },
    { region: "Central Tanzania", districts: 52, population: "6.8M", coverage: 94 },
    { region: "Southern Tanzania", districts: 48, population: "7.1M", coverage: 87 },
    { region: "Eastern Tanzania", districts: 37, population: "5.9M", coverage: 92 }
  ];

  const paralegalNetwork = [
    { category: "Community Paralegals", count: "2,800+", description: "Grassroots legal aid providers" },
    { category: "Ward Tribunals", count: "1,200+", description: "Local dispute resolution bodies" },
    { category: "Legal Aid Centers", count: "150+", description: "Permanent service points" },
    { category: "Mobile Clinics", count: "80+", description: "Reaching remote communities" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<TrendingUp className="h-8 w-8" />}
        badge="Our Impact"
        title="Transforming Lives Through Justice"
        description="A comprehensive look at how we're creating lasting change across Tanzania through strategic interventions, community empowerment, and systemic reform."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Impact Story Introduction */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="mb-8">
              Our Story in Numbers
            </Typography>
            <Typography variant="body" className="text-neutral-gray mb-12 text-xl leading-relaxed">
              Since 2011, we've been on a mission to ensure every Tanzanian has access to justice. 
              Here's how we're making that vision a reality through measurable impact and sustainable change.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactMetrics.map((metric, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                      <metric.icon className="h-8 w-8 text-primary" />
                    </div>
                    <Typography variant="h1" className="text-4xl text-primary mb-3">
                      {metric.value}
                    </Typography>
                    <Typography variant="h4" className="mb-3">
                      {metric.label}
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      {metric.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Strategic Approaches Deep Dive */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center mb-20">
            <Typography variant="overline" className="text-primary mb-4 block">
              HOW WE CREATE CHANGE
            </Typography>
            <Typography variant="h2" className="mb-8">
              Strategic Approaches & Impact
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Our six strategic approaches work in harmony to create comprehensive, sustainable change across Tanzania's justice landscape.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {strategicApproaches.map((approach, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3">
                  <div className={`absolute inset-0 bg-gradient-to-br ${approach.color} opacity-10`}></div>
                  
                  <div className="relative bg-white p-10 border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${approach.color} rounded-2xl flex items-center justify-center mr-6`}>
                        <approach.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <Typography variant="h3" className="mb-2">
                          {approach.title}
                        </Typography>
                        <Typography variant="bodySmall" className="text-neutral-gray">
                          {approach.description}
                        </Typography>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(approach.stats).map(([key, value], i) => (
                        <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                          <Typography variant="h3" className="text-2xl text-primary mb-1">
                            {value}
                          </Typography>
                          <Typography variant="small" className="text-neutral-gray capitalize">
                            {key}
                          </Typography>
                        </div>
                      ))}
                    </div>

                    {/* Impact Statement */}
                    <div className="bg-primary/5 rounded-xl p-6 mb-6">
                      <Typography variant="body" className="text-primary font-medium">
                        {approach.impact}
                      </Typography>
                    </div>

                    {/* Learn More Link */}
                    <Link to={`/what-we-do/${approach.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                        Learn More About {approach.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Geographic Reach Visualization */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Our Reach Across Tanzania
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              From bustling cities to remote villages, our network spans all regions of Tanzania, ensuring justice reaches every corner of the nation.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Tanzania Map Visualization */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-12 text-center">
                <MapPin className="h-32 w-32 text-primary mx-auto mb-8" />
                <Typography variant="h3" className="mb-4">
                  National Coverage
                </Typography>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <Typography variant="h1" className="text-4xl text-primary mb-2">184</Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">Districts Covered</Typography>
                  </div>
                  <div className="text-center">
                    <Typography variant="h1" className="text-4xl text-secondary-teal mb-2">91%</Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">National Coverage</Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Breakdown */}
            <div className="space-y-6">
              {reachData.map((region, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <Typography variant="h4">{region.region}</Typography>
                    <div className="text-right">
                      <Typography variant="h3" className="text-primary">{region.coverage}%</Typography>
                      <Typography variant="small" className="text-neutral-gray">Coverage</Typography>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Typography variant="bodySmall" className="text-neutral-gray mb-1">Districts</Typography>
                      <Typography variant="h4">{region.districts}</Typography>
                    </div>
                    <div>
                      <Typography variant="bodySmall" className="text-neutral-gray mb-1">Population</Typography>
                      <Typography variant="h4">{region.population}</Typography>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary-teal rounded-full transition-all duration-1000"
                      style={{ width: `${region.coverage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Paralegal Network */}
      <section className="py-24 bg-gradient-to-br from-secondary-teal/10 to-primary/10">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Our Paralegal Network
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              The backbone of our impact - a comprehensive network of trained paralegals and legal service points bringing justice to every community.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paralegalNetwork.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 text-center border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary-teal to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="h1" className="text-4xl text-primary mb-3">
                    {item.count}
                  </Typography>
                  <Typography variant="h4" className="mb-3">
                    {item.category}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {item.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Success Stories Highlight */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="mb-8">
              Real Stories, Real Impact
            </Typography>
            <Typography variant="body" className="text-neutral-gray mb-12 text-xl">
              Behind every statistic is a human story. Meet some of the heroes whose lives have been transformed through access to justice.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-primary/5 to-white rounded-2xl p-8 text-center">
                <Award className="h-16 w-16 text-primary mx-auto mb-6" />
                <Typography variant="h3" className="mb-4">96% Success Rate</Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  Of cases resolved favorably through our paralegal network
                </Typography>
              </div>
              <div className="bg-gradient-to-br from-secondary-teal/5 to-white rounded-2xl p-8 text-center">
                <Heart className="h-16 w-16 text-secondary-teal mx-auto mb-6" />
                <Typography variant="h3" className="mb-4">15,000+ Lives</Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  Directly transformed through our comprehensive programs
                </Typography>
              </div>
              <div className="bg-gradient-to-br from-secondary-orange/5 to-white rounded-2xl p-8 text-center">
                <Shield className="h-16 w-16 text-secondary-orange mx-auto mb-6" />
                <Typography variant="h3" className="mb-4">24/7 Support</Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  Round-the-clock legal assistance through our helpline
                </Typography>
              </div>
            </div>

            <Link to="/heroes">
              <Button size="lg" className="bg-primary hover:bg-primary-dark font-bold px-8 py-4">
                Read Success Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary-teal text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-white mb-8">
              Join Our Impact Story
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 text-xl">
              Every donation, partnership, and voice raised for justice contributes to the transformation you see here. Be part of building a more just Tanzania.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/donate">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                  Support Our Work
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                  Partner With Us
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" className="w-full bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4">
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

export default Impact;
