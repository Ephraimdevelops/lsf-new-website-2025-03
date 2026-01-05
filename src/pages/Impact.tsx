import { Link } from 'react-router-dom';
import {
  Users, Globe, Scale, MapPin, TrendingUp, Heart, Award, Smartphone,
  ArrowRight, CheckCircle2, BarChart3, Shield, Home, Baby, Briefcase,
  Building, Vote, Wallet, Download, MessageSquare
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import { Button } from '../components/ui/button';
import CinematicHero from '@/components/shared/CinematicHero';

const Impact = () => {
  // Headline Stats
  const headlineStats = [
    { value: '6.5M+', label: 'Tanzanians Reached', description: 'With legal education and awareness since inception', icon: <Users className="h-8 w-8" /> },
    { value: '4,000+', label: 'Paralegals Deployed', description: 'Actively serving across 184 Districts', icon: <Scale className="h-8 w-8" /> },
    { value: '680,000+', label: 'Legal Aid Recipients', description: 'Indigent people received direct legal assistance', icon: <Shield className="h-8 w-8" /> },
    { value: '100%', label: 'National Coverage', description: 'Of Tanzania\'s regions covered by paralegal units', icon: <Globe className="h-8 w-8" /> },
  ];

  // Access to Justice Stats
  const accessStats = {
    resolution: '62%',
    savings: 'TZS 4B',
    caseTypes: [
      { type: 'Family/Matrimonial', percent: 45, description: 'Inheritance, Divorce, Child Maintenance', color: 'bg-secondary-orange' },
      { type: 'Land Disputes', percent: 30, description: 'Property and land rights cases', color: 'bg-secondary-teal' },
      { type: 'Gender-Based Violence', percent: 15, description: 'Civil aspects of GBV cases', color: 'bg-primary' },
      { type: 'Other', percent: 10, description: 'Labor, Contract, Criminal', color: 'bg-neutral-500' },
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
  ];

  // Digital Stats
  const digitalStats = [
    { value: '45,000+', label: 'App Users', description: 'Unique downloads of Haki Yangu app', icon: <Download className="h-6 w-6" /> },
    { value: '15%', label: 'Digital Intake', description: 'Of total cases via App/SMS channels', icon: <MessageSquare className="h-6 w-6" /> },
  ];

  return (
    <Layout>
      <CinematicHero
        title="Real Change, Real Impact"
        badge="Measuring Success"
        description="See how we are transforming lives and expanding access to justice across Tanzania through measurable, community-driven action."
        backgroundImage="/lovable-uploads/impact-hero-bg.png"
      />

      {/* HEADLINE STATS SECTION */}
      <section className="py-12 bg-neutral-900 -mt-2 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {headlineStats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-secondary-orange/50 transition-all hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-secondary-orange/20 rounded-2xl flex items-center justify-center mb-6 text-secondary-orange group-hover:bg-secondary-orange group-hover:text-white transition-all">
                  {stat.icon}
                </div>
                <p className="text-4xl lg:text-5xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-secondary-orange font-bold text-lg mb-2">{stat.label}</p>
                <p className="text-white/60 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCESS TO JUSTICE SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
              <Scale className="h-4 w-4" />
              Access to Justice
            </div>
            <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Systemic Efficiency
            </Typography>
            <p className="text-neutral-600 text-lg max-w-3xl mx-auto">
              Our paralegals are saving the government money and reducing court backlog through community-level dispute resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Resolution Rate */}
            <div className="text-center lg:text-left">
              <p className="text-8xl md:text-9xl font-black text-primary mb-4">{accessStats.resolution}</p>
              <Typography variant="h3" className="text-2xl font-bold text-neutral-900 mb-4">
                Community Resolution Rate
              </Typography>
              <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                Of disputes reported to paralegals are resolved at the community level through Alternative Dispute Resolution (ADR), preventing them from clogging the court system.
              </p>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                <CheckCircle2 className="h-5 w-5" />
                Reduced court backlog significantly
              </div>
            </div>

            {/* Cost Savings */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-10 text-white text-center">
              <Award className="h-12 w-12 mx-auto mb-6 text-secondary-orange" />
              <p className="text-6xl md:text-7xl font-black mb-4">{accessStats.savings}</p>
              <p className="text-xl font-bold text-secondary-orange mb-4">Estimated Savings</p>
              <p className="text-white/80 leading-relaxed">
                Saved in potential litigation costs for the judiciary due to paralegal intervention.
              </p>
            </div>
          </div>

          {/* Case Types Breakdown */}
          <div className="bg-neutral-50 rounded-3xl p-10">
            <Typography variant="h3" className="text-2xl font-bold text-neutral-900 mb-8 text-center">
              Case Types Handled
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessStats.caseTypes.map((caseType, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${caseType.color} rounded-xl flex items-center justify-center text-white font-black text-xl`}>
                      {caseType.percent}%
                    </div>
                  </div>
                  <p className="font-bold text-neutral-900 mb-2">{caseType.type}</p>
                  <p className="text-neutral-500 text-sm">{caseType.description}</p>
                  {/* Progress bar */}
                  <div className="mt-4 bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${caseType.color}`} style={{ width: `${caseType.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SAUTI YA MWANAMKE SECTION */}
      <section className="py-24 bg-gradient-to-br from-secondary-orange via-secondary-orange to-secondary-orange-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-white/80 font-bold text-sm uppercase tracking-widest mb-4">
                <Heart className="h-4 w-4" />
                Sauti ya Mwanamke
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-6">
                Women's Rights Impact
              </Typography>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                Our flagship program amplifies women's voices and delivers tangible results in protecting their rights and recovering their assets.
              </p>
              <Link to="/programs/sauti-ya-mwanamke">
                <Button size="lg" className="bg-white text-secondary-orange hover:bg-white/90 font-bold px-8 py-5 rounded-full">
                  Explore Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {sautiStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <p className="text-3xl md:text-4xl font-black mb-1">{stat.value}</p>
                  <p className="text-white font-semibold mb-1">{stat.label}</p>
                  <p className="text-white/70 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WANAWAKE TUNAWEZA SECTION */}
      <section className="py-24 bg-secondary-teal text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 gap-6">
                {tunawezaStats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex items-center gap-6">
                    <div className="w-16 h-16 bg-secondary-yellow rounded-2xl flex items-center justify-center text-black flex-shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-3xl font-black mb-1">{stat.value}</p>
                      <p className="text-white font-semibold">{stat.label}</p>
                      <p className="text-white/70 text-sm">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-secondary-yellow font-bold text-sm uppercase tracking-widest mb-4">
                <Award className="h-4 w-4" />
                Wanawake Tunaweza
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-6">
                Leadership & Governance
              </Typography>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                Empowering women to move from the back of the room to the head of the table. Our leadership program is reshaping local governance across Tanzania.
              </p>
              <Link to="/programs/wanawake-tunaweza">
                <Button size="lg" className="bg-secondary-yellow text-black hover:bg-secondary-yellow/90 font-bold px-8 py-5 rounded-full">
                  Explore Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HAKI YANGU DIGITAL SECTION */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-secondary-teal font-bold text-sm uppercase tracking-widest mb-4">
              <Smartphone className="h-4 w-4" />
              Haki Yangu Platform
            </div>
            <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-6">
              Justice Goes Digital
            </Typography>
            <p className="text-white/80 text-lg leading-relaxed">
              We're modernizing access to justice. The Haki Yangu app provides discreet reporting, legal information, and connects users directly to paralegals.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-3xl mx-auto">
            {digitalStats.map((stat, index) => (
              <div key={index} className="flex-1 bg-gradient-to-br from-secondary-teal to-secondary-teal-dark rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {stat.icon}
                </div>
                <p className="text-5xl md:text-6xl font-black mb-2">{stat.value}</p>
                <p className="text-secondary-yellow font-bold text-lg mb-2">{stat.label}</p>
                <p className="text-white/70">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60 text-sm">Increasing accessibility for youth and remote communities</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Partner in Our Impact
            </Typography>
            <p className="text-neutral-600 text-lg mb-10 max-w-2xl mx-auto">
              Every statistic represents a life transformed. Join us in expanding access to justice for millions more Tanzanians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-bold px-10 py-5 rounded-full text-lg">
                  Support Our Work
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/publications">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-lg">
                  Download Impact Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Impact;