
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readTime?: string;
  storageId?: string; // Optional backend field
  slug?: string;
}

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <Link
      to="/news"
      className="group block"
    >
      <article className="hover:opacity-95 transition-opacity duration-300">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-neutral-800 text-xs font-bold px-4 py-2 rounded-full">
              {news.category.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-neutral-500 mb-3">
          <Calendar size={14} className="mr-2" />
          {new Date(news.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        <Typography
          variant="h3"
          className="text-neutral-800 font-heading group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-tight text-xl"
        >
          {news.title}
        </Typography>
        <Typography variant="bodySmall" className="text-neutral-600 line-clamp-3 leading-relaxed mb-4">
          {news.excerpt}
        </Typography>
        <div className="inline-flex items-center text-primary font-semibold group-hover:underline transition-all duration-300">
          <Typography variant="small" className="font-semibold">Read More</Typography>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
