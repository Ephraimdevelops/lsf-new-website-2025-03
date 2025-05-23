
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Calendar } from 'lucide-react';
import { Publication } from '@/services/dataService';

interface PublicationCardProps {
  publication: Publication;
  variant?: 'default' | 'featured' | 'compact';
}

const PublicationCard = ({ publication, variant = 'default' }: PublicationCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'report': return 'bg-primary/10 text-primary';
      case 'policy-brief': return 'bg-secondary-teal/10 text-secondary-teal';
      case 'research': return 'bg-secondary-orange/10 text-secondary-orange';
      case 'guide': return 'bg-secondary-yellow/10 text-secondary-yellow';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(publication.type)}`}>
            {publication.type.replace('-', ' ').toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar size={12} className="mr-1" />
            {new Date(publication.date).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-bold text-sm mb-2 line-clamp-2">{publication.title}</h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{publication.excerpt}</p>
        <div className="flex items-center justify-between">
          <Link to={`/publications/${publication.id}`} className="text-primary text-xs font-medium hover:underline">
            Read More
          </Link>
          {publication.downloadUrl && (
            <button className="text-gray-500 hover:text-primary">
              <Download size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link to={`/publications/${publication.id}`} className="group block">
      <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        variant === 'featured' ? 'md:flex' : ''
      }`}>
        <div className={`${variant === 'featured' ? 'md:w-1/2' : ''} h-48 overflow-hidden`}>
          <img 
            src={publication.image} 
            alt={publication.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className={`p-6 ${variant === 'featured' ? 'md:w-1/2' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getTypeColor(publication.type)}`}>
              {publication.type.replace('-', ' ').toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar size={12} className="mr-1" />
              {new Date(publication.date).toLocaleDateString()}
            </span>
          </div>
          <h3 className={`font-bold mb-2 group-hover:text-primary transition-colors ${
            variant === 'featured' ? 'text-xl' : 'text-lg'
          }`}>
            {publication.title}
          </h3>
          <p className="text-neutral-dark text-sm mb-4 line-clamp-3">
            {publication.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-primary text-sm font-medium group-hover:underline">
              Read more 
              <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
            </span>
            {publication.downloadUrl && (
              <span className="inline-flex items-center text-gray-500 text-sm">
                <Download size={14} className="mr-1" />
                Download
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublicationCard;
