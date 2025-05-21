
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'legal-empowerment',
    title: 'Justice Is a Right, Not a Privilege.',
    excerpt: 'Empowering communities—especially women and marginalized groups—with legal education, aid, and advocacy across Tanzania.',
    category: 'Legal Empowerment',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'digital-transformation',
    title: 'Digital Justice Tools Reaching Rural Communities',
    excerpt: 'Our Haki Yangu App has connected over 5,000 users with legal resources and paralegal support across Tanzania.',
    category: 'Digital Transformation',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'climate-justice',
    title: 'Climate Justice: Securing Environmental Rights',
    excerpt: 'Our new initiative empowers communities to address climate-related legal challenges and protect environmental rights.',
    category: 'Climate Justice',
    image: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  }
];

// Regions for the paralegal finder
const regions = ["All Regions", "Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Tanga", "Morogoro"];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % blogPosts.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? blogPosts.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pattern-bg text-white min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      
      {/* Slider background */}
      <div className="absolute inset-0 w-full h-full">
        {blogPosts.map((post, index) => (
          <div 
            key={post.id} 
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${post.image})` }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="mb-12">
          <img 
            src="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
            alt="LSF Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Hero content */}
          <div className="md:col-span-7 animate-fade-in">
            {blogPosts.map((post, index) => (
              <div 
                key={post.id}
                className={`transition-all duration-500 ${
                  currentSlide === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute'
                }`}
                style={{ display: currentSlide === index ? 'block' : 'none' }}
              >
                <span className="inline-block bg-secondary-orange text-white text-sm font-medium px-3 py-1 rounded-full mb-4 font-calibri">
                  {post.category}
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-panton font-bold mb-6 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white/90 font-calibri max-w-2xl">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/legal-help"
                    className="bg-secondary-teal text-white hover:bg-secondary-teal/90 px-8 py-4 rounded-md font-bold transition duration-300 inline-flex items-center text-lg font-calibri"
                  >
                    Get Legal Help
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    to="/what-we-do"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-md font-bold transition duration-300 inline-flex items-center text-lg font-calibri"
                  >
                    Our Programs
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paralegal finder - Moved from LegalAidFinder component */}
          <div className="md:col-span-5">
            <div className="bg-white/95 p-6 rounded-lg shadow-lg">
              <h3 className="text-primary text-2xl font-bold mb-3 font-panton">Need Legal Aid?</h3>
              <p className="text-neutral-dark mb-6 font-calibri">Find a paralegal near you or use our toll-free hotline</p>
              
              <div className="mb-4">
                <label htmlFor="region-select" className="block text-sm font-medium mb-2 text-neutral-dark font-calibri">
                  Select a Region
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={(value) => setSelectedRegion(value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-3 mb-6 p-4 bg-primary/10 rounded-md">
                <MapPin className="h-10 w-10 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-neutral-dark font-calibri">Need immediate assistance?</p>
                  <a href="tel:+255800110303" className="text-2xl font-bold text-primary font-panton">
                    +255 800 110 303
                  </a>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="tel:+255800110303" 
                  className="bg-primary text-white hover:bg-primary-dark px-4 py-3 rounded text-center font-bold transition-colors flex items-center justify-center gap-2 font-calibri"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <Link 
                  to="/legal-help" 
                  className="bg-secondary-teal text-white hover:bg-secondary-teal/90 px-4 py-3 rounded text-center font-bold transition-colors font-calibri"
                >
                  Find Paralegal
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slider navigation */}
        <div className="absolute bottom-10 right-10 z-30 flex space-x-4">
          <button 
            onClick={prevSlide}
            className="bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-10 left-10 z-30 flex space-x-2">
          {blogPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
