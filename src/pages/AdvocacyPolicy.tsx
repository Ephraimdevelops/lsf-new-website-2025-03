import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Container from '../components/shared/Container';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Megaphone, Scale, FileText, Users, Gavel, Building2, ArrowRight, CheckCircle, Award, Calendar } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AdvocacyPolicy = () => {
  useEffect(() => {
    document.title = 'Advocacy and Policy Influence - Legal Services Facility';
  }, []);

  const heroImages = [
    "/lovable-uploads/Danida-lsf-signing.jpg",
    "/lovable-uploads/lsf-10years-annivervasry.jpg",
    "/lovable-uploads/msaada kisheria lsf yazindua .webp"
  ];

  const sliderSettings = {
    autoplay: true, autoplaySpeed: 5000, infinite: true, fade: true, arrows: false, pauseOnHover: false, speed: 2000,
  };

  const objectives = [
    { icon: <Scale className="h-6 w-6" />, title: 'Policy Development', description: 'Champion the development of progressive legal frameworks that enhance access to justice for all Tanzanians.' },
    { icon: <Megaphone className="h-6 w-6" />, title: 'Strategic Advocacy', description: 'Influence policy decisions through evidence-based advocacy and strategic stakeholder engagement.' },
    { icon: <Users className="h-6 w-6" />, title: 'Coalition Building', description: 'Foster collaborative approaches among civil society, government, and development partners.' },
    { icon: <Gavel className="h-6 w-6" />, title: 'Implementation Support', description: 'Support the effective implementation of progressive legal and policy reforms.' }
  ];

  const keyActivities = [
    { icon: <FileText className="h-6 w-6" />, title: 'Policy Research & Analysis', description: 'Conducting comprehensive research to inform evidence-based policy recommendations and advocacy strategies.' },
    { icon: <Users className="h-6 w-6" />, title: 'Stakeholder Engagement', description: 'Facilitating multi-stakeholder dialogues and building coalitions for justice sector reforms.' },
    { icon: <Building2 className="h-6 w-6" />, title: 'Campaign Implementation', description: 'Leading national campaigns to raise awareness and build support for key policy initiatives.' }
  ];

  const flagshipProjects = [
    { name: 'Legal Aid Act Development', description: 'Championed the development and enactment of Tanzania\'s comprehensive Legal Aid Act, establishing a national framework for legal aid provision.', outcomes: [{ value: '100%', label: 'Parliamentary Approval' }, { value: '26', label: 'Regions Covered' }, { value: '50M+', label: 'Citizens Benefited' }] },
    { name: 'Mama Samia Legal Aid Campaign', description: 'Nationwide initiative operationalizing the Legal Aid Act and fostering coordinated stakeholder engagement in expanding legal empowerment.', outcomes: [{ value: '200+', label: 'Stakeholders Engaged' }, { value: '26', label: 'Regions Reached' }, { value: '85%', label: 'Awareness Increase' }] }
  ];

  const achievements = [
    { value: '1', label: 'National Legal Framework', description: 'Successfully advocated for the Legal Aid Act' },
    { value: '15+', label: 'Policy Reforms', description: 'Influenced key policy reforms improving access to justice' },
    { value: '500+', label: 'Stakeholders Engaged', description: 'Built extensive networks of advocates for justice reform' }
  ];

  const whatsNext = [
    { title: 'Legal Aid Act Implementation', description: 'Supporting full implementation of the Legal Aid Act across all regions.', timeline: '2024-2026' },
    { title: 'Gender Justice Policies', description: 'Advocating for enhanced legal frameworks addressing gender-based violence.', timeline: '2024-2025' },
    { title: 'Climate Justice Legal Framework', description: 'Developing policy recommendations for climate justice and environmental rights.', timeline: '2025-2027' },
    { title: 'Digital Rights Advocacy', description: 'Promoting policies that protect digital rights and enhance online access to justice.', timeline: '2025-2028' }
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
                <img src={img} alt={`Advocacy slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
              <Megaphone className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Strategic Approach</span>
            </div>
            <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              Advocacy & <span className="text-white">Policy Influence</span>
            </Typography>
            <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
              Shaping Tanzania's access to justice landscape through strategic advocacy, championing the Legal Aid Act and national campaigns.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="#flagship-projects">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all hover:-translate-y-1">
                  View Our Impact <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 py-5 rounded-full text-base transition-all hover:-translate-y-1">
                  Join Our Advocacy
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
                <Scale className="h-4 w-4" />
                <span className="font-bold text-sm uppercase tracking-widest">Overview</span>
              </div>
              <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Shaping Policy for <span className="text-primary">Justice</span>
              </Typography>
              <p className="text-lg text-gray-600 mb-8 border-l-4 border-primary pl-6">
                LSF has played a pivotal role in shaping Tanzania's access to justice landscape, notably championing the Legal Aid Act and spearheading the Mama Samia Legal Aid Campaign.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The organization championed the development and enactment of the Legal Aid Act and its accompanying regulations, establishing a national framework for legal aid provision. LSF also spearheaded a nationwide initiative that operationalizes the Act and fosters coordinated stakeholder engagement in expanding legal empowerment.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden h-[400px]">
              <img src="/lovable-uploads/Danida-lsf-signing.jpg" alt="Policy signing" className="w-full h-full object-cover" />
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
              <Gavel className="h-4 w-4" />
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
              <FileText className="h-4 w-4" />
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
              <span className="font-bold text-sm uppercase tracking-widest">Landmark Initiatives</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Flagship <span className="text-white">Projects</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {flagshipProjects.map((project, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
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

      {/* What's Next */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-5">
              <Calendar className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Future Plans</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What's <span className="text-primary">Next</span>
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatsNext.map((initiative, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{initiative.title}</h4>
                <p className="text-gray-600 mb-4">{initiative.description}</p>
                <div className="inline-flex items-center text-sm text-primary font-bold">
                  <Calendar className="h-4 w-4 mr-2" />{initiative.timeline}
                </div>
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
              <Megaphone className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Get Involved</span>
            </div>
            <Typography variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Join Our <span className="text-primary">Advocacy Efforts</span>
            </Typography>
            <p className="text-gray-600 text-lg mb-10 border-l-4 border-primary pl-6 text-left max-w-xl mx-auto">
              Partner with us to shape policies that advance access to justice and legal empowerment for all Tanzanians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/opportunities">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-base">
                  Get Involved <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-10 py-5 rounded-full text-base">
                  View Policy Resources
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default AdvocacyPolicy;