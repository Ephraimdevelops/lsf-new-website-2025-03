
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { ExternalLink, ArrowUp, ArrowDown, Edit, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// EMOJI Selection Map
const EMOJIS = [
    "📞", "🌍", "📄", "💬", "🚨", "📅", "📍", "✉️", "📱", "📺",
    "🔗", "💡", "🤝", "⚖️", "🇹🇿", "📜", "📢", "❓", "🆘"
];
const LINK_VARIANTS = ["primary", "secondary", "emergency"] as const;

const LinksManager = () => {
    const { toast } = useToast();

    // Data
    const links = useQuery(api.quickLinks.getAll);
    const createLink = useMutation(api.quickLinks.create);
    const updateLink = useMutation(api.quickLinks.update);
    const swapOrder = useMutation(api.quickLinks.swapOrder);
    const toggleStatus = useMutation(api.quickLinks.toggleStatus);

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<Id<"quick_links"> | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        url: "",
        variant: "primary" as "primary" | "secondary" | "emergency",
        icon: "🔗", // Default emoji
        openInNewTab: true,
        audience: "public" as "public" | "paralegal" | "staff"
    });

    const handleSwap = async (index: number, direction: 'up' | 'down') => {
        if (!links) return;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= links.length) return;

        const link1 = links[index];
        const link2 = links[targetIndex];

        await swapOrder({ id1: link1._id, id2: link2._id });
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await updateLink({ id: editingId, ...formData });
                toast({ title: "Updated", description: "Link updated successfully" });
            } else {
                await createLink({ ...formData, isActive: true });
                toast({ title: "Created", description: "New link added" });
            }
            setIsDialogOpen(false);
            setEditingId(null);
            setFormData({
                title: "", subtitle: "", url: "", variant: "primary", icon: "🔗", openInNewTab: true, audience: "public"
            });
        } catch (e) {
            toast({ title: "Error", description: "Failed to save link", variant: "destructive" });
        }
    };

    const startEdit = (link: Doc<"quick_links">) => {
        setFormData({
            title: link.title,
            subtitle: link.subtitle || "",
            url: link.url,
            variant: link.variant,
            icon: link.icon || "🔗",
            openInNewTab: link.openInNewTab,
            audience: link.audience || "public"
        });
        setEditingId(link._id);
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quick Links Manager</h1>
                        <p className="text-gray-500">Manage content for LSF Connect (/connect)</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => window.open('/connect', '_blank')}>
                            View Live Page <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingId(null); setFormData({ title: "", subtitle: "", url: "", variant: "primary", icon: "🔗", openInNewTab: true, audience: "public" }) }}>
                                    <Plus className="mr-2 h-4 w-4" /> Add New Link
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{editingId ? "Edit Link" : "Add New Link"}</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    {/* Title & Subtitle */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Chat with Saada" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Subtitle (Optional)</label>
                                            <Input value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} placeholder="e.g. 24/7 AI Assistant" />
                                        </div>
                                    </div>

                                    {/* URL & Type */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Destination URL</label>
                                        <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." />
                                    </div>

                                    {/* Variant Selector */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Style Variant</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {LINK_VARIANTS.map((v) => (
                                                <div
                                                    key={v}
                                                    onClick={() => setFormData({ ...formData, variant: v })}
                                                    className={`
                            cursor-pointer border-2 rounded-lg p-3 text-center capitalize transition-all
                            ${formData.variant === v ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-gray-100 hover:border-gray-300'}
                            ${v === 'emergency' && formData.variant === v ? 'border-red-500 bg-red-50 text-red-600' : ''}
                          `}
                                                >
                                                    {v}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Visual Emoji Selector */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Icon (Emoji)</label>
                                        <div className="grid grid-cols-8 gap-2">
                                            {EMOJIS.map((emoji) => (
                                                <div
                                                    key={emoji}
                                                    onClick={() => setFormData({ ...formData, icon: emoji })}
                                                    className={`
                            cursor-pointer rounded-lg p-2 flex items-center justify-center transition-all text-2xl aspect-square
                            ${formData.icon === emoji ? 'bg-primary/20 scale-110 shadow-md border-2 border-primary' : 'bg-gray-100 hover:bg-gray-200'}
                          `}
                                                >
                                                    {emoji}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="flex gap-8 pt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Switch checked={formData.openInNewTab} onCheckedChange={(c) => setFormData({ ...formData, openInNewTab: c })} />
                                            <span className="text-sm">Open in New Tab</span>
                                        </label>
                                    </div>

                                    <Button onClick={handleSubmit} className="w-full h-12 text-lg font-bold">
                                        {editingId ? "Save Changes" : "Create Link"}
                                    </Button>

                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Links List */}
                <div className="space-y-3">
                    {links ? (
                        links.map((link, index) => {

                            return (
                                <Card key={link._id} className={`p-4 flex items-center gap-4 transition-all ${!link.isActive ? 'opacity-50 grayscale' : ''}`}>

                                    {/* Sort Controls */}
                                    <div className="flex flex-col gap-1">
                                        <button
                                            disabled={index === 0}
                                            onClick={() => handleSwap(index, 'up')}
                                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-20"
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </button>
                                        <button
                                            disabled={index === links.length - 1}
                                            onClick={() => handleSwap(index, 'down')}
                                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-20"
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Icon Preview */}
                                    <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-3xl
                    ${link.variant === 'emergency' ? 'bg-red-50' :
                                            link.variant === 'primary' ? 'bg-primary/5' : 'bg-gray-50'}
                  `}>
                                        {link.icon || '🔗'}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900 truncate">{link.title}</h3>
                                            {link.variant === 'emergency' && <span className="bg-red-100 text-red-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Emergency</span>}
                                            {!link.isActive && <span className="bg-gray-200 text-gray-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Inactive</span>}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="truncate max-w-[200px]">{link.url}</span>
                                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {link.clicks || 0} clicks</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={link.isActive}
                                            onCheckedChange={(c) => toggleStatus({ id: link._id, isActive: c })}
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => startEdit(link)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>

                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-20">Loading...</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LinksManager;
