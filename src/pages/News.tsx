
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { dataService, NewsItem } from '@/services/dataService';
import NewsCard from '@/components/shared/NewsCard';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load news items
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const data = dataService.getNews();
        setNewsItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  // Filter news items when search term or category changes
  useEffect(() => {
    const filtered = newsItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, category, newsItems]);
  
  // Get unique categories for the filter
  const categories = ['all', ...Array.from(new Set(newsItems.map(item => item.category.toLowerCase())))];
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Latest News & Updates</h1>
            <p className="text-xl opacity-90">
              Stay informed about our latest initiatives, success stories, and impacts in the legal aid sector
            </p>
          </div>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search news..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-gray-500 text-sm">Filter by:</span>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
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
          </div>
        </div>
      </section>
      
      {/* News Items Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold mb-2">No Results Found</h3>
              <p className="text-neutral-dark mb-8">
                We couldn't find any news matching your search criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;
