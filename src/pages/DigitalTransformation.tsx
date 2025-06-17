
import { Smartphone, Wifi, Database, Shield, Users, Globe, Zap, ArrowRight, CheckCircle, Star, Download } from 'lucide-react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const digitalInitiatives = [
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: 'Mobile Legal Aid Platform',
    description: 'Revolutionary mobile app connecting Tanzanians with legal help via SMS, WhatsApp, and USSD codes.',
    features: ['USSD access (*123#)', 'WhatsApp integration', 'SMS alerts', 'Offline capabilities'],
    impact: '150,000+ users reached',
    status: 'Live',
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: 'Legal Information Management System',
    description: 'Comprehensive database of legal resources, case law, and procedures accessible in Swahili and English.',
    features: ['Multi-language support', 'Case tracking', 'Document management', 'Analytics dashboard'],
    impact: '50,000+ documents digitized',
    status: 'Live',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Digital Paralegal Training',
    description: 'Online certification platform training community paralegals across all 184 districts in Tanzania.',
    features: ['Video modules', 'Interactive assessments', 'Virtual mentorship', 'Digital certificates'],
    impact: '2,500+ paralegals trained',
    status: 'Live',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Blockchain Legal Registry',
    description: 'Secure, tamper-proof system for legal document verification and case outcome tracking.',
    features: ['Document verification', 'Case immutability', 'Smart contracts', 'Audit trails'],
    impact: '25,000+ documents secured',
    status: 'Pilot',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const digitalStats = [
  { number: '500K+', label: 'Digital Interactions', description: 'Legal consultations via digital platforms' },
  { number: '95%', label: 'Mobile Coverage', description: 'Tanzanian districts with mobile legal access' },
  { number: '12', label: 'Languages Supported', description: 'Including Swahili and major local languages' },
  { number: '24/7', label: 'Always Available', description: 'Round-the-clock digital legal support' }
];

const technologyPartners = [
  {
    name: 'Vodacom Tanzania',
    role: 'Mobile Network Partner',
    contribution: 'USSD platform and SMS infrastructure',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Microsoft Tanzania',
    role: 'Cloud Infrastructure',
    contribution: 'Azure cloud services and AI capabilities',
    logo: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Tanzania Telecommunications',
    role: 'Connectivity Partner',
    contribution: 'Rural internet access and infrastructure',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

const upcomingFeatures = [
  {
    title: 'AI-Powered Legal Assistant',
    description: 'Natural language processing for instant legal guidance in Swahili',
    timeline: 'Q2 2025',
    icon: <Zap className="h-6 w-6" />
  },
  {
    title: 'Virtual Court Integration',
    description: 'Remote hearing capabilities for rural communities',
    timeline: 'Q3 2025',
    icon: <Globe className="h-6 w-6" />
  },
  {
    title: 'Community Legal Networks',
    description: 'Peer-to-peer legal support and knowledge sharing platform',
    timeline: 'Q4 2025',
    icon: <Users className="h-6 w-6" />
  }
];

const DigitalTransformation = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Smartphone className="h-8 w-8" />}
        badge="Digital Innovation"
        title="Digital Legal Empowerment"
        description="Revolutionizing access to justice through innovative technology solutions that bring legal aid to every corner of Tanzania, from urban centers to the most remote villages."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Digital Impact Stats */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Digital Justice Revolution</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Technology is breaking down barriers to justice, making legal aid accessible to millions of Tanzanians.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {digitalStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Typography variant="h3" className="text-white font-bold">
                      {stat.number.charAt(0)}
                    </Typography>
                  </div>
                  <Typography variant="h1" className="text-blue-600 font-black mb-2">
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

      {/* Digital Initiatives */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Digital Justice Platforms</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Innovative digital solutions making legal aid accessible, affordable, and available to all Tanzanians.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {digitalInitiatives.map((initiative, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden">
                <div className="relative overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={initiative.image} 
                      alt={initiative.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`${initiative.status === 'Live' ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
                      {initiative.status}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        {initiative.icon}
                      </div>
                      <Typography variant="h4" className="text-white font-semibold">
                        {initiative.title}
                      </Typography>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <Typography variant="body" className="text-neutral-gray mb-4 leading-relaxed">
                    {initiative.description}
                  </Typography>
                  
                  <div className="mb-4">
                    <Typography variant="bodySmall" className="font-semibold mb-2">
                      Key Features:
                    </Typography>
                    <div className="grid grid-cols-2 gap-2">
                      {initiative.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-neutral-gray">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {initiative.impact}
                    </Badge>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Technology Partners */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Technology Partners</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Collaborating with leading technology companies to deliver world-class digital legal solutions.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologyPartners.map((partner, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <Typography variant="h3" className="mb-2 font-semibold">
                    {partner.name}
                  </Typography>
                  <Typography variant="bodySmall" className="text-blue-600 font-medium mb-3">
                    {partner.role}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {partner.contribution}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Upcoming Features */}
      <section className="py-16 bg-blue-600 text-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-white mb-6">What's Coming Next</Typography>
            <Typography variant="body" className="text-blue-100 max-w-2xl mx-auto">
              The future of digital legal empowerment is being built today. Here's what's coming next.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <Typography variant="h3" className="text-white mb-3 font-semibold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body" className="text-blue-100 mb-4">
                    {feature.description}
                  </Typography>
                  <Badge className="bg-orange-500 text-white">
                    {feature.timeline}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Digital Divide Solutions */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Typography variant="h2" className="mb-6">Bridging the Digital Divide</Typography>
              <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                We understand that not everyone has smartphones or internet access. That's why our digital solutions work across all technology levels - from basic feature phones to smartphones.
              </Typography>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <Typography variant="h4" className="font-semibold mb-1">
                      USSD Technology (*123#)
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Works on any mobile phone, even without internet connection
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <Typography variant="h4" className="font-semibold mb-1">
                      SMS Legal Alerts
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Critical legal information delivered via text messages
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <Typography variant="h4" className="font-semibold mb-1">
                      Community Digital Hubs
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      Shared access points in rural areas with trained facilitators
                    </Typography>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Access Digital Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <Typography variant="h1" className="text-blue-600 font-bold mb-2">
                    98%
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Mobile Phone Coverage
                  </Typography>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0">
                <CardContent className="p-6 text-center">
                  <Wifi className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <Typography variant="h1" className="text-green-600 font-bold mb-2">
                    75%
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Internet Accessibility
                  </Typography>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 col-span-2">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <Typography variant="h1" className="text-purple-600 font-bold mb-2">
                    2.5M+
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Tanzanians Reached Through Digital Platforms
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <Container>
          <div className="text-center">
            <Typography variant="h2" className="text-white mb-6">Join the Digital Justice Revolution</Typography>
            <Typography variant="body" className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you're seeking legal help or want to contribute to our digital transformation, there's a place for you in our technology-driven justice ecosystem.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/legal-help">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Access Digital Legal Aid
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Download className="mr-2 h-5 w-5" />
                Download Our App
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default DigitalTransformation;
