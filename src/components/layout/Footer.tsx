
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
                alt="LSF Logo"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/70 mb-6">
              Legal Services Facility (LSF) is a non-profit organization established in 2011. 
              We work to increase access to justice for all, particularly for women, through a legal empowerment approach.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white/70 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-white/70 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" className="text-white/70 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-white/70 hover:text-white transition-colors">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link to="/what-we-do" className="text-white/70 hover:text-white transition-colors">
                  What We Do
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white/70 hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link to="/publications" className="text-white/70 hover:text-white transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-white/70 hover:text-white transition-colors">
                  Opportunities
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/legal-help" className="text-white/70 hover:text-white transition-colors">
                  Get Legal Help
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-white/70 hover:text-white transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/whistleblower" className="text-white/70 hover:text-white transition-colors">
                  Whistleblower
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center">
                  Staff Portal <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="mr-2 h-5 w-5 flex-shrink-0 text-white/70" />
                <span className="text-white/70">
                  Plot No. 1, Jillian Plaza, Mbezi Beach, Dar es Salaam, Tanzania
                </span>
              </li>
              <li className="flex">
                <Phone className="mr-2 h-5 w-5 flex-shrink-0 text-white/70" />
                <span className="text-white/70">
                  Toll FREE: <a href="tel:+255800110303" className="hover:text-white">+255 800 110 303</a>
                </span>
              </li>
              <li className="flex">
                <Mail className="mr-2 h-5 w-5 flex-shrink-0 text-white/70" />
                <a href="mailto:info@lsftz.org" className="text-white/70 hover:text-white">
                  info@lsftz.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white/70 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Legal Services Facility (LSF). All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/privacy-policy" className="text-white/70 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="text-white/70 hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link to="/sitemap" className="text-white/70 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
