
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Users, Scale, Heart, ArrowRight, CheckCircle, AlertCircle, FileText, Gavel } from 'lucide-react';
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
    details: "+255 123 456 789",
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
    title: "Community Paralegals",
    details: "Local Support Network",
    description: "Find a paralegal in your area",
    availability: "Across all 184 districts"
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
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Scale className="h-8 w-8" />}
        badge="Legal Assistance"
        title="Get Legal Help"
        description="Access free legal aid services across Tanzania. Our qualified lawyers and paralegals are here to help you navigate the justice system and protect your rights."
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
                If you're in immediate danger or need urgent legal help, call our 24/7 hotline: +255 123 456 789
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">How to Reach Us</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Multiple ways to access legal help, designed to meet you where you are.
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

      {/* Legal Services */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Our Legal Services</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Comprehensive legal aid services designed to address the most common legal challenges facing Tanzanians.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {legalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                      <Typography variant="body" className="text-neutral-gray">
                        {service.description}
                      </Typography>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Eligibility:</span>
                      <span className="text-neutral-gray">{service.eligibility}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Process:</span>
                      <span className="text-neutral-gray">{service.process}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Eligibility & Application Process */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Eligibility */}
            <div>
              <Typography variant="h2" className="mb-6">Eligibility Criteria</Typography>
              <Typography variant="body" className="text-neutral-gray mb-8">
                To qualify for free legal aid, you must meet certain criteria. We prioritize those most in need.
              </Typography>
              
              <div className="space-y-4">
                {eligibilityCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">
                      {criteria.icon}
                    </div>
                    <div>
                      <Typography variant="h4" className="font-semibold mb-1">
                        {criteria.title}
                      </Typography>
                      <Typography variant="body" className="text-neutral-gray text-sm">
                        {criteria.description}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Process */}
            <div>
              <Typography variant="h2" className="mb-6">Application Process</Typography>
              <Typography variant="body" className="text-neutral-gray mb-8">
                Getting legal help is straightforward. Follow these simple steps to access our services.
              </Typography>
              
              <div className="space-y-6">
                {applicationSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <Typography variant="h4" className="font-semibold mb-2">
                        {step.title}
                      </Typography>
                      <Typography variant="body" className="text-neutral-gray text-sm">
                        {step.description}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                Call Now: +255 123 456 789
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
                <Typography variant="h3" className="mb-4">Find a Paralegal</Typography>
                <Typography variant="body" className="text-neutral-gray mb-6">
                  Connect with trained community paralegals in your local area.
                </Typography>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Find Local Help
                </Button>
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
