
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

interface Story {
  id: string;
  name: string;
  location: string;
  program: string;
  quote: string;
  description: string;
  image: string;
}

const stories: Story[] = [
  {
    id: "grace-story",
    name: "Grace Mwakipesile",
    location: "Dodoma, Tanzania",
    program: "Legal Empowerment",
    quote: "When I was wrongfully evicted from my land, the community paralegal trained by LSF helped me reclaim my property.",
    description: "After her husband passed away, Grace faced eviction from her family home. With the help of an LSF-trained paralegal, she was able to understand her legal rights and successfully kept her property.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "womens-collective",
    name: "Mwanza Women's Collective",
    location: "Mwanza, Tanzania",
    program: "Gender Justice",
    quote: "The legal empowerment program has transformed how our community addresses gender-based violence.",
    description: "This women's collective has been trained by LSF to recognize and respond to gender-based violence cases in their community. They've helped over 50 women seek justice and protection.",
    image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "samuel-story",
    name: "Samuel Kioko",
    location: "Arusha, Tanzania",
    program: "Digital Transformation",
    quote: "The mobile legal aid clinic reached our remote village and provided crucial services we needed.",
    description: "Samuel's village was three hours from the nearest legal aid office. When LSF's mobile legal clinic visited, he was finally able to resolve a long-standing land dispute that had affected his family for years.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

const SuccessStories = () => {
  const [current, setCurrent] = useState(0);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-panton">Stories from the Ground</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto font-calibri">
            Meet the people whose lives have been transformed through our work
          </p>
        </div>
        
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {stories.map((story, index) => (
                <CarouselItem key={index}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="h-64 lg:h-[400px] overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="mb-4">
                        <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full font-calibri">
                          {story.program}
                        </span>
                        <span className="ml-3 text-sm text-neutral-gray font-calibri">
                          {story.location}
                        </span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-panton">
                        {story.name}
                      </h3>
                      <p className="text-neutral-gray mb-6 font-calibri italic">
                        "{story.quote}"
                      </p>
                      <p className="text-neutral-gray mb-6 font-calibri">
                        {story.description}
                      </p>
                      <Link to={`/heroes/${story.id}`} className="inline-flex items-center text-primary font-medium font-calibri">
                        Read full story
                        <ArrowRight className="ml-1 h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2" />
            <CarouselNext className="absolute right-4 top-1/2" />
          </Carousel>
          
          <div className="flex justify-center mt-6 space-x-2">
            {stories.map((_, index) => (
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
        
        <div className="text-center mt-10">
          <Link to="/heroes">
            <Button className="font-calibri">
              Meet More Heroes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
