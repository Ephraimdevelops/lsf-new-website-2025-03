import { useState } from 'react';
import { useHeroSlides, usePublications, useNews, useOpportunities, useSuccessStories } from '@/hooks/useContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSlide, Publication, NewsItem, Opportunity, SuccessStory } from '@/services/contentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import contentService from '@/services/contentService';

interface ContentFormProps<T> {
  initialData?: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  type: 'hero' | 'publication' | 'news' | 'opportunity' | 'story';
}

function ContentForm<T>({ initialData, onSubmit, onCancel, type }: ContentFormProps<T>) {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await contentService.uploadFile(file, type);
        setFormData({ ...formData, imageUrl: url });
      } catch (err) {
        setError('Failed to upload file');
      }
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'hero':
        return (
          <>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleFileChange} />
              <Label htmlFor="ctaText">CTA Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText || ''}
                onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
              />
              <Label htmlFor="ctaLink">CTA Link</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink || ''}
                onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
              />
            </div>
          </>
        );
      // Add other form types here
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {renderFields()}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

export default function ContentManagement() {
  const { slides, updateSlide } = useHeroSlides();
  const { publications, updatePublication } = usePublications();
  const { news, updateNewsItem } = useNews();
  const { opportunities, updateOpportunity } = useOpportunities();
  const { stories, updateStory } = useSuccessStories();
  
  const [selectedTab, setSelectedTab] = useState('hero');
  const [editItem, setEditItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (item: any, type: string) => {
    setEditItem(item);
    setSelectedTab(type);
    setIsDialogOpen(true);
  };

  const handleCreate = (type: string) => {
    setEditItem(null);
    setSelectedTab(type);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      switch (selectedTab) {
        case 'hero':
          await updateSlide(data);
          break;
        case 'publications':
          await updatePublication(data);
          break;
        case 'news':
          await updateNewsItem(data);
          break;
        case 'opportunities':
          await updateOpportunity(data);
          break;
        case 'stories':
          await updateStory(data);
          break;
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="hero">Hero Slides</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Hero Slides</h2>
              <DialogTrigger asChild>
                <Button onClick={() => handleCreate('hero')}>Add New Slide</Button>
              </DialogTrigger>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map((slide) => (
                <Card key={slide.id}>
                  <CardHeader>
                    <CardTitle>{slide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-48 object-cover mb-4" />
                    <p className="line-clamp-3">{slide.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(slide, 'hero')}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await contentService.deleteHeroSlide(slide.id);
                          // Refresh slides
                        } catch (error) {
                          console.error('Error deleting slide:', error);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="publications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Publications</h2>
              <DialogTrigger asChild>
                <Button onClick={() => handleCreate('publications')}>Add New Publication</Button>
              </DialogTrigger>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publications.map((publication) => (
                <Card key={publication.id}>
                  <CardHeader>
                    <CardTitle>{publication.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={publication.coverImageUrl} alt={publication.title} className="w-full h-48 object-cover mb-4" />
                    <p className="line-clamp-3">{publication.description}</p>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Category: {publication.category}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(publication, 'publications')}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await contentService.deletePublication(publication.id);
                          // Refresh publications
                        } catch (error) {
                          console.error('Error deleting publication:', error);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Similar structure for news, opportunities, and stories */}

        </Tabs>

        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>
              {editItem ? 'Edit Content' : 'Create New Content'}
            </DialogTitle>
          </DialogHeader>
          <ContentForm
            initialData={editItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            type={selectedTab as any}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
