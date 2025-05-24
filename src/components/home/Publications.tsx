
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, Calendar } from 'lucide-react';
import { dataService } from '@/services/dataService';
import PublicationCard from '@/components/shared/PublicationCard';

const Publications = () => {
  const featuredPublications = dataService.getPublications(3, true);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-white via-gray-50 to-secondary-teal/10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-bl from-primary/5 to-secondary-teal/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-secondary-orange/5 to-primary/5 rounded-full blur-3xl"></div>
      
      {/* Floating Icons */}
      <div className="absolute top-32 right-20 opacity-5">
        <FileText size={80} className="text-primary" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-5">
        <Download size={60} className="text-secondary-teal" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary-teal rounded-full"></div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">Knowledge Hub</span>
            <div className="w-20 h-1 bg-gradient-to-r from-secondary-teal to-primary rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary-teal to-primary bg-clip-text text-transparent">
            Latest Publications
          </h2>
          
          <p className="text-xl text-neutral-dark max-w-3xl mx-auto leading-relaxed">
            Research, reports, and resources to advance access to justice across Tanzania. 
            Discover insights that drive meaningful change in our communities.
          </p>
        </div>
        
        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredPublications.map((publication, index) => (
            <div 
              key={publication.id} 
              className="group transform hover:-translate-y-3 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={publication.image} 
                    alt={publication.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Publication Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary backdrop-blur-sm">
                      <FileText size={12} className="mr-1" />
                      {publication.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-2" />
                      {new Date(publication.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-neutral-dark line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {publication.title}
                  </h3>
                  
                  <p className="text-neutral-gray mb-4 line-clamp-3 leading-relaxed">
                    {publication.excerpt}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/publications/${publication.id}`}
                      className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors group/link"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    
                    {publication.downloadUrl && (
                      <a 
                        href={publication.downloadUrl}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-secondary-teal/10 text-secondary-teal hover:bg-secondary-teal hover:text-white transition-all duration-300"
                        download
                      >
                        <Download size={14} className="mr-1" />
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <Link 
            to="/publications" 
            className="inline-flex items-center bg-gradient-to-r from-primary to-secondary-teal hover:from-primary-dark hover:to-secondary-teal text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          >
            <FileText className="mr-3 h-5 w-5" />
            View All Publications
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Publications;
