import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowUp } from 'lucide-react';
import Typography from '@/components/shared/Typography';

const ModernFooterBottom = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/legalservicesfacility',
      icon: Facebook,
      color: 'hover:text-blue-500'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/legalservicesfacility',
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/legalservicesfacility',
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/legalservicesfacility',
      icon: Youtube,
      color: 'hover:text-red-500'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/legalservicesfacility',
      icon: Instagram,
      color: 'hover:text-pink-500'
    }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' }
  ];

  return (
    <div className="border-t border-white/10 py-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          {/* Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <Typography variant="bodySmall" className="text-white/70 text-center md:text-left">
              © 2024 Legal Services Facility. All rights reserved.
            </Typography>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
              {legalLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href}
                  className="text-white/70 hover:text-primary text-sm transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-6">
            <Typography variant="bodySmall" className="text-white/70 mr-2">
              Follow us:
            </Typography>
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white/70 ${social.color} transition-all duration-300 hover:scale-110 group`}
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-105"
            aria-label="Back to top"
          >
            <span className="text-sm font-medium">Back to top</span>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
              <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Typography variant="bodySmall" className="text-white/60">
            Legal Services Facility is a registered non-profit organization in Tanzania. 
            Registration No: 00NGO/0000/0000 | Tax ID: 000000000000
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ModernFooterBottom;
