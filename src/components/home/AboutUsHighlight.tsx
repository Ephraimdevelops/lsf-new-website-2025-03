import { ArrowRight, Users, Target, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';
import Typography from '../shared/Typography';

const AboutUsHighlight = () => {
  const stats = [
    { icon: Users, value: '426,000+', label: 'Lives Transformed' },
    { icon: Target, value: '31', label: 'Regions Covered' },
    { icon: Globe, value: '500+', label: 'Paralegals Trained' },
    { icon: Award, value: '15+', label: 'Years of Impact' }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>    
            <div className="text-left mb-12">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
            about us 
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
          Empowering Communities through <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent"></span>
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Legal Access for all.
            </span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about our latest initiatives, partnerships, and impact stories from across Tanzania.
          </p>
         
        </div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Since 2009, the Legal Support Facility has been Tanzania's leading organization 
              in making justice accessible to all. We bridge the gap between legal systems 
              and communities through innovative approaches, technology, and sustainable partnerships.
            </p>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our work spans from training community paralegals in rural villages to developing 
              digital platforms that connect people with legal services. We believe that justice 
              is not a privilege—it's a fundamental right that should be accessible to every Tanzanian, 
              regardless of their location, income, or background.
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/30">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-light text-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHighlight;