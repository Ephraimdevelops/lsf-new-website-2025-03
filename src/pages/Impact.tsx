import { Link } from 'react-router-dom';
import {
  Users, Globe, Scale, TrendingUp, Heart, Award, Smartphone,
  ArrowRight, CheckCircle2, BarChart3, Shield, Home, Baby,
  Building, Vote, Wallet, Download, MessageSquare, Target, Sparkles, Map
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import ImpactPageHero from '@/components/impact/ImpactPageHero';
import ImpactTimeline from '@/components/impact/ImpactTimeline';
import ImpactBento from '@/components/impact/ImpactBento';
import ImpactFeatures from '@/components/impact/ImpactFeatures';

const Impact = () => {
  // Headline Stats
  const headlineStats = [
    { value: '7,673,867', label: 'People Reached (2024)', description: 'With legal education (58% Women)', icon: <Users className="h-7 w-7" /> },
    { value: '26,451', label: 'Direct Legal Aid (2024)', description: 'Marginalized individuals served', icon: <Scale className="h-7 w-7" /> },
    { value: '1.65B', label: 'Assets Reclaimed (2024)', description: 'TZS (approx $600k) for women', icon: <Wallet className="h-7 w-7" /> },
    { value: '6,825', label: 'GBV Cases Resolved', description: 'In 2024 (Exceeded target of 6,500)', icon: <Shield className="h-7 w-7" /> },
  ];

  // Access to Justice Stats
  const accessStats = {
    resolution: '60%',
    savings: 'TZS 4B',
    caseTypes: [
      { type: 'Family/Matrimonial', percent: 45, description: 'Inheritance, Divorce, Child Maintenance', color: 'bg-primary' },
      { type: 'Land Disputes', percent: 30, description: 'Property and land rights cases', color: 'bg-primary/80' },
      { type: 'Gender-Based Violence', percent: 15, description: 'Civil aspects of GBV cases', color: 'bg-primary/60' },
      { type: 'Other', percent: 10, description: 'Labor, Contract, Criminal', color: 'bg-gray-400' },
    ],
  };

  // Sauti ya Mwanamke Stats
  const sautiStats = [
    { value: '58%', label: 'Women Clients', description: 'Of all legal aid clients are women', icon: <Users className="h-6 w-6" /> },
    { value: '12,500+', label: 'GBV Survivors', description: 'Accessed justice and psychosocial support', icon: <Shield className="h-6 w-6" /> },
    { value: 'TZS 1.2B+', label: 'Assets Recovered', description: 'For widows and single mothers disinherited', icon: <Home className="h-6 w-6" /> },
    { value: '18,000+', label: 'Children Supported', description: 'Secured child support through mediation', icon: <Baby className="h-6 w-6" /> },
  ];

  // Wanawake Tunaweza Stats
  const tunawezaStats = [
    { value: '2,200+', label: 'Women Candidates', description: 'Successfully ran for local government seats', icon: <Vote className="h-6 w-6" /> },
    { value: '35%', label: 'Tribunal Representation', description: 'Women in Ward Tribunals (up from <15%)', icon: <Building className="h-6 w-6" /> },
    { value: '850+', label: 'Groups Registered', description: 'Women\'s groups formalized legally', icon: <Wallet className="h-6 w-6" /> },
    { value: '87.3%', label: 'Decline in FGM', description: 'Reported in intervention areas', icon: <Shield className="h-6 w-6" /> },
  ];

  // Digital Stats
  const digitalStats = [
    { value: '45,000+', label: 'App Users', description: 'Unique downloads of Haki Yangu app', icon: <Download className="h-6 w-6" /> },
    { value: '15%', label: 'Digital Intake', description: 'Of total cases via App/SMS channels', icon: <MessageSquare className="h-6 w-6" /> },
  ];

  return (
    <Layout>
      <ImpactPageHero />
      <ImpactTimeline />
      {/* ACCESS TO JUSTICE SECTION - With Image */}
      <section className="py-20 bg-white relative overflow-hidden">
        <Container>
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Scale className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Access to Justice</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Systemic <span className="text-primary">Efficiency</span>
            </Typography>
            <p className="text-lg text-gray-600 max-w-2xl border-l-4 border-primary pl-6">
              Our paralegals are saving the government money and reducing court backlog through community-level dispute resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Resolution Rate with Image */}
            <div className="relative rounded-3xl overflow-hidden h-[400px]">
              <img
                src="/lovable-uploads/wanawake tunaweza beenficiaries.jpg"
                alt="Community justice"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-7xl md:text-8xl font-black mb-2">{accessStats.resolution}</p>
                <p className="text-xl font-bold mb-2">Community Resolution Rate</p>
                <p className="text-white/80">Disputes resolved at community level through ADR</p>
              </div>
            </div>

            {/* Cost Savings */}
            <div className="bg-primary rounded-3xl p-10 text-white">
              <Award className="h-12 w-12 mb-6 text-white/80" />
              <p className="text-6xl md:text-7xl font-black mb-4">{accessStats.savings}</p>
              <p className="text-xl font-bold text-white/90 mb-4">Estimated Government Savings</p>
              <p className="text-white/80 leading-relaxed mb-6">
                Saved in potential litigation costs for the judiciary due to paralegal intervention.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full font-bold">
                <CheckCircle2 className="h-5 w-5" />
                Reduced court backlog significantly
              </div>
            </div>
          </div>

          {/* Case Types Breakdown - Redesigned */}
          <div className="mt-16">
            <Typography variant="h3" className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
              Breakdown of <span className="text-primary">Cases Handled</span>
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessStats.caseTypes.map((caseType, index) => {
                // Map icons based on type directly for simplicity
                const getIcon = (type: string) => {
                  if (type.includes('Family')) return <Heart className="h-6 w-6" />;
                  if (type.includes('Land')) return <Map className="h-6 w-6" />;
                  if (type.includes('Violence')) return <Shield className="h-6 w-6" />;
                  return <Scale className="h-6 w-6" />;
                };

                return (
                  <div key={index} className="bg-gray-50 rounded-3xl p-8 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${caseType.color.replace('bg-', 'text-')}`}>
                      {getIcon(caseType.type)}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-5xl font-black ${caseType.color.replace('bg-', 'text-')} opacity-90`}>
                          {caseType.percent}
                        </span>
                        <span className="text-xl font-bold text-gray-400">%</span>
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{caseType.type}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 border-l-2 border-gray-200 pl-3">
                        {caseType.description}
                      </p>

                      {/* Visual Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${caseType.color} transition-all duration-1000 ease-out group-hover:scale-x-110 origin-left`}
                          style={{ width: `${caseType.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* SAUTI YA MWANAMKE SECTION - With Background Image */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/mwanamke shamba.png')" }}
        />
        <div className="absolute inset-0 bg-primary/90" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 mb-5">
                <Heart className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Sauti ya Mwanamke</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Women's Rights <span className="text-white">Impact</span>
              </Typography>
              <p className="text-white/80 text-lg leading-relaxed mb-8 border-l-4 border-white/30 pl-6">
                Our flagship program amplifies women's voices and delivers tangible results in protecting their rights and recovering their assets.
              </p>
              <Link to="/programs/sauti-ya-mwanamke">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-5 rounded-full">
                  Explore Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sautiStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 text-primary">
                    {stat.icon}
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white font-semibold mb-1">{stat.label}</p>
                  <p className="text-white/70 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <ImpactBento />

      {/* WANAWAKE TUNAWEZA SECTION */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 gap-4">
                {tunawezaStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-3xl font-black text-primary mb-1">{stat.value}</p>
                      <p className="text-gray-900 font-semibold">{stat.label}</p>
                      <p className="text-gray-500 text-sm">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
                <Award className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Wanawake Tunaweza</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Leadership & <span className="text-primary">Governance</span>
              </Typography>
              <p className="text-lg text-gray-600 mb-8 border-l-4 border-primary pl-6">
                Empowering women to move from the back of the room to the head of the table. Our leadership program is reshaping local governance across Tanzania.
              </p>
              <Link to="/programs/wanawake-tunaweza">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full">
                  Explore Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* HAKI YANGU DIGITAL SECTION */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/haki yangu app uzinuzi.webp')" }}
        />
        <div className="absolute inset-0 bg-black/80" />

        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Smartphone className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Haki Yangu Platform</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Justice Goes <span className="text-primary">Digital</span>
            </Typography>
            <p className="text-white/80 text-lg border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              We're modernizing access to justice. The Haki Yangu app provides discreet reporting, legal information, and connects users directly to paralegals.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-2xl mx-auto">
            {digitalStats.map((stat, index) => (
              <div key={index} className="flex-1 bg-primary rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                  {stat.icon}
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-white font-bold mb-2">{stat.label}</p>
                <p className="text-white/70 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Target className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Partner in Our <span className="text-primary">Impact</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10 border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              Every statistic represents a life transformed. Join us in expanding access to justice for millions more Tanzanians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Support Our Work
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/publications">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
                  Download Impact Reports
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