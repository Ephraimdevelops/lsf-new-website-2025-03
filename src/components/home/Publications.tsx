
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, Calendar, Users, TrendingUp } from 'lucide-react';
import { dataService } from '@/services/dataService';
import ResourceCard from '../shared/ResourceCard';

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
        
        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredPublications.map((publication) => (
            <ResourceCard
              key={publication.id}
              id={publication.id}
              title={publication.title}
              description={publication.excerpt}
              type={publication.type.replace('-', ' ')}
              category="Publication"
              date={new Date(publication.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short'
              })}
              downloadUrl={publication.downloadUrl}
              thumbnailUrl={publication.image}
              linkTo={`/publications/${publication.id}`}
            />
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
