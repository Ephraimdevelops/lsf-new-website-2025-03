
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { dataService } from '@/services/dataService';
import PublicationCard from '@/components/shared/PublicationCard';

const Publications = () => {
  const featuredPublications = dataService.getPublications(3, true);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="relative">
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary-teal mb-4 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-panton font-bold mb-2">Latest Publications</h2>
            <p className="text-neutral-gray font-calibri text-lg max-w-xl">
              Research, reports, and resources to advance access to justice across Tanzania.
            </p>
          </div>
          <Link 
            to="/publications" 
            className="inline-flex items-center mt-6 md:mt-0 text-primary font-bold px-6 py-2 rounded-lg border border-primary hover:bg-primary hover:text-white transition-colors duration-300 font-calibri group"
          >
            View all publications
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPublications.map((publication) => (
            <div key={publication.id} className="transform hover:-translate-y-2 transition-transform duration-300">
              <PublicationCard
                publication={publication}
                variant="default"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
