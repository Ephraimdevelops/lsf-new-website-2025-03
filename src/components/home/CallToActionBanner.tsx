import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const CallToActionBanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-primary">
      <div className="container mx-auto px-6">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl lg:text-4xl font-light mb-4">
            Ready to Transform Justice in <span className="font-medium">Tanzania?</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Whether you need legal assistance, want to partner with us, or support our mission, 
            we're here to help you make a meaningful impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Get Legal Help */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:bg-white transition-colors duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-foreground">
                Need Legal Help?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Access free legal aid services, connect with community paralegals, 
                or use our digital platforms for immediate assistance.
              </p>
              <Button asChild className="w-full group/btn">
                <Link to="/legal-help">
                  Get Help Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Partner With Us */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:bg-white transition-colors duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-teal/20 transition-colors">
                <Mail className="h-8 w-8 text-secondary-teal" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-foreground">
                Partner With Us
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join our network of partners working to expand access to justice. 
                Explore collaboration opportunities and funding partnerships.
              </p>
              <Button asChild variant="outline" className="w-full group/btn">
                <Link to="/partners">
                  Explore Partnerships
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Support Our Mission */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm hover:bg-white transition-colors duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-secondary-green/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-green/20 transition-colors">
                <MapPin className="h-8 w-8 text-secondary-green" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-foreground">
                Support Our Mission
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Make a donation, volunteer your skills, or spread awareness 
                about our work to help us reach more communities in need.
              </p>
              <Button asChild variant="outline" className="w-full group/btn">
                <Link to="/donate">
                  Make a Difference
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-medium mb-6 text-white">
                Get in Touch
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-white/90">
                <div className="flex items-center justify-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+255 22 277 3265</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>info@lsf.or.tz</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span>Dar es Salaam, Tanzania</span>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild variant="secondary" size="lg" className="group">
                  <Link to="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CallToActionBanner;