
import { ArrowRight, CheckCircle, Users, Star, Calendar, Award, Target } from 'lucide-react';
import Container from '../shared/Container';
import Typography from '../shared/Typography';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import AnimatedCounter from '../shared/AnimatedCounter';

interface ApproachDetailSectionProps {
  approach: {
    id: string;
    icon: React.ReactNode;
    title: string;
    fullDescription: string;
    stats: { value: string; label: string }[];
    process: { step: string; description: string }[];
    testimonial: { quote: string; author: string; role: string };
    highlights: { title: string; description: string; image: string }[];
    color: string;
  };
  index: number;
}

const ApproachDetailSection = ({ approach, index }: ApproachDetailSectionProps) => {
  return (
    <section className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-neutral-light/30 to-primary/5'}`}>
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Content */}
          <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border shadow-sm">
              <div className="text-primary mr-3">
                {approach.icon}
              </div>
              <Typography variant="overline" className="text-primary font-bold">
                APPROACH {String(index + 1).padStart(2, '0')}
              </Typography>
            </div>
            
            <Typography variant="h1" className="mb-6 text-4xl lg:text-5xl font-bold leading-tight">
              {approach.title}
            </Typography>
            
            <Typography variant="body" className="text-neutral-gray mb-8 text-lg leading-relaxed">
              {approach.fullDescription}
            </Typography>

            {/* Enhanced Process Flow */}
            <div className="mb-8">
              <Typography variant="h3" className="mb-6 text-primary flex items-center gap-2">
                <Target className="h-6 w-6" />
                Our Process
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {approach.process.map((step, stepIndex) => (
                  <Card key={stepIndex} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${approach.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        <span className="text-white font-bold">{stepIndex + 1}</span>
                      </div>
                      <Typography variant="h4" className="mb-2 text-sm font-semibold">
                        {step.step}
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray text-xs leading-relaxed">
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enhanced Testimonial */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 border-primary/20 mb-8 overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute top-4 right-4 opacity-20">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <Typography variant="body" className="text-primary mb-4 italic text-lg leading-relaxed">
                  "{approach.testimonial.quote}"
                </Typography>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary-teal/20 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold">{approach.testimonial.author}</div>
                    <div className="text-neutral-gray text-sm">{approach.testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className={`bg-gradient-to-r ${approach.color} text-white hover:scale-105 transition-transform shadow-lg`}>
                Learn More About This Approach
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* Enhanced Stats & Highlights */}
          <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
            {/* Impact Stats */}
            <Card className="bg-gradient-to-br from-white/90 to-primary/5 backdrop-blur-sm border-0 shadow-xl mb-8">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="h-6 w-6 text-primary" />
                  <Typography variant="h3" className="text-primary">
                    Impact Metrics
                  </Typography>
                </div>
                <div className="space-y-6">
                  {approach.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-primary/10">
                      <span className="text-neutral-gray font-medium">{stat.label}</span>
                      <span className="text-2xl font-bold text-primary">
                        <AnimatedCounter 
                          end={parseInt(stat.value.replace(/\D/g, '')) || 0} 
                          suffix={stat.value.replace(/\d/g, '')} 
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Highlights */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="h-6 w-6 text-primary" />
                <Typography variant="h3" className="text-primary">
                  Key Initiatives
                </Typography>
              </div>
              {approach.highlights.map((highlight, hIndex) => (
                <Card key={hIndex} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${approach.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <Typography variant="h4" className="mb-2 font-semibold group-hover:text-primary transition-colors">
                              {highlight.title}
                            </Typography>
                            <Typography variant="bodySmall" className="text-neutral-gray leading-relaxed">
                              {highlight.description}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary-teal/10 flex items-center justify-center">
                        <div className={`w-8 h-8 bg-gradient-to-br ${approach.color} rounded-lg`}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Success Badge */}
            <Card className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Badge className="bg-green-600 text-white mb-3">
                  <Star className="h-3 w-3 mr-1" />
                  Proven Impact
                </Badge>
                <Typography variant="bodySmall" className="text-green-700">
                  This approach has demonstrated measurable positive outcomes across multiple communities in Tanzania.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ApproachDetailSection;
