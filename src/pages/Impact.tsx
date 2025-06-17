
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/shared/HeroSection';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import TestimonialSection from '@/components/shared/TestimonialSection';
import AnimatedStats from '@/components/about/AnimatedStats';
import GetInvolvedCTA from '@/components/what-we-do/GetInvolvedCTA';
import { BarChart, TrendingUp, Users, MapPin, Scale, Award, Heart, Globe, Target, Zap, Shield, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Impact = () => {
  const impactAreas = [
    {
      title: "Legal Aid Access",
      description: "Dramatically increased access to quality legal aid services across Tanzania through strategic partnerships and innovative delivery models.",
      metrics: [
        { label: "People Served", value: "426,349+", change: "+23% from 2023" },
        { label: "Legal Aid Providers", value: "180+", change: "+15% from 2023" },
        { label: "Case Resolution Rate", value: "78%", change: "+5% from 2023" }
      ],
      icon: <Scale className="h-8 w-8" />,
      color: "from-primary to-primary-dark",
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=600&h=400&fit=crop"
    },
    {
      title: "Community Empowerment",
      description: "Strengthened community capacity to understand and claim legal rights through comprehensive training and awareness programs.",
      metrics: [
        { label: "Paralegals Trained", value: "2,500+", change: "+30% from 2023" },
        { label: "Communities Reached", value: "1,200+", change: "+25% from 2023" },
        { label: "Legal Literacy Rate", value: "65%", change: "+12% from 2023" }
      ],
      icon: <Users className="h-8 w-8" />,
      color: "from-secondary-teal to-secondary-teal/80",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop"
    },
    {
      title: "Policy Influence",
      description: "Successfully advocated for legal reforms that benefit vulnerable populations through evidence-based policy recommendations.",
      metrics: [
        { label: "Policy Reforms", value: "12", change: "+3 from 2023" },
        { label: "Government Partnerships", value: "25+", change: "+8 from 2023" },
        { label: "Legislative Changes", value: "5", change: "+2 from 2023" }
      ],
      icon: <Award className="h-8 w-8" />,
      color: "from-secondary-orange to-secondary-orange/80",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
    },
    {
      title: "Women's Rights",
      description: "Advanced gender equality through targeted legal empowerment initiatives focusing on property rights and gender-based violence.",
      metrics: [
        { label: "Women Beneficiaries", value: "62%", change: "+8% from 2023" },
        { label: "GBV Cases Resolved", value: "5,600+", change: "+18% from 2023" },
        { label: "Property Rights Claims", value: "3,200+", change: "+22% from 2023" }
      ],
      icon: <Heart className="h-8 w-8" />,
      color: "from-secondary-yellow to-secondary-yellow/80",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
    }
  ];

  const successStories = [
    {
      title: "Land Rights Victory in Mwanza",
      description: "Community paralegals helped 150 families secure land titles, protecting them from illegal evictions and enabling them to access credit for agricultural development.",
      image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&h=400&fit=crop",
      impact: "150 families secured land rights",
      location: "Mwanza Region",
      category: "Land Rights",
      stats: { families: 150, hectares: 2500, income: "+45%" }
    },
    {
      title: "Women's Cooperative Legal Support",
      description: "Legal aid enabled 80 women to formalize their cooperative business, access microfinance, and increase their collective income by 300%.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      impact: "300% income increase",
      location: "Dodoma Region",
      category: "Economic Rights",
      stats: { women: 80, cooperatives: 5, income: "+300%" }
    },
    {
      title: "Environmental Justice Advocacy",
      description: "Successful advocacy led to new environmental regulations protecting 5 communities from mining activities affecting their water sources.",
      image: "https://images.unsplash.com/photo-1569163163395-4d8b29d5be3c?w=600&h=400&fit=crop",
      impact: "5 communities protected",
      location: "Northern Tanzania",
      category: "Environmental Rights",
      stats: { communities: 5, people: 12000, sources: 8 }
    },
    {
      title: "Youth Legal Empowerment",
      description: "Trained 200 young advocates who now provide peer legal education in schools, reaching over 5,000 students across 12 regions.",
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop",
      impact: "5,000 students reached",
      location: "National Program",
      category: "Youth Rights",
      stats: { advocates: 200, students: 5000, schools: 50 }
    }
  ];

  const testimonials = [
    {
      quote: "Thanks to LSF's support, our organization has grown from serving 50 clients annually to over 2,000. The capacity building and funding have been transformational.",
      author: "Dr. Elizabeth Mwakatundu",
      role: "Executive Director",
      organization: "Arusha Legal Aid Network",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    },
    {
      quote: "The paralegal training changed my life. I've helped resolve over 100 family disputes and now serve as a bridge between my community and the formal justice system.",
      author: "Mwalimu Hassan",
      role: "Community Paralegal",
      organization: "Kilimanjaro Region",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    },
    {
      quote: "LSF's advocacy work directly contributed to the Legal Aid Act. This framework now ensures that legal aid is coordinated nationally and reaches those who need it most.",
      author: "Hon. Justice Stella Manyara",
      role: "High Court Judge",
      organization: "Judiciary of Tanzania",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba051ff?w=100&h=100&fit=crop&crop=faces",
      rating: 5
    }
  ];

  const regionalImpact = [
    { region: "Dar es Salaam", beneficiaries: 45000, providers: 25, color: "bg-gradient-to-br from-primary to-primary-dark", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop" },
    { region: "Mwanza", beneficiaries: 38000, providers: 18, color: "bg-gradient-to-br from-secondary-teal to-secondary-teal/80", image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300&h=200&fit=crop" },
    { region: "Arusha", beneficiaries: 32000, providers: 16, color: "bg-gradient-to-br from-secondary-orange to-secondary-orange/80", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop" },
    { region: "Dodoma", beneficiaries: 28000, providers: 14, color: "bg-gradient-to-br from-secondary-yellow to-secondary-yellow/80", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop" },
    { region: "Mbeya", beneficiaries: 25000, providers: 12, color: "bg-gradient-to-br from-green-500 to-green-600", image: "https://images.unsplash.com/photo-1569163163395-4d8b29d5be3c?w=300&h=200&fit=crop" },
    { region: "Morogoro", beneficiaries: 22000, providers: 11, color: "bg-gradient-to-br from-blue-500 to-blue-600", image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=300&h=200&fit=crop" }
  ];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>

      <HeroSection
        icon={<TrendingUp className="h-8 w-8" />}
        badge="OUR IMPACT"
        title="Measuring Change, Creating Lasting Impact"
        description="Over 15 years, we've transformed Tanzania's legal aid landscape through strategic interventions, innovative partnerships, and evidence-based advocacy that puts justice within reach of every citizen."
        backgroundImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop"
      />

      {/* Enhanced Overall Impact Stats */}
      <AnimatedStats />

      {/* Enhanced Impact Areas with Images and Better Visual Design */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <Target className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                IMPACT AREAS
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              Transforming Lives Through
              <span className="block text-primary">Strategic Interventions</span>
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our comprehensive approach addresses multiple dimensions of legal empowerment, 
              creating sustainable change that benefits individuals, communities, and the justice system as a whole.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {impactAreas.map((area, index) => (
              <Card key={index} variant="elevated" hover className="group overflow-hidden">
                <div className="relative">
                  <img 
                    src={area.image} 
                    alt={area.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${area.color} opacity-90`} />
                  <div className="absolute inset-0 flex items-end">
                    <div className="p-6 text-white w-full">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                          {area.icon}
                        </div>
                        <Typography variant="h3" className="text-white">
                          {area.title}
                        </Typography>
                      </div>
                      <Typography variant="bodySmall" className="text-white/90">
                        {area.description}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {area.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-primary/30 transition-colors">
                        <div>
                          <Typography variant="bodySmall" className="text-neutral-gray mb-1">
                            {metric.label}
                          </Typography>
                          <Typography variant="h4" className="text-neutral-dark">
                            {metric.value}
                          </Typography>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {metric.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Enhanced Regional Impact with Images */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-6 py-3 mb-6">
              <MapPin className="h-5 w-5 mr-3 text-secondary-teal" />
              <Typography variant="overline" className="text-secondary-teal font-bold">
                REGIONAL PRESENCE
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              Nationwide Impact Across Tanzania
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Our comprehensive reach ensures that legal aid and empowerment reaches every corner of the country
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regionalImpact.map((region, index) => (
              <Card key={index} variant="elevated" hover className="overflow-hidden group">
                <div className="relative">
                  <img 
                    src={region.image} 
                    alt={region.region}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${region.color} opacity-80`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <MapPin className="h-12 w-12 mx-auto mb-3" />
                      <Typography variant="h3" className="text-white mb-2">
                        {region.region}
                      </Typography>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <Typography variant="h4" className="text-primary mb-1">
                        {region.beneficiaries.toLocaleString()}
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray">
                        Beneficiaries
                      </Typography>
                    </div>
                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <Typography variant="h4" className="text-secondary-teal mb-1">
                        {region.providers}
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray">
                        Providers
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Enhanced Success Stories with Rich Visual Design */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-secondary-orange/10 rounded-full px-6 py-3 mb-6">
              <Award className="h-5 w-5 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold">
                SUCCESS STORIES
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              Real Lives, Real Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Behind every statistic is a human story of empowerment, justice, and hope. 
              These stories showcase the transformative power of accessible legal aid.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {successStories.map((story, index) => (
              <Card key={index} variant="elevated" hover className="group overflow-hidden">
                <div className="relative">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-2 rounded-full text-sm font-semibold">
                    {story.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Typography variant="h4" className="text-white mb-2">
                      {story.title}
                    </Typography>
                    <div className="flex items-center text-secondary-orange text-sm font-semibold">
                      <MapPin className="h-4 w-4 mr-1" />
                      {story.location}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                    {story.description}
                  </Typography>
                  
                  {/* Enhanced stats visualization */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Object.entries(story.stats).map(([key, value], statIndex) => (
                      <div key={statIndex} className="text-center p-3 bg-gradient-to-br from-primary/5 to-secondary-orange/5 rounded-lg border border-primary/10">
                        <Typography variant="h4" className="text-primary mb-1">
                          {value}
                        </Typography>
                        <Typography variant="caption" className="text-neutral-gray capitalize">
                          {key}
                        </Typography>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <Typography variant="bodySmall" className="font-semibold text-primary">
                      {story.impact}
                    </Typography>
                    <Button size="sm" variant="outline">
                      Read Full Story
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Enhanced Impact Methodology with Visual Elements */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <BarChart className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                OUR METHODOLOGY
              </Typography>
            </div>
            <Typography variant="h2" className="mb-6">
              How We Measure Impact
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our comprehensive monitoring and evaluation framework ensures accountability 
              and continuous improvement in all our interventions.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart className="h-8 w-8" />,
                title: "Quantitative Metrics",
                description: "We track concrete numbers: people served, cases resolved, providers trained, and geographic coverage.",
                color: "from-primary to-primary-dark",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Qualitative Assessment", 
                description: "Regular surveys and interviews capture satisfaction levels, capacity improvements, and quality of services.",
                color: "from-secondary-teal to-secondary-teal/80",
                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Systemic Change",
                description: "We measure policy influence, institutional strengthening, and long-term sustainability of interventions.",
                color: "from-secondary-orange to-secondary-orange/80",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
              }
            ].map((method, index) => (
              <Card key={index} variant="elevated" hover className="overflow-hidden group">
                <div className="relative">
                  <img 
                    src={method.image} 
                    alt={method.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${method.color} opacity-80`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <div className="text-white">
                        {method.icon}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <Typography variant="h4" className="mb-3">
                    {method.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                    {method.description}
                  </Typography>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <TestimonialSection
        title="Voices of Impact"
        subtitle="Hear from stakeholders about the real-world changes our work has created"
        testimonials={testimonials}
      />

      {/* Enhanced Annual Reports CTA with Visual Design */}
      <Section variant="gradient" padding="lg" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <BookOpen className="h-6 w-6 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold">
                DETAILED REPORTS
              </Typography>
            </div>
            
            <Typography variant="h2" className="text-white mb-6">
              Explore Our Impact in Detail
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8 text-xl">
              Download our comprehensive annual reports to see detailed impact data, 
              financial information, and stories from the communities we serve.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Shield className="h-8 w-8 text-secondary-orange mx-auto mb-3" />
                <Typography variant="h4" className="text-white mb-2">Transparency</Typography>
                <Typography variant="bodySmall" className="text-white/80">Full financial disclosure</Typography>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Target className="h-8 w-8 text-secondary-teal mx-auto mb-3" />
                <Typography variant="h4" className="text-white mb-2">Results</Typography>
                <Typography variant="bodySmall" className="text-white/80">Measurable outcomes</Typography>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Zap className="h-8 w-8 text-secondary-yellow mx-auto mb-3" />
                <Typography variant="h4" className="text-white mb-2">Innovation</Typography>
                <Typography variant="bodySmall" className="text-white/80">New approaches</Typography>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                View Annual Reports
              </Button>
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90">
                Impact Dashboard
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <GetInvolvedCTA />
    </Layout>
  );
};

export default Impact;
