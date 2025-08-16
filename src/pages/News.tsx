import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingState from '../components/shared/LoadingState';
import ErrorState from '../components/shared/ErrorState';
import EnhancedSearch from '../components/shared/EnhancedSearch';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Filter, 
  ChevronDown, 
  Tag, 
  ArrowRight,
  Target,
  PlayCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { dataService } from '@/services/dataService';

// Sliding News Hero Component
const SlidingNewsHero = ({ featuredNews }: { featuredNews: any[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (featuredNews.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
      }, 8000); // Change slide every 8 seconds (slower)
      return () => clearInterval(interval);
    }
  }, [featuredNews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'innovation': return 'bg-primary text-white';
      case 'legal victory': return 'bg-secondary-teal text-white';
      case 'training': return 'bg-secondary-orange text-white';
      case 'outreach': return 'bg-secondary-yellow text-gray-800';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!featuredNews || featuredNews.length === 0) {
    return (
      <section className="relative h-[80vh] bg-gradient-to-br from-primary to-secondary-teal flex items-center">
        <Container size="xl" className="text-center text-white">
          <Newspaper className="h-16 w-16 mx-auto mb-6 opacity-50" />
          <Typography variant="h1" className="text-white mb-4">News & Updates</Typography>
          <Typography variant="body" className="text-white/90">Stay informed with our latest developments</Typography>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-full">
        {featuredNews.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-all duration-2000 ease-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
            </div>

            {/* Content */}
            <Container size="xl" className="relative z-10 h-full flex items-center">
              <div className="max-w-4xl text-white">
                {/* Category Badge */}
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(article.category)}`}>
                    <Tag className="h-4 w-4" />
                    {article.category.toUpperCase()}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center text-white/80 mb-4">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="text-lg">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {article.readTime && (
                    <>
                      <span className="mx-3">•</span>
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{article.readTime}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <Typography
                  variant="h1"
                  className="text-white mb-6 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]"
                >
                  {article.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body"
                  className="text-white/95 mb-8 text-lg md:text-xl max-w-3xl leading-relaxed [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]"
                >
                  {article.excerpt}
                </Typography>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/news/${article.id}`}>
                    <Button
                      size="lg"
                      className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                    >
                      Read Full Article
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onClick={() => {
                      document.getElementById('news-content')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                  >
                    Browse All News
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {featuredNews.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {featuredNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide 
                    ? 'w-12 h-3 bg-white rounded-full shadow-lg' 
                    : 'w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentSlide + 1} / {featuredNews.length}
          </div>
        </>
      )}
    </section>
  );
};

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use mock data instead of API calls
        const data = dataService.getNews();
        setNews(data);
        setFilteredNews(data);
        
        // Get featured news (latest 5 articles for the hero slider)
        const featured = data.slice(0, 5);
        setFeaturedNews(featured);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Enhanced search handler with loading state
  const handleSearch = async (term: string) => {
    setIsSearching(true);
    setSearchTerm(term);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const filtered = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(term.toLowerCase()) ||
                            item.excerpt.toLowerCase().includes(term.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
      });
      setFilteredNews(filtered);
      setIsSearching(false);
    }, 300);
  };

  // Filter news based on category
  useEffect(() => {
    const filtered = news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    setFilteredNews(filtered);
  }, [selectedCategory, news, searchTerm]);

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(news.map(item => item.category)))];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'innovation': return 'bg-primary/10 text-primary';
      case 'legal victory': return 'bg-secondary-teal/10 text-secondary-teal';
      case 'training': return 'bg-secondary-orange/10 text-secondary-orange';
      case 'outreach': return 'bg-secondary-yellow/10 text-secondary-yellow';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingState className="min-h-screen" text="Loading news articles..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState
          title="Failed to Load News"
          message={error}
          onRetry={() => window.location.reload()}
          className="min-h-screen"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Sliding News Hero Section */}
      <SlidingNewsHero featuredNews={featuredNews} />

      {/* Enhanced Search Section */}
      <section id="news-content" className="py-12 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Typography variant="h2" className="text-neutral-dark mb-4">
              All News Articles
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Explore all our news articles and stay updated with the latest developments in legal aid and access to justice.
            </Typography>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-grow lg:max-w-md">
              <EnhancedSearch
                placeholder="Search news articles..."
                onSearch={handleSearch}
                value={searchTerm}
                onChange={setSearchTerm}
                isLoading={isSearching}
                className="w-full"
              />
            </div>
            
            <div className="lg:ml-auto">
              <Collapsible
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                className="w-full lg:w-auto"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full lg:w-auto flex items-center justify-between gap-2 rounded-xl border-2 border-gray-200 hover:border-secondary-teal transition-colors px-6 py-3"
                  >
                    <Filter size={16} />
                    Filter by Category
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 lg:absolute lg:right-0 lg:mt-2 lg:bg-white lg:shadow-xl lg:rounded-2xl lg:p-6 lg:z-10 lg:min-w-[200px] lg:border lg:border-gray-200">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full rounded-xl border-2" id="category">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Filter Summary */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-6 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="px-4 py-2 bg-secondary-teal/10 text-secondary-teal border border-secondary-teal/20">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border border-primary/20">
                  Category: {selectedCategory}
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* News Grid with Loading State */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-16">
              <LoadingState text="Searching articles..." />
            </div>
          ) : filteredNews.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-neutral-dark mb-4">
                  {filteredNews.length} {filteredNews.length === 1 ? 'Article' : 'Articles'} Found
                </h2>
                <p className="text-neutral-gray">Latest news and updates from our work</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {filteredNews.map((article) => (
                  <Link 
                    key={article.id}
                    to={`/news/${article.id}`}
                    className="group block"
                  >
                    <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 hover:scale-[1.02]">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                          <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${getCategoryColor(article.category)}`}>
                            <Tag className="h-4 w-4 mr-2" />
                            {article.category.toUpperCase()}
                          </span>
                        </div>

                        {/* Read Time */}
                        {article.readTime && (
                          <div className="absolute top-6 right-6">
                            <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold bg-white/95 text-gray-700 shadow-lg">
                              <Clock className="h-4 w-4 mr-2" />
                              {article.readTime}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span className="font-medium">
                            {new Date(article.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-secondary-teal transition-colors duration-300">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                          {article.excerpt}
                        </p>

                        {/* Call to Action */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-3 text-secondary-teal hover:text-white hover:bg-secondary-teal rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
                          >
                            Read Article
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                          
                          <div className="w-12 h-12 rounded-full bg-secondary-teal/10 flex items-center justify-center group-hover:bg-secondary-teal group-hover:scale-110 transition-all duration-300">
                            <ArrowRight className="h-6 w-6 text-secondary-teal group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-dark">No Articles Found</h3>
              <p className="text-neutral-gray mb-8 max-w-md mx-auto">
                We couldn't find any articles matching your search criteria. Try adjusting your search terms or filters.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="rounded-xl px-8 py-3"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;