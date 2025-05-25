
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Search, Globe } from 'lucide-react';
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { 
      name: 'JOIN US', 
      href: '/opportunities',
      dropdown: [
        { name: 'Opportunities', href: '/opportunities' },
        { name: 'Volunteer', href: '/volunteer' },
        { name: 'Careers', href: '/careers' }
      ]
    },
    { 
      name: 'WHAT WE DO', 
      href: '/what-we-do',
      dropdown: [
        { name: 'Overview', href: '/what-we-do' },
        { name: 'Programs', href: '/programs' },
        { name: 'Projects', href: '/projects' }
      ]
    },
    { 
      name: 'WHO WE ARE', 
      href: '/about',
      dropdown: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Partners', href: '/partners' }
      ]
    },
    { 
      name: 'LATEST', 
      href: '/news',
      dropdown: [
        { name: 'News', href: '/news' },
        { name: 'Publications', href: '/publications' },
        { name: 'Resources', href: '/resources' }
      ]
    }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-sm' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
              alt="LSF Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-1 text-neutral-900 hover:text-primary font-medium transition-colors py-2 text-sm tracking-wide uppercase">
                        <span>{item.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white border shadow-lg rounded-none">
                      {item.dropdown.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.name} asChild>
                          <Link
                            to={dropdownItem.href}
                            className="block px-4 py-3 text-sm text-neutral-900 hover:text-primary hover:bg-gray-50 transition-colors"
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
                    className="text-neutral-900 hover:text-primary transition-colors font-medium py-2 text-sm tracking-wide uppercase"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-neutral-900 hover:text-primary transition-colors p-2">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-neutral-900 hover:text-primary transition-colors p-2">
              <Globe className="h-5 w-5" />
            </button>
            <Link to="/donate">
              <Button className="bg-secondary-teal hover:bg-secondary-teal/90 text-white font-medium px-6 py-2 rounded-none text-sm tracking-wide uppercase">
                ♥ DONATE
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
                      <div className="font-medium text-neutral-900 px-3 py-2 text-sm tracking-wide uppercase">
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.href}
                            className="block px-3 py-2 text-sm text-neutral-700 hover:text-primary"
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
                      className="block px-3 py-2 text-neutral-900 hover:text-primary font-medium text-sm tracking-wide uppercase"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4 space-y-2">
                <Link to="/donate" className="block">
                  <Button className="w-full bg-secondary-teal hover:bg-secondary-teal/90 text-white font-medium rounded-none text-sm tracking-wide uppercase">
                    ♥ DONATE
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
