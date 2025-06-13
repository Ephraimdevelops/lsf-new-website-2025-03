
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Search, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import LegalAidDialog from '@/components/shared/LegalAidDialog';

// Updated navigation structure with new "Our Impact" section and renamed items
const navigationItems = [
  { 
    name: 'About', 
    href: '/about',
    description: 'Learn about our mission and organization',
    featured: {
      title: 'Our Story',
      description: 'Empowering communities through legal aid since 2011',
      href: '/about',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Organization',
        links: [
          { name: 'About Us', href: '/about', description: 'Mission, vision, and history' },
          { name: 'Our Team', href: '/team', description: 'Leadership and staff members' },
          { name: 'Board Leadership', href: '/team#leadership', description: 'Governance structure' },
          { name: 'Partners', href: '/partners', description: 'Strategic partnerships' },
        ]
      },
      {
        title: 'Engagement',
        links: [
          { name: 'Contact Us', href: '/contact', description: 'Get in touch with us' },
          { name: 'Opportunities', href: '/opportunities', description: 'Career and volunteer options' },
          { name: 'Whistleblower', href: '/whistleblower', description: 'Report concerns safely' },
          { name: 'Donate', href: '/donate', description: 'Support our mission' },
        ]
      }
    ]
  },
  { 
    name: 'Our Work', 
    href: '/what-we-do',
    description: 'How we strengthen access to justice',
    featured: {
      title: 'Strategic Focus Areas',
      description: 'Six key areas driving systemic change',
      href: '/what-we-do',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Strategic Approaches',
        links: [
          { name: 'What We Do', href: '/what-we-do', description: 'Our comprehensive approach' },
          { name: 'Grant Making', href: '/what-we-do/grant-making', description: 'Funding justice organizations' },
          { name: 'Capacity Building', href: '/what-we-do/capacity-building', description: 'Strengthening providers' },
          { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy', description: 'Systemic change initiatives' },
          { name: 'Learning & Research', href: '/what-we-do/learning-research', description: 'Evidence-based approaches' },
          { name: 'Partnerships & Networking', href: '/what-we-do/partnerships-networking', description: 'Collaborative networks' },
        ]
      },
      {
        title: 'Focus Areas',
        links: [
          { name: 'Accessible Legal Aid', href: '/focus-areas/accessible-legal-aid', description: 'Quality legal services' },
          { name: 'Empowered Communities', href: '/focus-areas/empowered-communities', description: 'Legal empowerment' },
          { name: 'Conducive Environment', href: '/focus-areas/conducive-environment', description: 'Policy and systems' },
          { name: 'Institutional Development', href: '/focus-areas/institutional-development', description: 'Sustainability' },
          { name: 'Climate Justice', href: '/focus-areas/climate-justice', description: 'Environmental rights' },
          { name: 'Digital Transformation', href: '/focus-areas/digital-transformation', description: 'Innovation' },
        ]
      }
    ]
  },
  { 
    name: 'Programs', 
    href: '/programs',
    description: 'Our active initiatives and projects',
    featured: {
      title: 'Active Programs',
      description: 'Current initiatives creating change',
      href: '/programs',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Current Work',
        links: [
          { name: 'Programs', href: '/programs', description: 'Active program portfolio' },
          { name: 'Projects', href: '/projects', description: 'Current initiatives' },
          { name: 'Legal Help', href: '/legal-help', description: 'Access legal assistance' },
          { name: 'Opportunities', href: '/opportunities', description: 'Join our team' },
        ]
      },
      {
        title: 'Get Involved',
        links: [
          { name: 'Partner With Us', href: '/contact', description: 'Strategic partnerships' },
          { name: 'Support Us', href: '/donate', description: 'Financial support' },
          { name: 'Volunteer', href: '/opportunities', description: 'Volunteer opportunities' },
          { name: 'Careers', href: '/opportunities', description: 'Join our team' },
        ]
      }
    ]
  },
  { 
    name: 'Our Impact', 
    href: '/impact',
    description: 'Stories of change and measurable results',
    featured: {
      title: 'Real Impact Stories',
      description: 'Lives transformed through justice',
      href: '/heroes',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Success Stories',
        links: [
          { name: 'Heroes of Justice', href: '/heroes', description: 'Inspiring success stories' },
          { name: 'Impact Dashboard', href: '/impact', description: 'Measurable outcomes' },
          { name: 'Case Studies', href: '/heroes', description: 'Detailed impact stories' },
          { name: 'Community Voices', href: '/heroes', description: 'Testimonials and experiences' },
        ]
      },
      {
        title: 'Metrics & Data',
        links: [
          { name: 'Annual Reports', href: '/publications', description: 'Comprehensive impact reports' },
          { name: 'Impact Metrics', href: '/impact', description: 'Key performance indicators' },
          { name: 'Research Findings', href: '/publications', description: 'Evidence and insights' },
          { name: 'Data Transparency', href: '/impact', description: 'Open data initiatives' },
        ]
      }
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Publications, news, and legal resources',
    featured: {
      title: 'Knowledge Hub',
      description: 'Research, reports, and legal guides',
      href: '/publications',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Information',
        links: [
          { name: 'Latest News', href: '/news', description: 'Current developments' },
          { name: 'Publications', href: '/publications', description: 'Reports and research' },
          { name: 'Legal Resources', href: '/resources', description: 'Practical legal information' },
          { name: 'Resource Categories', href: '/resources', description: 'Organized by topic' },
        ]
      },
      {
        title: 'Specialized Resources',
        links: [
          { name: 'Gender Justice', href: '/resources/gender-justice', description: 'Women\'s rights resources' },
          { name: 'Legal Empowerment', href: '/resources/legal-empowerment', description: 'Community empowerment' },
          { name: 'Climate Justice', href: '/resources/climate-justice', description: 'Environmental law' },
          { name: 'Training Materials', href: '/resources#training', description: 'Capacity building tools' },
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
  
  // Handle scroll effect - only change header background, no spacing changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
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
        {/* Simplified Contact Strip - Only show when not scrolled */}
        <div className={cn(
          "bg-primary text-white py-2 border-b border-primary-dark transition-all duration-300",
          isScrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
        )}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm space-y-1 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>24/7 Legal Helpline: +255 870 119 363</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@legalservicesfacility.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dar es Salaam, Tanzania</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/contact" className="hover:text-secondary-orange transition-colors">
                  Contact Us
                </Link>
                <Link to="/opportunities" className="hover:text-secondary-orange transition-colors">
                  Careers
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
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
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 font-heading",
                      location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                        ? "text-primary bg-primary/5"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    )}
                    onClick={() => toggleDropdown(item.name)}
                  >
                    {item.name}
                    <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-screen max-w-6xl rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                    <div className="p-6">
                      <div className="grid grid-cols-12 gap-6">
                        {/* Featured Section */}
                        <div className="col-span-4">
                          <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-xl p-6 h-full border border-primary/10">
                            <div className="mb-4">
                              <img 
                                src={item.featured?.image} 
                                alt={item.featured?.title}
                                className="w-full h-24 object-cover rounded-lg mb-4"
                              />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-3 font-heading">{item.featured?.title}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed font-sans text-sm">{item.featured?.description}</p>
                            <Link 
                              to={item.featured?.href || ''}
                              className="inline-flex items-center text-primary hover:text-primary/80 font-medium font-heading group/link text-sm"
                            >
                              Learn more 
                              <ArrowRight size={14} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                        
                        {/* Navigation Sections */}
                        <div className="col-span-8 grid grid-cols-2 gap-6">
                          {item.sections?.map((section, index) => (
                            <div key={index}>
                              <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2 font-heading">
                                {section.title}
                              </h4>
                              <ul className="space-y-2">
                                {section.links.map((link) => (
                                  <li key={link.name}>
                                    <Link
                                      to={link.href}
                                      className="block p-2 rounded-lg hover:bg-gray-50 transition-colors group/link"
                                    >
                                      <div className="font-semibold text-gray-900 group-hover/link:text-primary transition-colors mb-1 font-heading text-sm">
                                        {link.name}
                                      </div>
                                      <div className="text-xs text-gray-500 font-sans">
                                        {link.description}
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
                </div>
              ))}
              
              {/* Action buttons */}
              <div className="flex items-center ml-6 space-x-3 border-l border-gray-200 pl-6">
                <SearchDialog />
                <Button 
                  size="sm" 
                  className="font-medium bg-primary hover:bg-primary/90 font-heading flex items-center space-x-2"
                  onClick={() => setLegalAidDialogOpen(true)}
                >
                  <Phone className="h-4 w-4" />
                  <span>Get Legal Help</span>
                </Button>
                <Link to="/donate">
                  <Button variant="outline" size="sm" className="font-medium font-heading border-2 hover:bg-primary hover:text-white transition-all duration-300">
                    Support Justice
                  </Button>
                </Link>
              </div>
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden space-x-3">
              <Link to="/donate" className="lg:hidden">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white px-4 py-2">
                  Donate
                </Button>
              </Link>
              <button 
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
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
              {/* Quick Actions */}
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-xl">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="w-full justify-center bg-primary hover:bg-primary/90 font-heading text-sm"
                    onClick={() => setLegalAidDialogOpen(true)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Get Help
                  </Button>
                  <Link to="/donate" className="w-full">
                    <Button variant="outline" className="w-full justify-center font-heading text-sm border-primary text-primary hover:bg-primary hover:text-white">
                      Donate Now
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
                          "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg font-heading transition-all duration-200",
                          location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                            ? "text-primary bg-primary/5"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        <div className="flex items-center">
                          <span>{item.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{item.description}</span>
                        </div>
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
                          {/* Featured item for mobile */}
                          <div className="p-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            <h4 className="font-bold text-primary mb-2 font-heading">{item.featured?.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{item.featured?.description}</p>
                            <Link 
                              to={item.featured?.href || ''}
                              className="text-sm text-primary font-medium flex items-center"
                            >
                              Learn more <ArrowRight size={14} className="ml-1" />
                            </Link>
                          </div>
                          
                          {item.sections?.map((section) => (
                            <div key={section.title} className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide font-heading border-b border-gray-200 pb-1">
                                {section.title}
                              </h4>
                              <ul className="space-y-2">
                                {section.links.map((link) => (
                                  <li key={link.name}>
                                    <Link
                                      to={link.href}
                                      className={cn(
                                        "block px-3 py-2 text-sm rounded-md font-heading transition-colors",
                                        location.pathname === link.href
                                          ? "text-primary bg-primary/5"
                                          : "text-gray-600 hover:bg-gray-50"
                                      )}
                                    >
                                      <div className="font-medium">{link.name}</div>
                                      <div className="text-xs text-gray-500 mt-1">{link.description}</div>
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
              
              {/* Mobile Search */}
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
