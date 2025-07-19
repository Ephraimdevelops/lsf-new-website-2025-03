
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { TrendingUp } from 'lucide-react';

const successMetrics = [
  { value: "$47M+", label: "Disbursed as Grants", description: "Financial support to legal aid organizations" },
  { value: "105,562+", label: "Supported Groups", description: "Community organizations receiving assistance" },
  { value: "426,349+", label: "Legal Aid Beneficiaries", description: "Individuals receiving direct legal support" },
  { value: "39.8M+", label: "Legal Education Beneficiaries", description: "People reached through awareness programs" }
];

const ImpactMetricsSection = () => (
  <section className="py-28 md:py-32 relative overflow-hidden">
    {/* Multi-layer background treatment */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/lovable-uploads/background with mother umage .png')" }}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/85 to-black/90"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>
    
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
    </div>

    {/* Subtle overlay pattern */}
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,.2)_2px,transparent_0)] bg-[length:30px_30px]"></div>

    <Container size="2xl" className="relative z-10">
      <div className="text-center mb-16 space-y-9">
        <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30">
          <TrendingUp className="h-6 w-6 mr-4 text-secondary-orange" />
          <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
            MEASURABLE IMPACT
          </Typography>
        </div>

        <Typography variant="h2" className="mb-8 text-white text-5xl md:text-6xl font-bold">
          Real Results.
          <span className="block text-secondary-orange">Lasting Change.</span>
        </Typography>

        <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-2xl leading-relaxed">
          Our commitment to transparency and accountability drives us to measure and share the concrete impact of our work across Tanzania.
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {successMetrics.map((metric, index) => (
          <div key={index} className="group">
            <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-secondary-orange/50 transition-all duration-300 text-center group-hover:-translate-y-3 hover:shadow-2xl">
              <Typography variant="display" className="text-secondary-orange mb-6 font-heading text-4xl md:text-5xl">
                {metric.value}
              </Typography>
              <Typography variant="h4" className="text-white mb-4 font-heading text-xl">
                {metric.label}
              </Typography>
              <Typography variant="bodySmall" className="text-white/80 text-lg">
                {metric.description}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default ImpactMetricsSection;
