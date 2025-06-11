
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { NewsItem } from '@/services/dataService';
import Typography from './Typography';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'featured' | 'compact';
}

const NewsCard = ({ news, variant = 'default' }: NewsCardProps) => {
  if (variant === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {news.category}
          </span>
          <span className="text-xs text-neutral-gray flex items-center">
            <Calendar size={12} className="mr-1" />
            {new Date(news.date).toLocaleDateString()}
          </span>
        </div>
        <Typography variant="h4" className="font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </Typography>
        <Typography variant="body" className="text-neutral-gray mb-4 line-clamp-2">
          {news.excerpt}
        </Typography>
        <Link 
          to={`/news/${news.id}`} 
          className="inline-flex items-center text-primary font-semibold text-sm hover:underline group-hover:translate-x-1 transition-all"
        >
          Read More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <Link to={`/news/${news.id}`} className="group block">
      <div className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 ${
        variant === 'featured' ? 'md:flex' : ''
      }`}>
        <div className={`${variant === 'featured' ? 'md:w-1/2' : ''} overflow-hidden`}>
          <div className="aspect-[16/10] overflow-hidden">
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
        <div className={`p-8 ${variant === 'featured' ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {news.category}
            </span>
            <span className="text-xs text-neutral-gray flex items-center">
              <Calendar size={12} className="mr-1" />
              {new Date(news.date).toLocaleDateString()}
            </span>
          </div>
          <Typography 
            variant={variant === 'featured' ? 'h2' : 'h3'} 
            className={`font-bold mb-4 group-hover:text-primary transition-colors ${
              variant === 'featured' ? 'text-2xl lg:text-3xl' : 'text-xl'
            }`}
          >
            {news.title}
          </Typography>
          <Typography variant="body" className="text-neutral-gray mb-6 line-clamp-3 leading-relaxed">
            {news.excerpt}
          </Typography>
          <div className="inline-flex items-center text-primary font-semibold uppercase tracking-wide text-sm group-hover:underline">
            Read Full Story
            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
