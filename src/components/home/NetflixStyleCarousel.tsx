import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Eye, Download, FileText, Newspaper, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { supabaseService } from '@/services/api/supabaseService';
import { News, Publication } from '@/types';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedDate: string;
  category: string;
  type: 'news' | 'publication';
  featured?: boolean;
  downloadUrl?: string;
  readTime?: string;
}

const NetflixStyleCarousel = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'publications'>('news');
  const [newsData, setNewsData] = useState<ContentItem[]>([]);
  const [publicationsData, setPublicationsData] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [newsResponse, publicationsResponse] = await Promise.all([
          supabaseService.getFeaturedNews(10),
          supabaseService.getFeaturedPublications(10)
        ]);
        
        // Transform news data
        const transformedNews: ContentItem[] = newsResponse.map((item: News) => ({
          id: item.id,
          title: item.title,
          description: item.content.substring(0, 150) + '...',
          imageUrl: item.imageUrl || '/lovable-uploads/placeholder.svg',
          publishedDate: item.publishedDate,
          category: item.category || 'Legal News',
          type: 'news' as const,
          featured: item.featured,
          readTime: '5 min read'
        }));

        // Transform publications data
        const transformedPublications: ContentItem[] = publicationsResponse.map((item: Publication) => ({
          id: item.id,
          title: item.title,
          description: item.description || item.content.substring(0, 150) + '...',
          imageUrl: item.coverImageUrl || '/lovable-uploads/placeholder.svg',
          publishedDate: item.publishedDate,
          category: item.type || 'Research',
          type: 'publication' as const,
          featured: item.featured,
          downloadUrl: item.pdfUrl,
          readTime: item.pages ? `${item.pages} pages` : 'Report'
        }));
        
        setNewsData(transformedNews);
        setPublicationsData(transformedPublications);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentData = activeTab === 'news' ? newsData : publicationsData;
  const featuredItem = currentData.find(item => item.featured) || currentData[0];
  const otherItems = currentData.filter(item => item.id !== featuredItem?.id);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background">
        <Container size="2xl" className="relative z-10">
          <div className="animate-pulse">
            <div className="h-12 w-1/3 bg-neutral-200 rounded mb-8"></div>
            <div className="h-64 w-full bg-neutral-200 rounded mb-8"></div>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-48 w-80 bg-neutral-200 rounded"></div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-secondary-orange/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            <div>
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-6 border border-primary/20">
                <div className="w-3 h-3 bg-secondary-orange rounded-full animate-pulse"></div>
                <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                  Latest Content
                </Typography>
              </div>
              
              <Typography 
                variant="h2" 
                className="mb-4 text-4xl md:text-5xl font-bold"
              >
                Stay Informed with
                <span className="block bg-gradient-to-r from-primary to-secondary-orange bg-clip-text text-transparent">
                  Legal Insights
                </span>
              </Typography>
              
              <Typography variant="body" className="text-xl text-muted-foreground max-w-2xl">
                Discover the latest legal developments, research, and stories that shape justice in Tanzania.
              </Typography>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 bg-neutral-100 rounded-2xl p-2 mt-8 lg:mt-0">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'news'
                    ? 'bg-white text-primary shadow-lg'
                    : 'text-neutral-600 hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  News
                </div>
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'publications'
                    ? 'bg-white text-primary shadow-lg'
                    : 'text-neutral-600 hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Publications
                </div>
              </button>
            </div>
          </div>

          {/* Featured Item */}
          {featuredItem && (
            <div className="mb-16">
              <div className="relative group">
                <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={featuredItem.imageUrl}
                    alt={featuredItem.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>

                {/* Featured Badge */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary text-white px-4 py-2 text-sm font-semibold">
                    Featured {activeTab === 'news' ? 'News' : 'Publication'}
                  </Badge>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {featuredItem.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate(featuredItem.publishedDate)}</span>
                      </div>
                      {featuredItem.readTime && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{featuredItem.readTime}</span>
                        </div>
                      )}
                    </div>

                    <Typography 
                      variant="h3" 
                      className="text-white mb-4 text-2xl lg:text-3xl font-bold leading-tight"
                    >
                      {featuredItem.title}
                    </Typography>

                    <Typography 
                      variant="body" 
                      className="text-white/90 mb-6 text-lg leading-relaxed"
                    >
                      {featuredItem.description}
                    </Typography>

                    <div className="flex gap-4">
                      <Button 
                        size="lg" 
                        className="bg-white text-primary hover:bg-white/90 font-semibold group"
                      >
                        {activeTab === 'news' ? 'Read Article' : 'Download PDF'}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      {activeTab === 'news' && (
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="border-white/30 text-white hover:bg-white hover:text-primary"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Watch
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Carousel */}
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h4" className="text-2xl font-bold">
                More {activeTab === 'news' ? 'News' : 'Publications'}
              </Typography>
              
              <div className="flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-neutral-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-neutral-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {otherItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex-shrink-0 w-80 group transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-neutral-500 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.publishedDate)}
                        </div>
                      </div>

                      <Typography 
                        variant="h5" 
                        className="mb-3 text-lg font-bold leading-tight group-hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Typography>

                      <Typography 
                        variant="body" 
                        className="text-neutral-600 text-sm leading-relaxed mb-4"
                      >
                        {item.description}
                      </Typography>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-500 text-sm">
                          {activeTab === 'news' ? (
                            <>
                              <Eye className="h-4 w-4" />
                              <span>1.2K views</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              <span>PDF</span>
                            </>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-primary hover:text-primary-dark font-semibold"
                        >
                          {activeTab === 'news' ? 'Read' : 'Download'}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg font-semibold"
            >
              View All {activeTab === 'news' ? 'News' : 'Publications'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default NetflixStyleCarousel;
