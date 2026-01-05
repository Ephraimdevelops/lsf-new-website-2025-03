import { ArrowRight, PlayCircle, Target } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ApproachData } from '@/data/approachData';

interface ApproachHeroProps {
  approach: ApproachData;
}

const ApproachHero = ({ approach }: ApproachHeroProps) => {
  return (
    <section className="relative">
      <div className="relative h-[80vh] bg-white overflow-hidden">
        {/* Fixed background for parallax effect */}
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${approach.heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-4xl text-white">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Target className="h-5 w-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Strategic Approach</span>
            </div>

            <Typography variant="h1" className="text-white mb-4 text-5xl md:text-6xl leading-tight">
              {approach.title}
            </Typography>

            <Typography variant="body" className="text-white/90 mb-8 text-xl max-w-3xl leading-relaxed">
              {approach.subtitle}
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="#overview">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange-dark text-white font-semibold px-8 py-4 rounded-lg">
                  Explore Approach
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-lg">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  See Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachHero;