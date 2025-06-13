
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
      <div className="group bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:border-secondary-teal/30 transition-all duration-500 transform hover:-translate-y-2">
        <div className="flex items-start justify-between mb-6">
          <span className={`text-sm font-bold px-4 py-2 rounded-full border ${getTypeColor(publication.type)}`}>
            {publication.type.replace('-', ' ').toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 flex items-center bg-gray-50 px-3 py-2 rounded-full">
            <Calendar size={12} className="mr-2" />
            {new Date(publication.date).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-4 line-clamp-2 text-neutral-dark group-hover:text-secondary-teal transition-colors">
          {publication.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
          {publication.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link 
            to={`/publications/${publication.id}`} 
            className="text-secondary-teal text-sm font-semibold hover:underline flex items-center"
          >
            Read More
            <ArrowRight size={14} className="ml-2" />
          </Link>
          {publication.downloadUrl && (
            <button className="text-gray-500 hover:text-secondary-teal transition-colors p-2 rounded-full hover:bg-secondary-teal/10">
              <Download size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link to={`/publications/${publication.id}`} className="group block">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border-2 border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-4 ${
        variant === 'featured' ? 'md:flex' : ''
      }`}>
        <div className={`${variant === 'featured' ? 'md:w-1/2' : ''} relative h-64 overflow-hidden`}>
          <img 
            src={publication.image} 
            alt={publication.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Updated gradient to use maroon instead of black */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent"></div>
          
          {/* Enhanced Type Badge */}
          <div className="absolute top-6 left-6">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-xl border ${getTypeColor(publication.type)}`}>
              <FileText className="h-4 w-4 mr-2" />
              {publication.type.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* View Count Badge */}
          <div className="absolute bottom-6 right-6">
            <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-white/90 text-gray-700 shadow-lg">
              <Eye className="h-4 w-4 mr-2" />
              2.5K views
            </span>
          </div>
        </div>
        
        <div className={`p-8 ${variant === 'featured' ? 'md:w-1/2 md:p-12' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500 flex items-center bg-gray-50 px-4 py-2 rounded-full">
              <Calendar size={14} className="mr-2" />
              {new Date(publication.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long'
              })}
            </span>
          </div>
          
          <h3 className={`font-bold mb-6 group-hover:text-secondary-teal transition-colors duration-300 ${
            variant === 'featured' ? 'text-3xl' : 'text-xl'
          } line-clamp-2 leading-tight`}>
            {publication.title}
          </h3>
          
          <p className="text-neutral-gray text-lg mb-8 line-clamp-3 leading-relaxed">
            {publication.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <span className="inline-flex items-center text-secondary-teal text-sm font-bold group-hover:underline uppercase tracking-wide">
              Read Full Publication
              <ArrowRight size={16} className="ml-3 transition-transform group-hover:translate-x-2" />
            </span>
            
            {publication.downloadUrl && (
              <span className="inline-flex items-center bg-secondary-teal/10 hover:bg-secondary-teal hover:text-white text-secondary-teal px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2 border-secondary-teal/20">
                <Download size={16} className="mr-2" />
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
