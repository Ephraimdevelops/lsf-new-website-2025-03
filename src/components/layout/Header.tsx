
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import LegalAidDialog from '@/components/shared/LegalAidDialog';
import { TouchTarget } from '@/components/shared/TouchTarget';

const navigationItems = [
  { 
    name: 'About Us', 
    href: '/about',
    description: 'Who we are and our mission',
    image: '/lovable-uploads/bd699246-15c2-42da-aac8-85925fa200f4.png',
    subItems: [
      { name: 'Who We Are', href: '/about', description: 'Our story and mission' },
      { name: 'Our Vision & Mission', href: '/about#mission', description: 'What drives us' },
      { name: 'Our Team', href: '/team', description: 'Meet our leadership' },
      { name: 'Partners & Donors', href: '/partners', description: 'Strategic collaborations' },
      { name: 'Governance & Transparency', href: '/about#governance', description: 'How we operate' },
    ]
  },
  { 
    name: 'What We Do', 
    href: '/what-we-do',
    description: 'Our comprehensive approach to justice',
    image: '/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png',
    subItems: [
      { name: 'Strategic Focus Areas', href: '/what-we-do#focus-areas', description: 'Key intervention areas' },
      { name: 'Accessible Legal Aid', href: '/focus-areas/accessible-legal-aid', description: 'Breaking barriers to justice' },
      { name: 'Empowered Communities', href: '/focus-areas/empowered-communities', description: 'Local capacity building' },
      { name: 'Conducive Legal Environment', href: '/focus-areas/conducive-environment', description: 'Policy & framework' },
      { name: 'Institutional Sustainability', href: '/focus-areas/institutional-development', description: 'Organizational growth' },
      { name: 'Our Approaches', href: '/what-we-do#approaches', description: 'How we work' },
      { name: 'Grant Making & Management', href: '/what-we-do/grant-making', description: 'Strategic funding approach' },
      { name: 'Direct Implementation', href: '/what-we-do/direct-implementation', description: 'On-ground projects' },
      { name: 'Advocacy', href: '/what-we-do/advocacy-policy', description: 'System-level change' },
      { name: 'Research & Learning', href: '/what-we-do/learning-research', description: 'Evidence-based insights' },
      { name: 'Policy Influence', href: '/what-we-do/advocacy-policy#policy', description: 'Shaping legal frameworks' },
      { name: 'Partnerships & Networking', href: '/what-we-do/partnerships-networking', description: 'Collaborative approach' },
    ]
  },
  { 
    name: 'Our Impact', 
    href: '/impact',
    description: 'Measurable change and stories',
    image: '/lovable-uploads/bd699246-15c2-42da-aac8-85925fa200f4.png',
    subItems: [
      { name: 'Impact Dashboard', href: '/impact', description: 'Data and outcomes' },
      { name: 'Stories of Change', href: '/heroes', description: 'Real impact stories' },
      { name: 'SDG Alignment', href: '/impact#sdg', description: 'UN Sustainable Development Goals' },
      { name: 'Reports & Achievements', href: '/impact#reports', description: 'Annual reports and milestones' },
    ]
  },
  { 
    name: 'Programs', 
    href: '/programs',
    description: 'Our flagship initiatives',
    image: '/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png',
    subItems: [
      { name: 'Sauti ya Mwanamke', href: '/programs#sauti', description: 'Women\'s voice program' },
      { name: 'Wanawake Tunaweza', href: '/programs#wanawake', description: 'Women empowerment initiative' },
      { name: 'Haki Yangu App', href: '/programs#haki', description: 'Legal rights mobile app' },
      { name: 'Other Flagship Initiatives', href: '/programs', description: 'All our programs' },
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Publications and learning materials',
    image: '/lovable-uploads/bd699246-15c2-42da-aac8-85925fa200f4.png',
    subItems: [
      { name: 'Publications & Reports', href: '/publications', description: 'Research and reports' },
      { name: 'Research & Studies', href: '/resources#research', description: 'Academic insights' },
      { name: 'Policies & Toolkits', href: '/resources#policies', description: 'Implementation guides' },
      { name: 'Training Manuals', href: '/resources#training', description: 'Capacity building materials' },
    ]
  },
  { 
    name: 'News', 
    href: '/news',
    description: 'Latest updates and events',
    image: '/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png',
    subItems: [
      { name: 'Blog', href: '/news', description: 'Latest articles and insights' },
      { name: 'Press Releases', href: '/news#press', description: 'Official announcements' },
      { name: 'Events', href: '/news#events', description: 'Upcoming and past events' },
      { name: 'Campaigns', href: '/news#campaigns', description: 'Inspire To Lead and more' },
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 relative overflow-hidden",
          isScrolled || mobileMenuOpen
            ? "bg-white shadow-lg border-b border-gray-100"
            : "bg-white/95 backdrop-blur-sm"
        )}
      >
        {/* Subtle Brand Pattern */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-3 pointer-events-none"
          style={{
            backgroundImage: `url('/lovable-uploads/bd699246-15c2-42da-aac8-85925fa200f4.png')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />
        {/* Contact Strip - Improved Mobile Behavior */}
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

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - Improved Mobile Responsiveness */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
                <img 
                  src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                  alt="LSF Logo"
                  className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="hidden sm:block">
                  <div className="text-xs md:text-sm font-bold text-primary transition-colors duration-200 group-hover:text-primary-dark leading-tight">
                    Legal Services Facility
                  </div>
                  <div className="text-[10px] md:text-xs text-neutral-gray leading-tight">
                    Empowering Justice Since 2011
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.subItems.length > 0 ? (
                    <button
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-muted/50"
                      )}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.name}
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "ml-1 transition-transform duration-200",
                          activeDropdown === item.name ? "rotate-180" : ""
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        location.pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-muted/50"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                  
                   {/* Dropdown menu */}
                  {item.subItems.length > 0 && (
                    <div 
                      className={cn(
                        "absolute left-0 top-full mt-2 w-80 rounded-lg shadow-xl bg-white border border-gray-200 transition-all duration-200 z-[60]",
                        activeDropdown === item.name 
                          ? "opacity-100 visible translate-y-0" 
                          : "opacity-0 invisible -translate-y-2"
                      )}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {/* Header with icon instead of image */}
                      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-t-lg border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-primary rounded-sm"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-600">{item.description}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="p-3">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={cn(
                              "flex items-start p-2 rounded-md transition-colors duration-200 hover:bg-muted group",
                              location.pathname === subItem.href
                                ? "text-primary bg-primary/10"
                                : "text-foreground hover:text-primary"
                            )}
                          >
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-2 mt-1.5 transition-colors duration-200 group-hover:bg-primary"></div>
                            <div>
                              <div className="font-medium text-sm">{subItem.name}</div>
                              <div className="text-xs text-muted-foreground">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Action buttons */}
              <div className="flex items-center ml-6 space-x-3 border-l border-border pl-6">
                <div className="transform hover:scale-110 transition-transform duration-200">
                  <SearchDialog />
                </div>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 flex items-center space-x-2 transform hover:scale-105 transition-all duration-200 hover:shadow-lg rounded-lg px-4"
                  onClick={() => setLegalAidDialogOpen(true)}
                >
                  <Phone className="h-4 w-4" />
                  <span>Get Legal Help</span>
                </Button>
                <Link to="/donate">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 rounded-lg px-4"
                  >
                    Donate
                  </Button>
                </Link>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden space-x-3">
              <div className="transform hover:scale-110 transition-transform duration-200">
                <SearchDialog />
              </div>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 transition-all duration-200"
                onClick={() => setLegalAidDialogOpen(true)}
              >
                <Phone className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Get Help</span>
              </Button>
              <TouchTarget
                size="lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "rounded-md text-neutral-600 hover:bg-neutral-100 transition-all duration-200",
                  mobileMenuOpen && "bg-neutral-100"
                )}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </TouchTarget>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mobile Navigation */}
        <div className={cn(
          "lg:hidden bg-white border-t border-gray-100 shadow-lg transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="container mx-auto px-4 py-4">
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
              <Button 
                className="w-full justify-center bg-primary hover:bg-primary/90 transition-all duration-200 mb-3"
                onClick={() => setLegalAidDialogOpen(true)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Get Legal Help
              </Button>
              <Link to="/donate" className="block">
                <Button 
                  variant="outline" 
                  className="w-full justify-center border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  Donate
                </Button>
              </Link>
            </div>
            
            <nav className="space-y-1 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => (
                <div key={item.name} className="py-1">
                  <div>
                    {item.subItems.length > 0 ? (
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                          activeDropdown === item.name ? "text-primary bg-primary/10" : "text-foreground"
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
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                          location.pathname === item.href ? "text-primary bg-primary/10" : "text-foreground"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}
                    
                    {item.subItems.length > 0 && (
                      <div className={cn(
                        "transition-all duration-200 overflow-hidden",
                        activeDropdown === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <div className="mt-2 pl-4 border-l-2 border-primary/20 bg-muted/30 rounded-r-lg">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={cn(
                                "flex items-center gap-3 py-3 text-sm rounded-md transition-all duration-200 hover:bg-muted/50 min-h-[44px]",
                                location.pathname === subItem.href
                                  ? "text-primary bg-primary/10 font-medium px-3"
                                  : "text-muted-foreground px-3"
                              )}
                            >
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full transition-all duration-200 flex-shrink-0"></span>
                              <div className="font-medium">{subItem.name}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <LegalAidDialog 
        open={legalAidDialogOpen} 
        onOpenChange={setLegalAidDialogOpen} 
      />
    </>
  );
};

export default Header;
