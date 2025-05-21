import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '@/services/api';
import { useState as useHookState } from '@hookform/resolvers/zod';
import { NewsPost } from '@/services/api/types';

interface NewsItem {
  id: string;
  title: string;
}

// We'll replace these with actual API data when available
const staticNews: NewsItem[] = [
  { id: 'legal-empowerment-initiatives', title: 'LSF helps 26,000+ Tanzanians resolve legal disputes through community paralegals' },
  { id: 'gender-justice-workshop', title: "Sauti ya Mwanamke project empowers women through legal education in rural communities" },
  { id: 'climate-justice-advocacy', title: 'New Climate Justice initiative launched to address environmental legal challenges' },
  { id: 'digital-legal-aid', title: 'Haki Yangu App reaches 5,000+ users providing accessible legal support' },
  { id: 'government-partnership', title: 'LSF partners with Ministry of Justice to strengthen paralegal networks in 184 districts' }
];

const NewsTicker = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(staticNews);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Attempt to fetch real news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await newsService.getFeaturedNews(5);
        if (response && response.length > 0) {
          setNews(response.map(item => ({
            id: item.slug || item.id.toString(),
            title: item.title
          })));
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Could not load latest news");
        // Keep using static news if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % news.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, news.length]);

  return (
    <div className="bg-primary text-white py-3 sticky top-20 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="mr-4 font-bold px-3 py-1 bg-white text-primary rounded-md font-panton text-sm md:text-base">
            NEWS
          </div>
          <div 
            className="overflow-hidden flex-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden">
              {isLoading ? (
                <div className="text-sm md:text-base font-calibri">Loading latest news...</div>
              ) : error ? (
                <div className="text-sm md:text-base font-calibri">{error}</div>
              ) : (
                news.map((item, index) => (
                  <div
                    key={item.id}
                    className={`transform transition-all duration-500 ${
                      index === activeIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 absolute'
                    }`}
                    style={{ display: index === activeIndex ? 'block' : 'none' }}
                  >
                    <Link to={`/news/${item.id}`} className="hover:underline font-calibri text-sm md:text-base">
                      {item.title}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="ml-4">
            <Link to="/news" className="text-xs font-medium hover:underline whitespace-nowrap font-calibri">
              ALL NEWS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
