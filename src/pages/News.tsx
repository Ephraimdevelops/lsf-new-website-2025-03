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
import { useNews } from '@/hooks/useNews';

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
      case 'innovation': return 'bg-primary/10 text-primary';
      case 'legal victory': return 'bg-secondary-teal/10 text-secondary-teal';
      case 'training': return 'bg-secondary-orange/10 text-secondary-orange';
      case 'outreach': return 'bg-secondary-yellow/10 text-secondary-yellow';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!featuredNews || featuredNews.length === 0) {
    return (
      <section className="relative h-[80vh] bg-gradient-to-br from-primary to-secondary-teal flex items-center">
        <div className="container mx-auto px-4 text-center text-white">
          <Newspaper className="h-16 w-16 mx-auto mb-6 opacity-50" />
          <Typography variant="h1" className="text-white mb-4">News & Updates</Typography>
          <Typography variant="body" className="text-white/90">Stay informed with our latest developments</Typography>
        </div>
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
            className={`absolute inset-0 transition-all duration-2000 ease-out ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
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
                  <Link to={`/news/${article.slug || article.id}`}>
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
            </div>
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
                className={`transition-all duration-500 ${index === currentSlide
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Pass filter state directly to hook for backend filtering
  const { news, featuredNews, loading, error } = useNews(searchTerm, selectedCategory);

  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle search input with debounce could be added here, but for now direct update
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(!!term); // Just for UI feedback if needed
  };

  // Get unique categories for filter (In a real app, this should come from a separate query or aggregation)
  // For now, we might lose categories if filtered result doesn't contain them.
  // Ideally, fetch categories separate. But let's assume 'news' contains enough variety or hardcode robust list.
  // Or, since we want to show all filter options even when filtered:
  // We can't derive from 'news' if 'news' is filtered!
  // Solution: Hardcode categories or fetch all distinct categories separately.
  // Let's use a static list for reliability.
  // Get unique categories for filter
  const categories = ['all', 'Innovation', 'Legal Victory', 'Training', 'Outreach', 'Gender Justice', 'Climate', 'Technology', 'Partnership'];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'innovation': return 'bg-primary/10 text-primary';
      case 'legal victory': return 'bg-secondary-teal/10 text-secondary-teal';
      case 'training': return 'bg-secondary-orange/10 text-secondary-orange';
      case 'outreach': return 'bg-secondary-yellow/10 text-secondary-yellow';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with Sliding News */}
      <SlidingNewsHero featuredNews={featuredNews} />

      {/* Enhanced Filters Section */}
      <section className="py-10 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="relative flex-grow lg:max-w-md">
              <Newspaper className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Search news, topics, or keywords..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-teal transition-colors shadow-sm"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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
                    <span>Filter by Category</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 lg:mt-0">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="rounded-full"
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>

      {/* News Content Section */}
      <section id="news-content" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <Typography variant="h2" className="text-gray-600 mb-4">
                {searchTerm ? 'No News Found' : 'No News Available'}
              </Typography>
              <Typography variant="body" className="text-gray-500 mb-8">
                {searchTerm
                  ? `No news articles found matching "${searchTerm}". Try different keywords or browse all news.`
                  : 'We don\'t have any news articles at the moment. Please check back later.'
                }
              </Typography>
              {searchTerm && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    // setFilteredNews(news); // No longer needed
                  }}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-12">
                <Typography variant="h2" className="text-3xl md:text-4xl font-bold mb-4">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'Latest News'}
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  {news.length} article{news.length !== 1 ? 's' : ''} found
                </Typography>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article) => (
                  <article key={article.id} className="group">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30 group-hover:-translate-y-2">
                      {/* Image */}
                      {article.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Category Badge */}
                        <div className="mb-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                            <Tag className="h-3 w-3" />
                            {article.category}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(article.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          {article.readTime && (
                            <>
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{article.readTime}</span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <Typography variant="h3" className="text-xl font-bold mb-3 text-neutral-dark group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {article.title}
                        </Typography>

                        {/* Excerpt */}
                        <Typography variant="body" className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </Typography>

                        {/* Read More Link */}
                        <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Link to={`/news/${article.slug || article.id}`} className="flex items-center text-sm font-medium">
                            Read Full Article
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;