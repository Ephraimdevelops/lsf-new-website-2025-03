
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Publication {
  id: string;
  title: string;
  type: string;
  date: string;
  image: string;
  downloadUrl: string;
}

const publications: Publication[] = [
  {
    id: '1',
    title: 'Annual Report 2022: Impact and Growth',
    type: 'Report',
    date: 'December 2022',
    image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    downloadUrl: '#'
  },
  {
    id: '2',
    title: 'Women\'s Land Rights in Tanzania: Research Findings',
    type: 'Research',
    date: 'October 2022',
    image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'Legal Aid Provider Technical Manual',
    type: 'Guide',
    date: 'August 2022',
    image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    downloadUrl: '#'
  },
  {
    id: '4',
    title: 'Digital Justice: Technology and Legal Aid',
    type: 'White Paper',
    date: 'June 2022',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    downloadUrl: '#'
  }
];

const Publications = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const nextSlide = () => {
    setStartIndex((prevIndex) => 
      (prevIndex + 1) % Math.max(1, publications.length - visibleCount + 1)
    );
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) => 
      prevIndex === 0 
        ? Math.max(0, publications.length - visibleCount) 
        : prevIndex - 1
    );
  };

  const visiblePublications = publications.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 font-panton">Latest Publications</h2>
            <p className="text-neutral-gray font-calibri max-w-xl">
              Explore our research, reports, and resources designed to enhance legal aid and access to justice in Tanzania
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button 
              onClick={prevSlide}
              className="p-2 bg-neutral-light hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Show previous publications"
              disabled={startIndex === 0}
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 bg-neutral-light hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Show more publications"
              disabled={startIndex >= publications.length - visibleCount}
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {visiblePublications.map((publication) => (
            <div key={publication.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={publication.image} 
                  alt={publication.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-primary text-white text-xs py-1 px-3 rounded-full font-calibri">
                  {publication.type}
                </span>
              </div>
              <div className="p-6">
                <span className="text-neutral-gray text-sm mb-2 block font-calibri">{publication.date}</span>
                <h3 className="text-xl font-bold mb-4 line-clamp-2 font-panton">{publication.title}</h3>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/publications/${publication.id}`}
                    className="text-primary font-medium flex items-center hover:underline font-calibri"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Read more
                  </Link>
                  <a 
                    href={publication.downloadUrl} 
                    className="text-secondary-teal font-medium flex items-center hover:underline font-calibri"
                    download
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/publications">
            <Button className="bg-primary hover:bg-primary-dark text-white font-calibri">
              View All Publications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Publications;
