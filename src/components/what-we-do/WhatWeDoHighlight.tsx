import { ArrowRight, Users, Target, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';
import Typography from '../shared/Typography';

const WhatWeDoHighlight = () => {

  return (
    <section className="py-0 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          {/* Content */}
          <div className="flex flex-col py-10 ">
            <div className="text-left mb-0">
              <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
                <DesignIcon 
                  icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
                  size="sm"
                  className="mr-4"
                />
                <Text variant="overline" className="font-bold text-lg tracking-widest">
                Our Strategy
                </Text>
              </div>
              <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
              Focus Areas <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                & Approaches
                </span>
              </Typography>
            </div>
            <div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At the LSF, we champion access to justice through an integrated model grounded in legal empowerment. Our work is guided by two complementary pillars: <span className="font-semibold text-primary">Strategic Approaches</span> (how we work) and <span className="font-semibold text-secondary-teal">Strategic Focus Areas</span> (where we focus). These intersect to deliver lasting, rights-based change for women, marginalized communities, and the justice ecosystem at large.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group">
                  <Link to="/about">
                    Learn Our Story
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/what-we-do">
                    Explore Our Work
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-full mb-0">
            <img 
              src="/lovable-uploads/3.png" 
              alt="Haki Yangu App Interface" 
              className="w-full h-full object-cover rounded-t-xxl rounded-b-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoHighlight;