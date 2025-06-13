
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import AnimatedStats from '../components/about/AnimatedStats';
import InteractiveTimeline from '../components/about/InteractiveTimeline';
import TestimonialCarousel from '../components/about/TestimonialCarousel';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { 
  Heart, Target, Users, Scale, Globe, Award, MapPin, 
  TrendingUp, Briefcase, BookOpen, ArrowRight, CheckCircle,
  Shield, Lightbulb, Phone, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const impactHighlights = [
    {
      icon: Users,
      title: "Community Empowerment",
      description: "Training 4,000+ paralegals to bring justice to grassroots level",
      stats: "4,000+ Paralegals Trained",
      color: "from-primary to-primary-dark"
    },
    {
      icon: Scale,
      title: "Legal Reform",
      description: "Influencing 15+ policy changes for systemic improvement",
      stats: "15+ Policies Influenced",
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: Globe,
      title: "National Reach",
      description: "Operating in 184 districts across all regions of Tanzania",
      stats: "184 Districts Covered",
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: Heart,
      title: "Lives Transformed",
      description: "Directly helping 426,349+ individuals access justice",
      stats: "426K+ Lives Changed",
      color: "from-secondary-green to-secondary-green/80"
    }
  ];

  const focusAreaHighlights = [
    {
      title: "Accessible Legal Aid",
      description: "Quality legal services for everyone",
      image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
      impact: "150+ Legal Aid Centers",
      activities: ["Mobile legal clinics", "Paralegal training", "Legal help desks"]
    },
    {
      title: "Empowered Communities", 
      description: "Legal empowerment and awareness",
      image: "/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png",
      impact: "39.8M+ People Reached",
      activities: ["Community workshops", "Legal literacy", "Rights awareness"]
    },
    {
      title: "Conducive Environment",
      description: "Policy reform and advocacy",
      image: "/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png",
      impact: "15+ Policy Changes",
      activities: ["Policy advocacy", "Legislative reform", "Stakeholder engagement"]
    },
    {
      title: "Climate Justice",
      description: "Environmental rights protection",
      image: "/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png",
      impact: "50+ Communities",
      activities: ["Environmental law", "Climate litigation", "Green advocacy"]
    }
  ];

  const operationalRegions = [
    { region: "Dar es Salaam", districts: 5, population: "4.3M", programs: 25 },
    { region: "Mwanza", districts: 8, population: "2.8M", programs: 18 },
    { region: "Arusha", districts: 7, population: "1.7M", programs: 15 },
    { region: "Dodoma", districts: 6, population: "2.1M", programs: 20 },
    { region: "Mbeya", districts: 9, population: "2.7M", programs: 22 },
    { region: "Morogoro", districts: 6, population: "2.2M", programs: 16 }
  ];

  return (
    <Layout>
      <HeroSection
        icon={<Heart className="h-8 w-8" />}
        badge="About Us"
        title="Legal and Human Rights Centre"
        description="We are Tanzania's leading legal empowerment organization, dedicated to ensuring that every person has access to justice and the tools to claim their rights."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Typography variant="h2" className="mb-8">
                Our Mission & Vision
              </Typography>
              <div className="space-y-8">
                <div className="bg-primary/5 rounded-2xl p-8">
                  <Typography variant="h3" className="mb-4 text-primary">
                    Our Mission
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray leading-relaxed">
                    To strengthen access to justice for all, particularly the poor and marginalized, 
                    by building the capacity of legal aid providers and fostering an enabling environment 
                    for justice in Tanzania.
                  </Typography>
                </div>
                <div className="bg-secondary-teal/5 rounded-2xl p-8">
                  <Typography variant="h3" className="mb-4 text-secondary-teal">
                    Our Vision
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray leading-relaxed">
                    A Tanzania where every person, regardless of economic status, has meaningful 
                    access to justice and the tools necessary to claim and protect their rights.
                  </Typography>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png"
                alt="LSF team working with community members"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <Typography variant="h3" className="text-primary mb-2">Since 2011</Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  Empowering justice across Tanzania
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Highlights */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="overline" className="text-primary mb-4 block">
              OUR IMPACT HIGHLIGHTS
            </Typography>
            <Typography variant="h2" className="mb-8">
              Measuring Our Success
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Every program we run, every partnership we build, and every policy we influence contributes to meaningful change across Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactHighlights.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 text-center border border-gray-100">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <Typography variant="h4" className="mb-3">
                    {item.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray mb-4">
                    {item.description}
                  </Typography>
                  <div className="bg-primary/5 rounded-xl p-3">
                    <Typography variant="h4" className="text-primary">
                      {item.stats}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Focus Area Highlights */}
      <section className="py-24 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Our Focus Areas in Action
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Six strategic focus areas guide our work, each addressing critical aspects of Tanzania's justice landscape.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {focusAreaHighlights.map((area, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="relative h-64">
                    <img 
                      src={area.image}
                      alt={area.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <Typography variant="h3" className="mb-2">
                        {area.title}
                      </Typography>
                      <Typography variant="body" className="text-white/90">
                        {area.description}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <Typography variant="h4" className="text-primary">
                        {area.impact}
                      </Typography>
                      <Award className="h-6 w-6 text-secondary-orange" />
                    </div>
                    
                    <Typography variant="bodySmall" className="text-neutral-gray mb-4">
                      Key Activities:
                    </Typography>
                    <ul className="space-y-2">
                      {area.activities.map((activity, i) => (
                        <li key={i} className="flex items-center text-sm text-neutral-gray">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Regions Where We Work */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <div className="text-center mb-16">
            <Typography variant="h2" className="mb-8">
              Regions Where We Work
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-xl">
              Our presence spans across Tanzania's major regions, with active programs and partnerships in key urban and rural areas.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {operationalRegions.map((region, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <MapPin className="h-8 w-8 text-primary mr-4" />
                    <Typography variant="h3">{region.region}</Typography>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center bg-gray-50 rounded-xl p-4">
                      <Typography variant="h3" className="text-primary mb-1">
                        {region.districts}
                      </Typography>
                      <Typography variant="small" className="text-neutral-gray">
                        Districts
                      </Typography>
                    </div>
                    <div className="text-center bg-gray-50 rounded-xl p-4">
                      <Typography variant="h3" className="text-secondary-teal mb-1">
                        {region.population}
                      </Typography>
                      <Typography variant="small" className="text-neutral-gray">
                        Population
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-xl p-4 text-center">
                    <Typography variant="h4" className="text-primary mb-1">
                      {region.programs} Active Programs
                    </Typography>
                    <Typography variant="small" className="text-neutral-gray">
                      Community initiatives
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <AnimatedStats />
      <InteractiveTimeline />
      <TestimonialCarousel />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary-teal text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h2" className="text-white mb-8">
              Join Our Mission for Justice
            </Typography>
            <Typography variant="body" className="text-white/90 mb-12 text-xl">
              Be part of our story. Whether you need legal assistance, want to support our work, or partner with us, there's a place for you in our mission.
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                  <Phone className="mr-2 h-5 w-5" />
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary font-bold py-4">
                  <Mail className="mr-2 h-5 w-5" />
                  Partner With Us
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" className="w-full bg-secondary-orange hover:bg-secondary-orange/90 font-bold py-4">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Join Our Team
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
