import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import LoadingState from '../components/shared/LoadingState';
import ErrorState from '../components/shared/ErrorState';
import EnhancedSearch from '../components/shared/EnhancedSearch';
import { Newspaper, Calendar, Clock, Filter, ChevronDown, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
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
      <HeroSection
        icon={<Newspaper className="h-8 w-8" />}
        badge="Latest Updates"
        title="News & Updates"
        description="Stay informed with the latest developments in legal aid and access to justice across Tanzania"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Enhanced Search Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
        <div className="container mx-auto px-4">
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
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-teal/10 text-secondary-teal border border-secondary-teal/20">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                  Category: {selectedCategory}
                </span>
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

              <div className="grid grid-cols-1 gap-8">
                {filteredNews.map((article) => (
                  <Link 
                    key={article.id}
                    to={`/news/${article.id}`}
                    className="group block w-full"
                  >
                    <article className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                              <Tag className="h-3 w-3 mr-1" />
                              {article.category.toUpperCase()}
                            </span>
                          </div>

                          {/* Read Time */}
                          {article.readTime && (
                            <div className="absolute top-4 right-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/95 text-gray-600">
                                <Clock className="h-3 w-3 mr-1" />
                                {article.readTime}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 flex flex-col justify-center gap-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(article.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          
                          <h3 className="text-2xl font-semibold text-neutral-dark line-clamp-2 group-hover:text-secondary-teal transition-colors duration-300 ease-in-out">
                            {article.title}
                          </h3>
                          
                          <p className="text-neutral-gray text-base line-clamp-4 leading-relaxed">
                            {article.excerpt}
                          </p>

                          {/* Call to Action */}
                          <Button
                            variant="ghost"
                            className="w-fit flex items-center gap-2 text-secondary-teal hover:bg-secondary-teal/10 rounded-full px-6 py-2 text-base font-medium transition-colors duration-300 ease-in-out"
                          >
                            Read More
                            <ArrowRight className="h-4 w-4" />
                          </Button>
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