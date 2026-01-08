import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart3, Lightbulb, Search, ArrowRight, FileText, Award, TrendingUp, Download } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LearningResearch = () => {
  useEffect(() => {
    document.title = 'Learning & Research - Legal Services Facility';
  }, []);

  const heroImages = [
    "/lovable-uploads/lsf-10years-annivervasry.jpg",
    "/lovable-uploads/Danida-lsf-signing.jpg",
    "/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const researchAreas = [
    { icon: <BarChart3 className="h-6 w-6" />, title: "Impact Assessment", description: "Measuring the effectiveness of legal aid interventions and their outcomes for continuous improvement." },
    { icon: <Lightbulb className="h-6 w-6" />, title: "Innovation Pilots", description: "Testing new approaches and models for legal service delivery before scaling successful methods." },
    { icon: <Search className="h-6 w-6" />, title: "Best Practices", description: "Identifying and documenting successful strategies for replication across our network." }
  ];

  const publications = [
    { title: "Annual Impact Assessment Report", year: "2024", type: "Report" },
    { title: "Paralegal Effectiveness Study", year: "2023", type: "Study" },
    { title: "Women's Access to Justice Survey", year: "2023", type: "Survey" },
    { title: "Digital Legal Aid Pilot Evaluation", year: "2024", type: "Evaluation" },
    { title: "Community Legal Education Impact Study", year: "2023", type: "Study" }
  ];

  const stats = [
    { value: '25+', label: 'Research Studies', description: 'Conducted to improve legal aid effectiveness' },
    { value: '100%', label: 'Evidence-Based', description: 'Decisions driven by data and research' },
    { value: '15+', label: 'Innovation Pilots', description: 'New models tested and refined' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-black h-[85vh] min-h-[550px] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Slider {...sliderSettings} className="h-full w-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full">
            {heroImages.map((img, idx) => (
              <div key={idx} className="h-full w-full relative">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img src={img} alt={`Research slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <BookOpen className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Strategic Approach</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Learning & <span className="text-white">Research</span>
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
              Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn't.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/publications">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all hover:-translate-y-1">
                  View Publications <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 py-5 rounded-full text-base transition-all hover:-translate-y-1">
                  Explore Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
                <BarChart3 className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Overview</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Evidence-Based <span className="text-primary">Approach</span>
              </Typography>
              <p className="text-lg text-gray-600 mb-8 border-l-4 border-primary pl-6">
                Our commitment to continuous learning drives everything we do. We systematically collect data, analyze outcomes, and use evidence to inform our strategies.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through rigorous research and pilot programs, we test innovative approaches and document lessons learned to benefit the broader legal aid community in Tanzania and beyond. This approach ensures that our interventions are effective and our resources are used efficiently.
              </p>
            </div>
            <div className="bg-primary rounded-3xl p-10 text-white">
              <BookOpen className="h-12 w-12 mb-6 text-white/80" />
              <p className="text-6xl md:text-7xl font-black mb-4">25+</p>
              <p className="text-xl font-bold text-white/90 mb-4">Research Studies Conducted</p>
              <p className="text-white/80 leading-relaxed">
                Comprehensive research and evaluations conducted to improve legal aid effectiveness across Tanzania.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Research Focus Areas */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Search className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Focus</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Research Focus <span className="text-primary">Areas</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">{area.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h4>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Publications Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/brand-pattern.png')", backgroundSize: '200px' }} />
        <div className="absolute inset-0 bg-primary/95" />
        <Container className="relative z-10">
          <div className="mb-12 text-center text-white">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 mb-5">
              <FileText className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Knowledge Products</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Key Publications & <span className="text-white">Studies</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">{pub.year}</span>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">{pub.type}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-4">{pub.title}</h4>
                <button className="flex items-center text-white/80 hover:text-white text-sm font-bold">
                  <Download className="h-4 w-4 mr-2" /> Download
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/publications">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 py-5 rounded-full text-base">
                View All Publications <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <p className="text-5xl md:text-6xl font-black mb-2">{stat.value}</p>
                <p className="text-white/90 font-bold text-lg mb-2">{stat.label}</p>
                <p className="text-white/70">{stat.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Lightbulb className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Collaborate</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Partner in <span className="text-primary">Research</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10 border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              We're always looking for research partners, academic institutions, and organizations interested in advancing evidence-based legal aid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Partner With Us <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
                  Explore Resources
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default LearningResearch;
