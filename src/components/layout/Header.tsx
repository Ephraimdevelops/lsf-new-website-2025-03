
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { 
      name: 'About', 
      href: '/about',
      dropdown: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Partners', href: '/partners' }
      ]
    },
    { 
      name: 'Our work', 
      href: '/what-we-do',
      dropdown: [
        { name: 'Overview', href: '/what-we-do' },
        { name: 'Programs', href: '/programs' },
        { name: 'Projects', href: '/projects' }
      ]
    },
    { 
      name: 'Ideas', 
      href: '/resources',
      dropdown: [
        { name: 'All Resources', href: '/resources' },
        { name: 'Publications', href: '/publications' },
        { name: 'News', href: '/news' }
      ]
    },
    { 
      name: 'Get Involved', 
      href: '/opportunities',
      dropdown: [
        { name: 'Opportunities', href: '/opportunities' },
        { name: 'Donate', href: '/donate' },
        { name: 'Heroes', href: '/heroes' }
      ]
    },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo only */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
              alt="LSF Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation with Gates Foundation style dropdowns */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-1 text-neutral-dark hover:text-primary font-calibri font-medium transition-colors py-2">
                        <span>{item.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg">
                      {item.dropdown.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.name} asChild>
                          <Link
                            to={dropdownItem.href}
                            className="block px-4 py-3 text-sm text-neutral-dark hover:text-primary hover:bg-gray-50 transition-colors font-calibri"
                          >
                            {dropdownItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={item.href}
                    className="text-neutral-dark hover:text-primary transition-colors font-calibri font-medium py-2"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Search and CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-neutral-dark hover:text-primary transition-colors">
              <span className="font-calibri">Search</span>
            </button>
            <Link to="/legal-help">
              <Button variant="outline" size="sm" className="font-calibri">
                Get Legal Help
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="sm" className="font-calibri">
                Donate
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div className="space-y-1">
                      <div className="font-medium text-neutral-dark px-3 py-2 font-calibri">
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block px-3 py-2 text-sm text-neutral-gray hover:text-primary font-calibri"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-3 py-2 text-neutral-dark hover:text-primary font-calibri font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-2">
                <Link to="/legal-help" className="block">
                  <Button variant="outline" className="w-full font-calibri">
                    Get Legal Help
                  </Button>
                </Link>
                <Link to="/donate" className="block">
                  <Button className="w-full font-calibri">
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
