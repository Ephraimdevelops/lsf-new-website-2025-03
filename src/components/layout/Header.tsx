
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Search, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import LegalAidDialog from '@/components/shared/LegalAidDialog';

// Enhanced navigation structure with images
const navigationItems = [
  { 
    name: 'About', 
    href: '/about',
    description: 'Our mission and organization',
    image: '/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png',
    sections: [
      {
        title: 'Organization',
        links: [
          { name: 'About LSF', href: '/about', description: 'Mission, vision, and history', image: '/lovable-uploads/background with mother umage .png' },
          { name: 'Our Team', href: '/team', description: 'Leadership and staff', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Partners', href: '/partners', description: 'Strategic partnerships', image: '/lovable-uploads/background with mother umage .png' },
        ]
      },
      {
        title: 'Get Involved',
        links: [
          { name: 'Contact Us', href: '/contact', description: 'Get in touch', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Opportunities', href: '/opportunities', description: 'Join our team', image: '/lovable-uploads/background with mother umage .png' },
          { name: 'Donate', href: '/donate', description: 'Support our mission', image: '/lovable-uploads/backgound lsf colours.png' },
        ]
      }
    ]
  },
  { 
    name: 'Our Work', 
    href: '/what-we-do',
    description: 'How we strengthen access to justice',
    image: '/lovable-uploads/background with mother umage .png',
    sections: [
      {
        title: 'Approaches',
        links: [
          { name: 'What We Do', href: '/what-we-do', description: 'Our comprehensive approach', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Grant Making', href: '/what-we-do/grant-making', description: 'Funding justice organizations', image: '/lovable-uploads/background with mother umage .png' },
          { name: 'Capacity Building', href: '/what-we-do/capacity-building', description: 'Strengthening providers', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy', description: 'Systemic change', image: '/lovable-uploads/background with mother umage .png' },
        ]
      },
      {
        title: 'Focus Areas',
        links: [
          { name: 'Legal Aid', href: '/focus-areas/accessible-legal-aid', description: 'Quality services', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Community Empowerment', href: '/focus-areas/empowered-communities', description: 'Legal empowerment', image: '/lovable-uploads/background with mother umage .png' },
          { name: 'Climate Justice', href: '/focus-areas/climate-justice', description: 'Environmental rights', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Digital Innovation', href: '/focus-areas/digital-transformation', description: 'Technology solutions', image: '/lovable-uploads/background with mother umage .png' },
        ]
      }
    ]
  },
  { 
    name: 'Programs', 
    href: '/programs',
    description: 'Our active initiatives',
    image: '/lovable-uploads/backgound lsf colours.png',
    sections: [
      {
        title: 'Current Programs',
        links: [
          { name: 'All Programs', href: '/programs', description: 'Active program portfolio', image: '/lovable-uploads/background with mother umage .png' },
          { name: 'Get Legal Help', href: '/legal-help', description: 'Access assistance', image: '/lovable-uploads/backgound lsf colours.png' },
        ]
      }
    ]
  },
  { 
    name: 'Impact', 
    href: '/impact',
    description: 'Stories and results',
    image: '/lovable-uploads/background with mother umage .png',
    sections: [
      {
        title: 'Our Impact',
        links: [
          { name: 'Success Stories', href: '/heroes', description: 'Inspiring stories', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Impact Metrics', href: '/impact', description: 'Measurable outcomes', image: '/lovable-uploads/background with mother umage .png' },
        ]
      }
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Publications and information',
    image: '/lovable-uploads/backgound lsf colours.png',
    sections: [
      {
        title: 'Information',
        links: [
          { name: 'Latest News', href: '/news', description: 'Current developments', image: '/lovable-uploads/background with mother umage .png' },
          { name: 'Publications', href: '/publications', description: 'Reports and research', image: '/lovable-uploads/backgound lsf colours.png' },
          { name: 'Legal Resources', href: '/resources', description: 'Practical information', image: '/lovable-uploads/background with mother umage .png' },
        ]
      }
    ]
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [legalAidDialogOpen, setLegalAidDialogOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);
  
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  
  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || mobileMenuOpen
            ? "bg-white shadow-lg border-b border-gray-100"
            : "bg-white/95 backdrop-blur-sm"
        )}
      >
        {/* Contact Strip */}
        <div className={cn(
          "bg-primary text-white py-2 transition-all duration-300",
          isScrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
        )}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Legal Helpline: +255 870 119 363</span>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@legalservicesfacility.org</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/contact" className="hover:text-secondary-orange transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF Logo"
                  className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="hidden md:block">
                  <div className="text-sm font-bold text-primary">Legal Services Facility</div>
                  <div className="text-xs text-neutral-gray">Empowering Justice Since 2011</div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <button
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200",
                      location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                        ? "text-primary bg-primary/5"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    )}
                    onClick={() => toggleDropdown(item.name)}
                  >
                    {item.name}
                    <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
                  </button>
                  
                  {/* Enhanced Dropdown with Images */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-[500px] rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-6">
                      {/* Header with main image */}
                      <div className="mb-6 relative overflow-hidden rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <h3 className="text-white font-bold text-lg">{item.name}</h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {item.sections?.map((section, index) => (
                          <div key={index}>
                            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                              {section.title}
                            </h4>
                            <ul className="space-y-2">
                              {section.links.map((link) => (
                                <li key={link.name}>
                                  <Link
                                    to={link.href}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group/link"
                                  >
                                    <img 
                                      src={link.image} 
                                      alt={link.name}
                                      className="w-10 h-10 object-cover rounded-md"
                                    />
                                    <div>
                                      <div className="font-semibold text-gray-900 group-hover/link:text-primary transition-colors text-sm">
                                        {link.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {link.description}
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Action buttons */}
              <div className="flex items-center ml-6 space-x-3 border-l border-gray-200 pl-6">
                <SearchDialog />
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
                  onClick={() => setLegalAidDialogOpen(true)}
                >
                  <Phone className="h-4 w-4" />
                  <span>Get Help</span>
                </Button>
                <Link to="/donate">
                  <Button variant="outline" size="sm" className="border-2 hover:bg-primary hover:text-white transition-all duration-300">
                    Donate
                  </Button>
                </Link>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden space-x-3">
              <Link to="/donate">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Donate
                </Button>
              </Link>
              <button 
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="container mx-auto px-4 py-4">
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-xl">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="w-full justify-center bg-primary hover:bg-primary/90"
                    onClick={() => setLegalAidDialogOpen(true)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Get Help
                  </Button>
                  <Link to="/donate" className="w-full">
                    <Button variant="outline" className="w-full justify-center border-primary text-primary hover:bg-primary hover:text-white">
                      Donate
                    </Button>
                  </Link>
                </div>
              </div>
              
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <div key={item.name} className="py-1">
                    <div>
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200",
                          activeDropdown === item.name ? "text-primary bg-primary/5" : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown 
                          size={16} 
                          className={cn(
                            "transition-transform duration-200",
                            activeDropdown === item.name ? "transform rotate-180" : ""
                          )}
                        />
                      </button>
                      
                      {activeDropdown === item.name && (
                        <div className="mt-2 pl-4 border-l-2 border-primary/20 bg-gray-50/50 rounded-r-lg">
                          {item.sections?.map((section) => (
                            <div key={section.title} className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-1">
                                {section.title}
                              </h4>
                              <ul className="space-y-2">
                                {section.links.map((link) => (
                                  <li key={link.name}>
                                    <Link
                                      to={link.href}
                                      className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                                        location.pathname === link.href
                                          ? "text-primary bg-primary/5"
                                          : "text-gray-600 hover:bg-gray-50"
                                      )}
                                    >
                                      <img 
                                        src={link.image} 
                                        alt={link.name}
                                        className="w-8 h-8 object-cover rounded"
                                      />
                                      <div>
                                        <div className="font-medium">{link.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{link.description}</div>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <SearchDialog />
              </div>
            </div>
          </div>
        )}
      </header>

      <LegalAidDialog 
        open={legalAidDialogOpen} 
        onOpenChange={setLegalAidDialogOpen} 
      />
    </>
  );
};

export default Header;
