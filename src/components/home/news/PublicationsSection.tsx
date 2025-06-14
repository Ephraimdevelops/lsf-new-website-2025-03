
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download, Sparkles } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import { uploadedDocuments } from './newsData';

const PublicationsSection = () => {
  return (
    <div className="flex-[0.95] min-w-[350px] lg:max-w-sm">
      <div className="flex items-center gap-5 mb-12">
        <div className="bg-gradient-to-br from-secondary-teal to-primary-dark p-4 rounded-xl">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <div>
          <Typography variant="h3" className="text-secondary-teal font-heading font-bold text-2xl">Latest Publications</Typography>
          <Typography variant="bodySmall" className="text-neutral-gray">Recent research &amp; reports</Typography>
        </div>
      </div>
      
      <div className="space-y-6">
        {uploadedDocuments.map((doc) => (
          <div key={doc.id} className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300">
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
              <img 
                src={doc.image}
                alt={doc.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <Typography variant="h4" className="font-bold text-sm leading-tight line-clamp-2 text-neutral-dark">
                  {doc.title}
                </Typography>
                {doc.isNew && (
                  <div className="flex items-center bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                    <Sparkles size={10} className="mr-1" />
                    NEW
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-gray">{doc.type}</span>
                <a 
                  href={doc.downloadUrl}
                  className="inline-flex items-center bg-secondary-teal text-white px-3 py-1 rounded-full text-xs font-bold hover:shadow-md transition-all"
                  download
                >
                  <Download size={10} className="mr-1" />
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-row gap-4 pt-8">
        <Link 
          to="/publications"
          className="w-1/2 flex items-center justify-center rounded-xl bg-secondary-teal hover:bg-secondary-teal/90 text-white font-bold px-4 py-4 transition-all duration-300"
        >
          <FileText className="mr-2 h-5 w-5" />
          All Pubs
        </Link>
        <Link 
          to="/resources"
          className="w-1/2 flex items-center justify-center rounded-xl border border-secondary-teal text-secondary-teal font-bold px-4 py-4 hover:bg-secondary-teal/10 transition-all duration-300"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Resources
        </Link>
      </div>
    </div>
  );
};

export default PublicationsSection;
