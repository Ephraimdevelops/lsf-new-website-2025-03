
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewsForm from './NewsForm';
import { supabase } from '@/lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
  featured?: boolean;
  image?: string;
}

const AdminNews = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [openForm, setOpenForm] = useState(false);

  const filteredNews = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNews = (id: string) => {
    setNewsItems(newsItems.filter(item => item.id !== id));
    toast({
      title: "News Deleted",
      description: "The news item has been deleted successfully.",
    });
  };

  const handleEditNews = (id: string) => {
    // In a real application, this would open an edit form
    toast({
      title: "Edit News",
      description: `Editing news item: ${id}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold font-panton">News Management</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search news..."
              className="pl-8 font-calibri"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="shrink-0 gap-1 font-calibri" onClick={() => setOpenForm(true)}>
            <Plus size={16} /> Add News
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-panton">News Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNews.length > 0 ? (
              filteredNews.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium font-calibri">{item.title}</h3>
                    <p className="text-sm text-gray-500 font-calibri">Published: {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditNews(item.id)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteNews(item.id)}
                    >
                      <Trash size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 font-calibri">
                No news items found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <NewsForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onCreated={(news) => setNewsItems((items) => [news, ...items])}
      />
    </div>
  );
};

export default AdminNews;
