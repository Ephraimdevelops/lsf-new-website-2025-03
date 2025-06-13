
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
  BarChart3, Quote
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

  const impactStories = [
    {
      title: "From Silence to Strength",
      subtitle: "Women's Rights Champion",
      description: "Amina's journey from a voiceless widow to a community advocate who helped 200+ women claim their inheritance rights.",
      image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
      category: "Gender Justice",
      impact: "200+ Women Empowered",
      readTime: "3 min read"
    },
    {
      title: "The Paralegal Who Changed Everything",
      subtitle: "Community Leadership",
      description: "How John transformed dispute resolution in his village, saving families thousands in legal fees and years of court battles.",
      image: "/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png",
      category: "Legal Empowerment",
      impact: "500+ Cases Resolved",
      readTime: "4 min read"
    },
    {
      title: "Justice Through Technology",
      subtitle: "Digital Innovation",
      description: "The story of how our Haki Yangu app reached remote communities, bringing legal aid to people who never thought it was possible.",
      image: "/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png",
      category: "Digital Access",
      impact: "75,000+ Users Served",
      readTime: "2 min read"
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
    }
  ];

  return (
    <Layout>
      {/* Hero Section with Compelling Story */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/lovable-uploads/background with mother umage .png')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/30"></div>
        
        <Container className="relative z-10 text-center text-white">
          <Typography variant="overline" className="text-secondary-orange mb-6 text-lg font-bold tracking-wider">
            REAL STORIES. REAL IMPACT.
          </Typography>
          <Typography variant="h1" className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Every Case Changes<br />
            <span className="text-secondary-orange">Everything</span>
          </Typography>
          <Typography variant="body" className="text-2xl mb-12 max-w-4xl mx-auto text-white/90 leading-relaxed">
            Behind every statistic is a human story of transformation. Meet the people whose lives have been forever changed through access to justice.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-xl px-8 py-4">
              <Heart className="mr-3 h-6 w-6" />
              Read Their Stories
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-xl px-8 py-4">
              <BarChart3 className="mr-3 h-6 w-6" />
              See Our Impact
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Impact Stories */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
              Stories That Inspire Change
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              These aren't just success stories—they're proof that justice can reach anyone, anywhere.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {impactStories.map((story, index) => (
              <div key={index} className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4">
                <div className="aspect-[4/5] relative">
                  <img 
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-secondary-orange/90 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                      {story.category}
                    </span>
                  </div>

                  {/* Impact Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {story.impact}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <Typography variant="overline" className="text-secondary-orange mb-2 text-sm">
                      {story.subtitle}
                    </Typography>
                    <Typography variant="h3" className="text-white mb-4 text-2xl leading-tight">
                      {story.title}
                    </Typography>
                    <Typography variant="body" className="text-white/90 mb-6 leading-relaxed">
                      {story.description}
                    </Typography>
                    <div className="flex items-center justify-between">
                      <Button className="bg-primary hover:bg-primary/90 group-hover:bg-secondary-orange group-hover:hover:bg-secondary-orange/90 transition-all duration-300">
                        Read Full Story
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-white/70 text-sm">{story.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Visual Impact Statistics */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-secondary-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-secondary-teal rounded-full blur-3xl"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl">
              The Numbers Tell Our Story
            </Typography>
            <Typography variant="body" className="text-white/90 max-w-3xl mx-auto text-xl">
              Each statistic represents lives transformed and communities empowered across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bigPictureMetrics.map((metric, index) => (
              <div key={index} className="group text-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105">
                  <div className="w-20 h-20 bg-secondary-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-orange/30 transition-colors">
                    <metric.icon className="h-10 w-10 text-secondary-orange" />
                  </div>
                  <div className="mb-4">
                    <Typography variant="h1" className="text-5xl text-white font-bold">
                      <AnimatedCounter 
                        end={metric.value} 
                        suffix={metric.suffix || ""} 
                        duration={2000}
                      />
                    </Typography>
                  </div>
                  <Typography variant="h4" className="text-white mb-3 text-xl">
                    {metric.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/80">
                    {metric.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Human Stories Testimonials */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl">
              In Their Own Words
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              The most powerful measure of our impact comes from the voices of those we serve.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <Quote className="h-12 w-12 text-primary/20 absolute top-6 right-6" />
                
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-primary/10"
                  />
                  <div>
                    <Typography variant="h4" className="mb-1">{testimonial.name}</Typography>
                    <Typography variant="bodySmall" className="text-primary font-medium">{testimonial.role}</Typography>
                    <Typography variant="small" className="text-neutral-gray">{testimonial.location}</Typography>
                  </div>
                </div>
                
                <blockquote className="mb-6">
                  <Typography variant="body" className="text-neutral-gray italic leading-relaxed text-lg">
                    "{testimonial.quote}"
                  </Typography>
                </blockquote>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-secondary-orange fill-current" />
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/lovable-uploads/background with mother umage .png')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-white mb-8 text-4xl md:text-5xl">
              Your Support Creates These Stories
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 text-xl leading-relaxed">
              Every donation, every partnership, every voice raised for justice contributes to the transformation you see here. 
              Be part of the next success story.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4 text-lg">
                <Heart className="mr-2 h-6 w-6" />
                Donate Now
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                <Users className="mr-2 h-6 w-6" />
                Partner With Us
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                <Download className="mr-2 h-6 w-6" />
                Read Reports
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-4 text-lg">
                <Briefcase className="mr-2 h-6 w-6" />
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
