import { useState } from 'react';
import { supabase } from '@/lib/supabase';
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
import { Upload } from 'lucide-react';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  excerpt: z.string().min(10, 'Excerpt is required'),
  content: z.string().min(20, 'Content is required'),
  category: z.string().min(2, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  featured: z.boolean().optional().default(false),
});

type NewsFormData = z.infer<typeof schema>;

interface NewsFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: (news: {
    id: string;
    title: string;
    excerpt?: string;
    content?: string;
    category?: string;
    date: string;
    featured?: boolean;
    image?: string;
  }) => void;
}

const BUCKET = 'media';

const NewsForm = ({ open, onClose, onCreated }: NewsFormProps) => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (data: NewsFormData) => {
    try {
      setSubmitting(true);
      let heroImageUrl = '';
      if (imageFile) {
        const objectName = `news/${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(objectName, imageFile, {
          cacheControl: '3600', upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectName);
        heroImageUrl = pub?.publicUrl || '';
      }

      // Insert into Supabase news table
      const { data: inserted, error } = await supabase
        .from('news')
        .insert({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          date: data.date,
          featured: data.featured ?? false,
          image: heroImageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: 'News created' });
      onCreated(inserted);
      onClose();
    } catch (err) {
      console.error('Create news error:', err);
      toast({ title: 'Failed to create news', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-panton">Create News</DialogTitle>
          <DialogDescription className="font-calibri">Add a news item with rich content and an optional hero image.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-calibri font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" className="font-calibri" {...field} />
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
                  <FormLabel className="font-calibri font-semibold">Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short summary" className="font-calibri" {...field} />
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
                  <FormLabel className="font-calibri font-semibold">Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write content (supports HTML/Markdown later)" className="font-calibri min-h-[160px]" {...field} />
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
                    <FormLabel className="font-calibri font-semibold">Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gender Justice" className="font-calibri" {...field} />
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
                    <FormLabel className="font-calibri font-semibold">Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="font-calibri" {...field} />
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
                    <FormLabel className="font-calibri font-semibold">Featured</FormLabel>
                    <div className="flex items-center h-10">
                      <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                      <span className="ml-2 text-sm text-gray-600 font-calibri">Show as featured</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold font-calibri">Hero Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" accept="image/*" id="news-hero" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                <label htmlFor="news-hero" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 font-calibri">{imageFile ? imageFile.name : 'Click to upload an image'}</p>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="font-calibri">Cancel</Button>
              <Button type="submit" disabled={submitting} className="font-calibri">{submitting ? 'Saving...' : 'Create News'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsForm;


