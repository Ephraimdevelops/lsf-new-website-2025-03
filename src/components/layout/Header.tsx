
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';

// Enhanced navigation structure with better naming and organization
const navigationItems = [
  { 
    name: 'Who We Are', 
    href: '/about',
    description: 'Our mission, vision, team, and impact story',
    featured: {
      title: 'About LSF',
      description: 'Empowering communities through legal aid since 2011',
      href: '/about',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Our Organization',
        links: [
          { name: 'About LSF', href: '/about', description: 'Mission, vision, and history' },
          { name: 'Leadership Team', href: '/team', description: 'Meet our executive team' },
          { name: 'Strategic Partners', href: '/partners', description: 'Our collaborating organizations' },
          { name: 'Annual Reports', href: '/publications', description: 'Transparency and accountability' },
        ]
      },
      {
        title: 'Join Our Mission',
        links: [
          { name: 'Career Opportunities', href: '/opportunities', description: 'Work with us for justice' },
          { name: 'Volunteer Programs', href: '/opportunities#volunteer', description: 'Get involved in our work' },
          { name: 'Support Our Work', href: '/donate', description: 'Make a lasting impact' },
          { name: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
        ]
      }
    ]
  },
  { 
    name: 'Our Impact', 
    href: '/what-we-do',
    description: 'How we create lasting change across Tanzania',
    featured: {
      title: 'Strategic Approach',
      description: 'Eight focus areas driving justice forward',
      href: '/what-we-do',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Focus Areas',
        links: [
          { name: 'Grant Making', href: '/what-we-do/grant-making', description: 'Results-driven funding for justice' },
          { name: 'Capacity Building', href: '/what-we-do/capacity-building', description: 'Strengthening legal aid providers' },
          { name: 'Partnerships & Networks', href: '/what-we-do/partnerships-networking', description: 'Collaborative ecosystem building' },
          { name: 'Research & Learning', href: '/what-we-do/learning-research', description: 'Evidence-based solutions' },
        ]
      },
      {
        title: 'Our Approach',
        links: [
          { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy', description: 'Shaping inclusive laws and systems' },
          { name: 'Strategic Overview', href: '/what-we-do', description: 'Our comprehensive methodology' },
          { name: 'Success Stories', href: '/heroes', description: 'Real impact, real lives' },
          { name: 'Project Portfolio', href: '/projects', description: 'Current initiatives and outcomes' },
        ]
      }
    ]
  },
  { 
    name: 'Legal Services', 
    href: '/programs',
    description: 'Comprehensive legal aid and empowerment programs',
    featured: {
      title: 'Legal Empowerment',
      description: 'Accessible justice for all Tanzanians',
      href: '/programs',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Get Legal Help',
        links: [
          { name: 'Legal Aid Services', href: '/legal-help', description: 'Free legal assistance and support' },
          { name: 'All Programs', href: '/programs', description: 'Complete service overview' },
          { name: 'Community Outreach', href: '/programs#community', description: 'Grassroots legal education' },
          { name: 'Digital Legal Aid', href: '/programs#digital', description: 'Technology-enabled services' },
        ]
      },
      {
        title: 'Specialized Support',
        links: [
          { name: 'Women\'s Legal Clinic', href: '/programs#womens-clinic', description: 'Gender-focused legal support' },
          { name: 'Land Rights Protection', href: '/programs#land-rights', description: 'Property and inheritance law' },
          { name: 'Child Protection', href: '/programs#child-protection', description: 'Safeguarding children\'s rights' },
          { name: 'Climate Justice', href: '/programs#climate-justice', description: 'Environmental law advocacy' },
        ]
      }
    ]
  },
  { 
    name: 'Knowledge Hub', 
    href: '/resources',
    description: 'Research, publications, and legal resources',
    featured: {
      title: 'Latest Research',
      description: 'Evidence-based insights and publications',
      href: '/publications',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Stay Informed',
        links: [
          { name: 'News & Updates', href: '/news', description: 'Latest developments and stories' },
          { name: 'Research Publications', href: '/publications', description: 'Reports and policy briefs' },
          { name: 'Legal Resources', href: '/resources', description: 'Guides and educational materials' },
          { name: 'Success Stories', href: '/heroes', description: 'Impact testimonials' },
        ]
      },
      {
        title: 'For Professionals',
        links: [
          { name: 'Training Materials', href: '/resources#training', description: 'Capacity building resources' },
          { name: 'Policy Briefs', href: '/resources#policy', description: 'Advocacy documents' },
          { name: 'Legal Guides', href: '/resources#guides', description: 'Practical legal information' },
          { name: 'Research Database', href: '/resources#research', description: 'Academic and field studies' },
        ]
      }
    ]
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  
  // Handle scroll effect
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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || mobileMenuOpen
          ? "bg-white shadow-lg border-b border-gray-100"
          : "bg-white/95 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
                alt="LSF Logo"
                className="h-12 w-auto"
              />
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
                
                {/* Enhanced Dropdown Menu */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-screen max-w-6xl rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Featured Section */}
                      <div className="col-span-4">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-xl p-6 h-full">
                          <div className="mb-4">
                            <img 
                              src={item.featured?.image} 
                              alt={item.featured?.title}
                              className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-3">{item.featured?.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{item.featured?.description}</p>
                          <Link 
                            to={item.featured?.href || ''}
                            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                          >
                            Explore <ArrowRight size={16} className="ml-2" />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Navigation Sections */}
                      <div className="col-span-8 grid grid-cols-2 gap-8">
                        {item.sections?.map((section, index) => (
                          <div key={index}>
                            <h4 className="font-bold text-gray-900 mb-4 text-base uppercase tracking-wide border-b border-gray-200 pb-2">
                              {section.title}
                            </h4>
                            <ul className="space-y-3">
                              {section.links.map((link) => (
                                <li key={link.name}>
                                  <Link
                                    to={link.href}
                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                  >
                                    <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                                      {link.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
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
              <Link to="/legal-help">
                <Button variant="outline" size="sm" className="font-medium">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="sm" className="font-medium bg-secondary-orange hover:bg-secondary-orange/90">
                  Support Us
                </Button>
              </Link>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
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
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="py-1">
                  <div>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md",
                        location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                          ? "text-primary bg-primary/5"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                      onClick={() => toggleDropdown(item.name)}
                    >
                      {item.name}
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "transition-transform duration-200",
                          activeDropdown === item.name ? "transform rotate-180" : ""
                        )}
                      />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="mt-1 pl-4 border-l-2 border-gray-100">
                        {item.sections?.map((section) => (
                          <div key={section.title} className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                              {section.title}
                            </h4>
                            <ul className="space-y-2">
                              {section.links.map((link) => (
                                <li key={link.name}>
                                  <Link
                                    to={link.href}
                                    className={cn(
                                      "block px-3 py-2 text-sm rounded-md",
                                      location.pathname === link.href
                                        ? "text-primary bg-primary/5"
                                        : "text-gray-600 hover:bg-gray-50"
                                    )}
                                  >
                                    {link.name}
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
              
              {/* Mobile action buttons */}
              <div className="pt-4 pb-2 flex flex-col space-y-2">
                <div className="mb-2">
                  <SearchDialog />
                </div>
                <Link to="/legal-help" className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/donate" className="w-full">
                  <Button className="w-full justify-center bg-secondary-orange hover:bg-secondary-orange/90">
                    Support Us
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
