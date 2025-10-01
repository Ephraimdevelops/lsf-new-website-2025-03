
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  file: z.instanceof(File).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  language: z.string().default("English"),
  category: z.string().optional(),
});

type PublicationFormData = z.infer<typeof publicationSchema>;

interface Publication {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  downloadUrl: string;
  fileSize?: string;
  tags?: string[];
  author?: string;
  language?: string;
  category?: string;
}

interface PublicationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Publication) => void;
  publication?: Publication;
  mode: 'create' | 'edit';
}

const publicationTypes = [
  "Report",
  "Research",
  "Guide",
  "Brief",
  "Manual",
  "Toolkit",
  "Survey",
  "Policy Brief",
  "Case Study",
  "White Paper"
];

const categories = [
  "Legal Aid",
  "Gender Justice",
  "Climate Justice",
  "Land Rights",
  "Access to Justice",
  "Digital Innovation",
  "Capacity Building",
  "Policy Reform"
];

const PublicationForm = ({ open, onClose, onSubmit, publication, mode }: PublicationFormProps) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>(publication?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: publication?.title || '',
      description: publication?.description || '',
      type: publication?.type || '',
      date: publication?.date || new Date().toISOString().split('T')[0],
      author: publication?.author || '',
      language: publication?.language || 'English',
      category: publication?.category || '',
      tags: publication?.tags || [],
    },
  });

  const handleSubmit = async (data: PublicationFormData) => {
    try {
      let publicUrl = publication?.downloadUrl || '';
      let fileSizeLabel = publication?.fileSize;

      // Upload file to Supabase Storage if provided
      if (selectedFile) {
        const objectName = `publications/${Date.now()}-${selectedFile.name.replace(/\s+/g, '-')}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(objectName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadError) throw uploadError;
        const { data: pub } = supabase.storage.from('media').getPublicUrl(objectName);
        publicUrl = pub?.publicUrl || '';
        fileSizeLabel = `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`;
      }

      const newPublication: Publication = {
        id: publication?.id || `pub-${Date.now()}`,
        title: data.title,
        description: data.description,
        type: data.type,
        date: data.date,
        downloadUrl: publicUrl,
        fileSize: fileSizeLabel,
        tags,
        author: data.author,
        language: data.language,
        category: data.category,
      };

      onSubmit(newPublication);
      toast({
        title: mode === 'create' ? "Publication Created" : "Publication Updated",
        description: `The publication has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
      });
      onClose();
    } catch (err) {
      console.error('Publication submit error:', err);
      toast({ title: 'Failed to save publication', variant: 'destructive' });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-panton">
            {mode === 'create' ? 'Add New Publication' : 'Edit Publication'}
          </DialogTitle>
          <DialogDescription className="font-calibri">
            {mode === 'create' 
              ? 'Fill in the details to create a new publication.' 
              : 'Update the publication details below.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-calibri font-semibold">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter publication title" {...field} className="font-calibri" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-calibri font-semibold">Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-calibri">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {publicationTypes.map((type) => (
                          <SelectItem key={type} value={type} className="font-calibri">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-calibri font-semibold">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-calibri">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="font-calibri">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-calibri font-semibold">Publication Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="font-calibri" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-calibri font-semibold">Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} className="font-calibri" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-calibri font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter publication description" 
                      {...field} 
                      className="font-calibri min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold font-calibri">Publication File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 font-calibri">
                    {selectedFile ? selectedFile.name : 'Click to upload PDF or DOC file'}
                  </p>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-semibold font-calibri">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="font-calibri"
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-calibri">
                    {tag}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="font-calibri">
                Cancel
              </Button>
              <Button type="submit" className="font-calibri">
                {mode === 'create' ? 'Create Publication' : 'Update Publication'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PublicationForm;
