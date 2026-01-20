
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt is required'),
  content: z.string().min(20, 'Content is required'),
  category: z.string().min(2, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  featured: z.boolean().optional().default(false),
});

type NewsFormData = z.infer<typeof schema>;

interface EditData {
  _id: Id<"news">;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  date: string;
  featured?: boolean;
  image?: string;
}

interface NewsFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: (news: any) => void;
  editData?: EditData | null;
}

const NewsForm = ({ open, onClose, onCreated, editData }: NewsFormProps) => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const createNews = useMutation(api.news.create);
  const updateNews = useMutation(api.news.update);

  const isEditMode = !!editData;

  const form = useForm<NewsFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      featured: false,
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      form.reset({
        title: editData.title || '',
        excerpt: editData.excerpt || '',
        content: editData.content || '',
        category: editData.category || '',
        date: editData.date?.split('T')[0] || new Date().toISOString().split('T')[0],
        featured: editData.featured || false,
      });
      if (editData.image) {
        setImagePreview(editData.image);
      }
    } else {
      form.reset({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        featured: false,
      });
      setImagePreview(null);
    }
  }, [editData, form]);

  const handleSubmit = async (data: NewsFormData) => {
    try {
      setSubmitting(true);
      let heroImageUrl = editData?.image || '';

      if (imageFile) {
        // 1. Get upload URL
        const postUrl = await generateUploadUrl();

        // 2. Upload file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId } = await result.json();
        heroImageUrl = storageId;
      }

      if (isEditMode && editData) {
        // Update existing news
        await updateNews({
          id: editData._id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          date: data.date,
          featured: data.featured ?? false,
          image: heroImageUrl,
        });
        toast({ title: 'News updated successfully' });
      } else {
        // Create new news
        await createNews({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          date: data.date,
          featured: data.featured ?? false,
          image: heroImageUrl,
        });
        toast({ title: 'News created successfully' });
      }

      onCreated({});
      onClose();
      form.reset();
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Save news error:', err);
      toast({ title: `Failed to ${isEditMode ? 'update' : 'create'} news`, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit News Article' : 'Create News Article'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the news article details below.' : 'Add a news item with rich content and an optional hero image.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write content (supports HTML)" className="min-h-[160px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gender Justice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured</FormLabel>
                    <div className="flex items-center h-10">
                      <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                      <span className="ml-2 text-sm text-gray-600">Show as featured</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hero Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input type="file" accept="image/*" id="news-hero" className="hidden" onChange={handleImageChange} />
                  <label htmlFor="news-hero" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : isEditMode ? 'Update News' : 'Create News'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsForm;
