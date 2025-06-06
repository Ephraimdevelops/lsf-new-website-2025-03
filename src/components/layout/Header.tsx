import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';

// Enhanced navigation structure with reordered items and updated dropdowns
const navigationItems = [
  { 
    name: 'About', 
    href: '/about',
    description: 'Our mission and commitment to justice',
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
          { name: 'Who We Are', href: '/about', description: 'Mission, vision, and history' },
          { name: 'Our Team', href: '/team', description: 'Leadership and staff' },
          { name: 'Partners', href: '/partners', description: 'Collaborating organizations' },
          { name: 'Contact Us', href: '/contact', description: 'Get in touch' },
        ]
      },
      {
        title: 'Engagement',
        links: [
          { name: 'Opportunities', href: '/opportunities', description: 'Career and volunteer options' },
          { name: 'Board & Leadership', href: '/team#leadership', description: 'Governance structure' },
          { name: 'Annual Reports', href: '/publications', description: 'Transparency reports' },
          { name: 'Contact', href: '/contact', description: 'Connect with us' },
        ]
      }
    ]
  },
  { 
    name: 'Our Work', 
    href: '/what-we-do',
    description: 'How we strengthen access to justice',
    featured: {
      title: 'Grant Making',
      description: 'Results-driven funding for justice organizations',
      href: '/what-we-do/grant-making',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Approaches',
        links: [
          { name: 'Grant Making', href: '/what-we-do/grant-making', description: 'Funding for justice organizations' },
          { name: 'Capacity Building', href: '/what-we-do/capacity-building', description: 'Strengthening legal aid providers' },
          { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy', description: 'Systemic change initiatives' },
          { name: 'Learning & Research', href: '/what-we-do/learning-research', description: 'Evidence-based approaches' },
        ]
      },
      {
        title: 'Focus',
        links: [
          { name: 'What We Do', href: '/what-we-do', description: 'Our comprehensive approach' },
          { name: 'Programs', href: '/programs', description: 'Active program portfolio' },
          { name: 'Projects', href: '/projects', description: 'Current initiatives' },
          { name: 'Success Stories', href: '/heroes', description: 'Real impact stories' },
        ]
      }
    ]
  },
  { 
    name: 'Impact', 
    href: '/impact',
    description: 'Our measurable difference in communities',
    featured: {
      title: 'Success Stories',
      description: 'Real stories of justice transformation',
      href: '/heroes',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Measuring Change',
        links: [
          { name: 'Success Stories', href: '/heroes', description: 'Impact and testimonials' },
          { name: 'Annual Reports', href: '/publications', description: 'Comprehensive impact data' },
          { name: 'Statistics & Data', href: '/impact#statistics', description: 'Key performance metrics' },
          { name: 'Programs', href: '/programs', description: 'Active initiatives' },
        ]
      },
      {
        title: 'Evidence Base',
        links: [
          { name: 'Research', href: '/what-we-do/learning-research', description: 'Learning and evaluation' },
          { name: 'Publications', href: '/publications', description: 'Reports and findings' },
          { name: 'Policy Impact', href: '/what-we-do/policy-advocacy', description: 'Systemic change results' },
          { name: 'Community Outcomes', href: '/heroes', description: 'Real-world impact' },
        ]
      }
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'News, publications and legal resources',
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
          { name: 'Latest News', href: '/news', description: 'Current developments' },
          { name: 'Publications', href: '/publications', description: 'Reports and research' },
          { name: 'Legal Resources', href: '/resources', description: 'Practical legal information' },
          { name: 'Opportunities', href: '/opportunities', description: 'Career and partnerships' },
        ]
      },
      {
        title: 'Knowledge Hub',
        links: [
          { name: 'Research Reports', href: '/publications#research', description: 'Evidence and analysis' },
          { name: 'Policy Briefs', href: '/resources#policy', description: 'Advocacy documents' },
          { name: 'Training Materials', href: '/resources#training', description: 'Capacity building tools' },
          { name: 'Legal Guides', href: '/resources#guides', description: 'Practical guidance' },
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
                
                {/* Full Width Dropdown Menu */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-screen max-w-7xl rounded-lg shadow-2xl bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Featured Section - Takes up 4 columns */}
                      <div className="col-span-4">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary-teal/5 rounded-xl p-6 h-full">
                          <div className="mb-4">
                            <img 
                              src={item.featured?.image} 
                              alt={item.featured?.title}
                              className="w-full h-32 object-cover rounded-lg mb-4"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-3 font-heading">{item.featured?.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed font-sans">{item.featured?.description}</p>
                          <Link 
                            to={item.featured?.href || ''}
                            className="inline-flex items-center text-primary hover:text-primary/80 font-medium font-heading"
                          >
                            Learn more <ArrowRight size={16} className="ml-2" />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Navigation Sections - Takes up 8 columns */}
                      <div className="col-span-8 grid grid-cols-2 gap-8">
                        {item.sections?.map((section, index) => (
                          <div key={index}>
                            <h4 className="font-bold text-gray-900 mb-4 text-base uppercase tracking-wide border-b border-gray-200 pb-2 font-heading">
                              {section.title}
                            </h4>
                            <ul className="space-y-3">
                              {section.links.map((link) => (
                                <li key={link.name}>
                                  <Link
                                    to={link.href}
                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group/link"
                                  >
                                    <div className="font-semibold text-gray-900 group-hover/link:text-primary transition-colors mb-1 font-heading">
                                      {link.name}
                                    </div>
                                    <div className="text-sm text-gray-500 font-sans">
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
                <Button size="sm" className="font-medium bg-primary hover:bg-primary/90 font-heading">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" size="sm" className="font-medium font-heading">
                  Support Justice
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
                        "flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md font-heading",
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
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide font-heading">
                              {section.title}
                            </h4>
                            <ul className="space-y-2">
                              {section.links.map((link) => (
                                <li key={link.name}>
                                  <Link
                                    to={link.href}
                                    className={cn(
                                      "block px-3 py-2 text-sm rounded-md font-heading",
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
                  <Button className="w-full justify-center bg-primary hover:bg-primary/90 font-heading">
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/donate" className="w-full">
                  <Button variant="outline" className="w-full justify-center font-heading">
                    Support Justice
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
