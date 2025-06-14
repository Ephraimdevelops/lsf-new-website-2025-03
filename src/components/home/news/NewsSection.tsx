
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import NewsCard from './NewsCard';
import { featuredNews } from './newsData';

const NewsSection = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <div className="bg-gradient-to-br from-primary to-secondary-orange p-4 rounded-2xl shadow-lg">
            <Newspaper className="h-8 w-8 text-white" />
          </div>
          <div>
            <Typography variant="h2" className="text-neutral-dark font-bold text-3xl">Breaking News</Typography>
            <Typography variant="bodySmall" className="text-neutral-gray text-lg">Latest developments &amp; impact</Typography>
          </div>
        </div>
        <Link 
          to="/news" 
          className="inline-flex items-center bg-primary/10 hover:bg-primary hover:text-white text-primary px-9 py-4 rounded-full font-semibold transition-all duration-300 text-lg"
        >
          <Typography variant="bodySmall" className="font-extrabold">View All</Typography>
          <ArrowRight className="ml-3 h-5 w-5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {featuredNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
