import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'What We Do', href: '/what-we-do' },
    { name: 'Programs', href: '/programs' },
    { name: 'Our Impact', href: '/impact' },
  ];

  const resources = [
    { name: 'News & Updates', href: '/news' },
    { name: 'Publications', href: '/publications' },
    { name: 'Success Stories', href: '/heroes' },
    { name: 'Legal Resources', href: '/resources' },
  ];

  const getInvolved = [
    { name: 'Get Legal Help', href: '/legal-help' },
    { name: 'Careers', href: '/opportunities' },
    { name: 'Partner With Us', href: '/contact' },
    { name: 'Donate', href: '/donate' },
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
      {/* Subtle branded background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <img
          src="/pattern-bg.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40" />
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Organization Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img
                src="/lovable-uploads/0ab56c9e-d19f-4e11-97f4-9e0dd22b6e0b.png"
                alt="Legal Services Facility"
                className="h-14 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>

            <p className="text-white/80 leading-relaxed mb-8 max-w-sm">
              Empowering communities through accessible legal aid and justice reform across Tanzania since 2011.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a href="https://maps.google.com/?q=Chole+Road+Masaki+Dar+es+Salaam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-sm">Chole Rd, Masaki, Dar es Salaam</span>
              </a>
              <a href="tel:+255870119363" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-sm">+255 870 119 363</span>
              </a>
              <a href="mailto:info@lsftz.org" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-sm">info@lsftz.org</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">
              Get Involved
            </h4>
            <ul className="space-y-3">
              {getInvolved.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Donate CTA */}
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 mt-8 bg-white text-primary text-sm font-bold px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} Legal Services Facility. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="text-white/60 hover:text-white text-xs transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-white/60 hover:text-white text-xs transition-colors">
                  Terms
                </Link>
                <Link to="/whistleblower" className="text-white/60 hover:text-white text-xs transition-colors">
                  Whistleblower
                </Link>
              </div>
            </div>

            {/* Social Links & Back to Top */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-primary transition-all"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
                aria-label="Back to top"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
