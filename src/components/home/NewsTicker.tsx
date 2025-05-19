
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
}

const news: NewsItem[] = [
  { id: 'legal-empowerment-initiatives', title: 'LSF launches new paralegal training program in Dodoma region' },
  { id: 'gender-justice-workshop', title: 'Women's rights workshop reaches 500 participants across Tanzania' },
  { id: 'climate-justice-advocacy', title: 'New policy brief on climate justice and land rights released' },
  { id: 'digital-legal-aid', title: 'Mobile legal aid clinics reach remote communities in Mwanza' },
  { id: 'government-partnership', title: 'LSF signs MOU with Ministry of Justice to strengthen legal empowerment' }
];

const NewsTicker = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % news.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

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
              {news.map((item, index) => (
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
              ))}
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
