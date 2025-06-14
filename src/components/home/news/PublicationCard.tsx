
import { Link } from 'react-router-dom';
import { Calendar, Download, ExternalLink, Sparkles } from 'lucide-react';
import Typography from '@/components/shared/Typography';

interface Publication {
  id: string;
  title: string;
  excerpt: string;
  type: string;
  date: string;
  downloadUrl: string;
  isNew: boolean;
  image: string;
  fileSize: string;
  category: string;
  pages: string;
}

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard = ({ publication }: PublicationCardProps) => {
  return (
    <div className="relative group">
      <article className="bg-white border-2 border-secondary-teal/10 rounded-3xl overflow-hidden hover:border-secondary-teal/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 p-0">
        {publication.isNew && (
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-black px-3 py-2 rounded-full flex items-center shadow-lg">
              <Sparkles size={12} className="mr-2" />
              NEW
            </div>
          </div>
        )}
        <div className="relative h-36 overflow-hidden">
          <img 
            src={publication.image}
            alt={publication.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-teal/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="bg-secondary-teal text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
              {publication.type.toUpperCase()}
            </span>
            <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full">
              {publication.pages}
            </span>
          </div>
        </div>
        <div className="p-5 pb-4">
          <div className="flex items-center text-xs text-neutral-gray mb-2">
            <Calendar size={12} className="mr-2" />
            {new Date(publication.date).toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <Typography variant="h4" className="text-neutral-dark font-heading font-bold group-hover:text-secondary-teal transition-colors mb-2 line-clamp-2 text-[18px] leading-tight">
            {publication.title}
          </Typography>
          <Typography variant="bodySmall" className="text-neutral-gray line-clamp-3 mb-3 leading-snug text-[15px]">
            {publication.excerpt}
          </Typography>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-neutral-gray font-medium">{publication.fileSize}</span>
            <div className="flex items-center gap-2">
              <Link 
                to={`/publications/${publication.id}`}
                className="inline-flex items-center text-secondary-teal hover:text-secondary-teal-dark transition-colors font-bold text-xs"
              >
                <Typography variant="small" className="font-bold">View</Typography>
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
              <a 
                href={publication.downloadUrl}
                className="bg-gradient-to-r from-secondary-teal to-secondary-teal/80 text-white px-3 py-2 rounded-full flex items-center hover:shadow-lg transition-all text-xs font-black shadow-md"
                download
              >
                <Download size={12} className="mr-2" />
                Download
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PublicationCard;
