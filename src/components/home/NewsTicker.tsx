
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
}

const staticNews: NewsItem[] = [
  { 
    id: 'legal-empowerment-initiatives', 
    title: 'LSF helps 26,000+ Tanzanians resolve legal disputes',
    excerpt: 'Community paralegals provide essential legal support across the nation'
  },
  { 
    id: 'gender-justice-workshop', 
    title: "Sauti ya Mwanamke project empowers women through legal education",
    excerpt: 'Rural communities gain access to crucial legal knowledge and support'
  },
  { 
    id: 'climate-justice-advocacy', 
    title: 'New Climate Justice initiative launched',
    excerpt: 'Addressing environmental legal challenges in vulnerable communities'
  },
  { 
    id: 'digital-legal-aid', 
    title: 'Haki Yangu App reaches 5,000+ users',
    excerpt: 'Accessible legal support now available through mobile technology'
  }
];

const NewsTicker = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % staticNews.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="bg-primary py-4 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div 
          className="flex items-center gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Typography variant="overline" className="text-white bg-white/20 px-4 py-2 rounded-md flex-shrink-0">
            Latest News
          </Typography>
          
          <div className="flex-1 overflow-hidden">
            {staticNews.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-500 ${
                  index === activeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'
                }`}
                style={{ display: index === activeIndex ? 'block' : 'none' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Typography variant="h4" className="text-white font-semibold">
                    {item.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-white/80 hidden sm:block">
                    {item.excerpt}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
          
          <Link 
            to={`/news/${staticNews[activeIndex].id}`}
            className="flex items-center text-white hover:text-white/80 transition-colors flex-shrink-0"
          >
            <Typography variant="bodySmall" className="text-white mr-2 hidden sm:block">
              Read More
            </Typography>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {/* Progress indicators */}
        <div className="flex justify-center mt-3 gap-2">
          {staticNews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-white scale-125' : 'bg-white/40'
              }`}
              aria-label={`Go to news ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsTicker;
