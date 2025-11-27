import Layout from '../components/layout/Layout';
import AppleStyleMetrics from '../components/home/AppleStyleMetrics';
import ModernCallToAction from '../components/home/ModernCallToAction';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Handshake } from 'lucide-react';

const sdgGoals = [
  {
    number: 5,
    title: "Gender Equality",
    description: "Empowering women through legal education and land rights",
    impact: "47,000+ women accessing land rights",
    color: "secondary-orange",
    icon: Users
  },
  {
    number: 16,
    title: "Peace, Justice and Strong Institutions",
    description: "Building robust legal frameworks and accessible justice",
    impact: "426,349+ legal aid beneficiaries",
    color: "primary",
    icon: Target
  },
  {
    number: 17,
    title: "Partnerships for the Goals",
    description: "Collaborative approach with government and civil society",
    impact: "90+ partner organizations strengthened",
    color: "secondary-teal",
    icon: Handshake
  }
];

const SDGProgress = () => (
  <section className="py-24 bg-neutral-50 relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

    <Container>
      <div className="text-center mb-16 relative z-10">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
          Global Goals
        </span>
        <Typography variant="h2" className="mb-6 font-bold text-4xl md:text-5xl text-neutral-900">
          Progress Towards SDGs
        </Typography>
        <Typography variant="body" className="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Our work directly contributes to the United Nations Sustainable Development Goals, creating measurable impact towards global targets.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {sdgGoals.map((goal, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`w-16 h-16 bg-${goal.color}/10 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-${goal.color}/20`}>
                <goal.icon className={`w-8 h-8 text-${goal.color}`} />
              </div>
              <span className={`text-5xl font-black text-neutral-100 group-hover:text-${goal.color}/10 transition-colors duration-300`}>
                {goal.number}
              </span>
            </div>

            <Typography variant="h4" className="font-bold mb-3 text-neutral-900 text-xl group-hover:text-primary transition-colors">
              {goal.title}
            </Typography>

            <Typography variant="body" className="text-neutral-600 mb-8 leading-relaxed">
              {goal.description}
            </Typography>

            <div className={`bg-neutral-50 rounded-xl p-4 border border-neutral-100 group-hover:border-${goal.color}/20 transition-colors`}>
              <Typography variant="bodySmall" className={`font-bold text-${goal.color} uppercase tracking-wider text-xs mb-1`}>
                Key Impact
              </Typography>
              <Typography variant="body" className="text-neutral-900 font-bold text-lg">
                {goal.impact}
              </Typography>
            </div>
          </div >
        ))}
      </div >
    </Container >
  </section >
);

// Partner Recognition Section
const partnerLogos = [
  { name: "SIDA", description: "Core basket funder for access to justice", logo: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png" },
  { name: "EU", description: "Strategic partner on gender empowerment", logo: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png" },
  { name: "UN Women", description: "Women's rights and empowerment", logo: "/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png" },
  { name: "USAID", description: "Development cooperation and aid", logo: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png" },
];

const PartnerRecognition = () => (
  <section className="py-24 bg-white border-t border-neutral-100">
    <Container>
      <div className="text-center mb-16">
        <Typography variant="h2" className="mb-6 font-bold text-3xl text-neutral-900">Strategic Partners</Typography>
        <Typography variant="body" className="text-neutral-600 max-w-2xl mx-auto text-lg">
          Our impact is made possible through collaboration with leading development organizations.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {partnerLogos.map((partner, index) => (
          <div
            key={index}
            className="group p-8 rounded-2xl bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-100 hover:shadow-lg transition-all duration-500 text-center"
          >
            <div className="h-20 mb-6 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="max-h-full max-w-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <Typography variant="h4" className="font-bold mb-2 text-neutral-900 text-lg">
              {partner.name}
            </Typography>
            <Typography variant="bodySmall" className="text-neutral-500 text-sm leading-relaxed">
              {partner.description}
            </Typography>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

const Impact = () => {
  return (
    <Layout>
      {/* Hero Section - Sophisticated & Bold */}
      <section className="pt-32 pb-24 bg-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <Container size="xl" className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-neutral-600 text-sm font-semibold tracking-wide uppercase">Our Impact Report</span>
            </div>

            <Typography
              variant="h1"
              className="mb-8 text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]"
            >
              Transforming Lives Through <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-secondary-orange to-secondary-teal bg-clip-text text-transparent">
                Access to Justice
              </span>
            </Typography>

            <Typography
              variant="body"
              className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              We measure our success not just in numbers, but in the tangible difference we make in the lives of everyday Tanzanians.
            </Typography>
          </div>
        </Container>
      </section>

      {/* Impact Metrics - Dark Section for Contrast */}
      <AppleStyleMetrics />

      {/* SDG Progress - Light Section with Cards */}
      <SDGProgress />

      {/* Partner Recognition */}
      <PartnerRecognition />

      {/* Call to Action */}
      <ModernCallToAction />
    </Layout>
  );
};

export default Impact;