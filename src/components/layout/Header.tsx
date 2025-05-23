import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, ArrowRight, Users, Scale, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Enhanced navigation structure with detailed dropdowns
const navigationItems = [
  { 
    name: 'About Us', 
    href: '/about',
    description: 'Learn about our mission, vision, and impact',
    featured: {
      title: 'Our Story',
      description: 'Empowering communities through legal aid since 2011',
      href: '/about',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Who We Are',
        links: [
          { name: 'Our Story', href: '/about', description: 'Mission, vision, and history' },
          { name: 'Leadership', href: '/about#leadership', description: 'Meet our executive team' },
          { name: 'Board of Directors', href: '/about#board', description: 'Our governing body' },
          { name: 'Annual Reports', href: '/about#reports', description: 'Transparency and accountability' },
        ]
      },
      {
        title: 'Our People',
        links: [
          { name: 'Our Team', href: '/team', description: 'Staff and legal experts' },
          { name: 'Our Partners', href: '/partners', description: 'Collaborating organizations' },
          { name: 'Careers', href: '/opportunities', description: 'Join our mission' },
          { name: 'Volunteering', href: '/opportunities#volunteer', description: 'Get involved' },
        ]
      }
    ]
  },
  { 
    name: 'Our Work', 
    href: '/what-we-do',
    description: 'Discover how we create lasting change',
    featured: {
      title: 'Legal Empowerment',
      description: 'Building capacity for sustainable justice',
      href: '/programs/legal-empowerment',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Focus Areas',
        links: [
          { name: 'Legal Empowerment', href: '/programs/legal-empowerment', description: 'Community-based legal aid' },
          { name: 'Gender Justice', href: '/programs/gender-justice', description: 'Women\'s rights and equality' },
          { name: 'Climate Justice', href: '/programs/climate-justice', description: 'Environmental law and advocacy' },
          { name: 'Digital Transformation', href: '/programs/digital-transformation', description: 'Technology for justice' },
        ]
      },
      {
        title: 'Our Approach',
        links: [
          { name: 'What We Do', href: '/what-we-do', description: 'Our methodology and impact' },
          { name: 'Community Outreach', href: '/programs/community-outreach', description: 'Grassroots engagement' },
          { name: 'Training Programs', href: '/programs/training', description: 'Capacity building initiatives' },
          { name: 'Research & Advocacy', href: '/resources', description: 'Policy and legal research' },
        ]
      }
    ]
  },
  { 
    name: 'Programs', 
    href: '/programs',
    description: 'Explore our comprehensive legal aid programs',
    featured: {
      title: 'All Programs',
      description: 'Comprehensive legal aid across Tanzania',
      href: '/programs',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Core Programs',
        links: [
          { name: 'All Programs', href: '/programs', description: 'Complete program overview' },
          { name: 'Legal Aid Services', href: '/programs/legal-aid', description: 'Direct legal assistance' },
          { name: 'Paralegal Training', href: '/programs/training', description: 'Building local capacity' },
          { name: 'Community Education', href: '/programs/education', description: 'Legal literacy programs' },
        ]
      },
      {
        title: 'Special Initiatives',
        links: [
          { name: 'Women\'s Legal Clinic', href: '/programs/womens-clinic', description: 'Specialized support for women' },
          { name: 'Child Protection', href: '/programs/child-protection', description: 'Safeguarding children\'s rights' },
          { name: 'Land Rights', href: '/programs/land-rights', description: 'Property and inheritance law' },
          { name: 'Digital Legal Aid', href: '/programs/digital-aid', description: 'Technology-enabled services' },
        ]
      }
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Access our knowledge base and updates',
    featured: {
      title: 'Latest Publications',
      description: 'Research, reports, and legal guides',
      href: '/publications',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Stay Informed',
        links: [
          { name: 'News & Updates', href: '/news', description: 'Latest developments' },
          { name: 'Publications', href: '/publications', description: 'Reports and research' },
          { name: 'Success Stories', href: '/heroes', description: 'Impact and testimonials' },
          { name: 'Blog', href: '/news#blog', description: 'Insights and analysis' },
        ]
      },
      {
        title: 'Knowledge Hub',
        links: [
          { name: 'Legal Guides', href: '/resources#guides', description: 'Practical legal information' },
          { name: 'Training Materials', href: '/resources#training', description: 'Educational resources' },
          { name: 'Policy Briefs', href: '/resources#policy', description: 'Advocacy documents' },
          { name: 'Annual Reports', href: '/resources#reports', description: 'Impact and financials' },
        ]
      }
    ]
  },
  { 
    name: 'Get Involved', 
    href: '/opportunities',
    description: 'Join our mission for justice',
    simple: true
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
                src="/lovable-uploads/4d88ac6f-dc44-4191-ad46-f5da6daeb331.png" 
                alt="LSF Logo"
                className="h-14 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">Legal Services Facility</h1>
                <p className="text-xs text-neutral-gray uppercase tracking-wide">Access to Justice for All</p>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.simple ? (
                  <Link
                    to={item.href}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-md transition-all duration-200",
                      location.pathname === item.href
                        ? "text-primary bg-primary/5"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <>
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
                    <div className="absolute left-0 mt-1 w-[600px] rounded-lg shadow-2xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-20">
                      <div className="p-6">
                        <div className="flex gap-6">
                          {/* Featured Section */}
                          <div className="w-1/3">
                            <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-lg p-4 h-full">
                              <div className="mb-3">
                                <img 
                                  src={item.featured?.image} 
                                  alt={item.featured?.title}
                                  className="w-full h-24 object-cover rounded-md mb-3"
                                />
                              </div>
                              <h3 className="font-bold text-primary mb-2">{item.featured?.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{item.featured?.description}</p>
                              <Link 
                                to={item.featured?.href || ''}
                                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
                              >
                                Learn more <ArrowRight size={14} className="ml-1" />
                              </Link>
                            </div>
                          </div>
                          
                          {/* Navigation Sections */}
                          <div className="flex-1 grid grid-cols-2 gap-6">
                            {item.sections?.map((section, index) => (
                              <div key={index}>
                                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                  {section.title}
                                </h4>
                                <ul className="space-y-2">
                                  {section.links.map((link) => (
                                    <li key={link.name}>
                                      <Link
                                        to={link.href}
                                        className="block p-2 rounded-md hover:bg-gray-50 transition-colors group"
                                      >
                                        <div className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                          {link.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
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
                  </>
                )}
              </div>
            ))}
            
            {/* Action buttons */}
            <div className="flex items-center ml-6 space-x-3 border-l border-gray-200 pl-6">
              <button 
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link to="/legal-help">
                <Button variant="outline" size="sm" className="font-medium">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="sm" className="font-medium bg-secondary-orange hover:bg-secondary-orange/90">
                  Donate
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
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="py-1">
                  {item.simple ? (
                    <Link
                      to={item.href}
                      className={cn(
                        "block px-3 py-2 text-base font-medium rounded-md",
                        location.pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.name}
                    </Link>
                  ) : (
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
                            <div key={section.title}>
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
                  )}
                </div>
              ))}
              
              {/* Mobile action buttons */}
              <div className="pt-4 pb-2 flex flex-col space-y-2">
                <Link to="/legal-help" className="w-full">
                  <Button variant="outline" className="w-full justify-center">
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/donate" className="w-full">
                  <Button className="w-full justify-center">
                    Donate
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
