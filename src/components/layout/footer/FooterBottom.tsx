import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import Typography from '@/components/shared/Typography';

const FooterBottom = () => {
  return (
    <div className="border-t border-white/10 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
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
  );
};

export default FooterBottom;