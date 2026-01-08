import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, Target, ArrowRight, GraduationCap, CheckCircle } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CapacityBuilding = () => {
  useEffect(() => {
    document.title = 'Capacity Building - Legal Services Facility';
  }, []);

  const heroImages = [
    "/lovable-uploads/SaveVid.Net_484842638_18264975178279523_2515659245077784889_n.jpg",
    "/lovable-uploads/wanawake tunaweza beenficiaries.jpg",
    "/lovable-uploads/mwanamke shamba.png"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const buildingAreas = [
    { icon: <Target className="h-6 w-6" />, title: "Institutional Capacity", description: "Strengthening organizational systems, governance, and management capabilities for sustainable impact." },
    { icon: <BookOpen className="h-6 w-6" />, title: "Technical Skills", description: "Developing specialized legal knowledge and service delivery competencies across our network." },
    { icon: <Award className="h-6 w-6" />, title: "Leadership Development", description: "Building leadership capabilities within legal aid organizations and communities." }
  ];

  const programs = [
    { name: "Paralegal Certification Program", participants: "200+", duration: "6 months" },
    { name: "Legal Aid Management Training", participants: "50+", duration: "3 months" },
    { name: "Community Mobilization Workshops", participants: "100+", duration: "2 weeks" },
    { name: "Digital Literacy for Legal Workers", participants: "75+", duration: "1 month" },
    { name: "Leadership Development Initiative", participants: "30+", duration: "12 months" }
  ];

  const stats = [
    { value: '500+', label: 'Trained Paralegals', description: 'Certified through our comprehensive programs' },
    { value: '100+', label: 'Organizations', description: 'Strengthened through capacity building' },
    { value: '95%', label: 'Satisfaction Rate', description: 'From program participants' }
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
                <img src={img} alt={`Capacity building slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <GraduationCap className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Strategic Approach</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Capacity <span className="text-white">Building</span>
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
              Strengthening both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="#programs">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all hover:-translate-y-1">
                  View Programs <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 py-5 rounded-full text-base transition-all hover:-translate-y-1">
                  Join a Program
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
                <Users className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Overview</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Building Sustainable <span className="text-primary">Capacity</span>
              </Typography>
              <p className="text-lg text-gray-600 mb-8 border-l-4 border-primary pl-6">
                Our capacity building approach focuses on creating sustainable improvements in both individual competencies and organizational systems.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We work closely with legal aid providers, paralegals, and community-based organizations to strengthen their ability to deliver quality services. Through comprehensive training programs, mentorship, and ongoing support, we ensure that capacity building translates into improved service delivery and greater impact.
              </p>
            </div>
            <div className="bg-primary rounded-3xl p-10 text-white">
              <Users className="h-12 w-12 mb-6 text-white/80" />
              <p className="text-6xl md:text-7xl font-black mb-4">500+</p>
              <p className="text-xl font-bold text-white/90 mb-4">Paralegals Trained</p>
              <p className="text-white/80 leading-relaxed">
                Certified through our comprehensive capacity building programs across Tanzania.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Target className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Focus</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Capacity Building <span className="text-primary">Focus Areas</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buildingAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">{area.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h4>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Training Programs */}
      <section id="programs" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/brand-pattern.png')", backgroundSize: '200px' }} />
        <div className="absolute inset-0 bg-primary/95" />
        <Container className="relative z-10">
          <div className="mb-12 text-center text-white">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 mb-5">
              <GraduationCap className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Programs</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Training <span className="text-white">Programs</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <h4 className="text-lg font-bold text-white mb-4">{program.name}</h4>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>{program.participants} participants</span>
                  <span>{program.duration}</span>
                </div>
              </div>
            ))}
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
              <Award className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Join Our <span className="text-primary">Programs</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10 border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              Whether you're a legal aid organization, paralegal, or community leader, we have programs designed to strengthen your capacity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Apply for Training <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default CapacityBuilding;
