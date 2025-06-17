
import { Target } from 'lucide-react';
import Container from '../shared/Container';
import Typography from '../shared/Typography';
import AnimatedCounter from '../shared/AnimatedCounter';

interface ApproachHeroProps {
  approaches: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    stats: { value: string; label: string }[];
  }>;
}

const ApproachHero = ({ approaches }: ApproachHeroProps) => {
  // Calculate aggregate stats for hero display
  const totalPartners = 200;
  const totalFunds = 2;
  const totalReforms = 15;
  const totalStudies = 25;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url('/lovable-uploads/background with mother umage .png')`
        }}
      ></div>
      
      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/95 to-black/90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-secondary-yellow/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Container size="xl" className="relative z-10">
        <div className="text-center text-white max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center space-x-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
            <Target className="h-6 w-6 text-secondary-orange" />
            <span className="text-secondary-orange font-bold text-lg uppercase tracking-wider">
              Our Approaches
            </span>
          </div>
          
          <Typography variant="display" className="text-white mb-8 leading-none text-5xl md:text-7xl font-bold">
            How We Drive
            <span className="block text-secondary-orange mt-4">Lasting Change</span>
          </Typography>
          
          <Typography variant="body" className="text-white/95 mb-12 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Five integrated approaches that multiply our impact and create sustainable pathways to justice for all Tanzanians.
          </Typography>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold mb-2 text-secondary-orange">
                <AnimatedCounter end={totalPartners} suffix="+" />
              </div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Partners</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold mb-2 text-secondary-teal">
                <AnimatedCounter end={totalFunds} suffix="M+" />
              </div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Funds Distributed</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold mb-2 text-secondary-yellow">
                <AnimatedCounter end={totalReforms} suffix="+" />
              </div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Policy Reforms</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-bold mb-2 text-white">
                <AnimatedCounter end={totalStudies} suffix="+" />
              </div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Research Studies</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ApproachHero;
