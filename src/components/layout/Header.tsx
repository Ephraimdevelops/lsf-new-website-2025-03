
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';

// Enhanced navigation structure focused on LSF's legal aid and justice work
const navigationItems = [
  { 
    name: 'Impact', 
    href: '/impact',
    description: 'Our measurable difference in communities across Tanzania',
    featured: {
      title: 'Transforming Lives Through Justice',
      description: 'See how our work creates lasting change in Tanzanian communities',
      href: '/impact',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Our Results',
        links: [
          { name: 'Impact Stories', href: '/heroes', description: 'Real stories of justice transformation' },
          { name: 'Annual Impact Report', href: '/publications', description: 'Comprehensive yearly achievements' },
          { name: 'Statistics & Data', href: '/impact#statistics', description: 'Quantified impact across Tanzania' },
          { name: 'Community Outcomes', href: '/impact#outcomes', description: 'Long-term community changes' },
        ]
      },
      {
        title: 'Measurement & Learning',
        links: [
          { name: 'Research & Evaluation', href: '/what-we-do/learning-research', description: 'Evidence-based approach' },
          { name: 'Best Practices', href: '/resources#guides', description: 'Proven methodologies' },
          { name: 'Innovation Lab', href: '/projects', description: 'Experimental justice solutions' },
          { name: 'Knowledge Sharing', href: '/resources', description: 'Learning from our work' },
        ]
      }
    ]
  },
  { 
    name: 'About LSF (Who We Are)', 
    href: '/about',
    description: 'Our mission, vision, and commitment to justice',
    featured: {
      title: 'Who We Are',
      description: 'Empowering communities through legal aid since 2011',
      href: '/about',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Our Organization',
        links: [
          { name: 'Mission & Vision', href: '/about', description: 'Our commitment to justice for all' },
          { name: 'Leadership Team', href: '/team', description: 'Experienced legal professionals' },
          { name: 'Strategic Partners', href: '/partners', description: 'Collaborative network for justice' },
          { name: 'Annual Reports', href: '/publications', description: 'Transparency and impact measurement' },
        ]
      },
      {
        title: 'Get Involved',
        links: [
          { name: 'Career Opportunities', href: '/opportunities', description: 'Join our mission for justice' },
          { name: 'Volunteer with Us', href: '/opportunities#volunteer', description: 'Contribute to legal empowerment' },
          { name: 'Support Our Work', href: '/donate', description: 'Fund access to justice initiatives' },
          { name: 'Contact Us', href: '/contact', description: 'Connect with our team' },
        ]
      }
    ]
  },
  { 
    name: 'Our Work', 
    href: '/what-we-do',
    description: 'How we strengthen access to justice across Tanzania',
    featured: {
      title: 'Strategic Focus Areas',
      description: 'Four pillars driving justice forward',
      href: '/what-we-do',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Our Approach',
        links: [
          { name: 'Grant Making', href: '/what-we-do/grant-making', description: 'Results-driven funding for justice' },
          { name: 'Capacity Building', href: '/what-we-do/capacity-building', description: 'Strengthening legal aid providers' },
          { name: 'Policy & Advocacy', href: '/what-we-do/policy-advocacy', description: 'Shaping inclusive laws and systems' },
          { name: 'Strategic Overview', href: '/what-we-do', description: 'Our comprehensive methodology' },
        ]
      },
      {
        title: 'Programs & Services',
        links: [
          { name: 'Legal Aid Programs', href: '/programs', description: 'Direct legal assistance services' },
          { name: 'Partnerships & Networks', href: '/what-we-do/partnerships-networking', description: 'Collaborative ecosystem building' },
          { name: 'Current Projects', href: '/projects', description: 'Active initiatives and outcomes' },
          { name: 'Innovation & Research', href: '/what-we-do/learning-research', description: 'Evidence-based solutions' },
        ]
      }
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    description: 'Legal resources, research, and educational materials',
    featured: {
      title: 'Knowledge Hub',
      description: 'Evidence-based insights and legal resources',
      href: '/resources',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Stay Informed',
        links: [
          { name: 'Latest News', href: '/news', description: 'Updates on justice and legal aid' },
          { name: 'Research Publications', href: '/publications', description: 'Reports and policy analysis' },
          { name: 'Legal Resource Library', href: '/resources', description: 'Guides and educational materials' },
          { name: 'Policy Briefs', href: '/resources#policy', description: 'Advocacy and reform documents' },
        ]
      },
      {
        title: 'For Legal Professionals',
        links: [
          { name: 'Training Materials', href: '/resources#training', description: 'Capacity building resources' },
          { name: 'Best Practice Guides', href: '/resources#guides', description: 'Practical legal aid information' },
          { name: 'Research Database', href: '/resources#research', description: 'Academic and field studies' },
          { name: 'Tools & Templates', href: '/resources#tools', description: 'Practical legal resources' },
        ]
      }
    ]
  },
  { 
    name: 'Success Stories', 
    href: '/heroes',
    description: 'Real stories of justice transformation in Tanzanian communities',
    featured: {
      title: 'Heroes of Justice',
      description: 'Inspiring stories of lives transformed through legal empowerment',
      href: '/heroes',
      image: '/lovable-uploads/background with mother umage .png'
    },
    sections: [
      {
        title: 'Transformation Stories',
        links: [
          { name: 'All Success Stories', href: '/heroes', description: 'Complete collection of impact stories' },
          { name: 'Women\'s Rights Victories', href: '/heroes#womens-rights', description: 'Gender justice achievements' },
          { name: 'Land Rights Protection', href: '/heroes#land-rights', description: 'Property and inheritance victories' },
          { name: 'Community Justice Wins', href: '/heroes#community-justice', description: 'Local dispute resolutions' },
        ]
      },
      {
        title: 'Impact Areas',
        links: [
          { name: 'Legal Aid Success', href: '/heroes#legal-aid', description: 'Direct assistance outcomes' },
          { name: 'Policy Change Stories', href: '/heroes#policy-change', description: 'Systemic transformation wins' },
          { name: 'Capacity Building Results', href: '/heroes#capacity-building', description: 'Empowerment success stories' },
          { name: 'Partnership Achievements', href: '/heroes#partnerships', description: 'Collaborative impact stories' },
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
                <Button size="sm" className="font-medium bg-primary hover:bg-primary/90">
                  Get Legal Help
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="outline" size="sm" className="font-medium">
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
                  <Button className="w-full justify-center bg-primary hover:bg-primary/90">
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/donate" className="w-full">
                  <Button variant="outline" className="w-full justify-center">
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
