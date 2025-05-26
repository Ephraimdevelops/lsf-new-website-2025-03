
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, Calendar, Users, TrendingUp } from 'lucide-react';
import { dataService } from '@/services/dataService';

const Publications = () => {
  const featuredPublications = dataService.getPublications(3, true);

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-1 bg-secondary-teal"></div>
              <span className="text-secondary-teal font-bold text-sm uppercase tracking-wider">Knowledge Hub</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">
              Research & Reports
            </h2>
            <p className="text-neutral-gray mt-2 max-w-2xl">
              Evidence-based insights driving policy change and improving access to justice across Tanzania.
            </p>
          </div>
          <Link 
            to="/publications" 
            className="hidden md:inline-flex items-center text-secondary-teal font-semibold hover:text-secondary-teal/80 transition-colors group"
          >
            View All Publications
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        
        {/* Publications Grid - More compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredPublications.map((publication, index) => (
            <div 
              key={publication.id} 
              className="group transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-secondary-teal/20 h-full">
                {/* Image Section */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={publication.image} 
                    alt={publication.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Publication Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-white/90 text-secondary-teal">
                      <FileText size={10} className="mr-1" />
                      {publication.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center text-xs">
                      <Calendar size={12} className="mr-1" />
                      {new Date(publication.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 text-neutral-dark line-clamp-2 group-hover:text-secondary-teal transition-colors duration-300">
                    {publication.title}
                  </h3>
                  
                  <p className="text-neutral-gray mb-4 line-clamp-2 text-sm leading-relaxed">
                    {publication.excerpt}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/publications/${publication.id}`}
                      className="inline-flex items-center text-secondary-teal font-semibold text-sm hover:text-secondary-teal/80 transition-colors group/link"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    
                    {publication.downloadUrl && (
                      <a 
                        href={publication.downloadUrl}
                        className="inline-flex items-center px-3 py-1 rounded text-xs bg-secondary-teal/10 text-secondary-teal hover:bg-secondary-teal hover:text-white transition-all duration-300"
                        download
                      >
                        <Download size={12} className="mr-1" />
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Impact Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-primary mb-1">50,000+</div>
            <div className="text-sm text-gray-600">Research Participants</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <TrendingUp className="h-8 w-8 text-secondary-teal mx-auto mb-3" />
            <div className="text-2xl font-bold text-secondary-teal mb-1">15+</div>
            <div className="text-sm text-gray-600">Policy Changes Influenced</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <Download className="h-8 w-8 text-secondary-orange mx-auto mb-3" />
            <div className="text-2xl font-bold text-secondary-orange mb-1">100K+</div>
            <div className="text-sm text-gray-600">Downloads This Year</div>
          </div>
        </div>
        
        {/* Mobile CTA */}
        <div className="text-center md:hidden">
          <Link 
            to="/publications" 
            className="inline-flex items-center bg-secondary-teal hover:bg-secondary-teal/90 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FileText className="mr-2 h-4 w-4" />
            View All Publications
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Publications;
