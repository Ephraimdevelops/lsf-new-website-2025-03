import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Globe, Handshake, Building, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PartnershipsNetworking = () => {
  useEffect(() => {
    document.title = 'Partnerships & Networking - Legal Services Facility';
  }, []);

  const heroImages = [
    "/lovable-uploads/Danida-lsf-signing.jpg",
    "/lovable-uploads/lsf-10years-annivervasry.jpg",
    "/lovable-uploads/msaada kisheria lsf yazindua .webp"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const partnerTypes = [
    { icon: <Building className="h-6 w-6" />, title: "Government Institutions", description: "Collaborating with ministries, courts, and local government authorities to strengthen the justice system.", examples: ["Ministry of Constitutional and Legal Affairs", "Judiciary of Tanzania", "Regional Administration"], image: "/lovable-uploads/Danida-lsf-signing.jpg" },
    { icon: <Globe className="h-6 w-6" />, title: "Civil Society", description: "Working with NGOs, community organizations, and advocacy groups to amplify grassroots voices.", examples: ["Women's Rights Organizations", "Community Based Organizations", "Faith-Based Organizations"], image: "/lovable-uploads/wanawake tunaweza beenficiaries.jpg" },
    { icon: <Handshake className="h-6 w-6" />, title: "Development Partners", description: "Engaging with international donors and development agencies to scale our impact.", examples: ["DANIDA", "FCDO", "European Union", "World Bank", "WINGS", "ENABEL"], image: "/lovable-uploads/lsf-10years-annivervasry.jpg" }
  ];

  const networks = [
    { name: "Tanzania Legal Aid Network", role: "Founding Member & Secretariat", impact: "50+ member organizations" },
    { name: "East African Legal Aid Network", role: "Executive Committee Member", impact: "Cross-border advocacy" },
    { name: "Women's Legal Aid Coalition", role: "Co-Chair", impact: "Gender justice advocacy" },
    { name: "Paralegal Advisory Network", role: "Technical Lead", impact: "500+ trained paralegals" },
    { name: "Justice Reform Consortium", role: "Steering Committee", impact: "Policy reform initiatives" }
  ];

  const achievements = [
    { value: '150+', label: 'Active Partnerships', description: 'Across government, civil society, and development sectors' },
    { value: '12', label: 'Annual Dialogues', description: 'Multi-stakeholder dialogue sessions' },
    { value: '15+', label: 'Successful Campaigns', description: 'Joint advocacy campaigns coordinated' }
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
                <img src={img} alt={`Partnership slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <Handshake className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Strategic Approach</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Partnerships & <span className="text-white">Networking</span>
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
              We collaborate with a broad ecosystem of stakeholders to create lasting change in Tanzania's justice sector.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/partners">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all hover:-translate-y-1">
                  View Our Partners <ArrowRight className="ml-3 h-5 w-5" />
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
                <Globe className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Collaborative Impact</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Building Bridges for <span className="text-primary">Justice</span>
              </Typography>
              <p className="text-lg text-gray-600 mb-8 border-l-4 border-primary pl-6">
                We believe that sustainable change in the justice sector requires collaborative effort across multiple stakeholders.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through strategic alliances and active networking, we facilitate knowledge sharing, coordinate interventions, and advocate for systemic reforms that benefit all Tanzanians. Our partnership strategy brings together diverse actors to create synergies and amplify impact.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden h-[400px]">
              <img src="/lovable-uploads/Danida-lsf-signing.jpg" alt="Partnership" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-5xl font-black mb-2">150+</p>
                <p className="text-white/90">Active partnerships across sectors</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Partnership Categories */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Users className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Partner Categories</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Partnership <span className="text-primary">Ecosystem</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img src={type.image} alt={type.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg text-primary">{type.icon}</div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h4>
                  <p className="text-gray-600 mb-6">{type.description}</p>
                  <div className="space-y-2">
                    {type.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />{example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Achievements Stats */}
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

      {/* Networks Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Award className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Networks</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Strategic <span className="text-primary">Networks</span>
            </Typography>
            <p className="text-lg text-gray-600 max-w-2xl border-l-4 border-primary pl-6">
              Active participation in key networks amplifies our advocacy and extends our reach across the region.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networks.map((network, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border-l-4 border-primary hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{network.name}</h4>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold inline-block mb-3">{network.role}</div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 text-primary mr-2" />{network.impact}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/brand-pattern.png')", backgroundSize: '200px' }} />
        <div className="absolute inset-0 bg-primary/95" />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 mb-5">
              <Handshake className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ready to <span className="text-white">Collaborate?</span>
            </Typography>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              We're always looking for new partners who share our vision of accessible justice for all. Let's explore how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 py-5 rounded-full text-base">
                  Contact Us <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-10 py-5 rounded-full text-base">
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

export default PartnershipsNetworking;
