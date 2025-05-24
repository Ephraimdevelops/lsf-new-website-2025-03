import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background pattern element */}
      <div className="absolute top-0 left-0 w-full h-full bg-pattern-bg bg-opacity-2 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-12">
          <div>
            <h2 className="mb-3">Success Stories</h2>
            <p className="text-neutral-gray max-w-2xl">
              Real people, real impact — see how legal empowerment is transforming lives across Tanzania
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button 
              onClick={handlePrev}
              className="p-2 bg-white hover:bg-neutral-50 rounded-full transition-colors shadow-md"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <button 
              onClick={handleNext}
              className="p-2 bg-white hover:bg-neutral-50 rounded-full transition-colors shadow-md"
              aria-label="Next story"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
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
              <div 
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl ${
                  animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                } hover:-translate-y-2`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="relative h-64">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-90"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      {story.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="font-bold text-xl text-white">{story.name}</h3>
                    <div className="flex items-center text-white/80 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {story.location}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <Quote className="h-8 w-8 text-primary/20 mr-2 flex-shrink-0" />
                    <p className="text-neutral-dark italic">"{story.quote}"</p>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <span className="text-primary font-medium group-hover:underline flex items-center">
                      Read Full Story
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/heroes">
            <Button className="bg-primary hover:bg-primary-dark text-white font-sans text-lg px-8 py-6 h-auto">
              View All Success Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
