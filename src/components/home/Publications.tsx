
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, Calendar, Users, TrendingUp, BookOpen } from 'lucide-react';
import { dataService } from '@/services/dataService';
import ResourceCard from '../shared/ResourceCard';

const Publications = () => {
  const featuredPublications = dataService.getPublications(3, true);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary-teal/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
              <BookOpen className="h-6 w-6 text-secondary-teal" />
              <span className="text-secondary-teal font-bold text-sm uppercase tracking-wider">Knowledge Hub</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-6 bg-gradient-to-r from-neutral-dark to-secondary-teal bg-clip-text text-transparent">
            Research & Reports
          </h2>
          
          <p className="text-xl text-neutral-gray max-w-3xl mx-auto leading-relaxed">
            Evidence-based insights driving policy change and improving access to justice across Tanzania
          </p>
          
          {/* Decorative line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-secondary-teal to-primary rounded-full"></div>
          </div>
        </div>
        
        {/* Publications Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredPublications.map((publication) => (
            <div key={publication.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-2">
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary-teal/10 to-primary/10">
                  {publication.image ? (
                    <img 
                      src={publication.image} 
                      alt={publication.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-16 w-16 text-secondary-teal/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary-teal text-white shadow-lg">
                      <FileText className="h-3 w-3 mr-1" />
                      {publication.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(publication.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long'
                    })}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-neutral-dark line-clamp-2 group-hover:text-secondary-teal transition-colors duration-300">
                    {publication.title}
                  </h3>
                  
                  <p className="text-neutral-gray text-sm line-clamp-3 leading-relaxed mb-6">
                    {publication.excerpt}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link 
                      to={`/publications/${publication.id}`}
                      className="inline-flex items-center text-secondary-teal font-semibold hover:text-secondary-teal/80 transition-colors text-sm"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    {publication.downloadUrl && (
                      <a 
                        href={publication.downloadUrl}
                        className="inline-flex items-center bg-secondary-teal hover:bg-secondary-teal/90 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                        download
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Impact Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-dark mb-2">Research Impact</h3>
            <p className="text-neutral-gray">Measurable outcomes from our evidence-based approach</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-sm text-gray-600 font-medium">Research Participants</div>
              <div className="text-xs text-gray-500 mt-1">Engaged in our studies</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-teal/10 to-secondary-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-10 w-10 text-secondary-teal" />
              </div>
              <div className="text-3xl font-bold text-secondary-teal mb-2">15+</div>
              <div className="text-sm text-gray-600 font-medium">Policy Changes Influenced</div>
              <div className="text-xs text-gray-500 mt-1">Through evidence-based advocacy</div>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-orange/10 to-secondary-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Download className="h-10 w-10 text-secondary-orange" />
              </div>
              <div className="text-3xl font-bold text-secondary-orange mb-2">100K+</div>
              <div className="text-sm text-gray-600 font-medium">Downloads This Year</div>
              <div className="text-xs text-gray-500 mt-1">Knowledge sharing impact</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link 
              to="/publications" 
              className="inline-flex items-center bg-gradient-to-r from-secondary-teal to-secondary-teal/90 hover:from-secondary-teal/90 hover:to-secondary-teal text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FileText className="mr-2 h-5 w-5" />
              Explore All Publications
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link 
              to="/resources" 
              className="inline-flex items-center bg-white hover:bg-gray-50 text-secondary-teal border-2 border-secondary-teal px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Publications;
