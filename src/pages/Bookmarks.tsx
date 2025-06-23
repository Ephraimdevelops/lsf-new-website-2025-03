
import { useState } from 'react';
import { Bookmark, Search, Trash2, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBookmarks } from '@/hooks/useBookmarks';
import BookmarkButton from '@/components/shared/BookmarkButton';
import Typography from '@/components/shared/Typography';
import { Container } from '@/components/design-system';

const Bookmarks = () => {
  const { bookmarks, clearAllBookmarks, getBookmarksByType, count } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabBookmarks = activeTab === 'all' ? filteredBookmarks : 
    filteredBookmarks.filter(b => b.type === activeTab);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      news: 'News',
      publication: 'Publication',
      program: 'Program',
      opportunity: 'Opportunity'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      news: 'bg-blue-100 text-blue-800',
      publication: 'bg-green-100 text-green-800',
      program: 'bg-purple-100 text-purple-800',
      opportunity: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (count === 0 && !searchQuery) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <Container>
            <div className="text-center py-16">
              <Bookmark size={64} className="mx-auto text-gray-400 mb-6" />
              <Typography variant="h1" className="text-3xl font-bold text-gray-900 mb-4">
                No Bookmarks Yet
              </Typography>
              <Typography variant="body" className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Start bookmarking content you want to read later. Look for the bookmark icon on articles, publications, and programs.
              </Typography>
              <Button asChild size="lg">
                <Link to="/">
                  Explore Content
                </Link>
              </Button>
            </div>
          </Container>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Typography variant="h1" className="text-3xl font-bold text-gray-900 mb-2">
                  My Bookmarks
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  {count} saved {count === 1 ? 'item' : 'items'}
                </Typography>
              </div>
              {count > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all bookmarks?')) {
                      clearAllBookmarks();
                    }
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({count})
              </TabsTrigger>
              <TabsTrigger value="news">
                News ({getBookmarksByType('news').length})
              </TabsTrigger>
              <TabsTrigger value="publication">
                Publications ({getBookmarksByType('publication').length})
              </TabsTrigger>
              <TabsTrigger value="program">
                Programs ({getBookmarksByType('program').length})
              </TabsTrigger>
              <TabsTrigger value="opportunity">
                Opportunities ({getBookmarksByType('opportunity').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {tabBookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Filter size={48} className="mx-auto text-gray-400 mb-4" />
                  <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </Typography>
                  <Typography variant="body" className="text-gray-600">
                    {searchQuery ? `No bookmarks match "${searchQuery}"` : `No ${activeTab} bookmarks yet`}
                  </Typography>
                </div>
              ) : (
                <div className="grid gap-6">
                  {tabBookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {bookmark.image && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                              <img
                                src={bookmark.image}
                                alt={bookmark.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <Link
                                  to={bookmark.url}
                                  className="block hover:text-primary transition-colors"
                                >
                                  <Typography variant="h3" className="text-lg font-semibold line-clamp-2 mb-2">
                                    {bookmark.title}
                                  </Typography>
                                </Link>
                                {bookmark.description && (
                                  <Typography variant="body" className="text-gray-600 line-clamp-2">
                                    {bookmark.description}
                                  </Typography>
                                )}
                              </div>
                              
                              <BookmarkButton
                                id={bookmark.id}
                                type={bookmark.type}
                                title={bookmark.title}
                                url={bookmark.url}
                                description={bookmark.description}
                                image={bookmark.image}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge className={getTypeColor(bookmark.type)} variant="secondary">
                                  {getTypeLabel(bookmark.type)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Saved {formatDate(bookmark.bookmarkedAt)}
                                </span>
                              </div>
                              
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={bookmark.url}>
                                  <ExternalLink size={16} className="mr-2" />
                                  View
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Container>
      </div>
    </Layout>
  );
};

export default Bookmarks;
