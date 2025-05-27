
import { Phone, Mail, MapPin, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const InfoStrip = () => {
  return (
    <div className="bg-neutral-dark text-white py-2 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Contact Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>+255 (0) 800 110 303</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>info@lsftz.org</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>Plot No. 1129 Chole Rd, Masaki, Dar es salaam</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <span>www.lsftz.org</span>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <span className="text-xs hidden md:inline">Follow us:</span>
            <div className="flex gap-2">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStrip;
