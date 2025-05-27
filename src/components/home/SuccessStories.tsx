
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SuccessStory {
  id: string;
  name: string;
  location: string;
  image: string;
  quote: string;
  category: string;
  brief: string;
}

// Sample data - in production this would come from an API
const successStories: SuccessStory[] = [
  {
    id: "mariam-hassan",
    name: "Mariam Hassan",
    location: "Dar es Salaam",
    image: "https://images.unsplash.com/photo-1539701938214-0d9d0e8ab606?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "With LSF's paralegal support, I reclaimed my family land that was illegally taken after my husband passed away.",
    category: "Land Rights",
    brief: "After Mariam's husband died, her in-laws attempted to evict her from her home. With support from a local paralegal trained by LSF, she was able to assert her legal rights and maintain ownership of her family's property."
  },
  {
    id: "story2",
    name: "Joseph Mkwawa",
    location: "Mbeya",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "The mobile legal clinic in our village helped me understand my rights as a small business owner and resolve a longstanding dispute.",
    category: "Business Rights",
    brief: "Joseph's small carpentry workshop was threatened when a local official demanded illegal payments. With guidance from an LSF-supported legal aid provider, Joseph learned about business regulations and successfully challenged the corrupt demands."
  },
  {
    id: "story3",
    name: "Neema Urio",
    location: "Arusha",
    image: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "After attending legal education sessions, I now lead a women's group that advocates for our community's rights and supports other women.",
    category: "Women's Empowerment",
    brief: "Inspired by LSF's legal empowerment workshops, Neema formed a women's advocacy group in her community. The group provides peer support and connects women with paralegals when they face legal challenges."
  },
  {
    id: "story4",
    name: "Emmanuel Masaki",
    location: "Dodoma",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "The Haki Yangu app helped me find a paralegal who resolved my employment dispute without having to travel to the city.",
    category: "Labor Rights",
    brief: "When Emmanuel was unfairly dismissed without severance pay, he used the Haki Yangu app to connect with a paralegal who mediated the dispute, resulting in fair compensation from his former employer."
  }
];

const SuccessStories = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((current) => (current + 1) % successStories.length);
    setTimeout(() => setAnimating(false), 500);
  };
  
  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((current) => current === 0 ? successStories.length - 1 : current - 1);
    setTimeout(() => setAnimating(false), 500);
  };

  const visibleStories = [
    successStories[activeIndex],
    successStories[(activeIndex + 1) % successStories.length],
    successStories[(activeIndex + 2) % successStories.length]
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary-teal rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-12">
          <div className="max-w-2xl">
            <div className="w-12 h-1 bg-primary mb-4"></div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4 uppercase tracking-wide">Success Stories</h2>
            <p className="text-neutral-gray text-lg leading-relaxed">
              Real people, real impact — see how legal empowerment is transforming lives across Tanzania. 
              Every story represents hope, resilience, and the power of justice.
            </p>
          </div>
          
          <div className="flex space-x-3 mt-6 lg:mt-0">
            <button 
              onClick={handlePrev}
              className="p-3 bg-white hover:bg-primary hover:text-white rounded-full transition-all duration-300 shadow-lg border border-gray-200"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={handleNext}
              className="p-3 bg-white hover:bg-primary hover:text-white rounded-full transition-all duration-300 shadow-lg border border-gray-200"
              aria-label="Next story"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleStories.map((story, index) => (
            <Link 
              key={`${story.id}-${index}`}
              to={`/heroes/${story.id}`}
              className="group"
            >
              <Card 
                className={`overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                  animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                } hover:-translate-y-3`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-medium px-3 py-2 rounded-full uppercase tracking-wide">
                      {story.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="font-bold text-xl text-white mb-1">{story.name}</h3>
                    <div className="flex items-center text-white/80 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {story.location}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white">
                  <blockquote className="flex items-start mb-6">
                    <Quote className="h-8 w-8 text-primary/20 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-neutral-dark italic leading-relaxed">"{story.quote}"</p>
                  </blockquote>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{story.brief}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-medium group-hover:underline flex items-center uppercase tracking-wide text-sm">
                      Read Full Story
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
        <div className="flex justify-center mt-8 space-x-2">
          {successStories.map((_, index) => (
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
        
        <div className="mt-12 text-center">
          <Link to="/heroes">
            <Button className="bg-primary hover:bg-primary-600 text-white font-medium text-lg px-8 py-4 h-auto rounded-none uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300">
              View All Success Stories
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
