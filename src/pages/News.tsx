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
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  useEffect(() => {
    const filtered = newsItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, category, newsItems]);
  
  const categories = ['all', ...Array.from(new Set(newsItems.map(item => item.category.toLowerCase())))];
  
  return (
    <Layout>
      {/* Hero Section with Primary Color Overlay */}
      <section 
        className="relative h-96 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: '#931e5c', opacity: 0.85 }}></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center">
          <Container>
            <div className="text-white">
              <div className="bg-white text-black px-4 py-2 inline-block mb-4 font-bold text-lg tracking-wider">
                NEWS
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Media Centre Banner */}
      <section className="bg-neutral-50 py-12 border-t border-b border-gray-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <Typography variant="body" className="text-neutral-900 font-medium mb-4 md:mb-0">
              LSF'S NEWS AND MEDIA TEAMS CAN HELP WITH ALL MEDIA ENQUIRIES.
            </Typography>
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-wide font-medium rounded-none"
              >
                VISIT OUR MEDIA CENTRE
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="w-12 h-1 bg-primary mb-4"></div>
              <Typography variant="h1" className="text-4xl font-bold text-neutral-900 uppercase tracking-wide">
                LATEST NEWS
              </Typography>
            </div>
            
            {/* Filters */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="search"
                  placeholder="Search news..."
                  className="pl-10 border-gray-300 rounded-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] border-gray-300 rounded-none">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search news..."
                className="pl-10 border-gray-300 rounded-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border-gray-300 rounded-none">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-8">
              {filteredItems.map((item, index) => (
                <article key={item.id} className="group">
                  <Link to={`/news/${item.id}`} className="block">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8 border-b border-gray-100 hover:border-primary transition-colors">
                      <div className="lg:col-span-1">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-500">{item.date}</span>
                          <span className="bg-primary text-white px-2 py-1 text-xs font-medium uppercase tracking-wide">
                            {item.category}
                          </span>
                        </div>
                        
                        <Typography 
                          variant="h3" 
                          className="text-2xl lg:text-3xl font-bold text-neutral-900 group-hover:text-primary transition-colors leading-tight uppercase"
                        >
                          {item.title}
                        </Typography>
                        
                        <Typography variant="body" className="text-neutral-700 leading-relaxed">
                          {item.excerpt}
                        </Typography>
                        
                        <div className="flex items-center text-primary font-medium uppercase tracking-wide text-sm group-hover:underline">
                          READ MORE
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Typography variant="h3" className="text-2xl font-bold mb-2">
                No Results Found
              </Typography>
              <Typography variant="body" className="text-neutral-700 mb-8">
                We couldn't find any news matching your search criteria.
              </Typography>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategory('all');
                }}
                className="uppercase tracking-wide font-medium rounded-none"
              >
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* Load More Button */}
          {filteredItems.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-wide font-medium rounded-none px-8 py-3"
              >
                LOAD MORE
              </Button>
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
};

export default News;
