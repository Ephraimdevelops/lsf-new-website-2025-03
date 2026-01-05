
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Quote, Calendar } from 'lucide-react';
import Typography from './Typography';
import { Id } from '../../../convex/_generated/dataModel';

// Original props format (for backward compatibility)
interface LegacyStory {
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
}

// Convex story format
interface ConvexStory {
  _id: Id<"success_stories">;
  title: string;
  story: string;
  personName: string;
  location: string;
  imageUrl: string;
  featured?: boolean;
}

interface SuccessStoryCardProps {
  story: LegacyStory | ConvexStory;
  linkTo?: string;
  className?: string;
}

// Type guard to check if story is Convex format
const isConvexStory = (story: LegacyStory | ConvexStory): story is ConvexStory => {
  return '_id' in story && 'personName' in story;
};

// Normalize story to common format for rendering
const normalizeStory = (story: LegacyStory | ConvexStory) => {
  if (isConvexStory(story)) {
    return {
      id: story._id,
      name: story.personName,
      location: story.location,
      image: story.imageUrl,
      quote: story.story,
      category: story.featured ? 'Featured' : 'Impact Story',
      brief: story.story.substring(0, 150) + '...',
      title: story.title,
    };
  }
  return story;
};

const SuccessStoryCard = ({ story: rawStory, linkTo, className = "" }: SuccessStoryCardProps) => {
  // Normalize story data to common format
  const story = normalizeStory(rawStory);

  const CardContent = () => (
    <div className={`group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 hover:border-primary/20 ${className}`}>
      {/* Image with enhanced overlay */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={story.image}
          alt={story.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Branded gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Year badge (if available) */}
        {story.year && (
          <div className="absolute top-5 right-5">
            <span className="bg-white/95 backdrop-blur-sm text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              {story.year}
            </span>
          </div>
        )}

        {/* Bottom content overlay - enhanced contrast */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Typography variant="h3" className="text-white mb-2 font-bold text-xl drop-shadow-lg">
            {story.name}
          </Typography>
          <div className="flex items-center text-white text-sm font-medium drop-shadow-md">
            <MapPin className="h-4 w-4 mr-2 text-secondary-orange" />
            {story.location}
          </div>
        </div>
      </div>

      {/* Content section with branded gradient accent */}
      <div className="relative">
        {/* Accent bar */}
        <div className="h-1 bg-primary"></div>

        <div className="p-6">
          {/* Title if available */}
          {story.title && (
            <Typography variant="h4" className="text-neutral-900 font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {story.title}
            </Typography>
          )}

          {/* Brief description (if available) */}
          {story.brief && (
            <Typography variant="body" className="text-neutral-600 mb-5 leading-relaxed line-clamp-3">
              {story.brief}
            </Typography>
          )}

          {/* Read more link - enhanced */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <span className="text-primary font-bold group-hover:text-secondary-teal transition-colors flex items-center text-sm uppercase tracking-wide">
              Read Story
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </span>
          </div>
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
