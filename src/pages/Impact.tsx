
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
import { BarChart, TrendingUp, Users, MapPin, Scale, Award, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Impact = () => {
  const impactAreas = [
    {
      title: "Legal Aid Access",
      description: "Dramatically increased access to quality legal aid services across Tanzania",
      metrics: [
        { label: "People Served", value: "426,349+", change: "+23% from 2023" },
        { label: "Legal Aid Providers", value: "180+", change: "+15% from 2023" },
        { label: "Case Resolution Rate", value: "78%", change: "+5% from 2023" }
      ],
      icon: <Scale className="h-8 w-8" />,
      color: "from-primary to-primary-dark"
    },
    {
      title: "Community Empowerment",
      description: "Strengthened community capacity to understand and claim legal rights",
      metrics: [
        { label: "Paralegals Trained", value: "2,500+", change: "+30% from 2023" },
        { label: "Communities Reached", value: "1,200+", change: "+25% from 2023" },
        { label: "Legal Literacy Rate", value: "65%", change: "+12% from 2023" }
      ],
      icon: <Users className="h-8 w-8" />,
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      title: "Policy Influence",
      description: "Successfully advocated for legal reforms that benefit vulnerable populations",
      metrics: [
        { label: "Policy Reforms", value: "12", change: "+3 from 2023" },
        { label: "Government Partnerships", value: "25+", change: "+8 from 2023" },
        { label: "Legislative Changes", value: "5", change: "+2 from 2023" }
      ],
      icon: <Award className="h-8 w-8" />,
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      title: "Women's Rights",
      description: "Advanced gender equality through targeted legal empowerment initiatives",
      metrics: [
        { label: "Women Beneficiaries", value: "62%", change: "+8% from 2023" },
        { label: "GBV Cases Resolved", value: "5,600+", change: "+18% from 2023" },
        { label: "Property Rights Claims", value: "3,200+", change: "+22% from 2023" }
      ],
      icon: <Heart className="h-8 w-8" />,
      color: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  const successStories = [
    {
      title: "Land Rights Victory in Mwanza",
      description: "Community paralegals helped 150 families secure land titles, protecting them from illegal evictions and enabling them to access credit for agricultural development.",
      image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&h=400&fit=crop",
      impact: "150 families secured land rights",
      location: "Mwanza Region",
      category: "Land Rights"
    },
    {
      title: "Women's Cooperative Legal Support",
      description: "Legal aid enabled 80 women to formalize their cooperative business, access microfinance, and increase their collective income by 300%.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      impact: "300% income increase",
      location: "Dodoma Region",
      category: "Economic Rights"
    },
    {
      title: "Environmental Justice Advocacy",
      description: "Successful advocacy led to new environmental regulations protecting 5 communities from mining activities affecting their water sources.",
      image: "https://images.unsplash.com/photo-1569163139394-de44cb40ef4b?w=600&h=400&fit=crop",
      impact: "5 communities protected",
      location: "Northern Tanzania",
      category: "Environmental Rights"
    },
    {
      title: "Youth Legal Empowerment",
      description: "Trained 200 young advocates who now provide peer legal education in schools, reaching over 5,000 students across 12 regions.",
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop",
      impact: "5,000 students reached",
      location: "National Program",
      category: "Youth Rights"
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
    { region: "Dar es Salaam", beneficiaries: 45000, providers: 25, color: "bg-primary" },
    { region: "Mwanza", beneficiaries: 38000, providers: 18, color: "bg-secondary-teal" },
    { region: "Arusha", beneficiaries: 32000, providers: 16, color: "bg-secondary-orange" },
    { region: "Dodoma", beneficiaries: 28000, providers: 14, color: "bg-secondary-yellow" },
    { region: "Mbeya", beneficiaries: 25000, providers: 12, color: "bg-green-500" },
    { region: "Morogoro", beneficiaries: 22000, providers: 11, color: "bg-blue-500" }
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

      {/* Overall Impact Stats */}
      <AnimatedStats />

      {/* Impact Areas Detail */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary font-bold mb-4">
              IMPACT AREAS
            </Typography>
            <Typography variant="h2" className="mb-6">
              Transforming Lives Through
              <span className="block text-primary">Strategic Interventions</span>
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our comprehensive approach addresses multiple dimensions of legal empowerment, 
              creating sustainable change that benefits individuals, communities, and the justice system as a whole.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <Card key={index} variant="elevated" hover className="group">
                <div className={`bg-gradient-to-br ${area.color} p-6 rounded-t-2xl -m-8 mb-6`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                      <div className="text-white">
                        {area.icon}
                      </div>
                    </div>
                    <Typography variant="h3" className="text-white">
                      {area.title}
                    </Typography>
                  </div>
                  <Typography variant="body" className="text-white/90">
                    {area.description}
                  </Typography>
                </div>

                <div className="space-y-4">
                  {area.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                      <div>
                        <Typography variant="bodySmall" className="text-neutral-gray mb-1">
                          {metric.label}
                        </Typography>
                        <Typography variant="h4" className="text-neutral-dark">
                          {metric.value}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600 text-sm font-semibold">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {metric.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Regional Impact Map */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Regional Impact Overview
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Our presence and impact across Tanzania's key regions
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalImpact.map((region, index) => (
              <Card key={index} variant="elevated" hover className="text-center">
                <div className={`w-16 h-16 ${region.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h3" className="mb-2">
                  {region.region}
                </Typography>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Beneficiaries:
                    </Typography>
                    <Typography variant="bodySmall" className="font-semibold">
                      {region.beneficiaries.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Providers:
                    </Typography>
                    <Typography variant="bodySmall" className="font-semibold">
                      {region.providers}
                    </Typography>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Success Stories */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary font-bold mb-4">
              SUCCESS STORIES
            </Typography>
            <Typography variant="h2" className="mb-6">
              Real Lives, Real Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Behind every statistic is a human story of empowerment, justice, and hope. 
              These stories showcase the transformative power of accessible legal aid.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} variant="elevated" hover className="group overflow-hidden">
                <div className="relative">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {story.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                    {story.title}
                  </Typography>
                  
                  <Typography variant="body" className="text-neutral-gray mb-4 leading-relaxed">
                    {story.description}
                  </Typography>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div>
                      <Typography variant="bodySmall" className="font-semibold text-primary">
                        {story.impact}
                      </Typography>
                      <Typography variant="caption" className="text-neutral-gray">
                        Key Impact
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography variant="bodySmall" className="font-semibold">
                        {story.location}
                      </Typography>
                      <Typography variant="caption" className="text-neutral-gray">
                        Location
                      </Typography>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Impact Methodology */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
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
                color: "from-primary to-primary-dark"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Qualitative Assessment",
                description: "Regular surveys and interviews capture satisfaction levels, capacity improvements, and quality of services.",
                color: "from-secondary-teal to-secondary-teal/80"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Systemic Change",
                description: "We measure policy influence, institutional strengthening, and long-term sustainability of interventions.",
                color: "from-secondary-orange to-secondary-orange/80"
              }
            ].map((method, index) => (
              <Card key={index} variant="elevated" hover className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <div className="text-white">
                    {method.icon}
                  </div>
                </div>
                <Typography variant="h4" className="mb-3">
                  {method.title}
                </Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  {method.description}
                </Typography>
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

      {/* Annual Reports CTA */}
      <Section variant="gradient" padding="lg">
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Globe className="h-16 w-16 mx-auto mb-6 text-secondary-orange" />
            <Typography variant="h2" className="text-white mb-6">
              Explore Our Impact in Detail
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8">
              Download our comprehensive annual reports to see detailed impact data, 
              financial information, and stories from the communities we serve.
            </Typography>
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
