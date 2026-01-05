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
    <footer className="bg-white border-t border-neutral-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Organization Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/lovable-uploads/0ab56c9e-d19f-4e11-97f4-9e0dd22b6e0b.png"
                alt="Legal Services Facility"
                className="h-12 w-auto"
              />
            </Link>

            <p className="text-neutral-600 leading-relaxed mb-8 max-w-sm">
              Empowering communities through accessible legal aid and justice reform across Tanzania since 2011.
            </p>

            {/* Contact Info - Minimal */}
            <div className="space-y-3">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 hover:text-primary transition-colors">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Chole Rd, Masaki, Dar es Salaam</span>
              </a>
              <a href="tel:+255222601534" className="flex items-center gap-3 text-neutral-600 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+255 (0) 22 260 1534</span>
              </a>
              <a href="mailto:info@lsftz.org" className="flex items-center gap-3 text-neutral-600 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">info@lsftz.org</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-6 text-sm uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-600 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-6 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-600 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-6 text-sm uppercase tracking-wider">
              Get Involved
            </h4>
            <ul className="space-y-3">
              {getInvolved.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-neutral-600 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Donate CTA */}
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 mt-6 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors"
            >
              Donate Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p className="text-neutral-500 text-sm">
                © {new Date().getFullYear()} Legal Services Facility. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="text-neutral-500 hover:text-primary text-xs transition-colors">
                  Privacy
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/terms" className="text-neutral-500 hover:text-primary text-xs transition-colors">
                  Terms
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/whistleblower" className="text-neutral-500 hover:text-primary text-xs transition-colors">
                  Whistleblower
                </Link>
              </div>
            </div>

            {/* Social Links & Back to Top */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-primary transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-neutral-500 hover:text-primary text-sm transition-colors"
                aria-label="Back to top"
              >
                <span className="hidden sm:inline">Top</span>
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
