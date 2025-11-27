
import { useState } from 'react';
import { ArrowRight, Calendar, Clock, ChevronRight, Download, FileText, Eye, BookOpen, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { News, Publication } from '@/types';

const EnhancedNewsSection = () => {
  const [activeTab, setActiveTab] = useState('news');

  const news = useQuery(api.news.getFeatured) || [];
  const publications = useQuery(api.publications.getFeatured) || [];

  // Map to component types
  const newsData: News[] = news.slice(0, 3).map(item => ({
    id: item._id,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    image: item.image,
    date: item.date,
    category: item.category,
    readTime: '3 min read', // Default
    featured: item.featured,
    slug: item.slug || item._id
  }));

  const publicationsData: Publication[] = publications.slice(0, 3).map(item => ({
    id: item._id,
    title: item.title,
    excerpt: item.description, // Map description to excerpt
    description: item.description,
    image: item.coverImageUrl,
    date: item.publishedDate,
    category: item.category,
    type: item.type as any, // Cast to any to match specific union type
    downloadCount: item.downloadCount || 0,
    fileSize: '2.5 MB', // Default
    featured: item.featured,
    file: item.pdfUrl
  }));

  const isLoading = news === undefined || publications === undefined;

  const currentData = activeTab === 'news' ? newsData : publicationsData;
  const mainItem = currentData[0];
  const sideItems = currentData.slice(1);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-4"></div>
            <span className="font-bold text-lg tracking-widest text-primary">
              LATEST UPDATES
            </span>
          </div>
          <h2 className="mb-8 text-5xl md:text-6xl font-bold">
            News & <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Developments
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about our latest initiatives, partnerships, and impact stories from across Tanzania.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-muted rounded-full">
            <button
              onClick={() => setActiveTab('news')}
              className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'news'
                ? 'bg-primary text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Newspaper className="mr-2 h-4 w-4" />
              Latest News
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'publications'
                ? 'bg-primary text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Publications
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {currentData.length > 0 ? (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Featured Content */}
            <div className="lg:col-span-3">
              <Card className="group overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/50 backdrop-blur-sm">
                <div className="relative">
                  <img
                    src={mainItem.image || '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png'}
                    alt={mainItem.title}
                    className="w-full h-[24rem] lg:h-[28rem] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm text-white px-4 py-2 text-sm font-medium">
                    {activeTab === 'news' ? (mainItem as News).category : (mainItem as Publication).category}
                  </Badge>
                  <div className="absolute bottom-8 left-6 right-6">
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                      {mainItem.title}
                    </h3>
                    <div className="flex items-center text-white/90 text-base gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {new Date(mainItem.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      {activeTab === 'news' ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          {(mainItem as News).readTime || '3 min read'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Download className="h-5 w-5" />
                          {(mainItem as Publication).downloadCount?.toLocaleString() || 0} downloads
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                    {mainItem.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    {activeTab === 'publications' && (
                      <div className="flex items-center gap-6 text-base text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {(mainItem as Publication).fileSize || '2.5 MB'}
                        </span>
                        <span className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          {(mainItem as Publication).downloadCount?.toLocaleString() || 0} views
                        </span>
                      </div>
                    )}
                    <Link to={activeTab === 'news' ? `/news/${mainItem.id}` : `/publications/${mainItem.id}`}>
                      <Button size="lg" className="group/btn ml-auto px-8 py-4 text-base">
                        {activeTab === 'news' ? (
                          <>
                            Read Full Story
                            <ArrowRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            <Download className="mr-3 h-5 w-5" />
                            Download
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Content */}
            <div className="lg:col-span-2 space-y-6">
              {sideItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                  <div className="relative">
                    <img
                      src={item.image || '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png'}
                      alt={item.title}
                      className="w-full h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-secondary-teal/90 backdrop-blur-sm text-white px-3 py-1 text-sm">
                      {activeTab === 'news' ? (item as News).category : (item as Publication).category}
                    </Badge>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="font-bold text-lg text-white mb-2 leading-tight drop-shadow-md group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center text-white/90 text-sm gap-3">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        {activeTab === 'news' ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {(item as News).readTime || '3 min read'}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {(item as Publication).downloadCount?.toLocaleString() || 0}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                    <Link to={activeTab === 'news' ? `/news/${item.id}` : `/publications/${item.id}`}>
                      <Button variant="ghost" className="w-full mt-4 group/btn justify-between">
                        {activeTab === 'news' ? 'Read More' : 'View Publication'}
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No {activeTab} available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        {currentData.length > 0 && (
          <div className="text-center mt-12">
            <Link to={activeTab === 'news' ? '/news' : '/publications'}>
              <Button size="lg" variant="outline" className="px-8 py-3">
                View All {activeTab === 'news' ? 'News' : 'Publications'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedNewsSection;