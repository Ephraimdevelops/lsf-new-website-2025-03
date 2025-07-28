import { ArrowRight, PlayCircle, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const ImpactHero = () => {
  return (
    <section className="relative">
      {/* Clean Hero Section with Real Image */}
      <div className="relative h-[90vh] bg-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/03e3e41e-930e-409b-9697-0530773cca4c.png"
            alt="Women participating in legal empowerment program"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60"></div>
        </div>
        
        <Container size="xl" className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl text-white">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Target className="h-5 w-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">OUR IMPACT</span>
            </div>
            
            <Typography variant="h1" className="text-white mb-6 text-5xl md:text-6xl leading-tight">
            Justice that changes lives.<br/>
              <span className="text-secondary-orange">Systems that work for people.</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-8 text-xl max-w-3xl leading-relaxed">
            Over the past decade, LSF has transformed the legal empowerment landscape in Tanzania, creating measurable change that reaches every corner of our nation.
            </Typography>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="#strategic-approaches">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange-dark text-white font-semibold px-8 py-4 rounded-lg">
                  Explore Our Model
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="#focus-areas">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-lg">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Our Impact Video
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

    </section>
  );
};

export default ImpactHero;
