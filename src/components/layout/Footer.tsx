
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-teal rounded-full translate-x-48 translate-y-48"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Column - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-8">
              <img 
                src="/lovable-uploads/4d88ac6f-dc44-4191-ad46-f5da6daeb331.png"
                alt="LSF Logo"
                className="h-16 w-auto"
              />
            </Link>
            <h3 className="text-2xl font-bold mb-6 text-[#009bb6]">Legal Services Facility</h3>
            <p className="text-white/80 mb-8 leading-relaxed text-lg max-w-md">
              Empowering communities through accessible legal aid, education, and advocacy across all 184 districts of Tanzania since 2011.
            </p>
            
            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-[#ffbe06] mb-2">26,000+</div>
                <div className="text-sm text-white/70 uppercase tracking-wide">People Helped</div>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-[#ffbe06] mb-2">184</div>
                <div className="text-sm text-white/70 uppercase tracking-wide">Districts Covered</div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold mb-4 text-[#009bb6]">Stay Updated</h4>
              <p className="text-white/70 text-sm mb-4">Get the latest news and updates on our legal aid initiatives.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
                />
                <Button className="bg-primary hover:bg-primary/90 px-6">
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-[#009bb6] border-b border-white/20 pb-3">Organization</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>About Us</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>Our Team</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>Our Partners</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>Careers</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/publications" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>Publications</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Programs & Services */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-[#009bb6] border-b border-white/20 pb-3">Our Work</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/programs" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>Programs</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/what-we-do" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>What We Do</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/legal-help" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>Get Legal Help</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/heroes" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>Success Stories</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center group">
                  <span>News & Updates</span>
                  <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-[#009bb6] border-b border-white/20 pb-3">Connect</h4>
            
            {/* Contact Info */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-[#009bb6] mt-1 flex-shrink-0" />
                <div className="text-white/80 text-sm leading-relaxed">
                  <p className="font-semibold">Plot 35, Block D</p>
                  <p>Masaki, Dar es Salaam</p>
                  <p>Tanzania</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-[#009bb6] flex-shrink-0" />
                <a href="tel:+255222774790" className="text-white/80 hover:text-white text-sm transition-colors">
                  +255 22 277 4790
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-[#009bb6] flex-shrink-0" />
                <a href="mailto:info@lsf.or.tz" className="text-white/80 hover:text-white text-sm transition-colors">
                  info@lsf.or.tz
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-8">
              <h5 className="text-sm font-semibold mb-4 text-[#009bb6] uppercase tracking-wide">Follow Us</h5>
              <div className="flex space-x-3">
                <a href="https://facebook.com/lsf" className="p-3 rounded-full bg-white/10 hover:bg-[#1877F2] transition-all duration-300 group">
                  <Facebook size={18} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a href="https://instagram.com/lsf" className="p-3 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[#E4405F] hover:to-[#F56040] transition-all duration-300 group">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a href="https://youtube.com/lsf" className="p-3 rounded-full bg-white/10 hover:bg-[#FF0000] transition-all duration-300 group">
                  <Youtube size={18} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a href="https://x.com/lsf" className="p-3 rounded-full bg-white/10 hover:bg-black transition-all duration-300 group">
                  <svg className="w-[18px] h-[18px] group-hover:scale-110 transition-transform text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <Link to="/contact" className="block">
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-[#2c2c2c] transition-all duration-300">
                  Contact Us
                  <ExternalLink size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/donate" className="block">
                <Button className="w-full bg-[#ffbe06] hover:bg-[#ffbe06]/90 text-black font-semibold">
                  Support Our Work
                  <Heart size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-white/60">
              <p>&copy; 2024 Legal Services Facility. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span>|</span>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <span>|</span>
                <Link to="/whistleblower" className="hover:text-white transition-colors">Report Issue</Link>
              </div>
            </div>
            <div className="flex items-center text-white/60 text-sm">
              <span>Made with</span>
              <svg className="mx-2 w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>for justice in Tanzania</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
