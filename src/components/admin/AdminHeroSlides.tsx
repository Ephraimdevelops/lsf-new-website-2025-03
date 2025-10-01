import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Image, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { HeroSlide } from '@/components/home/hero/types';
import api from '@/lib/axios';
import { supabase } from '@/lib/supabase';

const AdminHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    image: '',
    stat: '',
    statLabel: ''
  });
  const { toast } = useToast();

  const loadSlides = useCallback(async () => {
    try {
      const response = await api.get('/hero');
      setSlides(response.data.hero || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load hero slides.' });
    }
  }, [toast]);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  const saveSlides = async (updatedSlides: HeroSlide[]) => {
    try {
      // For each slide, upsert (create or update)
      await Promise.all(updatedSlides.map(async (slide, index) => {
        const payload: {
          id?: string;
          title: string;
          subtitle: string;
          description: string;
          category?: string;
          image?: string;
          stat?: string;
          stat_label?: string;
          order: number;
        } = {
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          category: slide.category,
          image: slide.image,
          stat: slide.stat,
          stat_label: slide.statLabel,
          order: index + 1,
        };
        if (slide.id) {
          await api.put(`/hero/${slide.id}`, payload);
        } else {
          await api.post('/hero', payload);
        }
      }));
      setSlides(updatedSlides);
      toast({ title: 'Success', description: 'Hero slides updated successfully' });
      loadSlides();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save hero slides.' });
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.subtitle || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const slideData: HeroSlide = {
      id: editingSlide?.id || `slide-${Date.now()}`,
      title: formData.title!,
      subtitle: formData.subtitle!,
      description: formData.description!,
      category: formData.category || 'General',
      image: formData.image || '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
      stat: formData.stat || '1000+',
      statLabel: formData.statLabel || 'People Helped'
    };

    let updatedSlides;
    if (editingSlide) {
      updatedSlides = slides.map(slide => 
        slide.id === editingSlide.id ? slideData : slide
      );
    } else {
      if (slides.length >= 5) {
        toast({
          title: "Maximum Reached",
          description: "You can only have a maximum of 5 hero slides",
          variant: "destructive",
        });
        return;
      }
      updatedSlides = [...slides, slideData];
    }

    saveSlides(updatedSlides);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (slides.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one hero slide",
        variant: "destructive",
      });
      return;
    }

    const updatedSlides = slides.filter(slide => slide.id !== id);
    saveSlides(updatedSlides);
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
      image: '',
      stat: '',
      statLabel: ''
    });
    setIsDialogOpen(false);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const objectName = `hero/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(objectName, file, {
        cacheControl: '3600', upsert: false,
      });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(objectName);
      return data?.publicUrl || '';
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to upload image.' 
      });
      throw error;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await handleImageUpload(file);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        toast({ title: 'Success', description: 'Image uploaded successfully.' });
      } catch (error) {
        console.error(error);
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
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter slide title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle *</label>
                <Input
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder="Enter slide subtitle"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g., Legal Empowerment"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter slide description"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {formData.image && (
                  <p className="text-xs text-gray-500 mt-1 break-all">{formData.image}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Statistic</label>
                  <Input
                    value={formData.stat || ''}
                    onChange={(e) => setFormData({...formData, stat: e.target.value})}
                    placeholder="e.g., 426,000+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Statistic Label</label>
                  <Input
                    value={formData.statLabel || ''}
                    onChange={(e) => setFormData({...formData, statLabel: e.target.value})}
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
          <Card key={slide.id}>
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
                  onClick={() => handleDelete(slide.id)}
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
                  {slide.image ? (
                    <img 
                      src={slide.image} 
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
