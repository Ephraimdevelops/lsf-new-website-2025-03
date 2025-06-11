
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, MapPin, Calendar, Award, ArrowRight, CheckCircle, Target, BarChart3, Globe, Heart, Scale, BookOpen, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const impactMetrics = [
  {
    icon: <Users className="h-8 w-8" />,
    number: "125,847",
    label: "People Served",
    description: "Individuals who received direct legal assistance",
    trend: "+23% from last year"
  },
  {
    icon: <Scale className="h-8 w-8" />,
    number: "89%",
    label: "Success Rate",
    description: "Cases resolved successfully in clients' favor",
    trend: "+5% improvement"
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    number: "184",
    label: "Districts Covered",
    description: "Complete national coverage across Tanzania",
    trend: "100% coverage achieved"
  },
  {
    icon: <Award className="h-8 w-8" />,
    number: "2,847",
    label: "Paralegals Trained",
    description: "Community legal aid providers empowered",
    trend: "+847 new paralegals"
  }
];

const focusAreaImpacts = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Gender Justice",
    stats: "15,234 women supported",
    highlights: [
      "3,456 GBV cases resolved",
      "89% custody cases won",
      "2,100 women gained property rights",
      "156 policy changes advocated"
    ],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Legal Empowerment",
    stats: "45,678 people educated",
    highlights: [
      "1,200 community workshops held",
      "25,000 legal guides distributed",
      "345 paralegal training sessions",
      "89% knowledge retention rate"
    ],
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Climate Justice",
    stats: "89 communities protected",
    highlights: [
      "23 environmental cases won",
      "156 hectares land restored",
      "12 mining permits challenged",
      "67% reduction in violations"
    ],
    image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const yearlyProgress = [
  {
    year: "2020",
    people: 45200,
    districts: 120,
    cases: 2340,
    success: 78
  },
  {
    year: "2021",
    people: 67800,
    districts: 156,
    cases: 3890,
    success: 82
  },
  {
    year: "2022",
    people: 89400,
    districts: 172,
    cases: 5670,
    success: 85
  },
  {
    year: "2023",
    people: 108900,
    districts: 184,
    cases: 7820,
    success: 87
  },
  {
    year: "2024",
    people: 125847,
    districts: 184,
    cases: 9450,
    success: 89
  }
];

const testimonials = [
  {
    quote: "LSF didn't just help me win my case - they gave me back my dignity and hope for the future.",
    author: "Amina Hassan",
    role: "Land Rights Beneficiary",
    location: "Dar es Salaam"
  },
  {
    quote: "The paralegal training changed my entire community. Now we know our rights and how to protect them.",
    author: "Joseph Mwalimu",
    role: "Community Paralegal",
    location: "Mwanza"
  },
  {
    quote: "Thanks to LSF, my daughter can go to school and my family has a secure future.",
    author: "Grace Kimani",
    role: "Family Law Client",
    location: "Arusha"
  }
];

const Impact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<BarChart3 className="h-8 w-8" />}
        badge="Our Impact"
        title="Transforming Lives Through Justice"
        description="Discover how LSF is making a measurable difference across Tanzania. From individual cases to systemic change, see the real impact of our work in communities nationwide."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Key Impact Metrics */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Impact by the Numbers</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Every statistic represents real lives changed, families protected, and communities empowered through access to justice.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                    {metric.icon}
                  </div>
                  <Typography variant="h1" className="text-primary font-black mb-2">
                    {metric.number}
                  </Typography>
                  <Typography variant="h4" className="font-semibold mb-2">
                    {metric.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray mb-3">
                    {metric.description}
                  </Typography>
                  <div className="inline-flex items-center text-green-600 text-xs font-medium">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Focus Area Impact */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-primary mb-4 mx-auto"></div>
            <Typography variant="h2" className="mb-6">Impact Across Our Focus Areas</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              See how our strategic focus areas are creating meaningful change in the lives of Tanzanians.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {focusAreaImpacts.map((area, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={area.image} 
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 text-primary">
                      {area.icon}
                    </div>
                    <div>
                      <Typography variant="h3" className="font-bold group-hover:text-primary transition-colors">
                        {area.title}
                      </Typography>
                      <Typography variant="bodySmall" className="text-primary font-semibold">
                        {area.stats}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {area.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-neutral-gray">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Progress Over Time */}
      <section className="py-16 bg-neutral-50">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Our Journey of Growth</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Track our progress over the years as we've expanded our reach and deepened our impact across Tanzania.
            </Typography>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {yearlyProgress.map((year, index) => (
                <div key={year.year} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    {year.year.slice(-2)}
                  </div>
                  <Typography variant="h4" className="font-bold mb-2">
                    {year.year}
                  </Typography>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-primary">{year.people.toLocaleString()}</span>
                      <div className="text-neutral-gray">People Served</div>
                    </div>
                    <div>
                      <span className="font-semibold text-primary">{year.districts}</span>
                      <div className="text-neutral-gray">Districts</div>
                    </div>
                    <div>
                      <span className="font-semibold text-primary">{year.success}%</span>
                      <div className="text-neutral-gray">Success Rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Voices of Change</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Hear directly from the people whose lives have been transformed through our legal aid services.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-8">
                  <div className="text-primary mb-6">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Typography variant="body" className="text-neutral-dark mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </Typography>
                  <div>
                    <Typography variant="h4" className="font-semibold mb-1">
                      {testimonial.author}
                    </Typography>
                    <Typography variant="bodySmall" className="text-primary font-medium mb-1">
                      {testimonial.role}
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      {testimonial.location}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Future Goals */}
      <section className="py-16 bg-primary/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Typography variant="h2" className="mb-6">Looking Ahead: Our 2025 Goals</Typography>
              <Typography variant="body" className="text-neutral-gray mb-8 leading-relaxed">
                Building on our success, we're setting ambitious targets for the coming year to deepen our impact and reach even more Tanzanians in need.
              </Typography>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-primary mr-3" />
                  <span className="text-neutral-dark">Serve 150,000+ individuals</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-primary mr-3" />
                  <span className="text-neutral-dark">Train 1,000 additional paralegals</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-primary mr-3" />
                  <span className="text-neutral-dark">Achieve 92% case success rate</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-primary mr-3" />
                  <span className="text-neutral-dark">Launch digital legal aid platform</span>
                </div>
              </div>
              
              <Link to="/donate">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Support Our Mission
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/lovable-uploads/background with mother umage .png" 
                  alt="Future goals visualization" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-dark">2025 Vision</div>
                    <div className="text-sm text-neutral-gray">Expanding our reach</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center">
            <Typography variant="h2" className="mb-6">Be Part of Our Impact</Typography>
            <Typography variant="body" className="text-neutral-gray mb-8 max-w-2xl mx-auto">
              Whether you need legal help, want to support our work, or join our team, there are many ways to be part of Tanzania's justice transformation.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/legal-help">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Legal Help
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/heroes">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Read Success Stories
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
