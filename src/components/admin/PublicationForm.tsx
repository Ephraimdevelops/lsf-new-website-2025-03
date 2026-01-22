
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
import { X, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  date: z.string().min(1, "Date is required"),
  file: z.instanceof(File).optional(),
  coverImage: z.instanceof(File).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  language: z.string().default("English"),
  category: z.string().optional(),
});

type PublicationFormData = z.infer<typeof publicationSchema>;

interface Publication {
  _id: Id<"publications">;
  title: string;
  description: string;
  type: string;
  publishedDate: string;
  pdfUrl: string;
  coverImageUrl: string;
  category: string;
  authors?: string[];
  featured?: boolean;
}

interface PublicationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
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
  const [tags, setTags] = useState<string[]>(publication?.authors || []); // Using authors as tags for now based on schema mapping
  const [newTag, setNewTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const createPublication = useMutation(api.publications.create);
  const updatePublication = useMutation(api.publications.update);

  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: publication?.title || '',
      description: publication?.description || '',
      type: publication?.type || '',
      date: publication?.publishedDate || new Date().toISOString().split('T')[0],
      author: publication?.authors?.[0] || '',
      language: 'English',
      category: publication?.category || '',
      tags: publication?.authors || [],
    },
  });

  // Reset form when publication or mode changes
  useEffect(() => {
    if (mode === 'edit' && publication) {
      form.reset({
        title: publication.title,
        description: publication.description,
        type: publication.type,
        date: publication.publishedDate,
        author: publication.authors?.[0] || '',
        language: 'English',
        category: publication.category,
        tags: publication.authors || [],
      });
      setTags(publication.authors || []);
    } else if (mode === 'create') {
      form.reset({
        title: '',
        description: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        author: '',
        language: 'English',
        category: '',
        tags: [],
      });
      setTags([]);
      setSelectedFile(null);
      setSelectedCoverImage(null);
    }
  }, [publication, mode, form]);

  const handleUpload = async (file: File) => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error(`Upload failed: ${result.statusText}`);
      const { storageId } = await result.json();
      return storageId;
    } catch (e) {
      console.error("Upload error:", e);
      throw e;
    }
  };

  const handleSubmit = async (data: PublicationFormData) => {
    try {
      setSubmitting(true);
      let pdfUrl = publication?.pdfUrl || '';
      let coverImageUrl = publication?.coverImageUrl || '';
      let coverImageStorageId: string | undefined = undefined;

      // Validation: Require PDF for new publications
      if (mode === 'create' && !selectedFile) {
        toast({ title: "PDF Required", description: "Please upload a PDF file for the publication.", variant: "destructive" });
        setSubmitting(false);
        return;
      }

      if (selectedFile) {
        if (selectedFile.size > 20 * 1024 * 1024) { // 20MB limit for PDFs
          toast({ title: "File too large", description: "PDF must be less than 20MB", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        pdfUrl = await handleUpload(selectedFile); // Returns storageId
      }

      if (selectedCoverImage) {
        if (selectedCoverImage.size > 2 * 1024 * 1024) { // 2MB limit for images
          toast({ title: "File too large", description: "Cover image must be less than 2MB", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const id = await handleUpload(selectedCoverImage);
        coverImageStorageId = id;
        coverImageUrl = ''; // Clear legacy URL if new upload
      }

      const publicationData = {
        title: data.title,
        description: data.description,
        type: data.type,
        publishedDate: data.date,
        pdfUrl,
        coverImageUrl: coverImageStorageId ? undefined : coverImageUrl,
        coverImageStorageId: coverImageStorageId,
        category: data.category || 'General',
        authors: tags.length > 0 ? tags : (data.author ? [data.author] : []),
        featured: false,
      };

      if (mode === 'create') {
        await createPublication(publicationData);
      } else if (publication) {
        await updatePublication({
          id: publication._id,
          ...publicationData,
        });
      }

      onSubmit({});
      toast({
        title: mode === 'create' ? "Publication Created" : "Publication Updated",
        description: `The publication has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
      });
      onClose();
    } catch (err) {
      console.error('Publication submit error:', err);
      toast({ title: 'Failed to save publication', variant: 'destructive' });
    } finally {
      setSubmitting(false);
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

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedCoverImage(file);
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
                    <FormLabel className="font-calibri font-semibold">Author (Primary)</FormLabel>
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

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold font-calibri">Publication File (PDF)</label>
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
                      {selectedFile ? selectedFile.name : 'Click to upload PDF'}
                    </p>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold font-calibri">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 font-calibri">
                      {selectedCoverImage ? selectedCoverImage.name : 'Click to upload Cover'}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Tags/Authors */}
            <div className="space-y-3">
              <label className="text-sm font-semibold font-calibri">Additional Authors / Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add author/tag"
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
              <Button type="submit" disabled={submitting} className="font-calibri">
                {submitting ? 'Saving...' : (mode === 'create' ? 'Create Publication' : 'Update Publication')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PublicationForm;
