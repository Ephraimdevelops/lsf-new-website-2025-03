
import { ArrowRight, PlayCircle, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const WhatWeDoHero = () => {
  return (
    <section className="relative">
      {/* Clean Hero Section with Real Image */}
      <div className="relative h-[90vh] bg-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png"
            alt="Women participating in legal empowerment program"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60"></div>
        </div>
        
        <Container size="xl" className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl text-white">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Target className="h-5 w-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Our Work</span>
            </div>
            
            <Typography variant="h1" className="text-white mb-6 text-5xl md:text-6xl leading-tight">
              Transforming Justice.<br/>
              <span className="text-secondary-orange">Empowering People.</span>
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-8 text-xl max-w-3xl leading-relaxed">
              Explore how our legal empowerment model drives impact in Tanzania through sustainable strategies, inclusive partnerships, and transformative focus areas.
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

      {/* Clean Stats Section */}
      <div className="bg-neutral-dark text-white overflow-hidden py-16">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2.8M+</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Tanzanians Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-teal mb-2">4,000+</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Trained Paralegals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-orange mb-2">31</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Regions Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-yellow mb-2">78%</div>
              <div className="text-neutral-200 text-sm uppercase tracking-wide">Cases Resolved</div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default WhatWeDoHero;
