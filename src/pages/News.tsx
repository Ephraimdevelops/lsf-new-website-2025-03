
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, Search, Filter, Newspaper, Calendar, Users, Globe, Target, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Featured posts for the carousel
  const featuredPosts = [
    {
      id: 'featured-1',
      title: 'Digital Legal Aid Revolution: Reaching 50,000+ Citizens Across Tanzania',
      excerpt: 'Our comprehensive digital transformation has successfully connected over 50,000 Tanzanians with essential legal services through innovative technology platforms.',
      date: 'November 15, 2024',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Digital Transformation'
    },
    {
      id: 'featured-2',
      title: 'Climate Justice Initiative Addresses Environmental Challenges',
      excerpt: 'LSF launches groundbreaking climate justice program to tackle environmental legal issues affecting vulnerable communities nationwide.',
      date: 'November 8, 2024',
      image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Climate Justice'
    },
    {
      id: 'featured-3',
      title: 'Paralegal Network Expansion: Now Covering All 184 Districts',
      excerpt: 'LSF completes nationwide expansion with trained paralegals now operating in every district across Tanzania, ensuring universal access to legal aid.',
      date: 'October 28, 2024',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      category: 'Legal Empowerment'
    }
  ];

  // Extended news items
  const extendedNewsItems: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Women\'s Rights Legal Clinic Opens in Dodoma',
      excerpt: 'New specialized legal clinic provides comprehensive support for women facing gender-based violence and discrimination.',
      date: 'November 12, 2024',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Gender Justice'
    },
    {
      id: 'news-2',
      title: 'Legal Aid Mobile App Surpasses 75,000 Downloads',
      excerpt: 'Haki Yangu mobile application reaches new milestone, providing instant legal guidance to citizens across Tanzania.',
      date: 'November 5, 2024',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Digital Innovation'
    },
    {
      id: 'news-3',
      title: 'Rural Communities Gain Access to Land Rights Legal Support',
      excerpt: 'New outreach program helps rural farmers secure land titles and resolve property disputes through community-based legal aid.',
      date: 'October 29, 2024',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Land Rights'
    },
    {
      id: 'news-4',
      title: 'Youth Legal Empowerment Program Trains 500+ Young Advocates',
      excerpt: 'Comprehensive training program equips young Tanzanians with legal knowledge to advocate for their communities.',
      date: 'October 22, 2024',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Youth Empowerment'
    },
    {
      id: 'news-5',
      title: 'Policy Reform Success: New Legal Aid Framework Adopted',
      excerpt: 'Government adopts LSF-proposed framework for improving access to justice and legal aid services nationwide.',
      date: 'October 15, 2024',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Policy Advocacy'
    },
    {
      id: 'news-6',
      title: 'Community Legal Education Reaches 25,000 Citizens',
      excerpt: 'Nationwide community education initiative successfully educates thousands on their legal rights and available remedies.',
      date: 'October 8, 2024',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Legal Education'
    },
    {
      id: 'news-7',
      title: 'Partnership with Universities Enhances Legal Research',
      excerpt: 'Strategic partnerships with leading universities strengthen evidence-based research for policy advocacy and legal reform.',
      date: 'September 30, 2024',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Research'
    },
    {
      id: 'news-8',
      title: 'Access to Justice Survey Reveals Key Insights',
      excerpt: 'Comprehensive national survey provides crucial data on barriers to justice and effectiveness of legal aid services.',
      date: 'September 23, 2024',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'Research'
    }
  ];
  
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        setNewsItems(extendedNewsItems);
        setFilteredItems(extendedNewsItems);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);
  
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
                Stay up to date with our latest news, announcements, and developments in advancing access to justice across Tanzania.
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

      {/* Featured Posts Carousel */}
      <section className="py-16 bg-neutral-50">
        <Container>
          <div className="mb-8">
            <Typography variant="h1" className="text-3xl font-bold text-neutral-dark mb-4 font-heading">
              Featured Stories
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Discover our most impactful stories and latest developments
            </Typography>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredPosts.map((post, index) => (
                  <div key={post.id} className="w-full flex-shrink-0">
                    <Link to={`/news/${post.id}`} className="block group">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white shadow-lg overflow-hidden">
                        <div className="lg:order-2">
                          <div className="h-64 lg:h-96 overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                        <div className="lg:order-1 p-8 lg:p-12 flex flex-col justify-center">
                          <div className="mb-4">
                            <span className="bg-primary text-white px-3 py-1 text-sm font-medium uppercase tracking-wide">
                              {post.category}
                            </span>
                            <span className="ml-4 text-neutral-gray text-sm">{post.date}</span>
                          </div>
                          <Typography variant="h1" className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-4 group-hover:text-primary transition-colors font-heading">
                            {post.title}
                          </Typography>
                          <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
                            {post.excerpt}
                          </Typography>
                          <div className="flex items-center text-primary font-medium uppercase tracking-wide text-sm group-hover:underline font-heading">
                            Read Full Story
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-neutral-dark" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-neutral-dark" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {featuredPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-primary scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
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
