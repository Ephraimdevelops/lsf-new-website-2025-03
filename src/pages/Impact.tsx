
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Section from '../components/shared/Section';
import Typography from '../components/shared/Typography';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Scale, 
  MapPin, 
  Download,
  ArrowRight,
  Heart,
  Shield,
  Gavel,
  Smartphone,
  Leaf,
  Quote
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Impact = () => {
  const keyStats = [
    {
      value: 2800000,
      suffix: '+',
      label: 'Tanzanians Reached',
      description: 'With legal aid & education',
      icon: <Users className="h-8 w-8" />,
      color: 'text-primary'
    },
    {
      value: 4000,
      suffix: '+',
      label: 'Paralegals Trained',
      description: 'Active in communities',
      icon: <Scale className="h-8 w-8" />,
      color: 'text-secondary-teal'
    },
    {
      value: 184,
      suffix: '',
      label: 'Community Justice Units',
      description: 'Supported nationwide',
      icon: <Target className="h-8 w-8" />,
      color: 'text-secondary-orange'
    },
    {
      value: 31,
      suffix: '/31',
      label: 'Regions Covered',
      description: 'Including Zanzibar',
      icon: <MapPin className="h-8 w-8" />,
      color: 'text-secondary-yellow'
    },
    {
      value: 60,
      suffix: '%+',
      label: 'Women & Girls',
      description: 'Of total beneficiaries',
      icon: <Heart className="h-8 w-8" />,
      color: 'text-pink-500'
    },
    {
      value: 78,
      suffix: '%',
      label: 'Cases Resolved',
      description: 'At community level',
      icon: <BarChart3 className="h-8 w-8" />,
      color: 'text-green-500'
    }
  ];

  const impactAreas = [
    {
      title: 'Legal Aid Access',
      icon: <Scale className="h-8 w-8" />,
      points: [
        'Free legal support available in every region',
        'Thousands of community-level legal resolutions annually',
        'Mobile legal clinics reaching remote areas'
      ],
      color: 'from-primary to-primary-dark'
    },
    {
      title: 'Gender Justice',
      icon: <Shield className="h-8 w-8" />,
      points: [
        'Paralegals addressing GBV, inheritance, land rights',
        'Women supported to access justice and leadership spaces',
        'Gender-responsive legal aid services'
      ],
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Policy Reform',
      icon: <Gavel className="h-8 w-8" />,
      points: [
        'Legal Aid Act supported & operationalized',
        'Mama Samia Legal Aid Campaign scaled nationally',
        'Evidence-based policy recommendations'
      ],
      color: 'from-secondary-teal to-teal-600'
    },
    {
      title: 'Digital Transformation',
      icon: <Smartphone className="h-8 w-8" />,
      points: [
        'Haki Yangu app connects users to paralegals',
        'Digital training & case tracking introduced',
        '10,000+ app users accessing justice digitally'
      ],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Climate Justice & Land Rights',
      icon: <Leaf className="h-8 w-8" />,
      points: [
        'Communities empowered to challenge land grabs',
        'Legal support for environmental protection',
        'Climate-vulnerable communities protected'
      ],
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const testimonials = [
    {
      quote: "Through LSF's support, I learned my rights and successfully reclaimed my family's land. Now I help other women in my community do the same.",
      author: "Fatuma Hassan",
      role: "Land Rights Beneficiary",
      location: "Morogoro Region"
    },
    {
      quote: "The paralegal training changed my life. I've helped resolve over 200 cases in my community and became a voice for justice.",
      author: "James Mwalimu",
      role: "Community Paralegal",
      location: "Mwanza Region"
    },
    {
      quote: "LSF's evidence-based approach to legal empowerment has transformed how we think about access to justice in Tanzania.",
      author: "Dr. Sarah Kinyoki",
      role: "Development Partner",
      location: "Partner Organization"
    }
  ];

  const reports = [
    {
      title: 'Annual Impact Report 2024',
      description: 'Comprehensive overview of LSF achievements and impact across Tanzania',
      type: 'PDF',
      pages: '64 pages'
    },
    {
      title: 'Gender Justice Research Brief',
      description: 'Analysis of gender-responsive legal aid and its impact on women\'s rights',
      type: 'PDF',
      pages: '24 pages'
    },
    {
      title: 'Digital Legal Aid Study',
      description: 'Evaluation of technology integration in community-based legal services',
      type: 'PDF',
      pages: '32 pages'
    },
    {
      title: 'Community Paralegals Handbook',
      description: 'Training resource for community-based legal service providers',
      type: 'PDF',
      pages: '48 pages'
    }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<BarChart3 className="h-8 w-8" />}
        badge="OUR IMPACT"
        title="Justice that changes lives. Systems that work for people."
        description="Over the past decade, LSF has transformed the legal empowerment landscape in Tanzania, creating measurable change that reaches every corner of our nation."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Key Statistics with Animated Counters */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">
              Impact by the Numbers
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our commitment to transparency means we measure and report on every aspect of our work.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl border border-neutral-light p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`mb-6 flex justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix}
                    className={`${stat.color} font-heading`}
                  />
                </div>
                <Typography variant="h4" className="mb-3">
                  {stat.label}
                </Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  {stat.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Thematic Impact Areas */}
      <Section variant="secondary" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">
              Thematic Impact Areas
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our comprehensive approach addresses multiple dimensions of justice and legal empowerment.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`h-32 bg-gradient-to-br ${area.color} p-6 flex items-center justify-center text-white`}>
                    <div className="text-center">
                      <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                        {area.icon}
                      </div>
                      <Typography variant="h4" className="text-white font-bold">
                        {area.title}
                      </Typography>
                    </div>
                  </div>
                  <div className="p-8">
                    <ul className="space-y-3">
                      {area.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <Typography variant="bodySmall" className="text-neutral-gray">
                            {point}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Human Stories / Testimonials */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">
              Stories of Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Behind every statistic is a human story of transformation, empowerment, and justice.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl border border-neutral-light p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-primary/20 mb-6">
                  <Quote className="h-12 w-12" />
                </div>
                <Typography variant="body" className="text-neutral-gray mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </Typography>
                <div className="border-t border-neutral-100 pt-6">
                  <Typography variant="h4" className="mb-2">
                    {testimonial.author}
                  </Typography>
                  <Typography variant="bodySmall" className="text-primary mb-1">
                    {testimonial.role}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {testimonial.location}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Regional Impact Highlights */}
      <Section variant="secondary" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">
              Nationwide Reach
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              LSF's impact spans all 31 regions of Tanzania, creating justice pathways in every community.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { region: 'Dar es Salaam', paralegals: '245', reached: '15,400+' },
              { region: 'Morogoro', paralegals: '115', reached: '6,300+' },
              { region: 'Mwanza', paralegals: '132', reached: '8,200+' },
              { region: 'Dodoma', paralegals: '98', reached: '5,800+' },
              { region: 'Arusha', paralegals: '87', reached: '4,900+' },
              { region: 'Mbeya', paralegals: '76', reached: '4,200+' },
              { region: 'Zanzibar', paralegals: '65', reached: '3,800+' },
              { region: 'Kilimanjaro', paralegals: '82', reached: '4,600+' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <Typography variant="h4" className="mb-3 text-primary">
                  {item.region}
                </Typography>
                <div className="space-y-2">
                  <div>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Paralegals:
                    </Typography>
                    <Typography variant="h4" className="font-bold">
                      {item.paralegals}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      People Reached:
                    </Typography>
                    <Typography variant="h4" className="font-bold text-secondary-teal">
                      {item.reached}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Reports and Publications */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-4">
              Reports & Publications
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Download our comprehensive reports and research briefs to explore our impact in detail.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reports.map((report, index) => (
              <div key={index} className="bg-white rounded-xl border border-neutral-light p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <Typography variant="h4" className="mb-3">
                      {report.title}
                    </Typography>
                    <Typography variant="body" className="text-neutral-gray mb-4">
                      {report.description}
                    </Typography>
                    <div className="flex items-center space-x-4 text-sm text-neutral-gray">
                      <span className="bg-neutral-100 px-3 py-1 rounded-full">{report.type}</span>
                      <span>{report.pages}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section variant="primary" padding="xl">
        <Container size="xl">
          <div className="text-center">
            <Typography variant="h2" className="text-white mb-6">
              Help us reach more people with justice that works
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 max-w-3xl mx-auto text-xl">
              Join us in creating a Tanzania where everyone has access to justice, regardless of their background or circumstances.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/publications">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
                  View Full Report
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Partner With Us
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default Impact;
