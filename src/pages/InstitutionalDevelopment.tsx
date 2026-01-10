import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Building, Users, ArrowRight, DollarSign, BookOpen, CheckCircle, Award, Quote } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const InstitutionalDevelopment = () => {
  useEffect(() => {
    document.title = 'Institutional Development - Legal Services Facility';
  }, []);

  const heroImages = [
    "/lovable-uploads/lsf-10years-annivervasry.jpg",
    "/lovable-uploads/Danida-lsf-signing.jpg",
    "/lovable-uploads/msaada kisheria lsf yazindua .webp"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const statistics = [
    { value: '$47M+', description: 'in development funds managed over 15 years' },
    { value: '200+', description: 'strategic partnerships established' }
  ];

  const methods = [
    { icon: <Building className="h-6 w-6" />, title: 'Organizational Development', description: 'Building robust governance systems and management capacity' },
    { icon: <DollarSign className="h-6 w-6" />, title: 'Financial Sustainability', description: 'Diversifying funding sources and improving resource management' },
    { icon: <Users className="h-6 w-6" />, title: 'Partnership Building', description: 'Strengthening the broader legal aid ecosystem through collaboration' },
    { icon: <BookOpen className="h-6 w-6" />, title: 'Knowledge Management', description: 'Capturing and sharing learning for sector-wide improvement' }
  ];

  const projects = [
    { name: 'Strategic Plan 2025-2030', description: 'Comprehensive institutional development plan focusing on sustainability, innovation, and expanded impact across Tanzania.', regions: 'National', beneficiaries: 'Sector-wide', outcome: 'Direction Set' },
    { name: 'Partner Capacity Program', description: 'Comprehensive capacity building program for CSO partners, strengthening organizational systems and service delivery.', regions: '31', beneficiaries: '200+ CSOs', outcome: '80% improvement' }
  ];

  const impactMetrics = [
    { value: '15+', label: 'Years Operating' },
    { value: '$47M+', label: 'Resources Mobilized' },
    { value: '200+', label: 'Partner Organizations' },
    { value: '95%', label: 'Donor Satisfaction' }
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
                <img src={img} alt={`Institution slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center items-center text-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <Building className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Focus Area</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Institutional Development and Sustainability
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
              Strengthening the organizational capacity, financial sustainability, and operational effectiveness of LSF and the broader legal aid sector to ensure long-term impact and resilience.
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
              <Building className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">The Foundation</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why This <span className="text-primary">Matters</span>
            </Typography>
            <p className="text-lg text-gray-600 max-w-3xl">
              Sustainable impact requires strong institutions. LSF invests in organizational development, financial sustainability, and strategic partnerships to ensure our mission continues for generations to come.
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
              How We <span className="text-primary">Build Capacity</span>
            </Typography>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We strengthen institutional capacity through robust governance, financial sustainability, technology integration, and strategic partnerships that amplify our collective impact.
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
              <span className="font-bold text-sm uppercase tracking-widest">Strategic Initiatives</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Building for the <span className="text-white">Future</span>
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
                    <p className="text-white/70 text-sm">Coverage</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{project.beneficiaries}</p>
                    <p className="text-white/70 text-sm">Beneficiaries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{project.outcome}</p>
                    <p className="text-white/70 text-sm">Outcome</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

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
              "LSF's institutional strength and commitment to sustainability makes them an ideal partner for long-term justice initiatives."
            </blockquote>
            <cite className="text-gray-600">
              — Dr. Sarah Mitchell, International Development Advisor
            </cite>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Users className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Build Sustainable <span className="text-primary">Justice</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10">
              Partner with us to strengthen institutions and build lasting capacity for access to justice across Tanzania.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Become a Partner <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/publications">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
                  Annual Report
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default InstitutionalDevelopment;