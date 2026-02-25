import { useUser, useAuth, SignOutButton } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    User, Settings, LogOut, LayoutDashboard, Shield, Scale,
    Users, ChevronDown, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const UserProfileButton = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const { user: clerkUser } = useUser();
    const convexUser = useQuery(api.users.current);
    const navigate = useNavigate();

    // Loading state
    if (!isLoaded) {
        return (
            <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
        );
    }

    // Not signed in - show login/signup buttons
    if (!isSignedIn) {
        return (
            <Link to="/login">
                <Button
                    size="sm"
                    className="text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all px-6 rounded-lg h-10"
                >
                    Join Our Portal
                </Button>
            </Link>
        );
    }

    // Signed in - show profile dropdown
    const userName = convexUser?.name || clerkUser?.firstName || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const userImage = convexUser?.imageUrl || clerkUser?.imageUrl;
    const userRole = convexUser?.role || 'user';

    // Role styling
    const roleConfig: Record<string, { label: string; color: string; icon: React.ElementType; dashboardPath: string }> = {
        admin: {
            label: 'Admin',
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: Shield,
            dashboardPath: '/admin'
        },
        staff: {
            label: 'Staff',
            color: 'bg-blue-100 text-blue-700 border-blue-200',
            icon: Users,
            dashboardPath: '/dashboard/staff'
        },
        paralegal: {
            label: 'Paralegal',
            color: 'bg-orange-100 text-orange-700 border-orange-200',
            icon: Scale,
            dashboardPath: '/dashboard/paralegal'
        },
        stakeholder: {
            label: 'Stakeholder',
            color: 'bg-purple-100 text-purple-700 border-purple-200',
            icon: Users,
            dashboardPath: '/dashboard/stakeholder'
        },
        user: {
            label: 'Member',
            color: 'bg-primary/10 text-primary border-primary/20',
            icon: Sparkles,
            dashboardPath: '/dashboard/user'
        },
    };

    const currentRole = roleConfig[userRole] || roleConfig.user;
    const RoleIcon = currentRole.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100/80 transition-all group"
                >
                    <Avatar className="h-9 w-9 border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                        <AvatarImage src={userImage} alt={userName} />
                        <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-64 p-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-xl"
                align="end"
                sideOffset={8}
            >
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal p-3 bg-gray-50/80 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow">
                            <AvatarImage src={userImage} alt={userName} />
                            <AvatarFallback className="bg-primary text-white font-semibold">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{userName}</p>
                            <p className="text-xs text-gray-500 truncate">
                                {clerkUser?.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>
                    </div>
                    <div className={cn(
                        "mt-3 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border w-fit",
                        currentRole.color
                    )}>
                        <RoleIcon className="h-3 w-3" />
                        {currentRole.label}
                    </div>
                </DropdownMenuLabel>

                {/* Dashboard Link */}
                <DropdownMenuItem
                    className="p-3 cursor-pointer rounded-lg hover:bg-primary/5 focus:bg-primary/5"
                    onClick={() => navigate(currentRole.dashboardPath)}
                >
                    <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                    <span className="font-medium">My Dashboard</span>
                </DropdownMenuItem>

                {/* Profile Settings */}
                <DropdownMenuItem
                    className="p-3 cursor-pointer rounded-lg hover:bg-gray-100 focus:bg-gray-100"
                    onClick={() => navigate('/profile')}
                >
                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Profile Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                {/* Sign Out */}
                <SignOutButton>
                    <DropdownMenuItem className="p-3 cursor-pointer rounded-lg hover:bg-red-50 focus:bg-red-50 text-red-600">
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                </SignOutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserProfileButton;
