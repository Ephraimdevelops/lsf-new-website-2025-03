import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Download, ExternalLink } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { name: 'About Us', href: '/about', description: 'Our mission and impact' },
  { name: 'Get Legal Help', href: '/legal-help', description: 'Find assistance' },
  { name: 'Contact Us', href: '/contact', description: 'Get in touch' },
  { name: 'AI Legal Assistant', href: '/lsfchatbot', description: '24/7 legal support' },
];

const resources = [
  { name: 'News & Updates', href: '/news', description: 'Latest developments' },
  { name: 'Publications', href: '/publications', description: 'Reports and research' },
  { name: 'Success Stories', href: '/heroes', description: 'Impact stories' },
  { name: 'Legal Resources', href: '/resources', description: 'Tools and guides' },
  { name: 'Haki Yangu App', href: '/haki-yangu', description: 'Download our app', featured: true },
];

const support = [
  { name: 'Careers & Opportunities', href: '/opportunities', description: 'Join our team' },
  { name: 'Whistleblower Channel', href: '/whistleblower', description: 'Report concerns' },
  { name: 'FAQs', href: '/faq', description: 'Common questions' },
  { name: 'Donate', href: '/donate', description: 'Support our work' },
];

const ModernFooterLinks = () => {
  return (
    <div className="py-10 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Organization Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF Logo"
                  className="h-16 w-auto"
                />
                <div>
                  <Typography variant="h3" className="text-white mb-2">
                    Legal Services Facility
                  </Typography>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary-teal"></div>
                </div>
              </div>
              
              <Typography variant="body" className="text-white/80 leading-relaxed mb-8 text-lg">
                Empowering communities through accessible legal aid and justice reform across Tanzania. 
                We believe that justice should be within reach of every Tanzanian, regardless of location, income, or background.
              </Typography>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Typography variant="h4" className="text-white mb-1 text-sm font-semibold">
                    Address
                  </Typography>
                  <Typography variant="body" className="text-white/80">
                    Chole Rd, Masaki<br />
                    Dar es Salaam, Tanzania
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Typography variant="h4" className="text-white mb-1 text-sm font-semibold">
                    Phone
                  </Typography>
                  <Typography variant="body" className="text-white/80">
                    +255 (0) 22260 1534
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Typography variant="h4" className="text-white mb-1 text-sm font-semibold">
                    Email
                  </Typography>
                  <Typography variant="body" className="text-white/80">
                    info@lsftz.org
                  </Typography>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="h4" className="text-white mb-6 text-lg font-bold">
              Quick Links
            </Typography>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="group flex items-start gap-3 text-white/80 hover:text-white transition-all duration-300"
                  >
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    <div>
                      <Typography variant="body" className="font-medium group-hover:text-primary transition-colors">
                        {link.name}
                      </Typography>
                      <Typography variant="bodySmall" className="text-white/60 text-xs">
                        {link.description}
                      </Typography>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Support Combined */}
          <div className="space-y-8">
            {/* Resources */}
            <div>
              <Typography variant="h4" className="text-white mb-6 text-lg font-bold">
                Resources
              </Typography>
              <ul className="space-y-4">
                {resources.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="group flex items-start gap-3 text-white/80 hover:text-white transition-all duration-300"
                    >
                      {link.featured ? (
                        <ExternalLink className="h-4 w-4 mt-0.5 text-secondary-teal/60 group-hover:text-secondary-teal group-hover:scale-110 transition-all duration-300 flex-shrink-0" />
                      ) : (
                        <ArrowRight className="h-4 w-4 mt-0.5 text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                      )}
                      <div>
                        <Typography variant="body" className="font-medium group-hover:text-primary transition-colors">
                          {link.name}
                        </Typography>
                        <Typography variant="bodySmall" className="text-white/60 text-xs">
                          {link.description}
                        </Typography>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernFooterLinks;
