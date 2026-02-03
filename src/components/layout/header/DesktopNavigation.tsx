import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SearchDialog from "@/components/shared/SearchDialog";
import NavigationDropdown from "./NavigationDropdown";
import UserProfileButton from "./UserProfileButton";
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
          <SearchDialog />
        </div>

        {/* legal help CTA */}
        <Link to="/legal-help">
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 flex items-center space-x-2 rounded-lg px-4 shadow-md hover:shadow-lg transition"
          >
            <Phone className="h-4 w-4" />
            <span>Get Legal Help</span>
          </Button>
        </Link>

        {/* User Profile / Auth */}
        <UserProfileButton />
      </div>
    </nav>
  );
};

export default DesktopNavigation;