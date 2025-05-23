
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { NewsItem } from '@/services/dataService';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'default' | 'featured' | 'compact';
}

const NewsCard = ({ news, variant = 'default' }: NewsCardProps) => {
  if (variant === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
            {news.category}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar size={12} className="mr-1" />
            {new Date(news.date).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-bold text-sm mb-2 line-clamp-2">{news.title}</h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{news.excerpt}</p>
        <Link to={`/news/${news.id}`} className="text-primary text-xs font-medium hover:underline">
          Read More
        </Link>
      </div>
    );
  }

  return (
    <Link to={`/news/${news.id}`} className="group block">
      <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        variant === 'featured' ? 'md:flex' : ''
      }`}>
        <div className={`${variant === 'featured' ? 'md:w-1/2' : ''} h-48 overflow-hidden`}>
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className={`p-6 ${variant === 'featured' ? 'md:w-1/2' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
              {news.category}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar size={12} className="mr-1" />
              {new Date(news.date).toLocaleDateString()}
            </span>
          </div>
          <h3 className={`font-bold mb-2 group-hover:text-primary transition-colors ${
            variant === 'featured' ? 'text-xl' : 'text-lg'
          }`}>
            {news.title}
          </h3>
          <p className="text-neutral-dark text-sm mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          <span className="inline-flex items-center text-primary text-sm font-medium group-hover:underline">
            Read more 
            <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
