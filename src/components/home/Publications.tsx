
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

interface PublicationCardProps {
  title: string;
  type: string;
  date: string;
  link: string;
  downloadUrl: string;
  coverImage: string;
  isNew?: boolean;
}

const PublicationCard = ({ title, type, date, link, downloadUrl, coverImage, isNew = false }: PublicationCardProps) => {
  return (
    <div className="group h-full flex flex-col">
      <div className="relative mb-4 overflow-hidden rounded-lg shadow-sm bg-white aspect-[3/4]">
        {isNew && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            NEW
          </div>
        )}
        <img 
          src={coverImage} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <div className="flex space-x-2">
            <a 
              href={downloadUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-3 py-1 rounded-md text-sm flex items-center font-calibri"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </a>
            <Link 
              to={link}
              className="bg-white text-primary px-3 py-1 rounded-md text-sm flex items-center font-calibri"
            >
              View
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1">
          <span className="text-xs text-neutral-gray font-calibri">{type} • {date}</span>
        </div>
        <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors font-panton">
          {title}
        </h3>
        <Link 
          to={link}
          className="inline-flex items-center text-primary text-sm font-medium group-hover:underline font-calibri"
        >
          Read publication
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

const Publications = () => {
  const publications = [
    {
      title: "Annual Report 2023: Impact and Progress in Legal Aid Delivery",
      type: "Report",
      date: "March 2023",
      link: "/publications/annual-report-2023",
      downloadUrl: "/publications/annual-report-2023.pdf",
      coverImage: "https://images.unsplash.com/photo-1544115559-6731bccacc70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      isNew: true
    },
    {
      title: "Women's Land Rights in Tanzania: Challenges and Opportunities",
      type: "Research",
      date: "January 2023",
      link: "/publications/womens-land-rights",
      downloadUrl: "/publications/womens-land-rights.pdf",
      coverImage: "https://images.unsplash.com/photo-1574195133452-f0830139812e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      isNew: false
    },
    {
      title: "Digital Legal Services: Best Practices and Lessons Learned",
      type: "Guide",
      date: "November 2022",
      link: "/publications/digital-legal-services",
      downloadUrl: "/publications/digital-legal-services.pdf",
      coverImage: "https://images.unsplash.com/photo-1583345237708-61a5c607c276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      isNew: false
    },
    {
      title: "Policy Brief: Climate Justice and Legal Empowerment",
      type: "Brief",
      date: "October 2022",
      link: "/publications/policy-brief-climate-justice",
      downloadUrl: "/publications/policy-brief-climate-justice.pdf",
      coverImage: "https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      isNew: false
    },
    {
      title: "Legal Aid Handbook for Community Paralegals",
      type: "Manual",
      date: "August 2022",
      link: "/publications/legal-aid-handbook",
      downloadUrl: "/publications/legal-aid-handbook.pdf",
      coverImage: "https://images.unsplash.com/photo-1559134935-d80da671a6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      isNew: false
    }
  ];

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {publications.map((pub, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <PublicationCard
                title={pub.title}
                type={pub.type}
                date={pub.date}
                link={pub.link}
                downloadUrl={pub.downloadUrl}
                coverImage={pub.coverImage}
                isNew={pub.isNew}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex absolute -left-12 top-1/3" />
        <CarouselNext className="hidden md:flex absolute -right-12 top-1/3" />
      </Carousel>
    </div>
  );
};

export default Publications;
