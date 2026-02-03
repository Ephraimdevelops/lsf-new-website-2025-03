import { useUser, useAuth } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { Navigate, Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import Layout from '../components/layout/Layout';
import Container from '@/components/shared/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Scale, MessageCircle, BookOpen, FileText, Heart,
    Settings, ChevronRight, Sparkles, Users, Phone,
    BookMarked, Clock, ArrowRight, LogOut
} from 'lucide-react';

const UserDashboard = () => {
    const { isSignedIn, isLoaded, signOut } = useAuth();
    const { user: clerkUser } = useUser();
    const convexUser = useQuery(api.users.current);

    // Auth guards
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    // Redirect other roles to their dashboards
    if (convexUser) {
        if (convexUser.role === "admin") return <Navigate to="/admin" replace />;
        if (convexUser.role === "paralegal") return <Navigate to="/dashboard/paralegal" replace />;
        if (convexUser.role === "staff") return <Navigate to="/dashboard/staff" replace />;
        if (convexUser.role === "stakeholder") return <Navigate to="/dashboard/stakeholder" replace />;
    }

    const userName = convexUser?.name || clerkUser?.firstName || 'User';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const userImage = convexUser?.imageUrl || clerkUser?.imageUrl;

    const quickActions = [
        {
            icon: MessageCircle,
            title: 'Talk to Saada',
            description: 'Get AI legal guidance',
            href: '/sara',
            bgColor: 'bg-purple-50',
        },
        {
            icon: Scale,
            title: 'Get Legal Help',
            description: 'Find resources near you',
            href: '/legal-help',
            bgColor: 'bg-blue-50',
        },
        {
            icon: Users,
            title: 'Find a Paralegal',
            description: 'Connect with experts',
            href: '/legal-help#paralegals',
            bgColor: 'bg-teal-50',
        },
        {
            icon: Phone,
            title: 'Contact Us',
            description: 'Reach out to LSF',
            href: '/contact',
            bgColor: 'bg-orange-50',
        },
    ];

    const resources = [
        { icon: FileText, title: 'Publications', description: 'Reports & research', href: '/publications' },
        { icon: BookOpen, title: 'Resources', description: 'Legal guides', href: '/resources' },
        { icon: Heart, title: 'Success Stories', description: 'Impact stories', href: '/success-stories' },
        { icon: BookMarked, title: 'Bookmarks', description: 'Saved items', href: '/bookmarks' },
    ];

    return (
        <Layout>
            {/* Simple Header */}
            <section className="bg-white border-b border-gray-200 py-8">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border border-gray-200">
                                <AvatarImage src={userImage} alt={userName} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
                                <p className="text-gray-500 text-sm">Community Member Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link to="/profile">
                                <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white hover:bg-gray-50 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                                onClick={() => signOut()}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Main Dashboard Content */}
            <section className="py-8 bg-gray-50/50">
                <Container>
                    {/* Quick Actions Grid */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <Link key={index} to={action.href}>
                                    <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                <action.icon className="h-5 w-5 text-gray-700" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 text-sm">
                                                    {action.title}
                                                </h3>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Content - Resources */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border border-gray-100 shadow-sm bg-white">
                                <CardHeader className="pb-3 border-b border-gray-50">
                                    <CardTitle className="text-base font-semibold text-gray-900">
                                        Explore Resources
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {resources.map((resource, index) => (
                                            <Link key={index} to={resource.href}>
                                                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                                                    <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-white">
                                                        <resource.icon className="h-4 w-4 text-gray-500 group-hover:text-primary" />
                                                    </div>
                                                    <span className="font-medium text-gray-700 text-sm group-hover:text-primary">{resource.title}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity Placeholder */}
                            <Card className="border border-gray-100 shadow-sm bg-white">
                                <CardHeader className="pb-3 border-b border-gray-50">
                                    <CardTitle className="text-base font-semibold text-gray-900">
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-6 text-gray-500">
                                        <p className="text-sm">No recent activity yet</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Become a Paralegal CTA */}
                            <Card className="border border-secondary-orange/20 shadow-sm bg-orange-50/50">
                                <CardContent className="p-5">
                                    <h3 className="font-semibold text-gray-900 mb-1">Become a Paralegal</h3>
                                    <p className="text-xs text-gray-600 mb-3">
                                        Join our network of community paralegals.
                                    </p>
                                    <Link to="/become-a-paralegal">
                                        <Button className="w-full bg-secondary-orange hover:bg-secondary-orange/90 h-8 text-sm">
                                            Apply Now
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Help Card */}
                            <Card className="border border-gray-100 shadow-sm bg-white">
                                <CardContent className="p-5">
                                    <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                                    <div className="space-y-2">
                                        <Link to="/faq" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            FAQ
                                        </Link>
                                        <Link to="/contact" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            Contact Support
                                        </Link>
                                        <Link to="/sara" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                            <MessageCircle className="h-4 w-4 text-gray-400" />
                                            Chat with Saada
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </Container>
            </section>
        </Layout>
    );
};

export default UserDashboard;
