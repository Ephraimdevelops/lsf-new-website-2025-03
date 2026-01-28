import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowUp, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'What We Do', href: '/what-we-do' },
    { name: 'Programs', href: '/programs' },
    { name: 'Our Impact', href: '/impact' },
    { name: 'Careers', href: '/opportunities' },
    { name: 'LSF Connect', href: '/connect' },
  ];

  const resources = [
    { name: 'News & Updates', href: '/news' },
    { name: 'Publications', href: '/publications' },
    { name: 'Success Stories', href: '/heroes' },
    { name: 'Legal Resources', href: '/resources' },
    { name: 'Digital Haki Yangu', href: '/haki-yangu' },
  ];

  const getInvolved = [
    { name: 'Get Legal Help', href: '/legal-help' },
    { name: 'Partner With Us', href: '/contact' },
    { name: 'Donate', href: '/donate' },
    { name: 'Whistleblower', href: '/whistleblower' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/legalservicesfacility', icon: Facebook },
    { name: 'Twitter', href: 'https://twitter.com/legalservicesfacility', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/legalservicesfacility', icon: Linkedin },
    { name: 'YouTube', href: 'https://youtube.com/legalservicesfacility', icon: Youtube },
    { name: 'Instagram', href: 'https://instagram.com/legalservicesfacility', icon: Instagram },
  ];

  return (
    <footer className="relative bg-primary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">

        {/* Top Section: Brand & Subscribe */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-20 border-b border-white/10 pb-12">
          {/* Brand Promise */}
          <div className="max-w-xl">
            <Link to="/" className="inline-block mb-8">
              <img
                src="/lsf-logo-white.png"
                alt="Legal Services Facility"
                className="h-20 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <h2 className="text-3xl font-bold leading-tight mb-4">Empowering Justice for All.</h2>
            <p className="text-white/70 text-lg leading-relaxed">
              We work everyday to ensure every Tanzanian, regardless of their status, has access to their rights and legal protection.
            </p>
          </div>

          {/* Newsletter Subscribe */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-white/60 mb-6 text-sm">Get the latest legal aid updates, success stories, and opportunities delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email address"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40 h-12 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white/30"
              />
              <Button className="bg-white text-primary hover:bg-gray-100 font-bold h-12 px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Contact - Enhanced */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>
              Contact Us
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">Headquarters</p>
                  <p className="text-white/70 text-sm leading-relaxed">Chole Rd, Masaki<br />Dar es Salaam, Tanzania</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">Call Us</p>
                  <a href="tel:+255870119363" className="text-white/70 text-sm hover:text-white transition-colors">+255 870 119 363</a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">Email Us</p>
                  <a href="mailto:info@lsftz.org" className="text-white/70 text-sm hover:text-white transition-colors">info@lsftz.org</a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>
              Organization
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>
              Resources
            </h4>
            <ul className="space-y-4">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Action */}
          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-8 h-1 bg-white/30 rounded-full"></span>
              Take Action
            </h4>
            <ul className="space-y-4 mb-8">
              {getInvolved.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/donate">
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold">
                Make a Donation
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Legal Services Facility. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">Privacy</Link>
            <Link to="/terms" className="text-white/50 hover:text-white text-sm transition-colors">Terms</Link>
            <button onClick={scrollToTop} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
              Back to Top <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
