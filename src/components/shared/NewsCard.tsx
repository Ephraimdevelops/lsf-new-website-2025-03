
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
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:border-primary/30">
        <div className="flex items-start justify-between mb-6">
          <span className="bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-primary/20">
            {news.category}
          </span>
          <span className="text-sm text-neutral-gray flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <Calendar size={14} className="mr-2" />
            {new Date(news.date).toLocaleDateString()}
          </span>
        </div>
        <Typography variant="h4" className="font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors text-lg">
          {news.title}
        </Typography>
        <Typography variant="body" className="text-neutral-gray mb-6 line-clamp-3 leading-relaxed">
          {news.excerpt}
        </Typography>
        <Link 
          to={`/news/${news.id}`} 
          className="inline-flex items-center text-primary font-semibold text-sm hover:underline group-hover:translate-x-1 transition-all uppercase tracking-wide"
        >
          Read More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <Link to={`/news/${news.id}`} className="group block">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border-2 border-gray-100 hover:border-primary/30 hover:-translate-y-4 ${
        variant === 'featured' ? 'md:flex' : ''
      }`}>
        <div className={`${variant === 'featured' ? 'md:w-1/2' : ''} overflow-hidden`}>
          <div className="aspect-[16/10] overflow-hidden relative">
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Updated gradient to use maroon instead of black */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>
        <div className={`p-8 ${variant === 'featured' ? 'md:w-1/2 flex flex-col justify-center md:p-12' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <span className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
              {news.category}
            </span>
            <span className="text-sm text-neutral-gray flex items-center bg-gray-50 px-3 py-2 rounded-full">
              <Calendar size={14} className="mr-2" />
              {new Date(news.date).toLocaleDateString()}
            </span>
          </div>
          <Typography 
            variant={variant === 'featured' ? 'h2' : 'h3'} 
            className={`font-bold mb-6 group-hover:text-primary transition-colors ${
              variant === 'featured' ? 'text-3xl lg:text-4xl' : 'text-xl'
            }`}
          >
            {news.title}
          </Typography>
          <Typography variant="body" className="text-neutral-gray mb-8 line-clamp-3 leading-relaxed text-lg">
            {news.excerpt}
          </Typography>
          <div className="inline-flex items-center text-primary font-bold uppercase tracking-wide text-sm group-hover:underline">
            Read Full Story
            <ArrowRight size={18} className="ml-3 transition-transform group-hover:translate-x-2" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
