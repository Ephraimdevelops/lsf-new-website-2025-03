
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import PublicationCard from './PublicationCard';
import { uploadedDocuments } from './newsData';

const PublicationsSection = () => {
  return (
    <div className="flex-[0.95] min-w-[350px] lg:max-w-sm">
      <div className="flex items-center gap-5 mb-10">
        <div className="bg-gradient-to-br from-secondary-teal to-primary-dark p-4 rounded-2xl shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <div>
          <Typography variant="h3" className="text-secondary-teal font-heading font-bold text-2xl">Latest Publications</Typography>
          <Typography variant="bodySmall" className="text-neutral-gray">Recent research &amp; reports</Typography>
        </div>
      </div>
      <div className="flex flex-col gap-7">
        {uploadedDocuments.map((doc) => (
          <PublicationCard key={doc.id} publication={doc} />
        ))}
      </div>
      <div className="flex flex-row gap-4 pt-6">
        <Link 
          to="/publications"
          className="w-1/2 flex items-center justify-center rounded-xl bg-secondary-teal hover:bg-secondary-teal/90 text-white font-bold px-4 py-4 transition-all duration-300 shadow-lg"
        >
          <FileText className="mr-2 h-5 w-5" />
          All Pubs
        </Link>
        <Link 
          to="/resources"
          className="w-1/2 flex items-center justify-center rounded-xl border-2 border-secondary-teal text-secondary-teal font-bold px-4 py-4 hover:bg-secondary-teal/10 transition-all duration-300"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Resources
        </Link>
      </div>
    </div>
  );
};

export default PublicationsSection;
