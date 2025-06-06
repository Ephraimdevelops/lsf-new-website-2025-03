
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Calendar, FileText, Eye } from 'lucide-react';
import { Publication } from '@/services/dataService';

interface PublicationCardProps {
  publication: Publication;
  variant?: 'default' | 'featured' | 'compact';
}

const PublicationCard = ({ publication, variant = 'default' }: PublicationCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'report': return 'bg-primary/10 text-primary border-primary/20';
      case 'policy-brief': return 'bg-secondary-teal/10 text-secondary-teal border-secondary-teal/20';
      case 'research': return 'bg-secondary-orange/10 text-secondary-orange border-secondary-orange/20';
      case 'guide': return 'bg-secondary-yellow/10 text-secondary-yellow border-secondary-yellow/20';
      case 'toolkit': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'manual': return 'bg-green-100 text-green-600 border-green-200';
      case 'survey': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="group bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-secondary-teal/30 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getTypeColor(publication.type)}`}>
            {publication.type.replace('-', ' ').toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded-full">
            <Calendar size={10} className="mr-1" />
            {new Date(publication.date).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="font-bold text-sm mb-3 line-clamp-2 text-neutral-dark group-hover:text-secondary-teal transition-colors">
          {publication.title}
        </h3>
        
        <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {publication.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link 
            to={`/publications/${publication.id}`} 
            className="text-secondary-teal text-xs font-semibold hover:underline flex items-center"
          >
            Read More
            <ArrowRight size={12} className="ml-1" />
          </Link>
          {publication.downloadUrl && (
            <button className="text-gray-500 hover:text-secondary-teal transition-colors p-1 rounded-full hover:bg-secondary-teal/10">
              <Download size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link to={`/publications/${publication.id}`} className="group block">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-2 ${
        variant === 'featured' ? 'md:flex' : ''
      }`}>
        <div className={`${variant === 'featured' ? 'md:w-1/2' : ''} relative h-56 overflow-hidden`}>
          <img 
            src={publication.image} 
            alt={publication.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Enhanced Type Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border ${getTypeColor(publication.type)}`}>
              <FileText className="h-3 w-3 mr-1" />
              {publication.type.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* View Count Badge */}
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 shadow-lg">
              <Eye className="h-3 w-3 mr-1" />
              2.5K views
            </span>
          </div>
        </div>
        
        <div className={`p-8 ${variant === 'featured' ? 'md:w-1/2' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 flex items-center bg-gray-50 px-3 py-1 rounded-full">
              <Calendar size={12} className="mr-1" />
              {new Date(publication.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long'
              })}
            </span>
          </div>
          
          <h3 className={`font-bold mb-4 group-hover:text-secondary-teal transition-colors duration-300 ${
            variant === 'featured' ? 'text-2xl' : 'text-xl'
          } line-clamp-2 leading-tight`}>
            {publication.title}
          </h3>
          
          <p className="text-neutral-gray text-sm mb-6 line-clamp-3 leading-relaxed">
            {publication.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="inline-flex items-center text-secondary-teal text-sm font-semibold group-hover:underline">
              Read Full Publication
              <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
            </span>
            
            {publication.downloadUrl && (
              <span className="inline-flex items-center bg-secondary-teal/10 hover:bg-secondary-teal hover:text-white text-secondary-teal px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border border-secondary-teal/20">
                <Download size={14} className="mr-1" />
                Download PDF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublicationCard;
