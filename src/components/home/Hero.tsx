
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'legal-empowerment-initiatives',
    title: 'Legal Empowerment Initiatives Making Impact in Rural Tanzania',
    excerpt: 'Our recent programs have reached over 200 villages, providing critical legal aid and education to marginalized communities.',
    category: 'Legal Empowerment',
    image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gender-justice-workshop',
    title: 'Gender Justice Workshop Series Empowers Women Across Tanzania',
    excerpt: 'Our workshops have trained over 500 women on legal rights and economic empowerment strategies.',
    category: 'Gender Justice',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'climate-justice-advocacy',
    title: 'Climate Justice Advocacy Leads to Policy Changes',
    excerpt: 'Our advocacy work has resulted in new local policies protecting vulnerable communities from climate-related displacement.',
    category: 'Climate Justice',
    image: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    <section className="relative bg-primary pattern-bg text-white min-h-[85vh] flex items-center overflow-hidden">
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
        <div className="mb-8">
          <img 
            src="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
            alt="LSF Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <div className="max-w-3xl animate-fade-in">
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-panton font-bold mb-6">
                {post.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 font-calibri">
                {post.excerpt}
              </p>
              <Link 
                to={`/news/${post.id}`}
                className="bg-white text-primary hover:bg-opacity-90 px-8 py-3 rounded-md font-bold transition duration-300 inline-flex items-center font-calibri"
              >
                Read Full Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          ))}
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
