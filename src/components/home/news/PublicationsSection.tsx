
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download, Calendar } from 'lucide-react';
import { Heading, Text } from '../../design-system';
import { Button } from '../../ui/button';
import { uploadedDocuments } from './newsData';

const PublicationsSection = () => {
  return (
    <div className="flex-[0.95] min-w-[350px] lg:max-w-sm">
      <div className="relative z-10">
        <div className="mb-12">
          <Heading variant="section" color="neutral" className="font-heading mb-2 text-3xl">
            Latest Publications
          </Heading>
          <Text variant="body" color="neutral" className="text-lg">
            Recent research & reports
          </Text>
        </div>
      
        <div className="space-y-8">
          {uploadedDocuments.map((doc, idx) => (
            <article 
              key={doc.id} 
              className="group hover:opacity-95 transition-opacity duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden bg-neutral-100">
                  <img 
                    src={doc.image}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                      {doc.type}
                    </span>
                    {doc.isNew && (
                      <span className="bg-secondary-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <Heading variant="card" color="neutral" className="leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-2">
                    {doc.title}
                  </Heading>

                  <div className="flex items-center text-sm text-neutral-500 mb-3">
                    <Calendar size={14} className="mr-2" />
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/publications/${doc.id}`}
                      className="text-primary hover:text-secondary-teal font-semibold text-sm hover:underline transition-all duration-300"
                    >
                      Read More
                    </Link>
                    <a 
                      href={doc.downloadUrl} 
                      download
                      className="inline-flex items-center bg-secondary-teal hover:bg-secondary-teal/90 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-300"
                    >
                      <Download size={12} className="mr-1" />
                      PDF
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-8 mt-8 border-t border-neutral-100">
          <Button
            size="lg"
            className="w-full bg-secondary-teal hover:bg-secondary-teal/90 text-white hover:scale-[1.02] transition-all duration-300 border-0"
            asChild
          >
            <Link to="/publications">
              <FileText className="mr-2 h-4 w-4" />
              All Publications
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:scale-[1.02] transition-all duration-300"
            asChild
          >
            <Link to="/resources">
              Browse Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicationsSection;
