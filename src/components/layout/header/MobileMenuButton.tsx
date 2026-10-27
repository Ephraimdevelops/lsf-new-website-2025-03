import { useCopy } from "@/i18n/useCopy";
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchDialog from '@/components/shared/SearchDialog';
import { TouchTarget } from '@/components/shared/TouchTarget';

interface MobileMenuButtonProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setLegalAidDialogOpen: (open: boolean) => void;
}

const MobileMenuButton = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  setLegalAidDialogOpen 
}: MobileMenuButtonProps) => {
  const c = useCopy();
  return (
    <div className="flex items-center 2xl:hidden space-x-2">
      <div className="hidden sm:block transform hover:scale-110 transition-transform duration-200">
        <SearchDialog />
      </div>
      <Button 
        size="sm" 
        className="hidden sm:inline-flex bg-primary hover:bg-primary/90 transition-all duration-200"
        onClick={() => setLegalAidDialogOpen(true)}
      >
        <Phone className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">{c("Get Help")}</span>
      </Button>
      <TouchTarget
        size="lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={cn(
          "rounded-md text-neutral-600 hover:bg-neutral-100 transition-all duration-200",
          mobileMenuOpen && "bg-neutral-100"
        )}
      >
        <span className="sr-only">{mobileMenuOpen ? c("Close menu") : c("Open menu")}</span>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </TouchTarget>
    </div>
  );
};

export default MobileMenuButton;