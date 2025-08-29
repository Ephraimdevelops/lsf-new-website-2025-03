import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SearchDialog from "@/components/shared/SearchDialog";
import NavigationDropdown from "./NavigationDropdown";
import { navigationItems } from "./navigationData";

interface DesktopNavigationProps {
  activeDropdown: string | null;
  setActiveDropdown: (name: string | null) => void;
  setLegalAidDialogOpen: (open: boolean) => void;
}

const DesktopNavigation = ({
  activeDropdown,
  setActiveDropdown,
  setLegalAidDialogOpen,
}: DesktopNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center space-x-4">
      {navigationItems.map((item) => {
        const isActive =
          location.pathname === item.href ||
          location.pathname.startsWith(`${item.href}/`);

        return (
          <div key={item.name} className="relative group">
            {item.subItems.length > 0 ? (
              <button
                className={cn(
                  "relative flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105",
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                )}
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* icon */}
                {(item as any).icon && (
                  <img
                    src={(item as any).icon}
                    alt={item.name}
                    className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-glow"
                  />
                )}
                <span className="relative">
                  {item.name}
                  {/* underline animation */}
                  <span
                    className={cn(
                      "absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary-teal transition-all duration-300",
                      isActive || activeDropdown === item.name
                        ? "w-full"
                        : "group-hover:w-full"
                    )}
                  />
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-300",
                    activeDropdown === item.name ? "rotate-180" : ""
                  )}
                />
              </button>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  "relative flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105",
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {(item as any).icon && (
                  <img
                    src={(item as any).icon}
                    alt={item.name}
                    className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-glow"
                  />
                )}
                <span className="relative">
                  {item.name}
                  <span
                    className={cn(
                      "absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary-teal transition-all duration-300",
                      isActive ? "w-full" : "group-hover:w-full"
                    )}
                  />
                </span>
              </Link>
            )}

            {/* dropdown */}
            {item.subItems.length > 0 && (
              <NavigationDropdown
                item={item}
                isActive={activeDropdown === item.name}
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
                className="backdrop-blur-md bg-white/70 border border-neutral-200 shadow-xl"
              />
            )}
          </div>
        );
      })}

      {/* Action buttons */}
      <div className="flex items-center ml-6 space-x-3 border-l border-border pl-6">
        {/* search button */}
        <div className="transform hover:scale-110 transition-transform duration-300">
          <SearchDialog>
            <button className="p-2 rounded-full bg-white/80 backdrop-blur border border-neutral-200 shadow-sm hover:shadow-md transition">
              <Search className="h-4 w-4 text-neutral-600" />
            </button>
          </SearchDialog>
        </div>

        {/* legal help CTA */}
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 flex items-center space-x-2 rounded-lg px-4 animate-pulse-slow hover:animate-none shadow-md hover:shadow-lg transition"
          onClick={() => setLegalAidDialogOpen(true)}
        >
          <Phone className="h-4 w-4" />
          <span>Get Legal Help</span>
        </Button>

        {/* donate */}
        <Link to="/donate">
          <Button
            variant="outline"
            size="sm"
            className="relative overflow-hidden border-2 border-transparent rounded-lg px-4
                       text-muted-foreground hover:text-foreground
                       before:absolute before:inset-0 before:rounded-lg before:border-2
                       before:border-gradient-to-r before:from-primary before:to-secondary-teal
                       before:opacity-0 hover:before:opacity-100 before:transition"
          >
            Donate
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNavigation;