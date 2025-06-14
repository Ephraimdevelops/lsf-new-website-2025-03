
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readTime: string;
}

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Innovation':
        return 'bg-secondary-teal text-white';
      case 'Legal Victory':
        return 'bg-secondary-orange text-white';
      case 'Training':
        return 'bg-primary text-white';
      default:
        return 'bg-secondary-teal text-white';
    }
  };

  return (
    <Link 
      to={`/news/${news.id}`}
      className="group block"
    >
      <article className="bg-white rounded-2xl hover:shadow-xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2 h-full">
        <div className="relative h-52 overflow-hidden">
          <img 
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-orange/70 via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-2 rounded-full text-sm font-black ${getCategoryColor(news.category)}`}>
              {news.category}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-white font-bold flex items-center">
            <Eye size={13} className="mr-2" />
            {news.readTime}
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center text-xs text-neutral-gray mb-3">
            <Calendar size={13} className="mr-3" />
            {new Date(news.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <Typography variant="h2" className="text-neutral-dark font-heading font-extrabold group-hover:text-secondary-orange transition-colors mb-3 line-clamp-2 leading-tight text-3xl md:text-4xl lg:text-5xl">
            {news.title}
          </Typography>
          <Typography variant="bodySmall" className="text-neutral-gray line-clamp-3 leading-relaxed mb-4">
            {news.excerpt}
          </Typography>
          <div className="flex items-center text-primary font-bold group-hover:text-secondary-orange transition-colors">
            <Typography variant="small" className="font-bold">Read More</Typography>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;

