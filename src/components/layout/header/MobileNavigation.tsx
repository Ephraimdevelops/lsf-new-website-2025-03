import { useCopy } from "@/i18n/useCopy";
import { dashboardPath as getDashboardPath } from '@/components/auth/dashboardPath';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Phone, User, LogOut, LayoutDashboard, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navigationItems } from './navigationData';
import { useUser, useAuth, SignOutButton } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileNavigationProps {
  mobileMenuOpen: boolean;
  activeDropdown: string | null;
  toggleDropdown: (name: string) => void;
  setLegalAidDialogOpen: (open: boolean) => void;
}

const MobileNavigation = ({
  mobileMenuOpen,
  activeDropdown,
  toggleDropdown,
  setLegalAidDialogOpen
}: MobileNavigationProps) => {
  const c = useCopy();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.current);
  const access = useQuery(api.users.currentAccess);

  const userName = convexUser?.name || clerkUser?.firstName || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const userImage = convexUser?.imageUrl || clerkUser?.imageUrl;
  const userRole = ['admin', 'supervisor', 'staff', 'safeguarding_officer', 'content_editor', 'paralegal', 'provider_staff', 'stakeholder', 'donor', 'user'].find((role) => access?.roles.includes(role as typeof access.roles[number])) || convexUser?.role || 'user';

  const dashboardPath = getDashboardPath(access?.roles);

  return (
    <div className={cn(
      "2xl:hidden bg-white border-t border-gray-100 shadow-lg transition-all duration-300 overflow-hidden",
      mobileMenuOpen ? "max-h-[80vh] opacity-100" : "hidden"
    )}>
      <div className="container mx-auto px-4 py-4">
        {/* Auth Section */}
        {isLoaded && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            {isSignedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback className="bg-primary text-white font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{c(userRole)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to={dashboardPath}>
                    <Button variant="outline" size="sm" className="w-full">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      {c("Dashboard")}
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-1" />{c("Settings")}</Button>
                  </Link>
                </div>
                <Link to="/notifications">
                  <Button variant="outline" size="sm" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />{c("Updates and notifications")}</Button>
                </Link>
                <SignOutButton redirectUrl="/">
                  <Button variant="ghost" size="sm" className="w-full text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    {c("Sign Out")}
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <div className="space-y-4">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full justify-center h-12 text-base font-medium border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 group transition-all">
                    <User className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />{c("Log in")}</Button>
                </Link>
                <Link to="/signup" className="block text-center text-sm font-semibold text-primary hover:underline">{c("Create an account")}</Link>
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="h-px w-8 bg-gray-100" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
                    {c("Secure Authentication")}
                  </p>
                  <div className="h-px w-8 bg-gray-100" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
          <Link to="/legal-help" className="block mb-3">
            <Button
              className="w-full justify-center bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              {c("Get Legal Help")}
            </Button>
          </Link>
          <Link to="/contact" className="block">
            <Button
              variant="outline"
              className="w-full justify-center border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              {c("Contact Us")}
            </Button>
          </Link>
        </div>

        <nav className="space-y-1 max-h-96 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={c(item.name)} className="py-1">
              <div>
                {item.subItems.length > 0 ? (
                  <button
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                      activeDropdown === item.name ? "text-primary bg-primary/10" : "text-foreground"
                    )}
                    onClick={() => toggleDropdown(item.name)}
                  >
                    <div className="flex items-center space-x-3">
                      {(item as any).icon && (
                        <img
                          src={(item as any).icon}
                          alt={c(item.name)}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span>{c(item.name)}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        activeDropdown === item.name ? "transform rotate-180" : ""
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-muted/50",
                      location.pathname === item.href ? "text-primary bg-primary/10" : "text-foreground"
                    )}
                  >
                    {(item as any).icon && (
                      <img
                        src={(item as any).icon}
                        alt={c(item.name)}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span>{c(item.name)}</span>
                  </Link>
                )}

                {/* Mobile Dropdown */}
                {item.subItems.length > 0 && activeDropdown === item.name && (
                  <div className="ml-6 mt-2 space-y-1 pb-2 border-l-2 border-gray-200 pl-4">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={c(subItem.name)}
                        to={subItem.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-lg transition-colors duration-200",
                          location.pathname === subItem.href
                            ? "text-primary bg-primary/10 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {c(subItem.name)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
