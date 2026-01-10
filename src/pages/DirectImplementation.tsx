import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Target, MapPin, Users, BarChart3, Truck, Building, ArrowRight, CheckCircle, Award, TrendingUp } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DirectImplementation = () => {
  useEffect(() => {
    document.title = 'Direct Project Implementation - Legal Services Facility';
  }, []);

  const heroImages = [
    "/lovable-uploads/mwanamke shamba.png",
    "/lovable-uploads/wanawake tunaweza beenficiaries.jpg",
    "/lovable-uploads/SaveVid.Net_484842638_18264975178279523_2515659245077784889_n.jpg"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const objectives = [
    { icon: <Target className="h-6 w-6" />, title: 'Strategic Implementation', description: 'Execute high-impact projects that demonstrate innovative approaches to legal aid delivery and community empowerment.' },
    { icon: <Building className="h-6 w-6" />, title: 'Organizational Agility', description: 'Develop internal capacity for rapid response to emerging justice needs and implementation opportunities.' },
    { icon: <Users className="h-6 w-6" />, title: 'Community-Centered Approach', description: 'Ensure all implementation efforts are grounded in community needs and participatory development principles.' },
    { icon: <BarChart3 className="h-6 w-6" />, title: 'Evidence-Based Results', description: 'Generate concrete evidence of impact to inform broader sector approaches and policy development.' }
  ];

  const keyActivities = [
    { icon: <MapPin className="h-6 w-6" />, title: 'Direct Service Delivery', description: 'Implementing legal aid services directly in communities through mobile clinics, legal centers, and outreach programs.' },
    { icon: <Users className="h-6 w-6" />, title: 'Capacity Building', description: 'Training and supporting community paralegals, women leaders, and local organizations to sustain impact.' },
    { icon: <Truck className="h-6 w-6" />, title: 'Resource Mobilization', description: 'Securing funding and resources for sustainable implementation of transformative legal aid initiatives.' }
  ];

  const flagshipProjects = [
    { name: 'Sauti ya Mwanamke (IMPAWLA)', description: 'EU-funded project (€4M) through Enabel. Tanzania\'s largest grassroots movement for gender justice, deploying 4,000+ paralegals to address GBV, land rights, and legal empowerment.', outcomes: [{ value: '168', label: 'Districts' }, { value: '4,000+', label: 'Paralegals' }, { value: '60%', label: 'ADR Resolution' }], image: '/lovable-uploads/mwanamke shamba.png' },
    { name: 'Wanawake Tunaweza (Women We Can)', description: 'North-South Cooperation-funded initiative in Longido District, Arusha Region, empowering Maasai women through VICOBA economic groups and girls\' education.', outcomes: [{ value: '209', label: 'Women Trained' }, { value: '1,214', label: 'Girls Reached' }, { value: '11', label: 'VICOBA Groups' }], image: '/lovable-uploads/wanawake tunaweza beenficiaries.jpg' }
  ];

  const achievements = [
    { value: '25,000+', label: 'Direct Beneficiaries', description: 'People directly served through our implementation projects' },
    { value: '37', label: 'Districts Reached', description: 'Geographic coverage across Tanzania' },
    { value: '2', label: 'Major Projects', description: 'High-impact implementation projects currently active' }
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
                <img src={img} alt={`Implementation slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <Target className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Strategic Approach</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Direct Project <span className="text-white">Implementation</span>
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
              Leading transformative legal aid projects on the ground, enhancing agility and impact through hands-on program delivery.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="#flagship-projects">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all hover:-translate-y-1">
                  View Our Projects <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 py-5 rounded-full text-base transition-all hover:-translate-y-1">
                  Partner With Us
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
                <Building className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Overview</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Expanding Our <span className="text-primary">Impact</span>
              </Typography>
              <p className="text-lg text-gray-600 mb-8 border-l-4 border-primary pl-6">
                Since 2023, the Legal Services Facility (LSF) has strategically expanded its role to include direct project implementation, enhancing agility and impact on the ground.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are currently implementing high-impact projects such as "Sauti ya Mwanamke", funded by the European Union through ENABEL, which strengthens women's access to justice and voice in governance, and "Wanawake Tunaweza", funded by North South Cooperation, which empowers women economically and legally, particularly in rural communities.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden h-[400px]">
              <img src="/lovable-uploads/mwanamke shamba.png" alt="Implementation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* Goals & Objectives */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Target className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Objectives</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Goals & <span className="text-primary">Objectives</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white">{obj.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900">{obj.title}</h4>
                </div>
                <p className="text-gray-600">{obj.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Activities */}
      <section className="py-20 bg-white">
        <Container>
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <MapPin className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">How We Work</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Key <span className="text-primary">Activities</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyActivities.map((activity, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">{activity.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h4>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Flagship Projects */}
      <section id="flagship-projects" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/brand-pattern.png')", backgroundSize: '200px' }} />
        <div className="absolute inset-0 bg-primary/95" />
        <Container className="relative z-10">
          <div className="mb-12 text-center text-white">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 mb-5">
              <Award className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Flagship Projects</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Transformative <span className="text-white">Initiatives</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {flagshipProjects.map((project, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20">
                <div className="h-48 overflow-hidden">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{project.name}</h3>
                  <p className="text-white/80 mb-6">{project.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {project.outcomes.map((outcome, oi) => (
                      <div key={oi} className="text-center">
                        <p className="text-2xl font-black text-white">{outcome.value}</p>
                        <p className="text-white/70 text-sm">{outcome.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-primary">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center text-white">
                <p className="text-5xl md:text-6xl font-black mb-2">{achievement.value}</p>
                <p className="text-white/90 font-bold text-lg mb-2">{achievement.label}</p>
                <p className="text-white/70">{achievement.description}</p>
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
              <Users className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Partner with Our <span className="text-primary">Implementation Team</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10 border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              Join us in implementing transformative legal aid projects that create lasting change in communities across Tanzania.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/opportunities">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Explore Opportunities <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
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

export default DirectImplementation;