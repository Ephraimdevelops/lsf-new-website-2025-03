
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

interface SuccessStoryCardProps {
  id: string;
  name: string;
  location: string;
  story: string;
  impact: string;
  image: string;
}

const SuccessStoryCard = ({ id, name, location, story, impact, image }: SuccessStoryCardProps) => {
  return (
    <div className="group h-full flex flex-col">
      <div className="relative mb-4 overflow-hidden rounded-lg shadow-md aspect-[4/3] transform transition-all duration-300 group-hover:scale-[1.02]">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white text-xl font-bold font-panton">{name}</h3>
          <p className="text-white/80 text-sm font-calibri">{location}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-neutral-gray font-calibri mb-3 line-clamp-3">{story}</p>
        <div className="bg-primary/10 p-3 rounded-md mb-3 mt-auto">
          <p className="text-sm text-primary font-bold font-calibri">Impact: {impact}</p>
        </div>
        <Link 
          to={`/heroes/${id}`}
          className="inline-flex items-center text-primary text-sm font-medium hover:underline font-calibri"
        >
          Read full story
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  const stories = [
    {
      id: "maria-joseph",
      name: "Maria Joseph",
      location: "Morogoro Region",
      story: "After being denied her inheritance rights following her husband's death, Maria sought help from our paralegals. Through legal education and representation, she was able to secure her rightful property.",
      impact: "Secured land ownership and financial independence for her family",
      image: "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "emmanuel-baraka",
      name: "Emmanuel Baraka",
      location: "Mwanza Region",
      story: "Emmanuel's community faced environmental damage from a nearby factory. With our support, they pursued legal action that resulted in proper environmental safeguards being implemented.",
      impact: "Protected community water source and improved public health",
      image: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "fatima-hassan",
      name: "Fatima Hassan",
      location: "Zanzibar",
      story: "As a single mother, Fatima struggled to obtain child support. Our paralegals helped her navigate the legal system and successfully negotiate a fair support arrangement.",
      impact: "Secured education and healthcare for her three children",
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "john-mkwawa",
      name: "John Mkwawa",
      location: "Dodoma Region",
      story: "John's village had a long-standing land dispute with a neighboring community. Through mediation and legal support, both communities reached a sustainable agreement.",
      impact: "Resolved multi-generational conflict and established shared resource management",
      image: "https://images.unsplash.com/photo-1512411233342-92208dfe81af?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-1 bg-secondary-teal/10 text-secondary-teal font-medium rounded-full mb-4 font-calibri">Stories of Impact</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-panton">Success Stories</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto font-calibri">
            Real people whose lives have been changed through access to justice.
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {stories.map((story, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <SuccessStoryCard
                  id={story.id}
                  name={story.name}
                  location={story.location}
                  story={story.story}
                  impact={story.impact}
                  image={story.image}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute -left-12 top-1/3" />
          <CarouselNext className="hidden md:flex absolute -right-12 top-1/3" />
        </Carousel>
        
        <div className="mt-10 text-center">
          <Link to="/heroes">
            <Button className="font-calibri">
              View All Success Stories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
