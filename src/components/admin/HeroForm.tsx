/**
 * HeroForm - Admin form for editing legacy hero stories
 * 
 * Features:
 * - Displays current image (local path or Convex storage)
 * - "Replace Image" functionality with upload
 * - Editable Location and Read Time fields
 * - Unified for both new and legacy heroes
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, RefreshCw, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const heroSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().optional(),
    readTime: z.number().min(1).optional(),
});

type HeroFormData = z.infer<typeof heroSchema>;

interface Hero {
    _id: Id<"heros">;
    title: string;
    slug: string;
    description: string;
    image?: string;
    date: number;
    location?: string;
    readTime?: number;
}

interface HeroFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    hero?: Hero;
    mode: 'create' | 'edit';
}

const HeroForm = ({ open, onClose, onSubmit, hero, mode }: HeroFormProps) => {
    const { toast } = useToast();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const generateUploadUrl = useMutation(api.media.generateUploadUrl);
    const saveMedia = useMutation(api.media.saveMedia);
    const createHero = useMutation(api.heros.create);
    const updateHero = useMutation(api.heros.update);

    const form = useForm<HeroFormData>({
        resolver: zodResolver(heroSchema),
        defaultValues: {
            title: hero?.title || '',
            slug: hero?.slug || '',
            description: hero?.description || '',
            location: hero?.location || 'Tanzania',
            readTime: hero?.readTime || 5,
        },
    });

    // Reset form when hero or mode changes
    useEffect(() => {
        if (mode === 'edit' && hero) {
            form.reset({
                title: hero.title || '',
                slug: hero.slug || '',
                description: hero.description || '',
                location: hero.location || 'Tanzania',
                readTime: hero.readTime || 5,
            });
            if (hero.image) {
                setImagePreview(hero.image);
            }
        } else if (mode === 'create') {
            form.reset({
                title: '',
                slug: '',
                description: '',
                location: 'Tanzania',
                readTime: 5,
            });
            setImagePreview(null);
            setSelectedImage(null);
        }
    }, [hero, mode, form]);

    // Generate slug from title
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 80);
    };

    // Calculate read time from description
    const calculateReadTime = (text: string): number => {
        const plainText = text.replace(/<[^>]*>/g, ' ');
        const words = plainText.split(/\s+/).filter(w => w.length > 0);
        return Math.max(1, Math.ceil(words.length / 200));
    };

    // Handle title change to auto-generate slug
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        form.setValue('title', title);
        if (mode === 'create') {
            form.setValue('slug', generateSlug(title));
        }
    };

    // Handle description change to auto-calculate read time
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const desc = e.target.value;
        form.setValue('description', desc);
        form.setValue('readTime', calculateReadTime(desc));
    };

    const handleUpload = async (file: File): Promise<string> => {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        });
        const { storageId } = await result.json();
        const url = await saveMedia({
            storageId,
            name: file.name,
            type: file.type,
            size: file.size,
        });
        return url;
    };

    const handleSubmit = async (data: HeroFormData) => {
        try {
            setSubmitting(true);
            let imageUrl = hero?.image || '';

            // Upload new image if selected
            if (selectedImage) {
                imageUrl = await handleUpload(selectedImage);
            }

            const heroData = {
                title: data.title,
                slug: data.slug,
                description: data.description,
                image: imageUrl || undefined,
                date: hero?.date || Date.now(),
                location: data.location || 'Tanzania',
                readTime: data.readTime,
            };

            if (mode === 'create') {
                await createHero(heroData);
            } else if (hero) {
                await updateHero({
                    id: hero._id,
                    ...heroData,
                });
            }

            onSubmit();
            toast({
                title: mode === 'create' ? "Hero Created" : "Hero Updated",
                description: `The hero story has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
            });
            onClose();
        } catch (err) {
            console.error('Hero submit error:', err);
            toast({ title: 'Failed to save hero', variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-panton">
                        {mode === 'create' ? 'Add New Hero Story' : 'Edit Hero Story'}
                    </DialogTitle>
                    <DialogDescription className="font-calibri">
                        {mode === 'create'
                            ? 'Create a new hero success story.'
                            : 'Update the hero story details. You can replace the image if needed.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-calibri font-semibold">Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter hero story title"
                                            {...field}
                                            onChange={handleTitleChange}
                                            className="font-calibri"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Slug */}
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-calibri font-semibold">URL Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="url-friendly-slug"
                                            {...field}
                                            className="font-calibri font-mono text-sm"
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground font-calibri">
                                        Auto-generated from title. Edit if needed.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Location and Read Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-calibri font-semibold flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Arusha, Tanzania"
                                                {...field}
                                                className="font-calibri"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="readTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-calibri font-semibold flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Read Time (minutes)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                className="font-calibri"
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground font-calibri">
                                            Auto-calculated from content. Adjust if needed.
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-calibri font-semibold">Story Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write the hero story content here..."
                                            {...field}
                                            onChange={handleDescriptionChange}
                                            className="font-calibri min-h-[200px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Current Image Display + Replace */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold font-calibri">Story Image</label>

                            {/* Current Image Preview */}
                            {imagePreview && (
                                <div className="relative rounded-lg overflow-hidden border bg-gray-50">
                                    <img
                                        src={imagePreview}
                                        alt="Current hero image"
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            // Fallback for broken images
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                        {selectedImage ? 'New Image' : 'Current Image'}
                                    </div>
                                    {hero?.image && !hero.image.startsWith('http') && (
                                        <div className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <RefreshCw className="h-3 w-3" />
                                            Legacy Image - Consider replacing
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="hero-image-upload"
                                />
                                <label htmlFor="hero-image-upload" className="cursor-pointer flex items-center justify-center gap-2">
                                    <Upload className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600 font-calibri">
                                        {selectedImage
                                            ? `Selected: ${selectedImage.name}`
                                            : (imagePreview ? 'Click to replace image' : 'Click to upload image')
                                        }
                                    </span>
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground font-calibri">
                                Upload a new image to replace the current one. The new image will be stored in Convex.
                            </p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose} className="font-calibri">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="font-calibri">
                                {submitting ? 'Saving...' : (mode === 'create' ? 'Create Hero' : 'Update Hero')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default HeroForm;
