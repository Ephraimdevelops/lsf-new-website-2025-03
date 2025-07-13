import { ArrowRight, Users, Target, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

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
            <div className="inline-flex items-center bg-secondary-teal/10 rounded-full px-6 py-3 mb-6">
              <span className="text-secondary-teal font-medium text-sm uppercase tracking-wider">
                About LSF
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-light mb-6 text-foreground">
              Empowering Communities Through 
              <span className="text-primary font-medium block">Legal Innovation</span>
            </h2>
            
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

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary-teal/5">
            <CardContent className="p-12">
              <h3 className="text-2xl font-light mb-6 text-foreground">Our Mission</h3>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                "To enhance access to justice for poor and marginalized communities in Tanzania through 
                legal empowerment, innovative service delivery, and systemic advocacy that promotes 
                the rule of law and human rights."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHighlight;