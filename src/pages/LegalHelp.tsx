import { useState } from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import ProviderFinder from '../components/legal-aid/ProviderFinder';
import ProviderRegistration from '../components/legal-aid/ProviderRegistration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, MapPin, Clock, Users, Scale, Heart, ArrowRight, CheckCircle, AlertCircle, FileText, Gavel, Shield, BookOpen, Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const legalServices = [
  {
    icon: <Scale className="h-8 w-8" />,
    title: "Civil Legal Aid",
    description: "Free legal representation for civil matters including family law, housing disputes, and employment issues.",
    eligibility: "Income-qualified individuals",
    process: "Application review within 48 hours"
  },
  {
    icon: <Gavel className="h-8 w-8" />,
    title: "Criminal Defense",
    description: "Legal representation for criminal cases and assistance with bail applications.",
    eligibility: "Court-appointed cases",
    process: "Immediate response for urgent cases"
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Legal Documentation",
    description: "Help with legal documents, contracts, and applications for various legal processes.",
    eligibility: "All community members",
    process: "Same-day assistance available"
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Family Law",
    description: "Support for divorce, child custody, domestic violence, and inheritance matters.",
    eligibility: "Vulnerable families",
    process: "Confidential consultation"
  }
];

const contactMethods = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Emergency Hotline",
    details: "+255 870 119 363",
    description: "24/7 emergency legal assistance",
    availability: "Available 24/7"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Support",
    details: "help@lsf.or.tz",
    description: "Send us your legal questions",
    availability: "Response within 24 hours"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Visit Our Office",
    details: "Dar es Salaam Office",
    description: "Plot 123, Msimbazi Street",
    availability: "Mon-Fri: 8AM-5PM"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Find Local Provider",
    details: "Paralegal Network",
    description: "Connect with verified providers",
    availability: "Search below"
  }
];

const networkStats = [
  {
    icon: <Users className="h-8 w-8" />,
    number: "2,847",
    label: "Community Paralegals",
    description: "Trained legal aid providers across Tanzania"
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    number: "184",
    label: "Districts Covered",
    description: "Complete national coverage"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    number: "156",
    label: "Legal Aid Centers",
    description: "Physical locations for legal support"
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    number: "96%",
    label: "Success Rate",
    description: "Cases resolved successfully"
  }
];

const eligibilityCriteria = [
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: "Income Qualification",
    description: "Household income below poverty threshold"
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: "Case Merit",
    description: "Legal issue has reasonable chance of success"
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: "Geographic Coverage",
    description: "Located within our service areas"
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: "Priority Groups",
    description: "Women, children, elderly, and disabled persons receive priority"
  }
];

const applicationSteps = [
  {
    step: "1",
    title: "Initial Contact",
    description: "Call our hotline, visit our office, or contact a local paralegal to discuss your legal issue."
  },
  {
    step: "2",
    title: "Screening",
    description: "We'll assess your case and determine if you qualify for free legal aid services."
  },
  {
    step: "3",
    title: "Documentation",
    description: "Gather necessary documents and evidence related to your legal matter."
  },
  {
    step: "4",
    title: "Legal Assistance",
    description: "Receive legal representation, advice, or assistance from our qualified team."
  }
];

const LegalHelp = () => {
  const [activeTab, setActiveTab] = useState("find-help");

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Scale className="h-8 w-8" />}
        badge="Legal Assistance Platform"
        title="Connect with Legal Aid Providers"
        description="Find qualified lawyers, paralegals, and legal aid centers across Tanzania. Get the legal help you need, when you need it."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Emergency Notice */}
      <section className="bg-red-50 border-l-4 border-red-400 py-4">
        <Container>
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
            <div>
              <Typography variant="h4" className="text-red-800 font-semibold">
                Emergency Legal Assistance
              </Typography>
              <Typography variant="body" className="text-red-700">
                If you're in immediate danger or need urgent legal help, call our 24/7 hotline: +255 870 119 363
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      {/* Network Statistics */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Our Legal Aid Network</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              A comprehensive network of verified professionals ready to assist you across Tanzania.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {networkStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                    {stat.icon}
                  </div>
                  <Typography variant="h1" className="text-primary font-black mb-2">
                    {stat.number}
                  </Typography>
                  <Typography variant="h4" className="font-semibold mb-2">
                    {stat.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Legal Aid Platform */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Legal Aid Platform</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Whether you need legal help or want to provide legal services, our platform connects Tanzanians with quality legal aid.
            </Typography>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="find-help" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Find Legal Help
              </TabsTrigger>
              <TabsTrigger value="join-network" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Join Our Network
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="find-help">
              <div className="mb-8">
                <Typography variant="h3" className="text-center mb-4">
                  Find Legal Aid Providers Near You
                </Typography>
                <Typography variant="body" className="text-center text-neutral-gray mb-8">
                  Search our network of verified lawyers, paralegals, and legal aid centers across all 184 districts in Tanzania.
                </Typography>
              </div>
              <ProviderFinder />
            </TabsContent>
            
            <TabsContent value="join-network">
              <div className="mb-8">
                <Typography variant="h3" className="text-center mb-4">
                  Join Our Legal Aid Network
                </Typography>
                <Typography variant="body" className="text-center text-neutral-gray mb-8">
                  Are you a qualified legal professional? Register to join our network and help provide legal aid to Tanzanians in need.
                </Typography>
              </div>
              <ProviderRegistration />
            </TabsContent>
          </Tabs>
        </Container>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Additional Ways to Get Help</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Multiple channels to access legal assistance, designed to meet you where you are.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {method.icon}
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="h4" className="text-primary font-semibold mb-2">
                    {method.details}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray text-sm mb-2">
                    {method.description}
                  </Typography>
                  <div className="flex items-center justify-center text-xs text-green-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {method.availability}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Success Stories CTA */}
      <section className="py-16 bg-primary/5">
        <Container>
          <div className="text-center">
            <Typography variant="h2" className="mb-6">You're Not Alone</Typography>
            <Typography variant="body" className="text-neutral-gray mb-8 max-w-2xl mx-auto">
              Thousands of Tanzanians have successfully resolved their legal issues with our help. 
              Read their stories and see how we can help you too.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/heroes">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Read Success Stories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Phone className="mr-2 h-5 w-5" />
                Call Now: +255 870 119 363
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Additional Resources</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Explore more ways to understand your rights and access justice.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <Typography variant="h3" className="mb-4">Legal Resources</Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Access guides, forms, and educational materials about your legal rights.
                </Typography>
                <Link to="/resources">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Browse Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <Typography variant="h3" className="mb-4">Community Programs</Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Learn about our community legal education and empowerment programs.
                </Typography>
                <Link to="/empowered-communities">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <Typography variant="h3" className="mb-4">Support Our Work</Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Help us expand access to justice for more Tanzanians in need.
                </Typography>
                <Link to="/donate">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Support Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default LegalHelp;
