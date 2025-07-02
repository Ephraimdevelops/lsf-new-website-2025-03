import { Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ContactStripProps {
  isScrolled: boolean;
}

const ContactStrip = ({ isScrolled }: ContactStripProps) => {
  return (
    <div className={cn(
      "bg-primary text-primary-foreground transition-all duration-300",
      isScrolled ? "h-0 overflow-hidden opacity-0 py-0" : "py-2 opacity-100"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Legal Helpline: +255 870 119 363</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">info@legalservicesfacility.org</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/contact" 
              className="hover:text-secondary-orange transition-colors duration-200 whitespace-nowrap text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactStrip;