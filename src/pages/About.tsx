
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, Target, Users, Scale, Globe, Award, MapPin, 
  TrendingUp, Briefcase, BookOpen, ArrowRight, CheckCircle,
  Shield, Lightbulb, Phone, Mail, Quote, Calendar,
  Eye, Star, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const keyStats = [
    { value: 4000, suffix: "+", label: "Paralegals", icon: Users },
    { value: 31, label: "Regions Covered", icon: MapPin },
    { value: 2800000, suffix: "+", label: "Tanzanians Reached", icon: Globe }
  ];

  const coreValues = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with transparency and accountability"
    },
    {
      icon: Heart,
      title: "Inclusivity", 
      description: "We prioritize the most vulnerable"
    },
    {
      icon: Target,
      title: "Empowerment",
      description: "We build voice, capacity, and dignity"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We adapt and scale what works"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe change happens together"
    }
  ];

  const timelineEvents = [
    {
      year: "2011",
      title: "LSF Founded",
      description: "Established as a grant-making mechanism for legal aid"
    },
    {
      year: "2015", 
      title: "National Expansion",
      description: "Extended operations to all 31 regions of Tanzania"
    },
    {
      year: "2020",
      title: "Digital Innovation",
      description: "Launched Haki Yangu app and digital platforms"
    },
    {
      year: "2023",
      title: "National Leadership",
      description: "Became the largest coordinator of legal aid services"
    }
  ];

  const testimonials = [
    {
      quote: "Thanks to LSF, we now have paralegals in our village who help us resolve land issues peacefully.",
      author: "Mariam",
      role: "Community Leader",
      location: "Dodoma"
    },
    {
      quote: "LSF is a model of transparency and impact in legal aid delivery.",
      author: "Partner Representative", 
      role: "Donor Agency",
      location: "Tanzania"
    }
  ];

  const partners = [
    "Ministry of Constitutional and Legal Affairs",
    "Judiciary of Tanzania", 
    "Enabel",
    "LuxDev",
    "Civil Society Organizations"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/lovable-uploads/background with mother umage .png')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary-dark/90"></div>
        
        <Container className="relative z-10 text-center text-white">
          <Typography variant="h1" className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Justice Starts <span className="text-secondary-orange">Here</span>
          </Typography>
          <Typography variant="body" className="text-2xl mb-10 max-w-4xl mx-auto text-white/90 leading-relaxed">
            We are LSF—a Tanzanian institution committed to legal empowerment, access to justice, and equity for all.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-xl px-10 py-4">
              <Users className="mr-3 h-6 w-6" />
              Meet Our Team
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-xl px-10 py-4">
              <Eye className="mr-3 h-6 w-6" />
              Explore Our Work
            </Button>
          </div>
        </Container>
      </section>

      {/* LSF at a Glance */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6 text-4xl">
              LSF at a Glance
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-5xl mx-auto text-lg leading-relaxed">
              Founded in 2011, <strong>Legal Services Facility (LSF)</strong> is a non-profit Tanzanian organization working to expand legal empowerment and access to justice across the country. We are the <strong>largest national coordinator and funder of legal aid services</strong> in Tanzania, supporting a vast network of over 4,000 paralegals, 200+ legal aid providers, and operating in all 31 regions of Mainland and Zanzibar.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {keyStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="h1" className="text-5xl text-primary font-bold mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix || ""} />
                  </Typography>
                  <Typography variant="h4" className="text-neutral-dark">
                    {stat.label}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-primary mr-4" />
                  <Typography variant="h3" className="text-primary">Our Vision</Typography>
                </div>
                <Typography variant="body" className="text-neutral-gray text-lg leading-relaxed">
                  A just, inclusive, and equitable society where all Tanzanians can enjoy their rights and access justice.
                </Typography>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Award className="h-8 w-8 text-secondary-teal mr-4" />
                  <Typography variant="h3" className="text-secondary-teal">Our Mission</Typography>
                </div>
                <Typography variant="body" className="text-neutral-gray text-lg leading-relaxed">
                  To empower communities—especially the underserved—through innovative, accessible legal aid systems and grassroots engagement.
                </Typography>
              </div>
            </div>

            <div>
              <Typography variant="h3" className="mb-8 text-center">Core Values</Typography>
              <div className="space-y-4">
                {coreValues.map((value, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <Typography variant="h4" className="mb-2">{value.title}</Typography>
                        <Typography variant="bodySmall" className="text-neutral-gray">
                          {value.description}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Legacy Timeline */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6 text-4xl">
              A Decade of Impact
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-lg">
              Since 2011, LSF has evolved from a grant-making mechanism into a national leader in legal empowerment and justice innovation.
            </Typography>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-secondary-teal"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <Typography variant="h3" className="text-primary mb-2">{event.year}</Typography>
                        <Typography variant="h4" className="mb-3">{event.title}</Typography>
                        <Typography variant="body" className="text-neutral-gray">{event.description}</Typography>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Leadership & Team */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6 text-4xl">
              Leadership & Team
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-lg">
              Behind every achievement is a dedicated, diverse team of Tanzanian professionals and justice champions. LSF is governed by an independent Board of Trustees and led by seasoned executives with expertise in law, development, policy, and community justice.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <Typography variant="h4" className="mb-4">Board of Trustees</Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Independent governance ensuring strategic oversight and accountability
                </Typography>
                <Button variant="outline" className="w-full">
                  View Board Members
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-secondary-teal rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <Typography variant="h4" className="mb-4">Executive Leadership</Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Seasoned professionals driving strategic vision and organizational growth
                </Typography>
                <Button variant="outline" className="w-full">
                  Meet Leadership
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-secondary-orange rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <Typography variant="h4" className="mb-4">Core Team</Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Field teams and operations staff working across the country
                </Typography>
                <Button variant="outline" className="w-full">
                  View Full Team
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6 text-4xl">
              Voices of Impact
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <Quote className="h-12 w-12 text-primary/20 absolute top-6 right-6" />
                  <blockquote className="mb-6">
                    <Typography variant="body" className="text-neutral-gray italic text-lg leading-relaxed">
                      "{testimonial.quote}"
                    </Typography>
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="h4" className="mb-1">{testimonial.author}</Typography>
                      <Typography variant="bodySmall" className="text-primary">{testimonial.role}</Typography>
                      <Typography variant="small" className="text-neutral-gray">{testimonial.location}</Typography>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-secondary-orange fill-current" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Partners */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6 text-4xl">
              Our Partners
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-lg">
              We work hand-in-hand with government ministries, donor agencies, civil society organizations, and global allies. Our trusted partnerships drive collective solutions, innovation, and sustainability in access to justice.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <Typography variant="bodySmall" className="text-neutral-dark font-medium text-center">
                    {partner}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-secondary-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary-teal rounded-full blur-2xl"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl">
              Are you a justice innovator? A policymaker? A partner? A supporter?
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 text-xl leading-relaxed">
              Let's build a more equitable Tanzania, together.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/contact">
                <Button size="lg" className="w-full bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4 text-lg">
                  <Heart className="mr-2 h-6 w-6" />
                  Join Our Mission
                </Button>
              </Link>
              <Link to="/what-we-do">
                <Button size="lg" variant="outline" className="w-full border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                  <Eye className="mr-2 h-6 w-6" />
                  Explore Our Work
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                  <Phone className="mr-2 h-6 w-6" />
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default About;
