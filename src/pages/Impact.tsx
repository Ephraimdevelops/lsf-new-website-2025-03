
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Users, Scale, Heart, MapPin, Target, Award, 
  Globe, Briefcase, BookOpen, Shield, Lightbulb, ArrowRight,
  CheckCircle, Clock, Star, Calendar, Phone, Mail, Download,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Impact = () => {
  const bigPictureMetrics = [
    { value: 31, suffix: "/31", label: "Regions Served", description: "Across Mainland Tanzania and Zanzibar", icon: MapPin },
    { value: 4000, suffix: "+", label: "Community Paralegals", description: "Trained and active nationwide", icon: Users },
    { value: 2800000, suffix: "+", label: "Tanzanians Reached", description: "With legal education and support", icon: Globe },
    { value: 184, label: "Community Justice Units", description: "Supported across the country", icon: Scale },
    { value: 60, suffix: "%", label: "Women & Girls", description: "Of total beneficiaries served", icon: Heart },
    { value: 78, suffix: "%", label: "Community Resolution", description: "Disputes resolved at local level", icon: Target }
  ];

  const thematicImpactAreas = [
    {
      id: "legal-aid",
      title: "Legal Aid Accessibility",
      icon: Scale,
      color: "from-primary to-primary-dark",
      stats: [
        { value: "426,349+", label: "Clients Reached" },
        { value: "150+", label: "Service Points" },
        { value: "96%", label: "Success Rate" }
      ],
      description: "Expanding access to quality legal services for all Tanzanians, especially the poor and marginalized.",
      achievements: [
        "Established 150+ permanent legal aid centers",
        "Trained 4,000+ community paralegals",
        "Achieved 96% success rate in cases handled"
      ]
    },
    {
      id: "empowerment",
      title: "Community Legal Empowerment", 
      icon: Users,
      color: "from-secondary-teal to-secondary-teal/80",
      stats: [
        { value: "39.8M+", label: "People Educated" },
        { value: "5,000+", label: "Workshops Held" },
        { value: "85%", label: "Awareness Increase" }
      ],
      description: "Building legal literacy and empowering communities to claim and protect their rights.",
      achievements: [
        "Conducted 5,000+ community workshops",
        "Reached 39.8M+ people with legal education",
        "Increased legal awareness by 85% in target areas"
      ]
    },
    {
      id: "policy-reform",
      title: "Policy Reform & Advocacy",
      icon: Target,
      color: "from-secondary-orange to-secondary-orange/80", 
      stats: [
        { value: "15+", label: "Laws Influenced" },
        { value: "8", label: "Major Reforms" },
        { value: "50+", label: "Policy Briefs" }
      ],
      description: "Driving systemic change through evidence-based policy advocacy and reform initiatives.",
      achievements: [
        "Influenced 15+ policy changes",
        "Led 8 major legal reforms",
        "Published 50+ policy briefs"
      ]
    },
    {
      id: "gender-justice",
      title: "Gender Justice",
      icon: Heart,
      color: "from-secondary-green to-secondary-green/80",
      stats: [
        { value: "250,000+", label: "Women Supported" },
        { value: "12,000+", label: "GBV Cases" },
        { value: "89%", label: "Property Rights Won" }
      ],
      description: "Advancing gender equality through targeted legal support and advocacy.",
      achievements: [
        "Supported 250,000+ women in legal matters",
        "Handled 12,000+ gender-based violence cases", 
        "Achieved 89% success rate in women's property rights cases"
      ]
    },
    {
      id: "digital-innovation",
      title: "Digital Transformation",
      icon: Lightbulb,
      color: "from-purple-500 to-purple-700",
      stats: [
        { value: "75,000+", label: "App Users" },
        { value: "25,000+", label: "Digital Queries" },
        { value: "40%", label: "Efficiency Gain" }
      ],
      description: "Leveraging technology to improve access to justice through digital platforms.",
      achievements: [
        "Launched Haki Yangu app with 75,000+ users",
        "Handled 25,000+ legal queries digitally",
        "Improved service efficiency by 40%"
      ]
    },
    {
      id: "climate-justice",
      title: "Climate Justice",
      icon: Globe,
      color: "from-green-500 to-green-700",
      stats: [
        { value: "80+", label: "Communities" },
        { value: "2,500+", label: "Land Cases" },
        { value: "95%", label: "Resolution Rate" }
      ],
      description: "Protecting environmental rights and supporting climate-vulnerable communities.",
      achievements: [
        "Supported 80+ communities on land rights",
        "Resolved 2,500+ land and resource disputes",
        "Achieved 95% success rate in environmental cases"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Through LSF's support, I was able to secure my land rights and now my children have a secure future. The paralegals made legal help accessible in our remote village.",
      name: "Fatuma M.",
      location: "Mtwara Region",
      role: "Farmer & Land Rights Beneficiary",
      image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png"
    },
    {
      quote: "As a community paralegal trained by LSF, I've been able to help over 200 families in our district resolve disputes without expensive court proceedings.",
      name: "John K.",
      location: "Arusha Region", 
      role: "Community Paralegal",
      image: "/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png"
    },
    {
      quote: "LSF's legal empowerment programs transformed our organization's capacity to serve marginalized communities effectively.",
      name: "Dr. Sarah W.",
      location: "Dar es Salaam",
      role: "Partner Organization Director",
      image: "/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png"
    },
    {
      quote: "The Haki Yangu app made it possible for me to get legal advice instantly when I needed help with my employment dispute.",
      name: "Emmanuel R.",
      location: "Dodoma Region",
      role: "Digital Platform User",
      image: "/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png"
    }
  ];

  const awards = [
    { title: "UN Human Rights Award", year: "2023", category: "Access to Justice" },
    { title: "African Legal Innovation Prize", year: "2022", category: "Digital Transformation" },
    { title: "Tanzania Good Governance Award", year: "2021", category: "Civil Society Excellence" },
    { title: "Regional Justice Champions", year: "2020", category: "Community Empowerment" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<TrendingUp className="h-8 w-8" />}
        badge="Our Impact"
        title="Transforming Lives Through Justice"
        description="Measuring our success through real outcomes, systemic change, and the voices of those we serve across Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Big Picture Metrics */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary mb-4 block font-bold tracking-wider">
              OUR IMPACT BY THE NUMBERS
            </Typography>
            <Typography variant="h2" className="mb-8">
              Scale and Reach Across Tanzania
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              These numbers represent real lives changed, communities empowered, and systemic barriers removed across all 31 regions of Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bigPictureMetrics.map((metric, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <metric.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="mb-4">
                    <Typography variant="h1" className="text-4xl text-primary">
                      <AnimatedCounter 
                        end={metric.value} 
                        suffix={metric.suffix || ""} 
                        duration={2000}
                      />
                    </Typography>
                  </div>
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
        </Container>
      </section>

      {/* Thematic Impact Areas with Tabs */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary mb-4 block font-bold tracking-wider">
              STRATEGIC IMPACT AREAS
            </Typography>
            <Typography variant="h2" className="mb-8">
              Deep Dive Into Our Results
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Explore our impact across six strategic focus areas, each driving comprehensive change in Tanzania's justice landscape.
            </Typography>
          </div>

          <Tabs defaultValue="legal-aid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-12">
              {thematicImpactAreas.map((area) => (
                <TabsTrigger key={area.id} value={area.id} className="flex items-center gap-2">
                  <area.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{area.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {thematicImpactAreas.map((area) => (
              <TabsContent key={area.id} value={area.id} className="mt-8">
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center mr-6`}>
                          <area.icon className="h-8 w-8 text-white" />
                        </div>
                        <Typography variant="h2">{area.title}</Typography>
                      </div>

                      <Typography variant="body" className="text-neutral-gray mb-8 text-lg leading-relaxed">
                        {area.description}
                      </Typography>

                      <div className="space-y-4">
                        <Typography variant="h4" className="mb-4">Key Achievements:</Typography>
                        {area.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                            <Typography variant="body" className="text-neutral-gray">
                              {achievement}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {area.stats.map((stat, i) => (
                        <div key={i} className={`bg-gradient-to-br ${area.color} rounded-2xl p-6 text-white text-center`}>
                          <Typography variant="h1" className="text-4xl font-bold mb-2">
                            {stat.value}
                          </Typography>
                          <Typography variant="body" className="text-white/90">
                            {stat.label}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Container>
      </section>

      {/* Interactive Impact Map */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Our Nationwide Presence
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              From urban centers to remote villages, our network of paralegals and service points ensures justice reaches every corner of Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-3xl p-12 text-center">
                <MapPin className="h-32 w-32 text-primary mx-auto mb-8" />
                <Typography variant="h3" className="mb-6">
                  Complete National Coverage
                </Typography>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <Typography variant="h1" className="text-5xl text-primary mb-2">31</Typography>
                    <Typography variant="body" className="text-neutral-gray">Regions Covered</Typography>
                  </div>
                  <div className="text-center">
                    <Typography variant="h1" className="text-5xl text-secondary-teal mb-2">184</Typography>
                    <Typography variant="body" className="text-neutral-gray">Districts Served</Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Typography variant="h3" className="mb-8">Regional Impact Highlights</Typography>
              {[
                { region: "Northern Tanzania", cases: "45,000+", paralegals: "800+", highlight: "Land rights advocacy" },
                { region: "Central Tanzania", cases: "38,000+", paralegals: "650+", highlight: "Gender justice focus" },
                { region: "Southern Tanzania", cases: "52,000+", paralegals: "750+", highlight: "Community empowerment" },
                { region: "Eastern Tanzania", cases: "41,000+", paralegals: "680+", highlight: "Digital innovation hub" }
              ].map((region, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <Typography variant="h4">{region.region}</Typography>
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <Typography variant="h4" className="text-primary">{region.cases}</Typography>
                      <Typography variant="small" className="text-neutral-gray">Cases Handled</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="h4" className="text-secondary-teal">{region.paralegals}</Typography>
                      <Typography variant="small" className="text-neutral-gray">Active Paralegals</Typography>
                    </div>
                    <div className="text-center">
                      <Typography variant="bodySmall" className="text-secondary-orange font-medium">
                        {region.highlight}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Voices of Impact
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Behind every statistic is a human story. Hear from the people whose lives have been transformed through access to justice.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start mb-6">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-6"
                  />
                  <div>
                    <Typography variant="h4" className="mb-1">{testimonial.name}</Typography>
                    <Typography variant="bodySmall" className="text-primary">{testimonial.role}</Typography>
                    <Typography variant="small" className="text-neutral-gray">{testimonial.location}</Typography>
                  </div>
                </div>
                
                <blockquote className="mb-6">
                  <Typography variant="body" className="text-neutral-gray italic leading-relaxed">
                    "{testimonial.quote}"
                  </Typography>
                </blockquote>
                
                <div className="flex justify-end">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-secondary-orange fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Awards & Recognition */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Recognition & Awards
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Our commitment to justice has been recognized nationally and internationally.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100">
                <Award className="h-12 w-12 text-secondary-orange mx-auto mb-4" />
                <Typography variant="h4" className="mb-2">{award.title}</Typography>
                <Typography variant="body" className="text-primary mb-2">{award.year}</Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">{award.category}</Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Reports & Data Visualization */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Transparency & Accountability
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Access our comprehensive reports and data that demonstrate our commitment to measurable impact.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100">
              <BarChart3 className="h-16 w-16 text-primary mx-auto mb-6" />
              <Typography variant="h3" className="mb-4">Annual Report 2023</Typography>
              <Typography variant="body" className="text-neutral-gray mb-6">
                Complete overview of our impact, financials, and strategic outcomes.
              </Typography>
              <Button className="w-full">
                <Download className="mr-2 h-5 w-5" />
                Download Report
              </Button>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100">
              <Target className="h-16 w-16 text-secondary-teal mx-auto mb-6" />
              <Typography variant="h3" className="mb-4">Impact Dashboard</Typography>
              <Typography variant="body" className="text-neutral-gray mb-6">
                Real-time data and visualizations of our ongoing programs.
              </Typography>
              <Button variant="outline" className="w-full">
                <ArrowRight className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100">
              <BookOpen className="h-16 w-16 text-secondary-orange mx-auto mb-6" />
              <Typography variant="h3" className="mb-4">Policy Briefs</Typography>
              <Typography variant="body" className="text-neutral-gray mb-6">
                Evidence-based research and policy recommendations.
              </Typography>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-5 w-5" />
                Download Briefs
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-white mb-8">
              Be Part of Our Impact Story
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 text-xl">
              Every partnership, donation, and voice raised for justice contributes to the transformation you see here. Join us in building a more just Tanzania.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4">
                <Heart className="mr-2 h-5 w-5" />
                Support Our Work
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                <Users className="mr-2 h-5 w-5" />
                Partner With Us
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                <Download className="mr-2 h-5 w-5" />
                Read Reports
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                <Briefcase className="mr-2 h-5 w-5" />
                Join Our Team
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Impact;
