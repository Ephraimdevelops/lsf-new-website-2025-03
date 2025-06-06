
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Typography from '@/components/shared/Typography';

const Footer = () => {
  const quickLinks = [
    { name: 'About LSF', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Strategic Partners', href: '/partners' },
    { name: 'Career Opportunities', href: '/opportunities' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Support Our Work', href: '/donate' }
  ];

  const legalServices = [
    { name: 'Get Legal Help', href: '/legal-help' },
    { name: 'All Programs', href: '/programs' },
    { name: 'Women\'s Legal Clinic', href: '/programs#womens-clinic' },
    { name: 'Land Rights Protection', href: '/programs#land-rights' },
    { name: 'Community Outreach', href: '/programs#community' },
    { name: 'Digital Legal Aid', href: '/programs#digital' }
  ];

  const resources = [
    { name: 'News & Updates', href: '/news' },
    { name: 'Research Publications', href: '/publications' },
    { name: 'Legal Resources', href: '/resources' },
    { name: 'Success Stories', href: '/heroes' },
    { name: 'Training Materials', href: '/resources#training' },
    { name: 'Policy Briefs', href: '/resources#policy' }
  ];

  const ourWork = [
    { name: 'Grant Making', href: '/what-we-do/grant-making' },
    { name: 'Capacity Building', href: '/what-we-do/capacity-building' },
    { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy' },
    { name: 'Research & Learning', href: '/what-we-do/learning-research' },
    { name: 'Strategic Partnerships', href: '/what-we-do/partnerships-networking' },
    { name: 'Our Impact', href: '/what-we-do' }
  ];

  return (
    <footer className="bg-neutral-dark text-white">
      {/* Newsletter Section */}
      <div className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Typography variant="h3" className="text-white mb-4">
              Stay Connected with Our Work
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest updates on our legal empowerment initiatives, success stories, 
              and opportunities to make a difference in Tanzania's justice landscape.
            </Typography>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-white text-neutral-dark border-0 flex-1"
              />
              <Button 
                variant="secondary" 
                className="bg-secondary-orange hover:bg-secondary-orange/90 text-white border-0 font-semibold px-8"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Organization Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF Logo"
                  className="h-16 w-auto mb-4"
                />
                <Typography variant="h4" className="text-white mb-4">
                  Legal Services Facility
                </Typography>
                <Typography variant="bodySmall" className="text-white/80 leading-relaxed mb-6">
                  Empowering communities through accessible legal aid and justice reform. 
                  For over a decade, we've been committed to tackling Tanzania's greatest 
                  inequities in access to justice.
                </Typography>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <Typography variant="bodySmall" className="text-white/90">
                      Mikocheni Light Industrial Area, Plot No. 1353<br />
                      Dar es Salaam, Tanzania
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <Typography variant="bodySmall" className="text-white/90">
                    +255 22 277 5567
                  </Typography>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <Typography variant="bodySmall" className="text-white/90">
                    info@legalservicesfacility.org
                  </Typography>
                </div>
              </div>
            </div>

            {/* Our Work */}
            <div>
              <Typography variant="h4" className="text-white mb-6 uppercase tracking-wide">
                Our Work
              </Typography>
              <ul className="space-y-3">
                {ourWork.map((link) => (
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

            {/* Legal Services */}
            <div>
              <Typography variant="h4" className="text-white mb-6 uppercase tracking-wide">
                Legal Services
              </Typography>
              <ul className="space-y-3">
                {legalServices.map((link) => (
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

            {/* Resources & About */}
            <div>
              <Typography variant="h4" className="text-white mb-6 uppercase tracking-wide">
                Resources
              </Typography>
              <ul className="space-y-3 mb-8">
                {resources.slice(0, 4).map((link) => (
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

              <Typography variant="h4" className="text-white mb-6 uppercase tracking-wide">
                About
              </Typography>
              <ul className="space-y-3">
                {quickLinks.slice(0, 4).map((link) => (
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

      {/* Bottom Section */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <Typography variant="bodySmall" className="text-white/70">
                © 2024 Legal Services Facility. All rights reserved.
              </Typography>
              <div className="flex space-x-4">
                <Link to="/privacy" className="text-white/70 hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-white/70 hover:text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link to="/whistleblower" className="text-white/70 hover:text-primary text-sm transition-colors">
                  Whistleblower
                </Link>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/legalservicesfacility" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
