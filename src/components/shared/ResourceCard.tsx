
import { Link } from 'react-router-dom';
import { Download, Calendar, ArrowRight } from 'lucide-react';
import Card from './Card';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  date: string;
  downloadUrl?: string;
  thumbnailUrl: string;
  variant?: 'default' | 'compact' | 'featured';
  linkTo?: string;
}

const ResourceCard = ({ 
  id,
  title, 
  description, 
  type, 
  category, 
  date, 
  downloadUrl, 
  thumbnailUrl,
  variant = 'default',
  linkTo
}: ResourceCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'report': return 'bg-primary/10 text-primary';
      case 'research': return 'bg-secondary-teal/10 text-secondary-teal';
      case 'policy brief': return 'bg-secondary-orange/10 text-secondary-orange';
      case 'guide': return 'bg-secondary-yellow/10 text-secondary-yellow';
      case 'toolkit': return 'bg-purple-100 text-purple-600';
      case 'case study': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (variant === 'compact') {
    return (
      <Card variant="flat" padding="sm" hover className="h-full">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(type)}`}>
            {type.toUpperCase()}
          </span>
          <span className="text-xs text-neutral-gray flex items-center">
            <Calendar size={12} className="mr-1" />
            {date}
          </span>
        </div>
        <h3 className="font-bold text-sm mb-2 line-clamp-2">{title}</h3>
        <p className="text-xs text-neutral-gray mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          {linkTo ? (
            <Link to={linkTo} className="text-primary text-xs font-medium hover:underline">
              Read More
            </Link>
          ) : (
            <span className="text-primary text-xs font-medium">View Details</span>
          )}
          {downloadUrl && (
            <a 
              href={downloadUrl}
              className="text-neutral-gray hover:text-primary"
              download
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={14} />
            </a>
          )}
        </div>
      </Card>
    );
  }

  const CardContent = () => (
    <Card variant="elevated" hover className="h-full overflow-hidden">
      <div className="relative h-48 overflow-hidden -m-8 mb-0">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold uppercase py-1 px-2 rounded">
          {category}
        </span>
        <span className={`absolute top-3 right-3 text-xs font-bold uppercase py-1 px-2 rounded shadow ${getTypeColor(type)}`}>
          {type}
        </span>
      </div>
      <div className="pt-6">
        <div className="flex items-center text-sm text-neutral-gray mb-2">
          <Calendar size={14} className="mr-1" />
          {date}
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-neutral-gray mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center text-primary font-medium group-hover:underline">
            {linkTo ? 'Read More' : 'View Details'}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          {downloadUrl && (
            <a 
              href={downloadUrl}
              className="inline-flex items-center text-neutral-gray hover:text-primary transition-colors"
              download
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="ml-1 h-4 w-4" />
              Download
            </a>
          )}
        </div>
      </div>
    </Card>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="group block">
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="group">
      <CardContent />
    </div>
  );
};

export default ResourceCard;
