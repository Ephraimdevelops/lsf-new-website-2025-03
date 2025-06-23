
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, MapPin, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Link } from 'react-router-dom';

const successStories = [
  {
    id: 1,
    name: "Mariam Hassan",
    location: "Dar es Salaam",
    image: "/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png",
    quote: "Through LSF's paralegal support, I successfully reclaimed my family land that was illegally taken after my husband's death. Now I can provide for my children with dignity.",
    category: "Land Rights",
    outcome: "Secured family home and children's education"
  },
  {
    id: 2,
    name: "Joseph Mkwawa",
    location: "Mbeya",
    image: "/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png",
    quote: "The LSF mobile legal clinic in our village helped me understand my rights as a small business owner and resolve a longstanding dispute.",
    category: "Business Rights",
    outcome: "Business legally registered and thriving"
  },
  {
    id: 3,
    name: "Neema Urio",
    location: "Arusha",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    quote: "After attending LSF's legal empowerment workshops, I now lead a women's group that advocates for our community's rights.",
    category: "Women's Empowerment",
    outcome: "Leading 50+ women across three villages"
  }
];

const AboutSuccessStories = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % successStories.length);
  };

  const handlePrev = () => {
    setActiveIndex((current) => current === 0 ? successStories.length - 1 : current - 1);
  };

  const activeStory = successStories[activeIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
      <Container size="xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
            <Heart className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold">
              SUCCESS STORIES
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-6 font-heading">
            Lives Transformed Through Justice
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto text-lg">
            Behind every legal victory is a human story of courage, determination, and hope.
          </Typography>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-80 lg:h-auto">
                  <img 
                    src={activeStory.image} 
                    alt={activeStory.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30">
                      {activeStory.category}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <Typography variant="h3" className="text-white mb-2 font-heading">
                      {activeStory.name}
                    </Typography>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {activeStory.location}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="relative mb-8">
                    <Quote className="h-12 w-12 text-primary/20 absolute -top-4 -left-4" />
                    <Typography variant="body" className="text-neutral-dark text-lg leading-relaxed pl-8 italic">
                      "{activeStory.quote}"
                    </Typography>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-lg p-4 mb-8">
                    <Typography variant="bodySmall" className="font-semibold text-primary mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Outcome:
                    </Typography>
                    <Typography variant="bodySmall" className="text-neutral-gray">
                      {activeStory.outcome}
                    </Typography>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {successStories.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`h-3 rounded-full transition-all duration-300 ${
                            index === activeIndex 
                              ? 'w-8 bg-primary' 
                              : 'w-3 bg-neutral-300 hover:bg-neutral-400'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        className="p-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        className="p-2"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
            <Link to="/heroes">
              View All Success Stories
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default AboutSuccessStories;
