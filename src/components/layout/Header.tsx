
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const mainNavItems = [
    { 
      id: 'about', 
      label: 'About Us', 
      link: '/about',
      submenu: [
        { label: 'Our Story', link: '/about' },
        { label: 'Vision & Mission', link: '/about#mission' },
        { label: 'What We Do', link: '/what-we-do' },
        { label: 'Team', link: '/team' },
        { label: 'Partners', link: '/partners' },
      ]
    },
    { 
      id: 'programs', 
      label: 'Programs', 
      link: '/programs',
      submenu: [
        { label: 'Overview', link: '/programs' },
        { label: 'Legal Empowerment', link: '/programs/legal-empowerment' },
        { label: 'Gender Justice', link: '/programs/gender-justice' },
        { label: 'Climate Justice', link: '/programs/climate-justice' },
        { label: 'Digital Transformation', link: '/programs/digital-transformation' },
      ]
    },
    { 
      id: 'resources', 
      label: 'Resources', 
      link: '/resources',
      submenu: [
        { label: 'Publications', link: '/publications' },
        { label: 'Research', link: '/resources/research' },
        { label: 'Our Heroes', link: '/heroes' },
        { label: 'Whistleblower', link: '/whistleblower' },
      ]
    },
    { label: 'News', link: '/news' },
    { 
      id: 'opportunities', 
      label: 'Opportunities', 
      link: '/opportunities',
      submenu: [
        { label: 'Job Openings', link: '/opportunities' },
        { label: 'Grants', link: '/opportunities' },
        { label: 'Tenders', link: '/opportunities' },
      ]
    },
    { label: 'Contact', link: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="w-40">
            <img 
              src={isScrolled ? "/lovable-uploads/02e8bc92-1854-4945-9da0-b4293427f46d.png" : "/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"} 
              alt="LSF Logo" 
              className="h-12 w-auto"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {mainNavItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.submenu ? (
                <button 
                  onClick={() => toggleDropdown(item.id)}
                  className={`px-3 py-2 rounded-md text-neutral-dark hover:text-primary flex items-center ${
                    activeDropdown === item.id || location.pathname.startsWith(item.link) ? 'text-primary' : ''
                  } font-calibri`}
                >
                  {item.label}
                  <ChevronDown size={16} className="ml-1" />
                </button>
              ) : (
                <Link 
                  to={item.link} 
                  className={`px-3 py-2 rounded-md font-calibri ${
                    location.pathname === item.link ? 'text-primary font-bold' : 'text-neutral-dark hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )}
              
              {item.submenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.label}
                      to={subitem.link}
                      className={`block px-4 py-2 text-sm font-calibri ${
                        location.pathname === subitem.link ? 'bg-primary text-white' : 'text-neutral-dark hover:bg-primary hover:text-white'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link 
            to="/legal-help" 
            className="bg-secondary-teal text-white hover:bg-secondary-teal/90 px-5 py-2 rounded-md transition-colors duration-300 font-calibri mr-2"
          >
            Get Legal Help
          </Link>
          <Link 
            to="/donate" 
            className="bg-primary text-white hover:bg-primary-dark px-5 py-2 rounded-md transition-colors duration-300 font-calibri"
          >
            Donate
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-dark hover:text-primary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white shadow-md pt-2 pb-4 px-4">
          {mainNavItems.map((item) => (
            <div key={item.label} className="py-1">
              {item.submenu ? (
                <div>
                  <button 
                    onClick={() => toggleDropdown(item.id)}
                    className="w-full text-left py-2 flex justify-between items-center font-calibri"
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={16} className={`transition-transform ${activeDropdown === item.id ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === item.id && (
                    <div className="pl-4 border-l-2 border-primary mt-1 mb-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.label}
                          to={subitem.link}
                          className={`block py-2 text-sm font-calibri ${
                            location.pathname === subitem.link ? 'text-primary font-bold' : 'hover:text-primary'
                          }`}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.link} 
                  className={`block py-2 font-calibri ${
                    location.pathname === item.link ? 'text-primary font-bold' : 'hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link 
            to="/legal-help" 
            className="block w-full text-center mt-4 bg-secondary-teal text-white hover:bg-secondary-teal/90 px-5 py-2 rounded-md transition-colors duration-300 font-calibri"
          >
            Get Legal Help
          </Link>
          <Link 
            to="/donate" 
            className="block w-full text-center mt-4 bg-primary text-white hover:bg-primary-dark px-5 py-2 rounded-md transition-colors duration-300 font-calibri"
          >
            Donate
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
