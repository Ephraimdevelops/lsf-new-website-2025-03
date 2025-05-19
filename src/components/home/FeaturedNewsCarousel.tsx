
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

const newsItems: NewsItem[] = [
  {
    id: 'climate-justice-initiative',
    title: "LSF Launches New Climate Justice Initiative in Coastal Regions",
    excerpt: "Legal Services Facility has launched a new initiative to address climate justice issues affecting communities in coastal regions. The program aims to empower local communities with legal knowledge and tools to protect their rights.",
    date: "May 10, 2023",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Climate Justice"
  },
  {
    id: 'digital-legal-aid',
    title: "Digital Legal Aid Services Reach Rural Communities",
    excerpt: "Our digital transformation program has successfully extended legal aid services to previously unreached rural communities. Through mobile legal clinics and digital tools, we have been able to provide legal advice and support.",
    date: "April 22, 2023",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Digital Transformation"
  },
  {
    id: 'government-partnership',
    title: "LSF Partners with Government on Legal Empowerment",
    excerpt: "LSF has signed a Memorandum of Understanding with the Ministry of Justice to strengthen legal empowerment initiatives across Tanzania. This partnership will enhance coordination between government agencies and civil society organizations.",
    date: "March 15, 2023",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Legal Empowerment"
  }
];

const FeaturedNewsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [autoplay]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-panton font-bold mb-2">Latest Updates</h2>
            <p className="text-neutral-gray font-calibri">Stay informed about our most recent initiatives and impact</p>
          </div>
          <Link 
            to="/news" 
            className="inline-flex items-center mt-4 md:mt-0 text-primary font-bold hover:underline font-calibri"
          >
            View all news
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Carousel className="w-full">
            <CarouselContent>
              {newsItems.map((item, index) => (
                <CarouselItem key={index}>
                  <Link to={`/news/${item.id}`} className="block">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden shadow-lg">
                      <div className="h-64 lg:h-[400px] overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-6 lg:p-8 flex flex-col justify-center">
                        <div className="mb-4">
                          <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full font-calibri">
                            {item.category}
                          </span>
                          <span className="ml-3 text-sm text-neutral-gray font-calibri">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-panton">
                          {item.title}
                        </h3>
                        <p className="text-neutral-gray mb-6 font-calibri">
                          {item.excerpt}
                        </p>
                        <span className="inline-flex items-center text-primary font-medium font-calibri">
                          Read full story
                          <ArrowRight className="ml-1 h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2" />
            <CarouselNext className="absolute right-4 top-1/2" />
          </Carousel>
          
          <div className="flex justify-center mt-6 space-x-2">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index ? 'bg-primary scale-125' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsCarousel;
