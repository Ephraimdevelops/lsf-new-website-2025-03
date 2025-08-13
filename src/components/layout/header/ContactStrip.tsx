import { Phone, Mail, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ContactStripProps {
  isScrolled: boolean;
}

const ContactStrip = ({ isScrolled }: ContactStripProps) => {
  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground transition-all duration-300",
        isScrolled ? "h-0 overflow-hidden opacity-0 py-0" : "py-3 opacity-100"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2 sm:gap-0">
          
          {/* Left side: Legal Aid / Helpline */}
          <div className="flex items-center gap-4 text-center sm:text-left flex-wrap justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" />
              <span className="font-semibold text-white">
                Accesible Legal Aid for All
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="truncate">Helpline: +255(0)222 601 534</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">info@lsftz.org</span>
            </div>
          </div>

          {/* Right side: CTA */}
          <div className="flex items-center">
            <Link
              to="/contact"
              className="inline-block bg-white text-primary rounded-full px-4 py-1.5 font-semibold text-sm hover:bg-secondary-orange hover:text-white transition-colors"
            >
              Talk to Us Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactStrip;