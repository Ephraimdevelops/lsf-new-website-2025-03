import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Scale, Users, Globe, Building2, Leaf, Smartphone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

// 4 Core Strategic Pillars (from LSF Annual Report 2024)
const corePillars = [
  {
    icon: Scale,
    number: '01',
    title: 'Increasing Accessibility to Quality Legal Aid Services',
    description: 'Prioritizing the provision of accessible, affordable, quality legal aid services to marginalized populations, with a strong emphasis on women and girls.',
    link: '/focus-areas/accessible-legal-aid',
    stats: '168 Districts Covered'
  },
  {
    icon: Users,
    number: '02',
    title: 'Promoting Legally Empowered Communities',
    description: 'Advancing community legal empowerment particularly for women, girls, and marginalized groups through legal education, awareness, and the strengthening of paralegal networks.',
    link: '/focus-areas/empowered-communities',
    stats: '4,000+ Paralegals'
  },
  {
    icon: Globe,
    number: '03',
    title: 'Enhancing a Conducive Environment for Sustainable Access to Justice',
    description: 'Supporting policy reform, legal frameworks, and advocacy initiatives that create enabling conditions for inclusive, sustainable, and equitable access to justice.',
    link: '/focus-areas/conducive-environment',
    stats: 'Legal Aid Act 2017'
  },
  {
    icon: Building2,
    number: '04',
    title: 'Institutional Development and Sustainability',
    description: 'Strengthening the organizational capacity, financial sustainability, and operational effectiveness of LSF and the broader legal aid sector to ensure long-term impact and resilience.',
    link: '/focus-areas/institutional-development',
    stats: '15 Years of Impact'
  }
];

// 2 Emerging Strategic Priorities (New for 2025)
const emergingPriorities = [
  {
    icon: Leaf,
    title: 'Climate Justice',
    description: 'Recognizing that climate change disproportionately affects women and marginalized communities, LSF is integrating climate justice into its programming. This includes legal empowerment on land rights, environmental governance, and climate-related disputes.',
    link: '/focus-areas/climate-justice',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Smartphone,
    title: 'Digital Transformation',
    description: 'Embracing innovation to modernize operations and expand reach. Efforts include the digitalization of legal aid service delivery, case tracking, training, and data systems to enhance accessibility and transparency.',
    link: '/focus-areas/digital-transformation',
    color: 'from-blue-500 to-indigo-600'
  }
];

const StrategicFocuses = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-gray-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/pattern-bg.png')", backgroundSize: '150px' }} />
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-orange/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 px-4 py-2">
              2022-2026 Strategic Plan
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Strategic Focus Areas
            </h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              Our work is organized around <strong>four core pillars</strong> that address the fundamental challenges
              in accessing justice across Tanzania, plus <strong>two emerging priorities</strong> for 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              Foundation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Four Core Strategic Pillars
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These interconnected pillars form the foundation of our strategic approach to legal empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {corePillars.map((pillar, index) => {
              const IconComponent = pillar.icon;
              return (
                <Link key={index} to={pillar.link} className="group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gray-50 hover:bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-5xl font-black text-gray-200 group-hover:text-primary/20 transition-colors">
                          {pillar.number}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                        {pillar.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 mb-6 leading-relaxed text-base">
                        {pillar.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2">
                          <span className="text-sm font-bold">{pillar.stats}</span>
                        </div>
                        <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform duration-300">
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emerging Priorities Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary-orange/20 text-secondary-orange text-sm font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              New for 2025
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Emerging Strategic Priorities
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Expanding our focus to address new challenges and opportunities in the access to justice landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {emergingPriorities.map((priority, index) => {
              const IconComponent = priority.icon;
              return (
                <Link key={index} to={priority.link} className="group">
                  <div className={`relative h-full rounded-3xl overflow-hidden bg-gradient-to-br ${priority.color} p-8 hover:scale-[1.02] transition-all duration-300`}>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/pattern-bg.png')", backgroundSize: '100px' }} />

                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{priority.title}</h3>
                      <p className="text-white/90 leading-relaxed mb-6">{priority.description}</p>
                      <div className="flex items-center text-white font-bold group-hover:translate-x-2 transition-transform duration-300">
                        Learn More
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Want to Learn More About Our Strategy?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Download our 2022-2026 Strategic Plan or contact us to discuss partnership opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/publications">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-full transition-all">
                Download Strategic Plan
              </button>
            </Link>
            <Link to="/contact">
              <button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-4 rounded-full transition-all">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StrategicFocuses;