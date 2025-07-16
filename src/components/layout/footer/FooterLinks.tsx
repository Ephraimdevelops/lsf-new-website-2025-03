import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import Typography from '@/components/shared/Typography';

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Our Work', href: '/what-we-do' },
  { name: 'Programs', href: '/programs' },
  { name: 'Get Legal Help', href: '/legal-help' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Sign Up', href: '/signup' },
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

const FooterLinks = () => {
  return (
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
                LSF
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
                  Chole Rd, Masaki - Dar es Salaam, Tanzania<br />
                    Dar es Salaam, Tanzania
                  </Typography>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <Typography variant="bodySmall" className="text-white/90">
                +255 (0) 22260 1534
                </Typography>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <Typography variant="bodySmall" className="text-white/90">
                  info@lsftz.org
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
  );
};

export default FooterLinks;