import { BrandLoadingIcon } from '@/components/shared/BrandLoading';
import { WorkHeader } from "@/components/dashboard/WorkArea";
import { useCopy } from "@/i18n/useCopy";
import PresenceSettings from "@/components/location/PresenceSettings";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload, User, Shield, CheckCircle } from "lucide-react";
import DesktopNavigation from "@/components/layout/header/DesktopNavigation";
import MobileNavigation from "@/components/layout/header/MobileNavigation";
import Footer from "@/components/layout/Footer";
import { usePersonalGreeting } from '@/hooks/usePersonalGreeting';
import { DeleteAccount } from '@/components/dashboard/DeleteAccount';

const ProfileSettings = () => {
  const c = useCopy();
    const [profileArea, setProfileArea] = useState("profile");
    const { name: savedName, imageUrl, initials } = usePersonalGreeting();
    const { user: clerkUser } = useUser();
    const convexUser = useQuery(api.users.current);
    const access = useQuery(api.users.currentAccess);
    const updateProfile = useMutation(api.users.updateProfile);
    const generateUploadUrl = useMutation(api.users.generateUploadUrl);

    const [name, setName] = useState(convexUser?.name || "");
    const [bio, setBio] = useState(convexUser?.bio || "");
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync local state with Convex data when it loads
    if (convexUser && name === "" && convexUser.name) {
        setName(convexUser.name);
    }
    if (convexUser && bio === "" && convexUser.bio) {
        setBio(convexUser.bio);
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Max size check (e.g. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setIsUploading(true);
        try {
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();

            // 3. Update user profile with new storage ID
            await updateProfile({
                name: name || convexUser?.name || "",
                bio: bio,
                imageStorageId: storageId,
            });

            toast.success("Profile picture updated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                name,
                bio,
            });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const userRole = access?.roles.filter((role) => role !== "user").join(" · ") || convexUser?.role || "user";

    // Navigation state management (reused from dashboard layouts)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [legalAidDialogOpen, setLegalAidDialogOpen] = useState(false);

    return (
        <div className="workspace-page flex flex-col">
            {/* Navigation Wrapper */}
            <header className="workspace-legacy-header sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="LSF Logo" className="h-10 w-auto" />
                        </a>
                    </div>

                    <DesktopNavigation
                        activeDropdown={activeDropdown}
                        setActiveDropdown={setActiveDropdown}
                        setLegalAidDialogOpen={setLegalAidDialogOpen}
                    />

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                            <span className={`block w-full h-0.5 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block w-full h-0.5 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-full h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>

                <MobileNavigation
                    mobileMenuOpen={mobileMenuOpen}
                    activeDropdown={activeDropdown}
                    toggleDropdown={(name) => setActiveDropdown(activeDropdown === name ? null : name)}
                    setLegalAidDialogOpen={setLegalAidDialogOpen}
                />
            </header>


            <main className="work-page">
                <WorkHeader title={c("My profile")} description={c("Your profile and account preferences.")}/>
                <nav className="work-tabs" aria-label={c("Account settings")}>{[['profile',c('My profile')],['preferences',c('Privacy and availability')],['account',c('Account actions')]].map(([value,label])=><button key={value} type="button" aria-current={profileArea===value?'page':undefined} onClick={()=>setProfileArea(value)}>{label}</button>)}</nav>
                <div hidden={profileArea!=='preferences'} className="work-account-area"><PresenceSettings /></div>
                <div hidden={profileArea!=='profile'} className="work-account-area">


                    <div className="grid gap-8 md:grid-cols-[1fr_2fr]">

                        {/* Left Column: Avatar & Quick Info */}
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 flex flex-col items-center text-center">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                            <AvatarImage src={imageUrl} alt={savedName ? `${savedName}'s profile` : 'Your profile'} className="object-cover" />
                                            <AvatarFallback className="text-4xl bg-primary text-white">{initials || <User size={32} />}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isUploading ? (
                                                <BrandLoadingIcon className="h-8 w-8 text-white " />
                                            ) : (
                                                <Upload className="h-8 w-8 text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">{c("Click to change avatar")}</p>

                                    <div className="mt-4">
                                        <h2 className="text-xl font-semibold">{savedName || 'My account'}</h2>
                                        <p className="text-sm text-gray-500">{clerkUser?.primaryEmailAddress?.emailAddress}</p>

                                        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                            <Shield className="w-3 h-3 mr-1" />
                                            {userRole}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Edit Form */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{c("General Information")}</CardTitle>
                                    <CardDescription>{c("Update your public profile details.")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{c("Full Name")}</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={c("Your full name")}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">{c("Bio")}</Label>
                                        <Textarea
                                            id="bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder={c("Tell us a little about yourself")}
                                            rows={4}
                                        />
                                        <p className="text-xs text-gray-500">{c("Brief description for your profile.")}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">{c("Email Address")}</Label>
                                        <Input
                                            id="email"
                                            value={clerkUser?.primaryEmailAddress?.emailAddress || ""}
                                            disabled
                                            className="bg-gray-50 text-gray-500"
                                        />
                                        <p className="text-xs text-gray-500">{c("Email is managed via your secure login provider.")}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end border-t pt-6">
                                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                                        {isSaving && <BrandLoadingIcon className="mr-2 h-4 w-4 " />}{c("Save Changes")}</Button>
                                </CardFooter>
                            </Card>
                        </div>

                    </div>
                </div>
                <div hidden={profileArea!=="account"} className="work-account-area"><DeleteAccount /></div>
            </main>

        </div>
    );
};

export default ProfileSettings;
