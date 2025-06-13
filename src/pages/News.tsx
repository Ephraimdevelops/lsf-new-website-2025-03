
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import NewsCard from '../components/shared/NewsCard';
import EnhancedSearch from '../components/shared/EnhancedSearch';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import { Filter, Calendar, TrendingUp, Eye, Users, Star, ChevronDown, Newspaper, ArrowRight } from 'lucide-react';
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
import { NewsItem } from '@/services/dataService';
import { newsService } from '@/services/api';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [year, setYear] = useState('all');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await newsService.getAllNews();
        // Extract the data array from the paginated response
        const newsData = response.data || [];
        setNewsItems(newsData);
        setFilteredNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  useEffect(() => {
    const filtered = newsItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
      const matchesYear = year === 'all' || new Date(item.date).getFullYear().toString() === year;
      return matchesSearch && matchesCategory && matchesYear;
    });
    
    setFilteredNews(filtered);
  }, [searchTerm, category, year, newsItems]);

  const categories = ['all', ...Array.from(new Set(newsItems.map(item => item.category)))];
  const years = ['all', ...Array.from(new Set(newsItems.map(item => new Date(item.date).getFullYear().toString())))];

  const featuredNews = filteredNews.slice(0, 1);
  const regularNews = filteredNews.slice(1);

  return (
    <Layout>
      {/* Enhanced Hero Section with Maroon Gradient */}
      <HeroSection
        icon={<Newspaper className="h-8 w-8" />}
        badge="Latest Updates"
        title="News & Impact Stories"
        description="Stay informed about our latest initiatives, success stories, and the transformative impact of accessible justice across Tanzania"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Enhanced Filters Section with New Search */}
      <section className="py-12 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-grow lg:max-w-lg">
              <EnhancedSearch
                placeholder="Search news stories, topics, or keywords..."
                onSearch={setSearchTerm}
                value={searchTerm}
                onChange={setSearchTerm}
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
                    className="w-full lg:w-auto flex items-center justify-between gap-3 rounded-2xl border-2 border-gray-200 hover:border-primary transition-all duration-300 px-8 py-4 text-lg shadow-lg bg-white hover:shadow-xl"
                  >
                    <Filter size={18} />
                    Advanced Filters
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-6 lg:absolute lg:right-0 lg:mt-4 lg:bg-white lg:shadow-2xl lg:rounded-3xl lg:p-8 lg:z-10 lg:min-w-[320px] lg:border-2 lg:border-gray-100">
                  <div className="space-y-8">
                    <div>
                      <label htmlFor="category" className="block text-lg font-bold text-gray-800 mb-3">
                        Category
                      </label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full rounded-2xl border-2 py-3 text-lg" id="category">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat === 'all' ? 'All Categories' : cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="year" className="block text-lg font-bold text-gray-800 mb-3">
                        Year
                      </label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-full rounded-2xl border-2 py-3 text-lg" id="year">
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((yearOption) => (
                            <SelectItem key={yearOption} value={yearOption}>
                              {yearOption === 'all' ? 'All Years' : yearOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl py-3 text-lg border-2"
                      onClick={() => {
                        setSearchTerm('');
                        setCategory('all');
                        setYear('all');
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Filter Summary */}
          {(searchTerm || category !== 'all' || year !== 'all') && (
            <div className="mt-6 flex flex-wrap gap-3">
              {searchTerm && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-primary/10 text-primary border-2 border-primary/20 font-semibold">
                  Search: "{searchTerm}"
                </span>
              )}
              {category !== 'all' && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-secondary-teal/10 text-secondary-teal border-2 border-secondary-teal/20 font-semibold">
                  Category: {category}
                </span>
              )}
              {year !== 'all' && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-secondary-orange/10 text-secondary-orange border-2 border-secondary-orange/20 font-semibold">
                  Year: {year}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced News Content */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <LoadingSpinner size="xl" message="Loading latest news stories..." />
            </div>
          ) : filteredNews.length > 0 ? (
            <>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-neutral-dark mb-6 font-heading">
                  <AnimatedCounter end={filteredNews.length} /> {filteredNews.length === 1 ? 'Story' : 'Stories'} Found
                </h2>
                <p className="text-xl text-neutral-gray max-w-2xl mx-auto">Discover the latest developments in justice and legal empowerment</p>
              </div>

              {/* Featured News */}
              {featuredNews.length > 0 && (
                <div className="mb-16">
                  <h3 className="text-2xl font-bold mb-8 text-center text-neutral-dark">Featured Story</h3>
                  <div className="max-w-5xl mx-auto">
                    <NewsCard news={featuredNews[0]} variant="featured" />
                  </div>
                </div>
              )}

              {/* Regular News Grid */}
              {regularNews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {regularNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Newspaper className="h-16 w-16 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-neutral-dark">No Stories Found</h3>
              <p className="text-xl text-neutral-gray mb-10 max-w-lg mx-auto">
                We couldn't find any news stories matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategory('all');
                  setYear('all');
                }}
                className="rounded-2xl px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Maroon Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/85"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-teal/20 via-transparent to-secondary-orange/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-secondary-teal rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading">
              Stay Informed, Stay Empowered
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Subscribe to receive the latest news, success stories, and updates about our legal empowerment initiatives directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder-white/70 text-lg"
              />
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                Subscribe Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
