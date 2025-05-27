
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, ExternalLink, Heart, Send, Users, Globe, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#2c2c2c] via-[#1a1a1a] to-[#0f0f0f] text-white relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary to-secondary-teal rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-br from-secondary-orange to-secondary-yellow rounded-full translate-x-32 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-secondary-teal to-primary rounded-full translate-y-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-secondary-orange rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-secondary-teal rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-secondary-yellow rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-primary/50 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Column - Enhanced with mission statement */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-8 group">
              <img 
                src="/lovable-uploads/4d88ac6f-dc44-4191-ad46-f5da6daeb331.png"
                alt="LSF Logo"
                className="h-16 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#009bb6] to-[#ffbe06] bg-clip-text text-transparent">
                Legal Services Facility
              </h3>
              <p className="text-white/90 mb-6 leading-relaxed text-lg">
                Transforming lives through accessible legal aid, community empowerment, and innovative solutions across all 184 districts of Tanzania.
              </p>
              
              {/* Mission highlights with icons */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <Users className="h-6 w-6 text-[#009bb6] mx-auto mb-2" />
                  <div className="text-sm text-white/70">Community Focused</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <Globe className="h-6 w-6 text-[#ffbe06] mx-auto mb-2" />
                  <div className="text-sm text-white/70">Nationwide Reach</div>
                </div>
                <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <Scale className="h-6 w-6 text-[#F46F00] mx-auto mb-2" />
                  <div className="text-sm text-white/70">Justice for All</div>
                </div>
              </div>
            </div>

            {/* Enhanced Newsletter Signup */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
              <h4 className="text-lg font-semibold mb-3 text-[#009bb6] flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Stay Connected
              </h4>
              <p className="text-white/70 text-sm mb-4">Get updates on our legal aid initiatives and community impact.</p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-primary focus:ring-primary"
                />
                <Button className="bg-primary hover:bg-primary/90 px-6 shrink-0">
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Quick Links with hover effects */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-[#009bb6] border-b border-white/20 pb-3 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-[#009bb6] to-[#ffbe06] rounded mr-3"></span>
              Organization
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'About LSF', href: '/about' },
                { label: 'Our Team', href: '/team' },
                { label: 'Partners', href: '/partners' },
                { label: 'Careers', href: '/opportunities' },
                { label: 'Publications', href: '/publications' }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-[#009bb6] rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    <span>{link.label}</span>
                    <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services & Programs */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-[#009bb6] border-b border-white/20 pb-3 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-[#F46F00] to-[#ffbe06] rounded mr-3"></span>
              Our Impact
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'What We Do', href: '/what-we-do' },
                { label: 'Legal Programs', href: '/programs' },
                { label: 'Get Legal Help', href: '/legal-help' },
                { label: 'Success Stories', href: '/heroes' },
                { label: 'Latest News', href: '/news' }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-white/80 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-[#F46F00] rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    <span>{link.label}</span>
                    <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact & Connect */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-[#009bb6] border-b border-white/20 pb-3 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-[#59B5B0] to-[#009bb6] rounded mr-3"></span>
              Connect
            </h4>
            
            {/* Contact Info with enhanced styling */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <MapPin size={18} className="text-[#009bb6] mt-1 flex-shrink-0" />
                <div className="text-white/80 text-sm leading-relaxed">
                  <p className="font-semibold text-white">Plot 35, Block D</p>
                  <p>Masaki, Dar es Salaam</p>
                  <p>Tanzania</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Phone size={18} className="text-[#009bb6] flex-shrink-0" />
                <a href="tel:+255222774790" className="text-white/80 hover:text-white text-sm transition-colors">
                  +255 22 277 4790
                </a>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <Mail size={18} className="text-[#009bb6] flex-shrink-0" />
                <a href="mailto:info@lsf.or.tz" className="text-white/80 hover:text-white text-sm transition-colors">
                  info@lsf.or.tz
                </a>
              </div>
            </div>

            {/* Enhanced Social Media */}
            <div className="mb-8">
              <h5 className="text-sm font-semibold mb-4 text-[#009bb6] uppercase tracking-wide">Follow Our Journey</h5>
              <div className="flex space-x-3">
                <a href="https://facebook.com/lsf" className="p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 hover:from-[#1877F2] hover:to-[#1877F2] transition-all duration-300 group backdrop-blur-sm">
                  <Facebook size={18} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a href="https://instagram.com/lsf" className="p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 hover:from-[#E4405F] hover:to-[#F56040] transition-all duration-300 group backdrop-blur-sm">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a href="https://youtube.com/lsf" className="p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 hover:from-[#FF0000] hover:to-[#FF0000] transition-all duration-300 group backdrop-blur-sm">
                  <Youtube size={18} className="group-hover:scale-110 transition-transform text-white" />
                </a>
                <a href="https://x.com/lsf" className="p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 hover:from-black hover:to-black transition-all duration-300 group backdrop-blur-sm">
                  <svg className="w-[18px] h-[18px] group-hover:scale-110 transition-transform text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Actions with enhanced styling */}
            <div className="space-y-3">
              <Link to="/contact" className="block">
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-[#2c2c2c] transition-all duration-300 group">
                  <span>Contact Us</span>
                  <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/donate" className="block">
                <Button className="w-full bg-gradient-to-r from-[#ffbe06] to-[#F46F00] hover:from-[#F46F00] hover:to-[#ffbe06] text-black font-semibold transition-all duration-300 group">
                  <Heart size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                  <span>Support Our Mission</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="relative border-t border-white/10 bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-8 text-sm text-white/60">
              <p className="flex items-center">
                <span>&copy; 2024 Legal Services Facility.</span>
                <span className="ml-2 text-white/40">All rights reserved.</span>
              </p>
              <div className="flex items-center space-x-6">
                <Link to="/privacy" className="hover:text-white transition-colors hover:underline">Privacy Policy</Link>
                <span className="text-white/30">•</span>
                <Link to="/terms" className="hover:text-white transition-colors hover:underline">Terms of Service</Link>
                <span className="text-white/30">•</span>
                <Link to="/whistleblower" className="hover:text-white transition-colors hover:underline">Report Issue</Link>
              </div>
            </div>
            <div className="flex items-center text-white/60 text-sm">
              <span>Crafted with</span>
              <Heart className="mx-2 w-4 h-4 text-red-400 animate-pulse" />
              <span>for justice in Tanzania</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add floating animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
