
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import Section from '../components/shared/Section';
import Container from '../components/shared/Container';
import Card from '../components/shared/Card';
import Breadcrumb from '../components/shared/Breadcrumb';
import { Button } from '../components/ui/button';
import { 
  DollarSign, 
  Target, 
  Users, 
  CheckCircle, 
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  ArrowRight,
  Building,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GrantMaking = () => {
  const [activeGrantArea, setActiveGrantArea] = useState('land-rights');

  const grantAreas = [
    {
      id: 'land-rights',
      title: "Land Rights & Property",
      description: "Supporting communities in securing land tenure and property ownership rights through legal education and dispute resolution.",
      icon: <Building className="h-6 w-6" />,
      stats: { amount: "$850K", beneficiaries: "12,000+", projects: "45" },
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
      highlights: [
        "Paralegal training programs",
        "Community legal education",
        "Legal aid service delivery",
        "Capacity building initiatives"
      ]
    }
  ];

  const fundingProcess = [
    {
      step: "01",
      title: "Application Review",
      description: "Comprehensive evaluation of project proposals based on impact potential and alignment with our strategic focus areas.",
      timeline: "2-4 weeks"
    },
    {
      step: "02", 
      title: "Due Diligence",
      description: "Thorough assessment of organizational capacity, financial management, and implementation readiness.",
      timeline: "3-6 weeks"
    },
    {
      step: "03",
      title: "Award & Partnership",
      description: "Formal agreement establishment with ongoing monitoring, evaluation, and technical assistance support.",
      timeline: "Ongoing"
    }
  ];

  const outcomes = [
    { metric: "15,000+", label: "Individuals received direct legal assistance", icon: <Users className="h-5 w-5" /> },
    { metric: "200+", label: "Paralegals trained and certified", icon: <Award className="h-5 w-5" /> },
    { metric: "85%", label: "Success rate in land dispute resolutions", icon: <TrendingUp className="h-5 w-5" /> },
    { metric: "50+", label: "Community-based organizations strengthened", icon: <Building className="h-5 w-5" /> }
  ];

  const activeArea = grantAreas.find(area => area.id === activeGrantArea) || grantAreas[0];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-black opacity-90"></div>
        
        <Container size="xl" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
              <DollarSign className="h-5 w-5 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold">
                WHAT WE DO
              </Typography>
            </div>
            
            <Typography variant="display" className="text-white mb-6 text-4xl md:text-6xl font-bold">
              Grant Making
            </Typography>
            
            <Typography variant="body" className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Results-driven grants to strengthen legal empowerment — especially around land rights, 
              property ownership, safety, and justice for women and girls.
            </Typography>
          </div>
        </Container>
      </section>

      {/* Interactive Grant Areas Section */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Key Grant Areas
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our strategic funding focuses on three core areas that create the greatest impact 
              for marginalized communities across Tanzania.
            </Typography>
          </div>

          {/* Grant Area Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {grantAreas.map((area) => (
              <Button
                key={area.id}
                variant={activeGrantArea === area.id ? "default" : "outline"}
                onClick={() => setActiveGrantArea(area.id)}
                className="flex items-center space-x-2"
              >
                {area.icon}
                <span>{area.title}</span>
              </Button>
            ))}
          </div>

          {/* Active Grant Area Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <div className="text-primary">
                    {activeArea.icon}
                  </div>
                </div>
                <Typography variant="h3">
                  {activeArea.title}
                </Typography>
              </div>
              
              <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                {activeArea.description}
              </Typography>

              <div className="space-y-3">
                {activeArea.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary-teal mr-3 mt-0.5 flex-shrink-0" />
                    <Typography variant="body" className="text-neutral-gray">
                      {highlight}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card variant="elevated" className="text-center p-6">
                <div className="text-2xl font-bold text-primary mb-2">
                  {activeArea.stats.amount}
                </div>
                <div className="text-neutral-gray text-sm">
                  Total Funding
                </div>
              </Card>
              <Card variant="elevated" className="text-center p-6">
                <div className="text-2xl font-bold text-secondary-teal mb-2">
                  {activeArea.stats.beneficiaries}
                </div>
                <div className="text-neutral-gray text-sm">
                  Beneficiaries
                </div>
              </Card>
              <Card variant="elevated" className="text-center p-6">
                <div className="text-2xl font-bold text-secondary-orange mb-2">
                  {activeArea.stats.projects}
                </div>
                <div className="text-neutral-gray text-sm">
                  Active Projects
                </div>
              </Card>
            </div>
          </div>

          {/* Funding Process */}
          <div className="mb-16">
            <Typography variant="h2" className="text-center mb-12">
              Our Funding Process
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fundingProcess.map((step, index) => (
                <Card key={index} variant="elevated" className="text-center p-8 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  <Typography variant="h4" className="mb-4 mt-4">
                    {step.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray mb-4">
                    {step.description}
                  </Typography>
                  <div className="inline-flex items-center text-sm text-primary font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    {step.timeline}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Outcomes Section */}
          <div className="bg-gradient-to-br from-secondary-teal/5 to-primary/5 rounded-2xl p-8 md:p-12">
            <Typography variant="h2" className="text-center mb-8">
              Measurable Outcomes
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {outcomes.map((outcome, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {outcome.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {outcome.metric}
                  </div>
                  <div className="text-neutral-gray text-sm">
                    {outcome.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto">
            <Typography variant="h2" className="text-white mb-6">
              Ready to Apply for Funding?
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8">
              Join our network of partners working to strengthen legal empowerment across Tanzania. 
              We're looking for innovative organizations with proven track records.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white">
                  Apply for Funding
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/what-we-do">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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
