import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LegalAidDialog from '@/components/shared/LegalAidDialog';
import ContactStrip from './header/ContactStrip';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';
import MobileMenuButton from './header/MobileMenuButton';

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
        <ContactStrip isScrolled={isScrolled} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Logo />

            <DesktopNavigation
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              setLegalAidDialogOpen={setLegalAidDialogOpen}
            />

            <MobileMenuButton
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              setLegalAidDialogOpen={setLegalAidDialogOpen}
            />
          </div>
        </div>

        <MobileNavigation
          mobileMenuOpen={mobileMenuOpen}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          setLegalAidDialogOpen={setLegalAidDialogOpen}
        />
      </header>

      <LegalAidDialog
        open={legalAidDialogOpen}
        onOpenChange={setLegalAidDialogOpen}
      />
    </>
  );
};

export default Header;