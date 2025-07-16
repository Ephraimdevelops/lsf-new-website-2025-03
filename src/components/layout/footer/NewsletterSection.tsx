import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Typography from '@/components/shared/Typography';

const NewsletterSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary via-primary/95 to-primary py-16 overflow-hidden">
      {/* Brand Pattern Overlay */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 opacity-10 transform rotate-12"
        style={{
          backgroundImage: `url('/lovable-uploads/bd699246-15c2-42da-aac8-85925fa200f4.png')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <Heart className="h-5 w-5 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold tracking-wider text-sm">
              NEWSLETTER
            </Typography>
          </div>
          <Typography variant="h2" className="text-white mb-6 font-bold">
            Stay Connected with Our Mission
          </Typography>
          <Typography variant="body" className="text-white/90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Join our community and get the latest updates on legal empowerment initiatives, success stories, and opportunities to make a difference.
          </Typography>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
            <Input 
              type="email" 
              placeholder="Enter your email address"
              className="bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 border-white/20 flex-1 h-12 text-base"
            />
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-12 transition-all duration-300 transform hover:scale-105"
            >
              Subscribe Now
            </Button>
          </div>
          
          {/* Call to Action Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10 pt-8 border-t border-white/20">
            <Button 
              size="lg"
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 font-semibold px-8"
              onClick={() => window.location.href = '/legal-help'}
            >
              <Phone className="h-5 w-5 mr-2" />
              Get Legal Help Now
            </Button>
            <Link to="/donate">
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 transition-all duration-300"
              >
                Support Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;