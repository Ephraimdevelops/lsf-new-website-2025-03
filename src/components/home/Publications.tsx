
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { dataService } from '@/services/dataService';
import PublicationCard from '@/components/shared/PublicationCard';

const Publications = () => {
  const featuredPublications = dataService.getPublications(3, true);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-panton font-bold mb-2">Latest Publications</h2>
            <p className="text-neutral-gray font-calibri">Research, reports, and resources to advance access to justice.</p>
          </div>
          <Link 
            to="/publications" 
            className="inline-flex items-center mt-4 md:mt-0 text-primary font-bold hover:underline font-calibri"
          >
            View all publications
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPublications.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              variant="default"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
