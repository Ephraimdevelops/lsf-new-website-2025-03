
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, ExternalLink, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-neutral-dark via-neutral-dark to-primary/10 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="pattern-bg h-full w-full"></div>
      </div>
      
      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Connected with Our Mission</h3>
            <p className="text-white/80 mb-8 text-lg">
              Get the latest updates on our legal empowerment initiatives and access to justice programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary-teal"
              />
              <Button className="bg-secondary-teal hover:bg-secondary-teal/90 px-6 py-3">
                Subscribe
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/lovable-uploads/4d88ac6f-dc44-4191-ad46-f5da6daeb331.png"
                alt="LSF Logo"
                className="h-12 w-auto"
              />
            </Link>
            <h4 className="text-xl font-bold mb-4 text-secondary-teal">Legal Services Facility</h4>
            <p className="text-white/80 mb-6 leading-relaxed">
              Empowering communities through accessible legal aid, education, and advocacy. 
              Working across all 184 districts of Tanzania to bridge the justice gap for women, 
              children, and marginalized groups since 2011.
            </p>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-secondary-teal">26,000+</div>
                <div className="text-xs text-white/70">People Helped</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-secondary-teal">184</div>
                <div className="text-xs text-white/70">Districts Covered</div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="p-2 rounded-full bg-white/10 hover:bg-secondary-teal transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="p-2 rounded-full bg-white/10 hover:bg-secondary-teal transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="p-2 rounded-full bg-white/10 hover:bg-secondary-teal transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="p-2 rounded-full bg-white/10 hover:bg-secondary-teal transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" className="p-2 rounded-full bg-white/10 hover:bg-secondary-teal transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-teal">Organization</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Our Partners
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Programs & Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-teal">Our Work</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/programs" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/what-we-do" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  What We Do
                </Link>
              </li>
              <li>
                <Link to="/legal-help" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Get Legal Help
                </Link>
              </li>
              <li>
                <Link to="/heroes" className="text-white/80 hover:text-white transition-colors flex items-center group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-teal">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-secondary-teal mt-1 flex-shrink-0" />
                <div className="text-white/80 text-sm">
                  <p>Plot 35, Block D</p>
                  <p>Masaki, Dar es Salaam</p>
                  <p>Tanzania</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-secondary-teal flex-shrink-0" />
                <a href="tel:+255222774790" className="text-white/80 hover:text-white text-sm transition-colors">
                  +255 22 277 4790
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-secondary-teal flex-shrink-0" />
                <a href="mailto:info@lsf.or.tz" className="text-white/80 hover:text-white text-sm transition-colors">
                  info@lsf.or.tz
                </a>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <Link to="/contact" className="block">
                <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white hover:text-neutral-dark">
                  Contact Us
                </Button>
              </Link>
              <Link to="/whistleblower" className="block">
                <Button variant="outline" size="sm" className="w-full border-secondary-orange text-secondary-orange hover:bg-secondary-orange hover:text-white">
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-white/60">
              <p>&copy; 2024 Legal Services Facility. All rights reserved.</p>
              <span className="hidden md:inline">|</span>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <div className="flex items-center text-sm text-white/60">
              <span>Made with</span>
              <Heart size={14} className="mx-1 text-red-400" />
              <span>for justice in Tanzania</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
