
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const Connect = () => {
    const links = useQuery(api.quickLinks.getPublic);
    const trackClick = useMutation(api.quickLinks.trackClick);

    const handleLinkClick = (id: any, url: string, openInNewTab: boolean) => {
        trackClick({ id });
        if (openInNewTab) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    };

    if (links === undefined) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex items-center justify-center bg-primary">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            </Layout>
        );
    }

    // Filter emergency links
    const emergencyLinks = links.filter(l => l.variant === 'emergency');
    const otherLinks = links.filter(l => l.variant !== 'emergency');

    return (
        <Layout>
            <div className="min-h-screen relative bg-primary pb-32 pt-32">
                {/* Background Pattern & Effects - Matches ModernCallToAction */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "url('/lovable-uploads/brand-pattern.png')",
                        backgroundSize: '300px',
                        backgroundRepeat: 'repeat',
                        opacity: 0.1
                    }}
                />
                {/* Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Sticky Emergency Header (Pulsing Red) */}
                {emergencyLinks.length > 0 && (
                    <div className="fixed top-20 left-0 right-0 z-40 px-4 md:px-0 pointer-events-none">
                        <div className="max-w-md mx-auto pointer-events-auto">
                            {emergencyLinks.map(link => (
                                <motion.button
                                    key={link._id}
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleLinkClick(link._id, link.url, link.openInNewTab)}
                                    className="w-full bg-red-600/90 backdrop-blur-md text-white shadow-2xl shadow-red-900/50 rounded-2xl p-4 mb-4 flex items-center justify-between border border-red-400 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                                    <div className="flex items-center gap-4 relative z-10">
                                        <span className="text-3xl filter drop-shadow-md">{link.icon || '🚨'}</span>
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg leading-tight">{link.title}</h3>
                                            {link.subtitle && <p className="text-red-100 text-sm opacity-90">{link.subtitle}</p>}
                                        </div>
                                    </div>
                                    <ExternalLink className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity relative z-10" />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="relative z-10 max-w-md mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-12 space-y-3">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                            LSF Connect
                        </h1>
                        <p className="text-white/70 text-lg font-medium">
                            Your gateway to justice and support.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="space-y-4">
                        {otherLinks.map((link, index) => {
                            const isPrimary = link.variant === 'primary';

                            return (
                                <motion.div
                                    key={link._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`
                      cursor-pointer overflow-hidden border-0 relative group
                      ${isPrimary
                                                ? 'bg-white text-gray-900 shadow-xl shadow-black/20'
                                                : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'}
                    `}
                                        onClick={() => handleLinkClick(link._id, link.url, link.openInNewTab)}
                                    >
                                        <div className="flex items-center justify-between p-5">
                                            <div className="flex items-center gap-5">
                                                <span className="text-3xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                                                    {link.icon || '🔗'}
                                                </span>
                                                <div>
                                                    <h3 className={`font-bold text-lg leading-tight ${isPrimary ? 'text-gray-900' : 'text-white'}`}>
                                                        {link.title}
                                                    </h3>
                                                    {link.subtitle && (
                                                        <p className={`text-sm mt-0.5 ${isPrimary ? 'text-gray-500' : 'text-white/60'}`}>
                                                            {link.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded-full ${isPrimary ? 'bg-gray-100 text-gray-400' : 'bg-white/10 text-white/50'} group-hover:translate-x-1 transition-all`}>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {links.length === 0 && (
                        <div className="text-center py-20 text-white/40 border-2 border-dashed border-white/10 rounded-3xl">
                            <p>No active links available.</p>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
};

export default Connect;
