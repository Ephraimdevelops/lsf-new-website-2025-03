
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, Search, Filter, Newspaper, Calendar, Users, Globe, Target } from 'lucide-react';
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
      {/* Professional Hero Section */}
      <section className="bg-white py-16 md:py-24 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Compelling Headlines */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center space-x-3 mb-6">
                <div className="w-12 h-1 bg-primary"></div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider font-heading">
                  Stay Informed
                </span>
              </div>
              
              <Typography variant="display" className="text-neutral-dark mb-6 leading-tight font-heading">
                News & Updates
              </Typography>
              
              <Typography variant="body" className="text-neutral-gray mb-8 leading-relaxed max-w-lg">
                Stay up to date with our latest news, announcements, and developments in advancing access to justice across Tanzania. Discover our impact stories and legislative achievements.
              </Typography>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/legal-help">
                  <Button size="lg" className="font-semibold px-8 py-4 font-heading">
                    Get Legal Help
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="font-semibold px-8 py-4 font-heading border-2">
                    Media Enquiries
                  </Button>
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1 font-heading">150+</div>
                  <div className="text-neutral-gray text-sm font-heading">News Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1 font-heading">25K+</div>
                  <div className="text-neutral-gray text-sm font-heading">Readers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1 font-heading">12</div>
                  <div className="text-neutral-gray text-sm font-heading">Regions Covered</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Striking Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/lovable-uploads/background with mother umage .png" 
                    alt="Legal empowerment in action" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Newspaper className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-neutral-dark font-heading">Latest Impact</div>
                      <div className="text-sm text-neutral-gray">Real stories, real change</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Card-Based Category Navigation */}
      <section className="py-12 bg-neutral-light">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-bold text-xl font-heading">01</span>
                </div>
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark mb-2 font-heading">Legal Empowerment</h3>
              <p className="text-neutral-gray text-sm">Community-based legal aid and empowerment initiatives</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary-teal/10 rounded-xl flex items-center justify-center group-hover:bg-secondary-teal/20 transition-colors">
                  <span className="text-secondary-teal font-bold text-xl font-heading">02</span>
                </div>
                <Globe className="h-6 w-6 text-secondary-teal" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark mb-2 font-heading">Policy Advocacy</h3>
              <p className="text-neutral-gray text-sm">Driving systemic change through policy reform</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary-orange/10 rounded-xl flex items-center justify-center group-hover:bg-secondary-orange/20 transition-colors">
                  <span className="text-secondary-orange font-bold text-xl font-heading">03</span>
                </div>
                <Target className="h-6 w-6 text-secondary-orange" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark mb-2 font-heading">Impact Stories</h3>
              <p className="text-neutral-gray text-sm">Real-world outcomes and success stories</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary-yellow/10 rounded-xl flex items-center justify-center group-hover:bg-secondary-yellow/20 transition-colors">
                  <span className="text-secondary-yellow font-bold text-xl font-heading">04</span>
                </div>
                <Calendar className="h-6 w-6 text-secondary-yellow" />
              </div>
              <h3 className="text-lg font-bold text-neutral-dark mb-2 font-heading">Announcements</h3>
              <p className="text-neutral-gray text-sm">Latest updates and organizational news</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Media Centre Banner */}
      <section className="bg-neutral-50 py-12 border-t border-b border-gray-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <Typography variant="body" className="text-neutral-900 font-medium mb-4 md:mb-0 font-heading">
              LSF'S NEWS AND MEDIA TEAMS CAN HELP WITH ALL MEDIA ENQUIRIES.
            </Typography>
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-wide font-medium rounded-none font-heading"
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
              <Typography variant="h1" className="text-4xl font-bold text-neutral-900 uppercase tracking-wide font-heading">
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
                          className="text-2xl lg:text-3xl font-bold text-neutral-900 group-hover:text-primary transition-colors leading-tight uppercase font-heading"
                        >
                          {item.title}
                        </Typography>
                        
                        <Typography variant="body" className="text-neutral-700 leading-relaxed">
                          {item.excerpt}
                        </Typography>
                        
                        <div className="flex items-center text-primary font-medium uppercase tracking-wide text-sm group-hover:underline font-heading">
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
              <Typography variant="h3" className="text-2xl font-bold mb-2 font-heading">
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
                className="uppercase tracking-wide font-medium rounded-none font-heading"
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
                className="border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-wide font-medium rounded-none px-8 py-3 font-heading"
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
