
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { 
  Scale, Users, Globe, Target, Heart, Shield, Briefcase, ArrowRight, 
  MapPin, TrendingUp, Smartphone, Award, ChevronLeft, ChevronRight,
  PlayCircle, ExternalLink, Calendar, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const WhatWeDo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Strategic Focus Areas
  const strategicAreas = [
    {
      icon: Scale,
      number: "01",
      title: "Increasing Accessibility to Quality Legal Aid Services",
      description: "We bring affordable, community-based legal aid to Tanzania's most vulnerable populations. Our paralegals—over 4,000 strong—provide legal support that is free, local, and inclusive.",
      stats: "4,000+ Paralegals",
      color: "primary",
      gradient: "from-primary to-primary-dark"
    },
    {
      icon: Users,
      number: "02", 
      title: "Promoting Legally Empowered Communities",
      description: "We empower citizens to know and use the law through legal education, awareness campaigns, and rights-based dialogue. Community paralegals are the frontline agents of change.",
      stats: "184 Communities",
      color: "secondary-teal",
      gradient: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: Shield,
      number: "03",
      title: "Enhancing a Conducive Environment for Sustainable Access to Justice", 
      description: "We strengthen the legal ecosystem by influencing policy reforms, building institutional capacity, and advocating for inclusive laws that support sustainable access to justice.",
      stats: "15+ Policy Reforms",
      color: "secondary-orange",
      gradient: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: Target,
      number: "04",
      title: "Institutional Development and Sustainability",
      description: "We invest in the resilience of LSF and the wider legal aid sector by enhancing operational systems, partner capacity, and financial sustainability.",
      stats: "200+ Partners",
      color: "secondary-yellow",
      gradient: "from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  // Expanding Strategic Focus
  const expandingFocus = [
    {
      icon: Globe,
      title: "Climate Justice",
      description: "Recognizing that climate change disproportionately harms women, rural communities, and pastoralist populations, LSF is integrating climate justice into our programming.",
      features: ["Land & Environmental Rights", "Climate-Related Legal Disputes", "Sustainable Environmental Governance"],
      image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Smartphone,
      title: "Digital Transformation", 
      description: "LSF is modernizing justice delivery through digital innovation, enhancing accessibility, transparency, and responsiveness.",
      features: ["Digital Case Tracking", "Online Training Platforms", "Haki Yangu Mobile App"],
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Our Approach
  const approaches = [
    {
      icon: Award,
      title: "Grant Making & Management",
      description: "Over $47 million USD managed. 200+ partner organizations empowered.",
      impact: "$47M+ Managed"
    },
    {
      icon: Target,
      title: "Direct Project Implementation", 
      description: "Since 2023, we've expanded our role to implement projects directly—adding speed, depth, and innovation.",
      impact: "Since 2023"
    },
    {
      icon: TrendingUp,
      title: "Advocacy & Policy Influence",
      description: "We shape Tanzania's justice landscape—from the Legal Aid Act to national campaigns.",
      impact: "15+ Reforms"
    },
    {
      icon: Users,
      title: "Strategic Partnerships",
      description: "We convene stakeholders across sectors to co-create solutions and amplify local voices.",
      impact: "200+ Partners"
    }
  ];

  // Ongoing Projects
  const projects = [
    {
      id: 1,
      title: "Sauti ya Mwanamke (Women's Voice)",
      description: "Empowering 4,000+ paralegals across 184 communities to expand legal aid and leadership opportunities for women.",
      image: "/lovable-uploads/f1407f2d-51ff-4898-b7a5-9ede5d13e081.png",
      category: "Women's Empowerment",
      impact: "4,000+ Paralegals Trained"
    },
    {
      id: 2,
      title: "Wanaweza (We Can)",
      description: "Supporting women's legal and economic empowerment through rights education, land access, and environmental justice.",
      image: "/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png", 
      category: "Economic Empowerment",
      impact: "50,000+ Women Reached"
    },
    {
      id: 3,
      title: "Haki Yangu App",
      description: "A free mobile app connecting Tanzanians to trained paralegals. Justice is now a tap away.",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Digital Innovation", 
      impact: "75,000+ Downloads"
    },
    {
      id: 4,
      title: "Climate Justice Initiative",
      description: "Enabling rural and pastoralist communities to defend land rights, adapt to climate stress, and access legal remedies.",
      image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Climate Justice",
      impact: "30+ Communities Served"
    },
    {
      id: 5,
      title: "Justice for Youth & Children", 
      description: "Offering youth-centered legal services and protection programs for children facing abuse or legal vulnerability.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Youth Protection",
      impact: "10,000+ Youth Served"
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="text-center text-white max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
              <Briefcase className="h-6 w-6 text-secondary-orange" />
              <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
                Our Work
              </span>
            </div>
            
            <Typography variant="display" className="text-white mb-8 leading-none text-6xl md:text-8xl font-bold">
              Justice for All.
              <span className="block text-secondary-orange">Empowerment for Each.</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              At the Legal Services Facility (LSF), our mission is clear: to ensure every Tanzanian—especially women, girls, and marginalized groups—can understand, access, and benefit from justice.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 text-lg rounded-full">
                Explore Our Projects
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-5 text-lg rounded-full">
                <PlayCircle className="mr-3 h-6 w-6" />
                Watch Our Impact
              </Button>
            </div>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-orange">2.8M+</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Tanzanians Reached</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-teal">4,000+</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Trained Paralegals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary-yellow">31</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Regions Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">78%</div>
                <div className="text-white/80 text-sm uppercase tracking-wide">Cases Resolved</div>
              </div>
            </div>
          </div>
        </Container>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Strategic Focus Areas */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <Container size="xl" className="relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-8 py-4 mb-8">
              <Target className="h-6 w-6 mr-4 text-primary" />
              <Typography variant="overline" className="text-primary font-bold text-lg">
                STRATEGIC FOCUS AREAS
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
              Four Enduring Pillars of 
              <span className="block text-primary">Systemic Change</span>
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
              Our work is structured around four strategic pillars that drive meaningful, systemic change across Tanzania's justice landscape.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {strategicAreas.map((area, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full group-hover:-translate-y-4">
                  {/* Header with Number */}
                  <div className={`bg-gradient-to-br ${area.gradient} p-8 relative`}>
                    <div className="absolute top-4 right-4 text-8xl font-black text-white/20">
                      {area.number}
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <area.icon className="h-8 w-8 text-white" />
                      </div>
                      <Typography variant="h3" className="text-white mb-4 leading-tight">
                        {area.title}
                      </Typography>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                        <span className="text-white font-bold text-sm">{area.stats}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <Typography variant="body" className="text-neutral-gray leading-relaxed mb-6 text-lg">
                      {area.description}
                    </Typography>
                    
                    <div className="flex items-center text-primary font-semibold group-hover:text-secondary-teal transition-colors">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Expanding Strategic Focus */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-secondary-teal/5 to-secondary-orange/5">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6 text-4xl md:text-5xl font-bold">
              Expanding Strategic Focus
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Evolving to meet emerging justice challenges with bold, forward-thinking priorities.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {expandingFocus.map((focus, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full group-hover:-translate-y-2">
                  <div className="relative h-64">
                    <img 
                      src={focus.image} 
                      alt={focus.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <focus.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <Typography variant="h3" className="mb-4 group-hover:text-primary transition-colors">
                      {focus.title}
                    </Typography>
                    
                    <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                      {focus.description}
                    </Typography>
                    
                    <div className="space-y-3">
                      {focus.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-secondary-teal mr-3 flex-shrink-0" />
                          <span className="text-neutral-gray">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="py-24 bg-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-6 text-4xl md:text-5xl font-bold">
              Our Approach
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Delivering justice through strategic, high-impact methods.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {approaches.map((approach, index) => (
              <div key={index} className="group text-center">
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-4 h-full border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <approach.icon className="h-10 w-10 text-primary" />
                  </div>
                  
                  <Typography variant="h4" className="mb-4 group-hover:text-primary transition-colors">
                    {approach.title}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray mb-4 leading-relaxed">
                    {approach.description}
                  </Typography>
                  
                  <div className="bg-secondary-orange/10 text-secondary-orange px-4 py-2 rounded-full text-sm font-bold inline-block">
                    {approach.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Ongoing Projects Carousel */}
      <section className="py-24 bg-gradient-to-br from-neutral-900 to-black text-white overflow-hidden">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-white mb-6 text-4xl md:text-5xl font-bold">
              Ongoing Projects
            </Typography>
            <Typography variant="body" className="text-white/80 max-w-3xl mx-auto text-xl">
              Explore our flagship initiatives—presented in a sleek, sliding interface.
            </Typography>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {projects.map((project) => (
                  <div key={project.id} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white text-black min-h-[600px]">
                      <div className="relative overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                          <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-12 flex flex-col justify-center">
                        <div className="mb-6">
                          <div className="text-primary font-bold text-sm mb-2 uppercase tracking-wide">
                            Featured Project
                          </div>
                          <Typography variant="h2" className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            {project.title}
                          </Typography>
                          <div className="bg-secondary-orange/10 text-secondary-orange px-4 py-2 rounded-full text-sm font-bold inline-block mb-6">
                            {project.impact}
                          </div>
                        </div>
                        
                        <Typography variant="body" className="text-neutral-gray mb-8 leading-relaxed text-lg">
                          {project.description}
                        </Typography>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button size="lg" className="font-bold px-8">
                            Explore Project
                            <ExternalLink className="ml-2 h-5 w-5" />
                          </Button>
                          <Button size="lg" variant="outline" className="font-bold px-8">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Watch Video
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-secondary-orange scale-125' : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* National Coverage */}
      <section className="py-24 bg-gradient-to-br from-secondary-teal to-secondary-teal/80 text-white">
        <Container size="xl">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-white mb-6 text-4xl md:text-5xl font-bold">
              National Coverage
            </Typography>
            <Typography variant="body" className="text-white/90 max-w-3xl mx-auto text-xl">
              Justice that Reaches Every Region of Tanzania
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">31</div>
              <div className="text-white/80">Regions Covered</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">4,000+</div>
              <div className="text-white/80">Trained Paralegals</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-white/80">Legal Aid Partners</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">184</div>
              <div className="text-white/80">Community Units</div>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary-teal font-bold px-8">
              <MapPin className="mr-2 h-5 w-5" />
              Explore Our Coverage by Region
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-white">
        <Container size="xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-8xl text-primary/20 mb-6">"</div>
            <Typography variant="h2" className="text-3xl md:text-4xl italic mb-8 leading-relaxed">
              LSF gave me the confidence to stand up for my rights. I'm not afraid anymore.
            </Typography>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <div className="text-lg font-semibold text-neutral-dark">Grace, Beneficiary</div>
            <div className="text-neutral-gray">Morogoro Region</div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white">
        <Container size="xl">
          <div className="text-center max-w-4xl mx-auto">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl font-bold">
              Be a Part of a National Movement for Justice
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-12 text-xl leading-relaxed">
              Join us in creating lasting change across Tanzania. Whether you need legal assistance, want to partner with us, or support our mission.
            </Typography>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4">
                Explore Projects
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                Support Our Work
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                Partner With Us
              </Button>
              <Button size="lg" className="bg-secondary-teal hover:bg-secondary-teal/90 font-bold py-4">
                Contact LSF Team
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default WhatWeDo;
