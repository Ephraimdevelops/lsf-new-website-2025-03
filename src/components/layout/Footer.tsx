
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-neutral-dark to-primary/20 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="h-full w-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/lovable-uploads/4d88ac6f-dc44-4191-ad46-f5da6daeb331.png"
                alt="LSF Logo"
                className="h-12 w-auto"
              />
            </Link>
            <h4 className="text-xl font-bold mb-4 text-secondary-teal">Legal Services Facility</h4>
            <p className="text-white/80 mb-6 leading-relaxed text-sm">
              Empowering communities through accessible legal aid, education, and advocacy across all 184 districts of Tanzania since 2011.
            </p>
            
            {/* Compact Social Media */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold mb-3 text-secondary-teal">Follow Us</h5>
              <div className="flex space-x-3">
                <a href="https://facebook.com/lsf" className="p-2 rounded-full bg-white/10 hover:bg-[#1877F2] transition-all duration-300 group">
                  <Facebook size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://instagram.com/lsf" className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[#E4405F] hover:to-[#F56040] transition-all duration-300 group">
                  <Instagram size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://youtube.com/lsf" className="p-2 rounded-full bg-white/10 hover:bg-[#FF0000] transition-all duration-300 group">
                  <Youtube size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://tiktok.com/@lsf" className="p-2 rounded-full bg-white/10 hover:bg-black transition-all duration-300 group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://threads.net/@lsf" className="p-2 rounded-full bg-white/10 hover:bg-black transition-all duration-300 group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 8.5c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/>
                  </svg>
                </a>
                <a href="https://x.com/lsf" className="p-2 rounded-full bg-white/10 hover:bg-black transition-all duration-300 group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-lg font-bold text-secondary-teal">26,000+</div>
                <div className="text-xs text-white/70">People Helped</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-lg font-bold text-secondary-teal">184</div>
                <div className="text-xs text-white/70">Districts</div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-teal">Organization</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Our Partners
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <Link to="/programs" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/what-we-do" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  What We Do
                </Link>
              </li>
              <li>
                <Link to="/legal-help" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Get Legal Help
                </Link>
              </li>
              <li>
                <Link to="/heroes" className="text-white/80 hover:text-white transition-colors flex items-center group text-sm">
                  <ArrowRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-teal">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-secondary-teal mt-1 flex-shrink-0" />
                <div className="text-white/80 text-sm">
                  <p>Plot 35, Block D</p>
                  <p>Masaki, Dar es Salaam</p>
                  <p>Tanzania</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-secondary-teal flex-shrink-0" />
                <a href="tel:+255222774790" className="text-white/80 hover:text-white text-sm transition-colors">
                  +255 22 277 4790
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-secondary-teal flex-shrink-0" />
                <a href="mailto:info@lsf.or.tz" className="text-white/80 hover:text-white text-sm transition-colors">
                  info@lsf.or.tz
                </a>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <Link to="/contact" className="block">
                <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white hover:text-neutral-dark text-xs">
                  Contact Us
                </Button>
              </Link>
              <Link to="/whistleblower" className="block">
                <Button variant="outline" size="sm" className="w-full border-secondary-orange text-secondary-orange hover:bg-secondary-orange hover:text-white text-xs">
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-sm">
            <div className="flex items-center space-x-4 text-white/60">
              <p>&copy; 2024 Legal Services Facility. All rights reserved.</p>
              <span className="hidden md:inline">|</span>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <div className="flex items-center text-white/60">
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
