
import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Image as ImageIcon, Clock, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const storySchema = z.object({
    title: z.string().min(1, "Title is required"),
    story: z.string().min(1, "Story content is required"),
    quote: z.string().optional(),
    personName: z.string().min(1, "Person name is required"),
    location: z.string().min(1, "Location is required"),
    programId: z.string().optional(),
    featured: z.boolean().default(false),
    readTime: z.number().min(1).optional(),
    image: z.instanceof(File).optional(),
});

type StoryFormData = z.infer<typeof storySchema>;

interface Story {
    _id: Id<"success_stories">;
    title: string;
    story: string;
    quote?: string;
    personName: string;
    location: string;
    imageUrl: string;
    readTime?: number;
    programId?: string;
    featured?: boolean;
}

interface StoryFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    story?: Story;
    mode: 'create' | 'edit';
}

const StoryForm = ({ open, onClose, onSubmit, story, mode }: StoryFormProps) => {
    const { toast } = useToast();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const generateUploadUrl = useMutation(api.media.generateUploadUrl);
    const saveMedia = useMutation(api.media.saveMedia);
    const createStory = useMutation(api.stories.create);
    const updateStory = useMutation(api.stories.update);

    const form = useForm<StoryFormData>({
        resolver: zodResolver(storySchema),
        defaultValues: {
            title: story?.title || '',
            story: story?.story || '',
            quote: story?.quote || '',
            personName: story?.personName || '',
            location: story?.location || 'Tanzania',
            programId: story?.programId || '',
            featured: story?.featured || false,
            readTime: story?.readTime || 5,
        },
    });

    // Calculate read time from story content
    const calculateReadTime = (text: string): number => {
        const plainText = text.replace(/<[^>]*>/g, ' ');
        const words = plainText.split(/\s+/).filter(w => w.length > 0);
        return Math.max(1, Math.ceil(words.length / 200));
    };

    // Auto-update read time when story changes
    const handleStoryChange = (value: string) => {
        form.setValue('story', value);
        form.setValue('readTime', calculateReadTime(value));
    };

    const handleUpload = async (file: File): Promise<string> => {
        // Step 1: Get upload URL
        const postUrl = await generateUploadUrl();

        // Step 2: Upload the file
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        });
        const { storageId } = await result.json();

        // Step 3: Convert storageId to actual URL via saveMedia
        const url = await saveMedia({
            storageId,
            name: file.name,
            type: file.type,
            size: file.size,
        });

        return url;
    };

    const handleSubmit = async (data: StoryFormData) => {
        try {
            setSubmitting(true);
            let imageUrl = story?.imageUrl || '';

            if (selectedImage) {
                imageUrl = await handleUpload(selectedImage);
            }

            // If creating, we need at least a placeholder if no image uploaded
            // For now, we'll assume image is optional or handled elsewhere if missing, 
            // but schema says imageUrl is string (required).
            if (!imageUrl && mode === 'create') {
                // In a real app, force upload or use default.
                // For now, let's just use a placeholder if empty to avoid schema error
                // or let it fail if schema enforces it.
                // Schema: imageUrl: v.string()
                // So it IS required.
                if (!selectedImage) {
                    toast({ title: 'Image required', description: 'Please upload an image.', variant: 'destructive' });
                    setSubmitting(false);
                    return;
                }
            }

            const storyData = {
                title: data.title,
                story: data.story,
                quote: data.quote,
                personName: data.personName,
                location: data.location,
                imageUrl,
                readTime: data.readTime,
                programId: data.programId,
                featured: data.featured,
            };

            if (mode === 'create') {
                await createStory(storyData);
            } else if (story) {
                await updateStory({
                    id: story._id,
                    ...storyData,
                });
            }

            onSubmit({});
            toast({
                title: mode === 'create' ? "Story Created" : "Story Updated",
                description: `The story has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
            });
            onClose();
        } catch (err) {
            console.error('Story submit error:', err);
            toast({ title: 'Failed to save story', variant: 'destructive' });
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

    // Set initial image preview
    React.useEffect(() => {
        if (story?.imageUrl) {
            setImagePreview(story.imageUrl);
        }
    }, [story]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-panton">
                        {mode === 'create' ? 'Add New Success Story' : 'Edit Success Story'}
                    </DialogTitle>
                    <DialogDescription className="font-calibri">
                        {mode === 'create'
                            ? 'Share a new success story or testimonial.'
                            : 'Update the story details below.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-calibri font-semibold">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter story title" {...field} className="font-calibri" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="personName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-calibri font-semibold">Person Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Jane Doe" {...field} className="font-calibri" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-calibri font-semibold">Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Arusha, Tanzania" {...field} className="font-calibri" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="story"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-calibri font-semibold">Story Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write the full story here. Use Enter key to create new paragraphs..."
                                            {...field}
                                            className="font-calibri min-h-[150px]"
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground font-calibri">
                                        Tip: Press Enter twice to create paragraph breaks. They will be preserved when displayed.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="quote"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-calibri font-semibold">Featured Quote (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="A short, impactful quote to highlight in the story detail page..."
                                            {...field}
                                            className="font-calibri min-h-[80px]"
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground font-calibri">
                                        This quote will be displayed prominently on the story detail page. If left empty, the first part of the story will be used.
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="programId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-calibri font-semibold">Related Program ID (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter program ID" {...field} className="font-calibri" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-calibri font-semibold">
                                            Featured Story
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground font-calibri">
                                            This story will be highlighted on the homepage or main sections.
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold font-calibri">Story Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600 font-calibri">
                                        {selectedImage ? selectedImage.name : 'Click to upload image'}
                                    </p>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} className="font-calibri">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="font-calibri">
                                {submitting ? 'Saving...' : (mode === 'create' ? 'Create Story' : 'Update Story')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default StoryForm;
