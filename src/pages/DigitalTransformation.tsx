import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Smartphone, Database, Users, BarChart, ArrowRight, CheckCircle, Award, Quote } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import HakiYanguChatbot from '@/components/haki-yangu/HakiYanguChatbot';

const DigitalTransformation = () => {
  useEffect(() => {
    document.title = 'Digital Transformation - Legal Services Facility';
  }, []);

  const heroImages = [
    "/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png",
    "/lovable-uploads/lsf-10years-annivervasry.jpg",
    "/lovable-uploads/Danida-lsf-signing.jpg"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const statistics = [
    { value: '60%', description: 'improvement in case processing time through digital systems' },
    { value: '3x', description: 'increase in service reach through digital platforms' },
    { value: '85%', description: 'user satisfaction with digital legal aid tools' },
    { value: '40%', description: 'reduction in operational costs through automation' }
  ];

  const methods = [
    { icon: <Smartphone className="h-6 w-6" />, title: 'Mobile Legal Platforms', description: 'Developing mobile applications that provide legal information, guidance, and connection to services directly on smartphones.' },
    { icon: <Database className="h-6 w-6" />, title: 'Digital Case Management', description: 'Implementing comprehensive case tracking and management systems to improve efficiency and transparency.' },
    { icon: <Users className="h-6 w-6" />, title: 'Virtual Training Systems', description: 'Creating online training platforms for paralegals and legal aid providers to enhance capacity building.' },
    { icon: <BarChart className="h-6 w-6" />, title: 'Data Analytics', description: 'Utilizing data systems to track impact, identify trends, and inform evidence-based decision making.' }
  ];

  const projects = [
    { name: 'Haki Digital Platform', description: 'Comprehensive digital platform providing legal information, case tracking, and connection to legal aid services through mobile and web applications.', regions: '26', beneficiaries: '50,000+', outcome: '90% Adoption' },
    { name: 'Paralegal Training App', description: 'Mobile application providing interactive training modules for community paralegals with certification tracking and continuing education.', regions: '20', beneficiaries: '2,500+', outcome: '95% Completion' }
  ];

  const impactMetrics = [
    { value: '75,000+', label: 'Digital Users' },
    { value: '15,000+', label: 'Cases Digitized' },
    { value: '500+', label: 'Trained Digitally' },
    { value: '26', label: 'Regions Connected' }
  ];

  return (
    <Layout>
      {/* Hero Section - CENTER ALIGNED, NO BORDER */}
      <section className="relative bg-black h-[85vh] min-h-[550px] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Slider {...sliderSettings} className="h-full w-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full">
            {heroImages.map((img, idx) => (
              <div key={idx} className="h-full w-full relative">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img src={img} alt={`Digital slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center items-center text-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <Smartphone className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Focus Area</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Digital Transformation
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
              Modernizing legal aid through innovation and technology to expand reach and enhance accessibility.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link to="#why-this-matters">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all hover:-translate-y-1">
                  Learn More <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/impact">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 py-5 rounded-full text-base transition-all hover:-translate-y-1">
                  View Impact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section id="why-this-matters" className="py-20 bg-white">
        <Container>
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Smartphone className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">The Opportunity</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why This <span className="text-primary">Matters</span>
            </Typography>
            <p className="text-lg text-gray-600 max-w-3xl">
              Digital transformation is essential for expanding the reach and efficiency of legal aid services. By leveraging technology, we can overcome geographic barriers, streamline operations, and provide more accessible and transparent services to communities in need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <p className="text-5xl font-black text-primary mb-3">{stat.value}</p>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <CheckCircle className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Approach</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How We <span className="text-primary">Innovate</span>
            </Typography>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our digital transformation strategy focuses on creating user-friendly, accessible technology solutions that enhance service delivery while maintaining our human-centered approach.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white">{method.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900">{method.title}</h4>
                </div>
                <p className="text-gray-600">{method.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Projects */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/brand-pattern.png')", backgroundSize: '200px' }} />
        <div className="absolute inset-0 bg-primary/95" />
        <Container className="relative z-10">
          <div className="mb-12 text-center text-white">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 mb-5">
              <Award className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Featured Projects</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Digital <span className="text-white">Innovations</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">{project.name}</h3>
                <p className="text-white/80 mb-6">{project.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{project.regions}</p>
                    <p className="text-white/70 text-sm">Regions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{project.beneficiaries}</p>
                    <p className="text-white/70 text-sm">Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{project.outcome}</p>
                    <p className="text-white/70 text-sm">Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* WhatsApp Chatbot Integration */}
      <HakiYanguChatbot />

      {/* Impact Stats */}
      <section className="py-16 bg-primary">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="text-center text-white">
                <p className="text-4xl md:text-5xl font-black mb-2">{metric.value}</p>
                <p className="text-white/80 text-sm">{metric.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-12 w-12 text-primary mx-auto mb-6" />
            <blockquote className="text-2xl text-gray-900 italic mb-6">
              "The mobile legal aid app has been a game-changer for our community. We can now access legal information and submit cases from our village without traveling to the city."
            </blockquote>
            <cite className="text-gray-600">
              — Joseph Mwalimu, Community Paralegal, Mwanza Region
            </cite>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Database className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Embrace Digital <span className="text-primary">Innovation</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10">
              Join us in leveraging technology to make legal aid more accessible, efficient, and impactful for communities across Tanzania.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/resources">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Explore Digital Tools <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default DigitalTransformation;