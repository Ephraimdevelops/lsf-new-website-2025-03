
import Layout from '../components/layout/Layout';
import WhatWeDoHero from '../components/what-we-do/WhatWeDoHero';
import StrategicFocusSection from '../components/what-we-do/StrategicFocusSection';
import ProjectsCarousel from '../components/what-we-do/ProjectsCarousel';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { 
  Globe, Target, Heart, Shield, Briefcase, ArrowRight, 
  MapPin, TrendingUp, Smartphone, Award, CheckCircle,
  Users, Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatWeDo = () => {
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

  return (
    <Layout>
      {/* Hero Section */}
      <WhatWeDoHero />

      {/* Strategic Focus Areas */}
      <StrategicFocusSection />

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
      <ProjectsCarousel />

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
