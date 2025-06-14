import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download, Sparkles } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import { uploadedDocuments } from './newsData';

const PublicationsSection = () => {
  return (
    <div className="flex-[0.95] min-w-[350px] lg:max-w-sm">
      <div className="relative z-10">
        <div className="flex items-center gap-5 mb-12">
          <div className="bg-gradient-to-br from-secondary-teal to-primary-dark p-5 rounded-2xl shadow-lg shadow-secondary-teal/25">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div>
            <Typography variant="h3" className="text-secondary-teal font-heading font-extrabold text-3xl leading-tight drop-shadow-lg">
              Latest Publications
            </Typography>
            <Typography variant="bodySmall" className="text-neutral-gray text-lg font-medium">
              Recent research &amp; reports
            </Typography>
          </div>
        </div>
      
        <div className="relative space-y-7 before:content-[''] before:absolute before:-top-7 before:left-2/4 before:-translate-x-2/4 before:w-[85%] before:h-full before:rounded-3xl before:bg-gradient-to-br before:from-white/90 before:to-secondary-teal/10 before:blur-2xl before:z-[-1]">
          {uploadedDocuments.map((doc, idx) => (
            <div 
              key={doc.id} 
              className="relative z-10 flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-br from-white via-secondary-teal/5 to-secondary-teal/20 shadow-lg hover:scale-[1.025] hover:z-20 hover:shadow-2xl transition-all duration-300"
            >
              {/* File thumbnail with border ring */}
              <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-sm ring-2 ring-secondary-teal/30 bg-gray-50">
                <img 
                  src={doc.image}
                  alt={doc.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Typography variant="h4" className="font-bold text-lg tracking-tight text-neutral-dark leading-snug line-clamp-2">
                    {doc.title}
                  </Typography>
                  {doc.isNew && (
                    <div
                      className="flex items-center bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-bold px-2 py-1 rounded-full ml-1 shadow-md animate-pulse"
                      style={{ minWidth: 54 }}
                    >
                      <Sparkles size={12} className="mr-1" />
                      NEW
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                  <span className="text-xs text-neutral-gray bg-gray-100/80 px-3 py-1 rounded-lg font-semibold tracking-wide shadow-inner">{doc.type}</span>
                  <a 
                    href={doc.downloadUrl}
                    className="inline-flex items-center bg-gradient-to-r from-secondary-teal to-secondary-teal/80 hover:from-secondary-teal/90 hover:to-secondary-teal px-4 py-2 rounded-full shadow-lg text-xs font-extrabold text-white transition-all duration-200 border-2 border-secondary-teal/20"
                    download
                  >
                    <Download size={13} className="mr-1" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row gap-4 pt-10">
          <Link 
            to="/publications"
            className="w-1/2 flex items-center justify-center rounded-2xl bg-gradient-to-r from-secondary-teal to-primary-dark hover:from-primary-dark hover:to-secondary-teal text-white font-bold px-4 py-4 shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FileText className="mr-2 h-5 w-5" />
            All Pubs
          </Link>
          <Link 
            to="/resources"
            className="w-1/2 flex items-center justify-center rounded-2xl border-2 border-secondary-teal text-secondary-teal font-bold px-4 py-4 hover:bg-secondary-teal/10 bg-white shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Resources
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicationsSection;
