
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, CalendarIcon, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { newsService } from '@/services/api';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

const getNewsItems = (): NewsItem[] => {
  return [
    {
      id: 'mama-samia-legal-aid',
      title: "Mama Samia Legal Aid Campaign Reaches 15,000+ Citizens",
      excerpt: "The nationwide campaign provided free legal services to vulnerable communities across Tanzania, focusing on women's rights, land disputes, and family law matters.",
      date: "April 30, 2024",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Legal Empowerment"
    },
    {
      id: 'haki-yangu-app-launch',
      title: "Haki Yangu Mobile App Expands Access to Legal Services",
      excerpt: "LSF's digital transformation initiative has successfully connected over 5,000 users with legal resources and support through the new Haki Yangu mobile application.",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Digital Transformation"
    },
    {
      id: 'climate-justice-initiative',
      title: "New Climate Justice Initiative Tackles Environmental Legal Challenges",
      excerpt: "LSF launches a groundbreaking program to address climate-related legal issues affecting communities across Tanzania, with a focus on land rights, resource management, and sustainable development.",
      date: "February 22, 2024",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Climate Justice"
    },
    {
      id: 'paralegal-network-expansion',
      title: "Paralegal Network Now Covers 184 Districts Nationwide",
      excerpt: "LSF's expanded network of 183+ paralegal organizations now reaches every district in Tanzania, making legal aid services more accessible than ever before.",
      date: "January 18, 2024",
      image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Legal Empowerment"
    },
    {
      id: 'gender-justice-workshop',
      title: "Women's Rights Workshop Reaches 500+ Participants",
      excerpt: "LSF's gender justice initiative conducted workshops across Tanzania, empowering women with knowledge about their legal rights and access to justice mechanisms.",
      date: "December 10, 2023",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Gender Justice"
    },
    {
      id: 'digital-legal-aid-clinics',
      title: "Digital Legal Aid Clinics Reach Remote Communities",
      excerpt: "LSF's mobile legal clinics leveraging digital technology have successfully reached remote communities in Mwanza, providing essential legal services to underserved populations.",
      date: "November 05, 2023",
      image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Digital Transformation"
    },
    {
      id: 'government-partnership-mou',
      title: "LSF Signs MOU with Ministry of Justice to Strengthen Legal Empowerment",
      excerpt: "A landmark agreement between LSF and the Ministry of Justice aims to enhance legal aid services and improve access to justice for marginalized communities across Tanzania.",
      date: "October 22, 2023",
      image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Partnerships"
    },
    {
      id: 'annual-legal-aid-conference',
      title: "Annual Legal Aid Conference Brings Together 300+ Stakeholders",
      excerpt: "The 2023 Legal Aid Conference in Dodoma convened stakeholders from across the legal aid sector to share insights, innovations, and strategies for enhancing access to justice.",
      date: "September 15, 2023",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Events"
    }
  ];
};

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
        // In a real app, this would be an API call
        // const response = await newsService.getAllNews();
        // setNewsItems(response);
        
        // Using sample data for now
        const data = getNewsItems();
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
                <Link to={`/news/${item.id}`} key={item.id} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500 ml-2 flex items-center">
                          <CalendarIcon size={12} className="mr-1" /> 
                          {item.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-neutral-dark text-sm mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>
                      <span className="inline-flex items-center text-primary text-sm font-medium group-hover:underline">
                        Read more 
                        <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
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
