import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote, Heart, Star, Users, TrendingUp } from 'lucide-react';
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
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary-teal rounded-full blur-xl"></div>
      </div>
      
      <Container size="xl">
        {/* Featured Stories Section */

        {/* All Stories Section */}
        <div className="border-t border-gray-200 pt-20">
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-16">
            <div className="max-w-2xl">
              <Typography variant="overline" className="text-primary mb-4 block">
                ALL STORIES OF JUSTICE
              </Typography>
              <Typography variant="h2" className="mb-6">
                Every Story Matters
              </Typography>
              <Typography variant="body" className="text-neutral-gray">
                Each story represents hope, resilience, and the transformative power of accessible justice.
              </Typography>
            </div>
            
            <div className="flex space-x-3 mt-6 lg:mt-0">
              <button 
                onClick={handlePrev}
                className="p-4 bg-white hover:bg-primary hover:text-white rounded-full transition-all duration-300 shadow-lg border border-gray-200 group"
                aria-label="Previous story"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={handleNext}
                className="p-4 bg-white hover:bg-primary hover:text-white rounded-full transition-all duration-300 shadow-lg border border-gray-200 group"
                aria-label="Next story"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {visibleStories.map((story, index) => (
              <Link 
                key={`${story.id}-${index}`}
                to={`/heroes/${story.id}`}
                className="group"
              >
                <Card 
                  className={`overflow-hidden transition-all duration-500 hover:shadow-2xl bg-white rounded-2xl border border-gray-100 ${
                    animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  } hover:-translate-y-3 group-hover:border-primary/20`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-full uppercase tracking-wide shadow-lg">
                        {story.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <Typography variant="h4" className="text-white mb-1">
                        {story.name}
                      </Typography>
                      <div className="flex items-center text-white/80 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <blockquote className="mb-4">
                      <Quote className="h-6 w-6 text-primary/20 mb-3" />
                      <Typography variant="bodySmall" className="text-neutral-dark italic leading-relaxed">
                        "{story.quote}"
                      </Typography>
                    </blockquote>
                    
                    <div className="flex justify-between items-center mt-6">
                      <span className="text-primary font-bold group-hover:underline flex items-center text-sm tracking-wide">
                        READ STORY
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <Heart className="h-5 w-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          {/* Story indicators */}
          <div className="flex justify-center mb-12 space-x-2">
            {allStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-12 mb-12">
          <div className="text-center mb-12">
            <Typography variant="h3" className="mb-4">
              Stories That Transform Communities
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              The ripple effect of justice reaches far beyond individual cases
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <Typography variant="h2" className="text-primary mb-2">
                426K+
              </Typography>
              <Typography variant="h4" className="mb-2">
                Lives Transformed
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                Direct beneficiaries of our legal empowerment programs
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-teal/10 to-secondary-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-10 w-10 text-secondary-teal" />
              </div>
              <Typography variant="h2" className="text-secondary-teal mb-2">
                96%
              </Typography>
              <Typography variant="h4" className="mb-2">
                Success Rate
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                Cases resolved through our paralegal network
              </Typography>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-orange/10 to-secondary-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-secondary-orange" />
              </div>
              <Typography variant="h2" className="text-secondary-orange mb-2">
                184
              </Typography>
              <Typography variant="h4" className="mb-2">
                Districts Reached
              </Typography>
              <Typography variant="bodySmall" className="text-neutral-gray">
                Communities across Tanzania accessing justice
              </Typography>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/heroes">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <Typography variant="overline" className="text-white mr-3">
                VIEW ALL SUCCESS STORIES
              </Typography>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default SuccessStories;
