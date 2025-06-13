
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote, Heart, Star, Users, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

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
  const [animating, setAnimating] = useState(false);
  
  const featuredStories = successStories.filter(story => story.featured);
  const allStories = successStories;
  
  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((current) => (current + 1) % allStories.length);
    setTimeout(() => setAnimating(false), 500);
  };
  
  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((current) => current === 0 ? allStories.length - 1 : current - 1);
    setTimeout(() => setAnimating(false), 500);
  };

  const visibleStories = [
    allStories[activeIndex],
    allStories[(activeIndex + 1) % allStories.length],
    allStories[(activeIndex + 2) % allStories.length]
  ];

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
          
          <Typography variant="display" className="text-white mb-8 font-heading max-w-4xl mx-auto">
            Stories That Transform Lives
          </Typography>
          
          <Typography variant="body" className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed">
            Meet the brave individuals whose lives have been transformed through access to justice. 
            These are stories of courage, resilience, and the power of legal empowerment.
          </Typography>
        </div>

        {/* All Stories Section */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-16">
            <div className="max-w-2xl">
              <Typography variant="h2" className="text-white mb-6 font-heading">
                Every Story Matters
              </Typography>
              <Typography variant="body" className="text-white/80 text-lg">
                Each story represents hope, resilience, and the transformative power of accessible justice.
              </Typography>
            </div>
            
            <div className="flex space-x-4 mt-8 lg:mt-0">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {visibleStories.map((story, index) => (
              <Link 
                key={`${story.id}-${index}`}
                to={`/heroes/${story.id}`}
                className="group"
              >
                <Card 
                  className={`overflow-hidden transition-all duration-700 hover:shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-white/50 ${
                    animating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                  } hover:-translate-y-4 group-hover:border-white hover:bg-white group-hover:shadow-white/20`}
                  style={{ 
                    transitionDelay: `${index * 150}ms`,
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <span className="bg-secondary-orange text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg border border-white/20">
                        {story.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <Typography variant="h4" className="text-white mb-2 font-heading">
                        {story.name}
                      </Typography>
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <blockquote className="mb-6">
                      <Quote className="h-8 w-8 text-primary/30 mb-4" />
                      <Typography variant="body" className="text-neutral-dark italic leading-relaxed text-lg">
                        "{story.quote}"
                      </Typography>
                    </blockquote>
                    
                    <div className="flex justify-between items-center mt-8">
                      <span className="text-primary font-bold group-hover:underline flex items-center text-sm tracking-wide uppercase">
                        READ STORY
                        <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                      </span>
                      <Heart className="h-6 w-6 text-gray-300 group-hover:text-red-400 transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Story indicators */}
          <div className="flex justify-center mb-16 space-x-3">
            {allStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-secondary-orange scale-125 shadow-lg' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Impact Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-12 mb-16">
          <div className="text-center mb-16">
            <Typography variant="h2" className="text-white mb-6 font-heading">
              Stories That Transform Communities
            </Typography>
            <Typography variant="body" className="text-white/80 text-lg max-w-2xl mx-auto">
              The ripple effect of justice reaches far beyond individual cases
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 border border-white/30">
                <Users className="h-12 w-12 text-white" />
              </div>
              <Typography variant="display" className="text-white mb-4 font-black">
                426K+
              </Typography>
              <Typography variant="h3" className="text-white/90 mb-3">
                Lives Transformed
              </Typography>
              <Typography variant="body" className="text-white/70">
                Direct beneficiaries of our legal empowerment programs
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 border border-white/30">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
              <Typography variant="display" className="text-white mb-4 font-black">
                96%
              </Typography>
              <Typography variant="h3" className="text-white/90 mb-3">
                Success Rate
              </Typography>
              <Typography variant="body" className="text-white/70">
                Cases resolved through our paralegal network
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 border border-white/30">
                <Award className="h-12 w-12 text-white" />
              </div>
              <Typography variant="display" className="text-white mb-4 font-black">
                184
              </Typography>
              <Typography variant="h3" className="text-white/90 mb-3">
                Districts Reached
              </Typography>
              <Typography variant="body" className="text-white/70">
                Communities across Tanzania accessing justice
              </Typography>
            </div>
          </div>
        </div>
        
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
