import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { newsService, analyticsService } from '@/services/api';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

const newsItems: NewsItem[] = [
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
    image: "https://images.unsplash.com/photo-1521791136064-0369a794ec0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Climate Justice"
  },
  {
    id: 'paralegal-network-expansion',
    title: "Paralegal Network Now Covers 184 Districts Nationwide",
    excerpt: "LSF's expanded network of 183+ paralegal organizations now reaches every district in Tanzania, making legal aid services more accessible than ever before.",
    date: "January 18, 2024",
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Legal Empowerment"
  }
];

const FeaturedNewsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [news, setNews] = useState<NewsItem[]>(newsItems);
  const [isLoading, setIsLoading] = useState(false);

  // Attempt to fetch real news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await newsService.getFeaturedNews(4);
        if (response && response.length > 0) {
          // If we have real API data, use it
          // This is commented out since we don't know the actual API structure
          // setNews(response);
        }
      } catch (error) {
        console.error("Failed to fetch featured news:", error);
        // Keep using static data if API fails
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % news.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [autoplay, news.length]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Track when users view news items
  const trackNewsView = async (newsId: string) => {
    try {
      await analyticsService.trackEvent('view_news_item', { news_id: newsId });
    } catch (error) {
      console.error("Failed to track news view:", error);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-panton font-bold mb-2">Latest Updates</h2>
            <p className="text-neutral-gray font-calibri">Stay informed about our most recent initiatives and impact</p>
          </div>
          <Link 
            to="/news" 
            className="inline-flex items-center mt-4 md:mt-0 text-primary font-bold hover:underline font-calibri"
          >
            View all news
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-pulse w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full"></div>
            <p className="text-neutral-gray font-calibri">Loading latest updates...</p>
          </div>
        ) : (
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Carousel className="w-full">
              <CarouselContent>
                {news.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="block">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden shadow-lg">
                        <div className="h-64 lg:h-[400px] overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        <div className="p-6 lg:p-8 flex flex-col justify-center">
                          <div className="mb-4">
                            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full font-calibri">
                              {item.category}
                            </span>
                            <span className="ml-3 text-sm text-neutral-gray font-calibri">
                              {item.date}
                            </span>
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-panton">
                            {item.title}
                          </h3>
                          <p className="text-neutral-gray mb-6 font-calibri">
                            {item.excerpt}
                          </p>
                          <Link 
                            to="/news" 
                            onClick={() => trackNewsView(item.id)}
                            className="inline-flex items-center text-primary font-medium font-calibri hover:text-primary/80 transition-colors"
                          >
                            Read full story
                            <ArrowRight className="ml-1 h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2" />
              <CarouselNext className="absolute right-4 top-1/2" />
            </Carousel>
            
            <div className="flex justify-center mt-6 space-x-2">
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    current === index ? 'bg-primary scale-125' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedNewsCarousel;
