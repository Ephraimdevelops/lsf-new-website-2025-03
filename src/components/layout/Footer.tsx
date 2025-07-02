
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Typography from '@/components/shared/Typography';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Work', href: '/what-we-do' },
    { name: 'Programs', href: '/programs' },
    { name: 'Get Legal Help', href: '/legal-help' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const resources = [
    { name: 'News & Updates', href: '/news' },
    { name: 'Publications', href: '/publications' },
    { name: 'Success Stories', href: '/heroes' },
    { name: 'Legal Resources', href: '/resources' },
  ];

  const support = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Careers & Opportunities', href: '/opportunities' },
    { name: 'Whistleblower Channel', href: '/whistleblower' },
    { name: 'FAQs', href: '/faq' },
  ];

  return (
    <footer className="relative bg-neutral-dark text-white overflow-hidden">
      {/* Brand Pattern Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png')`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Newsletter Section with Enhanced Branding */}
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

      {/* Main Footer Content - Improved Responsive Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Organization Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF Logo"
                  className="h-16 w-auto mb-4"
                />
                <Typography variant="h4" className="text-white mb-4">
                  Legal Services Facility
                </Typography>
                <Typography variant="bodySmall" className="text-white/80 leading-relaxed mb-6">
                  Empowering communities through accessible legal aid and justice reform across Tanzania.
                </Typography>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <Typography variant="bodySmall" className="text-white/90">
                      Mikocheni Light Industrial Area<br />
                      Dar es Salaam, Tanzania
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <Typography variant="bodySmall" className="text-white/90">
                    +255 22 277 5567
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <Typography variant="bodySmall" className="text-white/90">
                    info@legalservicesfacility.org
                  </Typography>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <Typography variant="h4" className="text-white mb-6 uppercase tracking-wide">
                Quick Links
              </Typography>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-primary transition-colors duration-300 text-sm block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <Typography variant="h4" className="text-white mb-6 uppercase tracking-wide">
                Resources
              </Typography>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-primary transition-colors duration-300 text-sm block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <Typography variant="h4" className="text-white mb-6 uppercase tracking-wide">
                Support Us
              </Typography>
              <ul className="space-y-3">
                {support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-primary transition-colors duration-300 text-sm block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Enhanced Mobile Layout */}
      <div className="border-t border-white/10 py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <Typography variant="bodySmall" className="text-white/70">
                © 2024 Legal Services Facility. All rights reserved.
              </Typography>
              <div className="flex space-x-4">
                <Link to="/privacy" className="text-white/70 hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-white/70 hover:text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
