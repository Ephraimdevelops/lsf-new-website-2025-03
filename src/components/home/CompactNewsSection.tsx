import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, Newspaper, FileText, Eye, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { supabaseService } from '@/services/api/supabaseService';
import { News, Publication } from '@/types';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedDate: string;
  category: string;
  type: 'news' | 'publication';
  featured?: boolean;
  readTime?: string;
  views?: number;
  trending?: boolean;
}

const CompactNewsSection = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'publications'>('news');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Mock data - always visible with Netflix/Google styling
  const mockNewsData: ContentItem[] = [
    {
      id: '1',
      title: 'LSF Launches Digital Legal Aid Platform',
      description: 'Revolutionary platform connecting rural communities with legal professionals across Tanzania.',
      imageUrl: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      publishedDate: '2024-01-15',
      category: 'Innovation',
      type: 'news',
      featured: true,
      readTime: '4 min',
      views: 1250,
      trending: true
    },
    {
      id: '2',
      title: 'Women\'s Land Rights Initiative Reaches 10K+',
      description: 'Empowering women across 15 regions with essential legal knowledge and support.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-12',
      category: 'Gender Justice',
      type: 'news',
      featured: true,
      readTime: '3 min',
      views: 890,
      trending: false
    },
    {
      id: '3',
      title: 'Climate Justice Program Expands Nationwide',
      description: 'Protecting environmental rights across all coastal regions in Tanzania.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-10',
      category: 'Climate',
      type: 'news',
      featured: false,
      readTime: '5 min',
      views: 650,
      trending: false
    },
    {
      id: '4',
      title: '500+ Paralegals Graduate Training Program',
      description: 'Expanding community legal support network across Tanzania.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-08',
      category: 'Training',
      type: 'news',
      featured: true,
      readTime: '6 min',
      views: 720,
      trending: true
    },
    {
      id: '5',
      title: 'Digital Transformation Reaches Rural Areas',
      description: 'Bridging the digital divide in legal services for 100+ communities.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-05',
      category: 'Technology',
      type: 'news',
      featured: false,
      readTime: '4 min',
      views: 580,
      trending: false
    },
    {
      id: '6',
      title: 'Government Partnership Strengthens Legal Aid',
      description: 'New collaboration reaching 50,000+ people in Q1 2024.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-03',
      category: 'Partnership',
      type: 'news',
      featured: true,
      readTime: '5 min',
      views: 920,
      trending: true
    }
  ];

  const mockPublicationsData: ContentItem[] = [
    {
      id: '1',
      title: 'Access to Justice in Rural Tanzania',
      description: 'Comprehensive study examining challenges and opportunities for justice in rural communities.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-20',
      category: 'Research',
      type: 'publication',
      featured: true,
      readTime: '45 pages',
      views: 2100,
      trending: true
    },
    {
      id: '2',
      title: 'Women\'s Legal Rights Handbook',
      description: 'Practical guide covering land ownership, inheritance, and protection from violence.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-18',
      category: 'Guide',
      type: 'publication',
      featured: true,
      readTime: '32 pages',
      views: 1850,
      trending: false
    },
    {
      id: '3',
      title: 'Climate Justice and Community Rights',
      description: 'Exploring intersection of climate change and legal rights for communities.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-15',
      category: 'Policy',
      type: 'publication',
      featured: false,
      readTime: '28 pages',
      views: 1200,
      trending: false
    },
    {
      id: '4',
      title: 'Digital Legal Services in Africa',
      description: 'Analysis of technology adoption in legal aid across African countries.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-12',
      category: 'Research',
      type: 'publication',
      featured: true,
      readTime: '52 pages',
      views: 1650,
      trending: true
    }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        
        // Always use mock data for now to ensure visibility
        setContent(activeTab === 'news' ? mockNewsData : mockPublicationsData);
        
        // Try to fetch real data in background (optional)
        try {
          if (activeTab === 'news') {
            const realNews = await supabaseService.getFeaturedNews(10);
            if (realNews && realNews.length > 0) {
              const transformedNews: ContentItem[] = realNews.map((item: News) => ({
                id: item.id || '',
                title: item.title,
                description: item.content?.substring(0, 100) + '...' || 'Read more...',
                imageUrl: item.image || '/lovable-uploads/placeholder.svg',
                publishedDate: item.date || new Date().toISOString(),
                category: item.category || 'News',
                type: 'news' as const,
                featured: item.featured,
                readTime: '5 min',
                views: Math.floor(Math.random() * 2000),
                trending: Math.random() > 0.7
              }));
              setContent(transformedNews);
            }
          } else {
            const realPublications = await supabaseService.getFeaturedPublications(10);
            if (realPublications && realPublications.length > 0) {
              const transformedPublications: ContentItem[] = realPublications.map((item: Publication) => ({
                id: item.id || '',
                title: item.title,
                description: item.description || 'Read more...',
                imageUrl: item.image || '/lovable-uploads/placeholder.svg',
                publishedDate: item.date || new Date().toISOString(),
                category: item.type || 'Publication',
                type: 'publication' as const,
                featured: item.featured,
                readTime: item.pages ? `${item.pages} pages` : 'Report',
                views: Math.floor(Math.random() * 1500),
                trending: Math.random() > 0.6
              }));
              setContent(transformedPublications);
            }
          }
        } catch (error) {
          console.log('Using mock data');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent(activeTab === 'news' ? mockNewsData : mockPublicationsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const itemsPerView = 4;
  const maxIndex = Math.max(0, content.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'innovation': return 'bg-primary/10 text-primary border-primary/20';
      case 'gender justice': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'climate': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'training': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'technology': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'partnership': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'research': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'guide': return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
      case 'policy': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-neutral-50">
        <Container size="2xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-neutral-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 bg-primary/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            {activeTab === 'news' ? (
              <Newspaper className="h-6 w-6 text-primary animate-pulse" />
            ) : (
              <FileText className="h-6 w-6 text-primary animate-pulse" />
            )}
            <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
              {activeTab === 'news' ? 'Latest News' : 'Publications'}
            </Typography>
          </div>
          
          <Typography 
            variant="h2" 
            className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            Stay Informed with
            <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
              Latest Updates
            </span>
          </Typography>
          
          <Typography 
            variant="body" 
            className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
          >
            Discover the latest news, publications, and insights driving justice reform across Tanzania.
          </Typography>

          {/* Tab switcher */}
          <div className="flex justify-center">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'news'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                News
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'publications'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Publications
              </button>
            </div>
          </div>
        </div>

          {/* Navigation arrows */}
          {content.length > itemsPerView && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-white shadow-sm border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-2 rounded-full bg-white shadow-sm border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        {/* Content Grid - Netflix-style horizontal scroll */}
        <div className="relative">
          <div 
            className="flex gap-4 sm:gap-6 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {content.map((item, index) => (
              <div
                key={item.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/4 group cursor-pointer"
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100">
                  {/* Image with overlay */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                      }}
                    />
                    
                    {/* Overlay badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.featured && (
                        <Badge className="bg-primary text-white text-xs px-2 py-1">
                          Featured
                        </Badge>
                      )}
                      {item.trending && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-1 ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </Badge>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <Typography variant="h4" className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </Typography>

                    <Typography variant="body" className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </Typography>

                    {/* Meta info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="hidden sm:inline">{formatDate(item.publishedDate)}</span>
                          <span className="sm:hidden">{new Date(item.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.readTime}
                        </div>
                      </div>
                      
                      {item.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View all button */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            View All {activeTab === 'news' ? 'News' : 'Publications'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default CompactNewsSection;
