
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-dark text-white">
      <div className="container mx-auto pt-16 pb-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/lovable-uploads/f1407f2d-51ff-4898-b7a5-9ede5d13e081.png" 
                alt="LSF Logo" 
                className="h-16 w-auto mb-4"
              />
            </Link>
            <p className="text-gray-300 text-sm">
              Legal Services Facility (LSF) is a basket fund established in 2011 as a non-profit organization that strives to increase access to justice for all, in particular for women.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="text-gray-300 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-300 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-600 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-primary transition-colors">Our Programs</Link></li>
              <li><Link to="/resources" className="text-gray-300 hover:text-primary transition-colors">Resources</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-primary transition-colors">News & Updates</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/donate" className="text-gray-300 hover:text-primary transition-colors">Support Our Work</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-600 pb-2">Our Programs</h3>
            <ul className="space-y-2">
              <li><Link to="/programs/legal-empowerment" className="text-gray-300 hover:text-primary transition-colors">Legal Empowerment</Link></li>
              <li><Link to="/programs/gender-justice" className="text-gray-300 hover:text-primary transition-colors">Gender Justice</Link></li>
              <li><Link to="/programs/climate-justice" className="text-gray-300 hover:text-primary transition-colors">Climate Justice</Link></li>
              <li><Link to="/programs/digital-transformation" className="text-gray-300 hover:text-primary transition-colors">Digital Transformation</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-600 pb-2">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="font-bold">Address:</span>
                <span>Plot No. 1, Jillian Plaza, Mbezi Beach, Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold">Phone:</span>
                <span>+255 800 110 303</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold">Email:</span>
                <a href="mailto:info@lsftz.org" className="hover:text-primary transition-colors">info@lsftz.org</a>
              </li>
              <li>
                <a href="https://www.lsftz.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Visit www.lsftz.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Legal Services Facility. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 text-sm text-gray-400">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookies-policy" className="hover:text-primary transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
