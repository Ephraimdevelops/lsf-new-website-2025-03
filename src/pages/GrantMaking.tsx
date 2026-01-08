import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import {
  DollarSign, Target, Users, CheckCircle, TrendingUp, Award, Calendar,
  ArrowRight, Building, Scale, FileText, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const GrantMaking = () => {
  const [activeGrantArea, setActiveGrantArea] = useState('land-rights');

  const grantAreas = [
    {
      id: 'land-rights',
      title: "Land Rights & Property",
      description: "Supporting communities in securing land tenure and property ownership rights through legal education and dispute resolution.",
      icon: <Building className="h-6 w-6" />,
      stats: { amount: "$850K", beneficiaries: "12,000+", projects: "45" },
      image: "/lovable-uploads/wanawake tunaweza beenficiaries.jpg",
      highlights: [
        "Land tenure security programs",
        "Property documentation assistance",
        "Community land use planning",
        "Dispute resolution mechanisms"
      ]
    },
    {
      id: 'women-justice',
      title: "Women & Girls Justice",
      description: "Advancing safety, legal protection, and empowerment for women and girls through targeted interventions.",
      icon: <Users className="h-6 w-6" />,
      stats: { amount: "$1.2M", beneficiaries: "25,000+", projects: "68" },
      image: "/lovable-uploads/mwanamke shamba.png",
      highlights: [
        "Gender-based violence prevention",
        "Women's legal rights education",
        "Economic empowerment programs",
        "Leadership development initiatives"
      ]
    },
    {
      id: 'legal-empowerment',
      title: "Community Legal Empowerment",
      description: "Strengthening community-based legal aid and paralegal services to increase access to justice.",
      icon: <Scale className="h-6 w-6" />,
      stats: { amount: "$650K", beneficiaries: "18,000+", projects: "35" },
      image: "/lovable-uploads/SaveVid.Net_484842638_18264975178279523_2515659245077784889_n.jpg",
      highlights: [
        "Paralegal training programs",
        "Community legal education",
        "Legal aid service delivery",
        "Capacity building initiatives"
      ]
    }
  ];

  const fundingProcess = [
    { step: "01", title: "Application Review", description: "Comprehensive evaluation of project proposals based on impact potential.", timeline: "2-4 weeks" },
    { step: "02", title: "Due Diligence", description: "Thorough assessment of organizational capacity and implementation readiness.", timeline: "3-6 weeks" },
    { step: "03", title: "Award & Partnership", description: "Formal agreement with ongoing monitoring and technical assistance.", timeline: "Ongoing" }
  ];

  const outcomes = [
    { icon: <Users className="h-6 w-6" />, title: "Individuals received direct legal assistance", value: "15,000+" },
    { icon: <Award className="h-6 w-6" />, title: "Paralegals trained and certified", value: "200+" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Success rate in land dispute resolutions", value: "85%" },
    { icon: <Building className="h-6 w-6" />, title: "Community organizations strengthened", value: "50+" }
  ];

  const heroImages = [
    "/lovable-uploads/background with mother umage .png",
    "/lovable-uploads/mwanamke shamba.png",
    "/lovable-uploads/wanawake tunaweza beenficiaries.jpg"
  ];

  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    fade: true,
    arrows: false,
    pauseOnHover: false,
    speed: 2000,
  };

  const activeArea = grantAreas.find(area => area.id === activeGrantArea) || grantAreas[0];

  return (
    <Layout>
      {/* Hero Section - Slider Style */}
      <section className="relative bg-black h-[85vh] min-h-[550px] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Slider {...sliderSettings} className="h-full w-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full">
            {heroImages.map((img, idx) => (
              <div key={idx} className="h-full w-full relative">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img src={img} alt={`Grant making slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <DollarSign className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Strategic Approach</span>
            </div>

            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Grant <span className="text-white">Making</span>
            </Typography>

            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
              Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls.
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="#grant-areas">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all hover:-translate-y-1">
                  Explore Grant Areas
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 py-5 rounded-full text-base transition-all hover:-translate-y-1">
                  Apply for Funding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Grant Areas Section */}
      <section id="grant-areas" className="py-20 bg-white">
        <Container>
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Target className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Our Focus</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Key Grant <span className="text-primary">Areas</span>
            </Typography>
            <p className="text-lg text-gray-600 max-w-2xl border-l-4 border-primary pl-6">
              Our strategic funding focuses on three core areas that create the greatest impact for marginalized communities across Tanzania.
            </p>
          </div>

          {/* Grant Area Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {grantAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setActiveGrantArea(area.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all ${activeGrantArea === area.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary'
                  }`}
              >
                {area.icon}
                {area.title}
              </button>
            ))}
          </div>

          {/* Active Grant Area Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative rounded-3xl overflow-hidden h-[400px]">
              <img
                src={activeArea.image}
                alt={activeArea.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">{activeArea.stats.amount}</p>
                    <p className="text-white/80 text-sm">Funding</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">{activeArea.stats.beneficiaries}</p>
                    <p className="text-white/80 text-sm">Beneficiaries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">{activeArea.stats.projects}</p>
                    <p className="text-white/80 text-sm">Projects</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white">
                  {activeArea.icon}
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-gray-900">
                  {activeArea.title}
                </Typography>
              </div>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {activeArea.description}
              </p>

              <div className="space-y-3">
                {activeArea.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Funding Process Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <FileText className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">How It Works</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Funding <span className="text-primary">Process</span>
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fundingProcess.map((step, index) => (
              <div key={index} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="absolute -top-4 left-8 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <Typography variant="h4" className="text-xl font-bold text-gray-900 mb-3 mt-4">
                  {step.title}
                </Typography>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="inline-flex items-center text-sm text-primary font-bold">
                  <Calendar className="h-4 w-4 mr-2" />
                  {step.timeline}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Outcomes Section - With Background Image */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/IMG-20230831-WA0003.jpg')" }}
        />
        <div className="absolute inset-0 bg-primary/90" />

        <Container className="relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white rounded-full px-6 py-2 mb-5">
              <TrendingUp className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Results</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Measurable <span className="text-white">Outcomes</span>
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outcomes.map((outcome, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {outcome.icon}
                </div>
                <p className="text-4xl font-black text-white mb-2">{outcome.value}</p>
                <p className="text-white/80 text-sm">{outcome.title}</p>
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
              <DollarSign className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ready to Apply for <span className="text-primary">Funding?</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10 border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              Join our network of partners working to strengthen legal empowerment across Tanzania. We're looking for innovative organizations with proven track records.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Apply for Funding
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/what-we-do">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
                  Learn About Our Work
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default GrantMaking;
