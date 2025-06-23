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
  Scale,
  FileText,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent } from '../components/ui/enhanced-tabs';
import AnimatedGrantStats from '../components/what-we-do/AnimatedGrantStats';
import ProgressIndicator from '../components/shared/ProgressIndicator';

const GrantMaking = () => {
  const [activeGrantArea, setActiveGrantArea] = useState('land-rights');

  const grantAreas = [
    {
      id: 'land-rights',
      title: "Land Rights & Property",
      description: "Supporting communities in securing land tenure and property ownership rights through legal education and dispute resolution.",
      icon: <Building className="h-6 w-6" />,
      stats: { amount: "$850K", beneficiaries: "12,000+", projects: "45", completion: 72 },
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
      stats: { amount: "$1.2M", beneficiaries: "25,000+", projects: "68", completion: 85 },
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
      stats: { amount: "$650K", beneficiaries: "18,000+", projects: "35", completion: 60 },
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
    { 
      icon: <Users className="h-5 w-5" />,
      title: "Individuals received direct legal assistance",
      value: "15,000+", 
      percentage: 75,
      color: 'primary' as const
    },
    { 
      icon: <Award className="h-5 w-5" />,
      title: "Paralegals trained and certified",
      value: "200+", 
      percentage: 92,
      color: 'secondary-orange' as const
    },
    { 
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Success rate in land dispute resolutions",
      value: "85%", 
      percentage: 85,
      color: 'secondary-teal' as const
    },
    { 
      icon: <Building className="h-5 w-5" />,
      title: "Community-based organizations strengthened",
      value: "50+", 
      percentage: 68,
      color: 'secondary-yellow' as const
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'What We Do', href: '/what-we-do' },
    { label: 'Grant Making' }
  ];

  const handleTabChange = (value: string) => {
    setActiveGrantArea(value);
  };

  const activeArea = grantAreas.find(area => area.id === activeGrantArea) || grantAreas[0];

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb items={breadcrumbItems} />
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
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20 animate-fade-in">
              <DollarSign className="h-5 w-5 mr-3 text-secondary-orange" />
              <Typography variant="overline" className="text-secondary-orange font-bold">
                WHAT WE DO
              </Typography>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
              <Typography variant="display" className="text-white mb-6 text-4xl md:text-6xl font-bold">
                Grant Making
              </Typography>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Typography variant="body" className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Results-driven grants to strengthen legal empowerment — especially around land rights, 
                property ownership, safety, and justice for women and girls.
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Grant Areas Section */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-12 animate-fade-in">
            <Typography variant="h2" className="mb-6">
              Key Grant Areas
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our strategic funding focuses on three core areas that create the greatest impact 
              for marginalized communities across Tanzania.
            </Typography>
          </div>

          {/* Grant Area Tabs - Enhanced Version */}
          <div className="flex flex-col items-center mb-12 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <EnhancedTabs defaultValue={activeGrantArea} onValueChange={handleTabChange}>
              <EnhancedTabsList className="mb-8">
                {grantAreas.map((area) => (
                  <EnhancedTabsTrigger key={area.id} value={area.id} className="flex items-center space-x-2">
                    {area.icon}
                    <span>{area.title}</span>
                  </EnhancedTabsTrigger>
                ))}
              </EnhancedTabsList>

              {grantAreas.map((area) => (
                <EnhancedTabsContent key={area.id} value={area.id} className="w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                          <div className="text-primary">
                            {area.icon}
                          </div>
                        </div>
                        <Typography variant="h3">
                          {area.title}
                        </Typography>
                      </div>
                      
                      <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                        {area.description}
                      </Typography>

                      <div className="space-y-3">
                        {area.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-secondary-teal mr-3 mt-0.5 flex-shrink-0" />
                            <Typography variant="body" className="text-neutral-gray">
                              {highlight}
                            </Typography>
                          </div>
                        ))}
                      </div>

                      <ProgressIndicator 
                        value={area.stats.completion} 
                        max={100} 
                        color="primary"
                        label="Program Completion" 
                        className="mt-8"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <Card variant="elevated" className="text-center p-6 transform transition-all hover:scale-105">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-primary mb-2">
                          {area.stats.amount}
                        </div>
                        <div className="text-neutral-gray text-sm">
                          Total Funding
                        </div>
                      </Card>
                      <Card variant="elevated" className="text-center p-6 transform transition-all hover:scale-105">
                        <div className="w-12 h-12 bg-secondary-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Users className="h-6 w-6 text-secondary-teal" />
                        </div>
                        <div className="text-2xl font-bold text-secondary-teal mb-2">
                          {area.stats.beneficiaries}
                        </div>
                        <div className="text-neutral-gray text-sm">
                          Beneficiaries
                        </div>
                      </Card>
                      <Card variant="elevated" className="text-center p-6 transform transition-all hover:scale-105">
                        <div className="w-12 h-12 bg-secondary-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-6 w-6 text-secondary-orange" />
                        </div>
                        <div className="text-2xl font-bold text-secondary-orange mb-2">
                          {area.stats.projects}
                        </div>
                        <div className="text-neutral-gray text-sm">
                          Active Projects
                        </div>
                      </Card>
                    </div>
                  </div>
                </EnhancedTabsContent>
              ))}
            </EnhancedTabs>
          </div>

          {/* Funding Process */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Typography variant="h2" className="text-center mb-12">
              Our Funding Process
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fundingProcess.map((step, index) => (
                <Card 
                  key={index} 
                  variant="elevated" 
                  className="text-center p-8 relative hover-scale"
                  hover
                >
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

          {/* Outcomes Section with Enhanced Stats */}
          <div className="bg-gradient-to-br from-secondary-teal/5 to-primary/5 rounded-2xl p-8 md:p-12 animate-fade-in" style={{ animationDelay: "450ms" }}>
            <Typography variant="h2" className="text-center mb-8">
              Measurable Outcomes
            </Typography>
            <AnimatedGrantStats stats={outcomes} />
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
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
