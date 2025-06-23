
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Heading, Text } from '../../design-system';
import Card from '../../shared/Card';
import { Button } from '../../ui/button';
import { uploadedDocuments } from './newsData';

const PublicationsSection = () => {
  return (
    <div className="flex-[0.95] min-w-[350px] lg:max-w-sm">
      <div className="relative z-10">
        <div className="flex items-center gap-5 mb-12">
          <div className="bg-gradient-to-br from-secondary-teal to-primary p-5 rounded-2xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <div>
            <Heading variant="section" color="secondary" className="font-heading mb-2">
              Latest Publications
            </Heading>
            <Text variant="body-small" color="neutral">
              Recent research &amp; reports
            </Text>
          </div>
        </div>
      
        <div className="space-y-6">
          {uploadedDocuments.map((doc, idx) => (
            <Card 
              key={doc.id} 
              className="bg-gradient-to-br from-white via-secondary-teal/5 to-secondary-teal/20 hover:scale-[1.025] transition-all duration-300 border border-neutral-100/30"
              padding="md"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/50 bg-gray-50">
                  <img 
                    src={doc.image}
                    alt={doc.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Heading variant="card" color="neutral" className="leading-snug line-clamp-2">
                      {doc.title}
                    </Heading>
                    {doc.isNew && (
                      <div className="flex items-center bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-bold px-2 py-1 rounded-full ml-1 animate-pulse">
                        <Sparkles size={12} className="mr-1" />
                        NEW
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                    <span className="text-xs text-neutral-gray bg-gray-100/80 px-3 py-1 rounded-lg font-semibold">{doc.type}</span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-secondary-teal to-secondary-teal/80 hover:from-secondary-teal/90 hover:to-secondary-teal text-white border border-secondary-teal/20"
                      asChild
                    >
                      <a href={doc.downloadUrl} download>
                        <Download size={13} className="mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-row gap-4 pt-8">
          <Button
            size="lg"
            className="w-1/2 bg-gradient-to-r from-secondary-teal to-primary hover:from-primary hover:to-secondary-teal text-white hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link to="/publications">
              <FileText className="mr-2 h-5 w-5" />
              All Pubs
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-1/2 border border-secondary-teal text-secondary-teal hover:bg-secondary-teal/10 bg-white hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link to="/resources">
              <ArrowRight className="mr-2 h-4 w-4" />
              Resources
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicationsSection;
