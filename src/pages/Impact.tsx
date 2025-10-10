import Layout from '../components/layout/Layout';
import AppleStyleMetrics from '../components/home/AppleStyleMetrics';
import ModernCallToAction from '../components/home/ModernCallToAction';

// SDG Progress Section
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Card, CardContent } from '@/components/ui/card';

const sdgGoals = [
  {
    number: 5,
    title: "Gender Equality",
    description: "Empowering women through legal education and land rights",
    impact: "47,000+ women accessing land rights",
    color: "secondary-orange"
  },
  {
    number: 16,
    title: "Peace, Justice and Strong Institutions",
    description: "Building robust legal frameworks and accessible justice",
    impact: "426,349+ legal aid beneficiaries",
    color: "primary"
  },
  {
    number: 17,
    title: "Partnerships for the Goals",
    description: "Collaborative approach with government and civil society",
    impact: "90+ partner organizations strengthened",
    color: "secondary-teal"
  }
];

const SDGProgress = () => (
  <section className="py-16 bg-gray-50">
    <Container>
      <div className="text-center mb-12">
        <Typography variant="h2" className="mb-6">Progress Towards SDGs</Typography>
        <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
          Our work directly contributes to the United Nations Sustainable Development Goals, creating measurable impact towards global targets.
        </Typography>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sdgGoals.map((goal, index) => (
          <Card 
            key={index}
            className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white"
          >
            <CardContent className="p-8 text-center">
              <div className={`w-20 h-20 bg-${goal.color}/10 rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Typography variant="h2" className={`font-black text-${goal.color}`}>
                  {goal.number}
                </Typography>
              </div>
              <Typography variant="h4" className="font-bold mb-4 text-neutral-dark">
                SDG {goal.number}
              </Typography>
              <Typography variant="h4" className="font-semibold mb-4 text-neutral-dark">
                {goal.title}
              </Typography>
              <Typography variant="body" className="text-neutral-600 mb-6 leading-relaxed">
                {goal.description}
              </Typography>
              <div className={`bg-${goal.color}/10 rounded-lg p-4`}>
                <Typography variant="bodySmall" className={`font-semibold text-${goal.color}`}>
                  Key Impact
                </Typography>
                <Typography variant="body" className="text-neutral-dark font-medium">
                  {goal.impact}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

// Partner Recognition Section
const partnerLogos = [
  { name: "SIDA", description: "Core basket funder for access to justice", logo: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png" },
  { name: "EU", description: "Strategic partner on gender empowerment", logo: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png" },
  { name: "UN Women", description: "Women's rights and empowerment", logo: "/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png" },
  { name: "USAID", description: "Development cooperation and aid", logo: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png" },
];

const PartnerRecognition = () => (
  <section className="py-16 bg-white">
    <Container>
      <div className="text-center mb-12">
        <Typography variant="h2" className="mb-6">Partner & Donor Recognition</Typography>
        <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
          Our impact is made possible through strategic partnerships with leading development organizations.
        </Typography>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {partnerLogos.map((partner, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-neutral-50 to-white p-6"
          >
            <CardContent className="text-center p-0">
              <div className="mb-4">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className="h-16 mx-auto object-contain"
                />
              </div>
              <Typography variant="h4" className="font-bold mb-2 text-neutral-dark">
                {partner.name}
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                {partner.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  </section>
);

const Impact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Container size="2xl" className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Our Impact
              </Typography>
            </div>
            
            <Typography 
              variant="h1" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Transforming Lives Through
              <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                Access to Justice
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Discover the measurable impact of our legal empowerment programs across Tanzania, 
              from individual stories of transformation to systemic change that benefits entire communities.
            </Typography>
          </div>
        </Container>
      </section>

      {/* Impact Metrics */}
      <AppleStyleMetrics />
      
      {/* SDG Progress */}
      <SDGProgress />
      
      {/* Partner Recognition */}
      <PartnerRecognition />
      
      {/* Call to Action */}
      <ModernCallToAction />
    </Layout>
  );
};

export default Impact;