
import { useState } from 'react';
import { Plus, Edit, Trash2, Image, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface HeroSlide {
  _id: Id<"hero_slides">;
  title: string;
  subtitle?: string;
  description: string;
  category?: string;
  imageUrl: string;
  stat?: string;
  statLabel?: string;
  order: number;
  isActive: boolean;
}

const AdminHeroSlides = () => {
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    imageUrl: '',
    stat: '',
    statLabel: ''
  });
  const { toast } = useToast();

  const slides = useQuery(api.hero.get) || [];
  const createSlide = useMutation(api.hero.create);
  const updateSlide = useMutation(api.hero.update);
  const deleteSlide = useMutation(api.hero.remove);
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSlide) {
        await updateSlide({
          id: editingSlide._id,
          title: formData.title!,
          subtitle: formData.subtitle,
          description: formData.description!,
          category: formData.category,
          imageUrl: formData.imageUrl || '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
          stat: formData.stat,
          statLabel: formData.statLabel,
          order: editingSlide.order,
          isActive: editingSlide.isActive,
        });
        toast({ title: 'Success', description: 'Hero slide updated successfully' });
      } else {
        if (slides.length >= 5) {
          toast({
            title: "Maximum Reached",
            description: "You can only have a maximum of 5 hero slides",
            variant: "destructive",
          });
          return;
        }
        await createSlide({
          title: formData.title!,
          subtitle: formData.subtitle,
          description: formData.description!,
          category: formData.category,
          imageUrl: formData.imageUrl || '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
          stat: formData.stat,
          statLabel: formData.statLabel,
          order: slides.length + 1,
          isActive: true,
        });
        toast({ title: 'Success', description: 'Hero slide created successfully' });
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to save hero slide.' });
    }
  };

  const handleDelete = async (id: Id<"hero_slides">) => {
    if (slides.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one hero slide",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteSlide({ id });
      toast({ title: 'Success', description: 'Hero slide deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete hero slide.' });
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData(slide);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      category: '',
      imageUrl: '',
      stat: '',
      statLabel: ''
    });
    setIsDialogOpen(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        // Assuming we store storageId as imageUrl for now. 
        // Ideally we'd get a public URL or use a Convex helper to display it.
        setFormData((prev) => ({ ...prev, imageUrl: storageId }));
        toast({ title: 'Success', description: 'Image uploaded successfully.' });
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to upload image.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hero Slides Management</h1>
          <p className="text-gray-600 mt-2">Manage your homepage hero carousel slides (Maximum: 5 slides)</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              disabled={slides.length >= 5}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Slide {slides.length >= 5 && '(Max Reached)'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter slide title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <Input
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Enter slide subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Legal Empowerment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter slide description"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {formData.imageUrl && (
                  <p className="text-xs text-gray-500 mt-1 break-all">{formData.imageUrl}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Statistic</label>
                  <Input
                    value={formData.stat || ''}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                    placeholder="e.g., 426,000+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Statistic Label</label>
                  <Input
                    value={formData.statLabel || ''}
                    onChange={(e) => setFormData({ ...formData, statLabel: e.target.value })}
                    placeholder="e.g., Lives Transformed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {slides.map((slide, index) => (
          <Card key={slide._id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                  Slide {index + 1}
                </span>
                {slide.title}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(slide)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(slide._id)}
                  disabled={slides.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Category:</strong> {slide.category}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Subtitle:</strong> {slide.subtitle}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Description:</strong> {slide.description.substring(0, 150)}...
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Stat:</strong> {slide.stat} {slide.statLabel}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  {slide.imageUrl ? (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full max-w-xs h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full max-w-xs h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminHeroSlides;
