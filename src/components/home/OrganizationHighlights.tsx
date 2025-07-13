import { Zap, Heart, Shield, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const highlights = [
  {
    icon: Shield,
    title: 'Legal Protection',
    description: 'Comprehensive legal aid services protecting the rights of vulnerable communities across Tanzania.',
    impact: '12,500+ disputes resolved',
    color: 'text-primary'
  },
  {
    icon: Lightbulb,
    title: 'Innovation Leadership',
    description: 'Pioneering digital solutions and mobile platforms that revolutionize access to justice.',
    impact: 'First mobile legal aid app in East Africa',
    color: 'text-secondary-teal'
  },
  {
    icon: Heart,
    title: 'Community Focus',
    description: 'Building lasting relationships and capacity within communities for sustainable impact.',
    impact: '500+ paralegals trained nationwide',
    color: 'text-secondary-green'
  },
  {
    icon: Zap,
    title: 'Systems Change',
    description: 'Advocating for policy reforms and systemic improvements to strengthen rule of law.',
    impact: '15+ policy reforms influenced',
    color: 'text-secondary-orange'
  }
];

const achievements = [
  {
    year: '2023',
    title: 'UN Sustainable Development Award',
    description: 'Recognized for outstanding contribution to climate justice and legal empowerment.'
  },
  {
    year: '2022',
    title: 'Digital Innovation Excellence',
    description: 'First organization in Tanzania to launch comprehensive mobile legal aid platform.'
  },
  {
    year: '2021',
    title: 'National Partnership',
    description: 'Historic MOU with Ministry of Justice to strengthen legal framework nationwide.'
  }
];

const OrganizationHighlights = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Why Choose LSF
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light mb-4 text-foreground">
            Leading the Way in 
            <span className="text-primary font-medium block">Legal Innovation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            For over 15 years, we've been at the forefront of transforming how justice 
            is delivered in Tanzania, combining traditional legal expertise with cutting-edge innovation.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background">
                <CardContent className="p-6 text-center">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-muted/50 rounded-2xl group-hover:scale-110 transition-transform">
                    <IconComponent className={`h-8 w-8 ${highlight.color}`} />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-foreground">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {highlight.description}
                  </p>
                  <div className={`text-sm font-medium ${highlight.color}`}>
                    {highlight.impact}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Achievements */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl lg:text-3xl font-light mb-6 text-foreground">
              Recent <span className="text-primary font-medium">Achievements</span>
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our commitment to excellence and innovation continues to earn recognition 
              from national and international organizations, validating our approach 
              to expanding access to justice.
            </p>
            <Button asChild variant="outline" size="lg" className="group">
              <Link to="/impact">
                View Full Impact Report
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-l-4 border-l-primary border-t-0 border-r-0 border-b-0 shadow-md bg-background">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl font-light text-primary bg-primary/10 px-3 py-1 rounded-lg">
                      {achievement.year}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-2">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary-teal/5">
            <CardContent className="p-12">
              <h3 className="text-2xl font-light mb-4 text-foreground">
                Join Us in Transforming Justice
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're looking to partner with us, support our mission, or learn 
                more about our innovative approaches, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/partners">Become a Partner</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OrganizationHighlights;