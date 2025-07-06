
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote, Heart, Star, Users, TrendingUp, Award, Sparkles, PlayCircle, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import SuccessStoryCard from '@/components/shared/SuccessStoryCard';

interface SuccessStory {
  id: string;
  name: string;
  location: string;
  image: string;
  quote: string;
  category: string;
  brief: string;
  featured?: boolean;
}

// Real success stories with LSF images
const successStories: SuccessStory[] = [
  {
    id: "mariam-hassan",
    name: "Mariam Hassan",
    location: "Dar es Salaam",
    image: "/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png",
    quote: "Through LSF's paralegal support, I successfully reclaimed my family land that was illegally taken after my husband's death. Now I can provide for my children with dignity.",
    category: "Land Rights",
    brief: "After Mariam's husband passed away, her in-laws attempted to evict her from her ancestral home. With guidance from an LSF-trained paralegal, Mariam learned about women's inheritance rights and successfully retained her home.",
    featured: true
  },
  {
    id: "joseph-mkwawa",
    name: "Joseph Mkwawa",
    location: "Mbeya",
    image: "/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png",
    quote: "The LSF mobile legal clinic in our village helped me understand my rights as a small business owner and resolve a longstanding dispute that was threatening my family's livelihood.",
    category: "Business Rights",
    brief: "Joseph's small carpentry workshop was threatened by illegal demands from local officials. The LSF mobile clinic helped him properly register his business and provided documentation showing the demands were illegal.",
    featured: true
  },
  {
    id: "neema-urio",
    name: "Neema Urio",
    location: "Arusha",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    quote: "After attending LSF's legal empowerment workshops, I now lead a women's group that advocates for our community's rights and provides peer support to women facing legal challenges.",
    category: "Women's Empowerment",
    brief: "Inspired by LSF's legal literacy program, Neema established the 'Tunaweza' women's group, which now includes over 50 members across three villages and has successfully mediated over 30 disputes.",
    featured: false
  },
  {
    id: "emmanuel-masaki",
    name: "Emmanuel Masaki",
    location: "Dodoma",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    quote: "The Haki Yangu app connected me with a paralegal who resolved my employment dispute without expensive travel to the city. Technology truly brought justice to my doorstep.",
    category: "Digital Justice",
    brief: "When Emmanuel was unfairly dismissed from his job, the Haki Yangu app connected him with a paralegal who guided him through labor law requirements and secured him three months' salary.",
    featured: false
  }
];

const SuccessStories = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % successStories.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  
  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % successStories.length);
  };
  
  const handlePrev = () => {
    setActiveIndex((current) => current === 0 ? successStories.length - 1 : current - 1);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Enhanced Maroon Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-teal/10 via-transparent to-secondary-orange/10"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-teal rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-secondary-orange rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <Container size="xl" className="relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 mb-8">
            <Sparkles className="h-5 w-5 mr-3 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold">
              HEROES OF JUSTICE
            </Typography>
          </div>
          
          <Typography variant="display" className="text-white mb-8 font-light max-w-4xl mx-auto">
            Stories That Transform Lives
          </Typography>
          
          <Typography variant="body" className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed">
            Meet the brave individuals whose lives have been transformed through access to justice. 
            These are stories of courage, resilience, and the power of legal empowerment.
          </Typography>
        </div>

        {/* Sliding Stories Carousel */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-16">
            <div className="max-w-2xl">
              <Typography variant="h2" className="text-white mb-6 font-light">
                Transforming Lives Daily
              </Typography>
              <Typography variant="body" className="text-white/80 text-lg">
                Each story represents hope, resilience, and the transformative power of accessible justice.
              </Typography>
            </div>
            
            <div className="flex items-center space-x-4 mt-8 lg:mt-0">
              <button 
                onClick={toggleAutoPlay}
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-300 shadow-xl border border-white/30"
                aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isAutoPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <PlayCircle className="h-5 w-5 text-white" />
                )}
              </button>
              <button 
                onClick={handlePrev}
                className="p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-300 shadow-xl border border-white/30 group"
                aria-label="Previous story"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button 
                onClick={handleNext}
                className="p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-300 shadow-xl border border-white/30 group"
                aria-label="Next story"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
          
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {successStories.map((story, index) => (
                <div key={story.id} className="w-full flex-shrink-0 px-4">
                  <SuccessStoryCard 
                    story={story} 
                    linkTo={`/heroes/${story.id}`}
                    className="mx-auto max-w-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Story indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-12 bg-secondary-orange scale-125 shadow-lg' 
                    : 'w-3 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* New Impact Transformation Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-12 mb-16">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-white mb-6 font-light">
              Ripple Effects of Justice
            </Typography>
            <Typography variant="body" className="text-white/80 text-lg max-w-3xl mx-auto">
              When one person's rights are protected, entire communities benefit. See how individual victories create lasting change.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 border border-white/30">
                <Users className="h-12 w-12 text-white" />
              </div>
              <Typography variant="display" className="text-white mb-4 font-medium">
                426K+
              </Typography>
              <Typography variant="h3" className="text-white/90 mb-3">
                Lives Transformed
              </Typography>
              <Typography variant="body" className="text-white/70">
                Each success story creates a ripple effect, empowering families and communities
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 border border-white/30">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <Typography variant="display" className="text-white mb-4 font-medium">
                96%
              </Typography>
              <Typography variant="h3" className="text-white/90 mb-3">
                Success Rate
              </Typography>
              <Typography variant="body" className="text-white/70">
                Proven track record of turning legal challenges into victories
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 border border-white/30">
                <Award className="h-12 w-12 text-white" />
              </div>
              <Typography variant="display" className="text-white mb-4 font-medium">
                184
              </Typography>
              <Typography variant="h3" className="text-white/90 mb-3">
                Communities Reached
              </Typography>
              <Typography variant="body" className="text-white/70">
                From urban centers to remote villages, justice knows no boundaries
              </Typography>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/heroes">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary font-bold px-16 py-6 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-2 text-lg">
              <Typography variant="overline" className="mr-4 text-lg">
                VIEW ALL SUCCESS STORIES
              </Typography>
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default SuccessStories;
