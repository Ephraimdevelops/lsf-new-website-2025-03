
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash, Eye, Calendar, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewsForm from './NewsForm';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface NewsItem {
  _id: Id<"news">;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
  featured?: boolean;
  image?: string;
  content?: string;
  author?: string;
}

const AdminNews = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const newsItems = useQuery(api.news.get) || [];
  const deleteNews = useMutation(api.news.remove);

  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNews = async (id: Id<"news">) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;

    try {
      await deleteNews({ id });
      toast({
        title: "News Deleted",
        description: "The news item has been deleted successfully.",
      });
    } catch (err) {
      console.error("Failed to delete news:", err);
      toast({
        title: "Error",
        description: "Failed to delete news item.",
        variant: "destructive"
      });
    }
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingNews(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-gray-500 text-sm mt-1">Create, edit, and manage news articles</p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search news..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpenForm(true)} className="gap-2 shrink-0">
            <Plus size={16} /> Add News
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{newsItems.length}</div>
            <p className="text-sm text-gray-500">Total Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {newsItems.filter(n => n.featured).length}
            </div>
            <p className="text-sm text-gray-500">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {new Set(newsItems.map(n => n.category).filter(Boolean)).size}
            </div>
            <p className="text-sm text-gray-500">Categories</p>
          </CardContent>
        </Card>
      </div>

      {/* News List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNews.length > 0 ? (
            <div className="space-y-3">
              {filteredNews.map(item => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                      {item.featured && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      {item.category && (
                        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                          {item.category}
                        </span>
                      )}
                    </div>
                    {item.excerpt && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{item.excerpt}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/news/${item._id}`, '_blank')}
                      title="Preview"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNews(item)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteNews(item._id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No news articles found</p>
              <Button variant="outline" className="mt-4" onClick={() => setOpenForm(true)}>
                Create Your First Article
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <NewsForm
        open={openForm}
        onClose={handleCloseForm}
        onCreated={handleCloseForm}
        editData={editingNews}
      />
    </div>
  );
};

export default AdminNews;
