
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Quote, Calendar } from 'lucide-react';
import Typography from './Typography';

interface SuccessStoryCardProps {
  story: {
    id?: string;
    name: string;
    location: string;
    image: string;
    quote: string;
    category: string;
    brief?: string;
    year?: string;
    outcome?: string;
    title?: string;
  };
  linkTo?: string;
  className?: string;
}

const SuccessStoryCard = ({ story, linkTo, className = "" }: SuccessStoryCardProps) => {
  const CardContent = () => (
    <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 ${className}`}>
      {/* Image with overlay */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={story.image} 
          alt={story.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Category badge */}
        <div className="absolute top-6 left-6">
          <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30">
            {story.category}
          </span>
        </div>
        
        {/* Year badge (if available) */}
        {story.year && (
          <div className="absolute top-6 right-6">
            <span className="bg-secondary-orange/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              {story.year}
            </span>
          </div>
        )}
        
        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Typography variant="h3" className="text-white mb-2 font-heading">
            {story.name}
          </Typography>
          <div className="flex items-center text-white/90 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-2" />
            {story.location}
          </div>
          {story.title && (
            <Typography variant="body" className="text-white/80 text-sm font-medium">
              {story.title}
            </Typography>
          )}
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-8">
        
        {/* Brief description (if available) */}
        {story.brief && (
          <Typography variant="body" className="text-neutral-gray mb-6 leading-relaxed">
            {story.brief}
          </Typography>
        )}
        
        {/* Read more link */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <span className="text-primary font-semibold group-hover:text-secondary-teal transition-colors flex items-center">
            Read Full Story
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary-teal rounded-full group-hover:w-16 transition-all duration-300"></div>
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block group-hover:-translate-y-2 transition-transform duration-300">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default SuccessStoryCard;
