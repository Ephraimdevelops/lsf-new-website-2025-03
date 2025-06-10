
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, PlayCircle } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const ProjectsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const projects = [
    {
      id: 1,
      title: "Sauti ya Mwanamke (Women's Voice)",
      description: "Empowering 4,000+ paralegals across 184 communities to expand legal aid and leadership opportunities for women.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Women's Empowerment",
      impact: "4,000+ Paralegals Trained"
    },
    {
      id: 2,
      title: "Wanaweza (We Can)",
      description: "Supporting women's legal and economic empowerment through rights education, land access, and environmental justice.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
      category: "Economic Empowerment",
      impact: "50,000+ Women Reached"
    },
    {
      id: 3,
      title: "Haki Yangu App",
      description: "A free mobile app connecting Tanzanians to trained paralegals. Justice is now a tap away.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Digital Innovation", 
      impact: "75,000+ Downloads"
    },
    {
      id: 4,
      title: "Climate Justice Initiative",
      description: "Enabling rural and pastoralist communities to defend land rights, adapt to climate stress, and access legal remedies.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      category: "Climate Justice",
      impact: "30+ Communities Served"
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-900 to-black text-white overflow-hidden">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-white mb-6 text-4xl md:text-5xl font-bold">
            Ongoing Projects
          </Typography>
          <Typography variant="body" className="text-white/80 max-w-3xl mx-auto text-xl">
            Explore our flagship initiatives—presented in a sleek, sliding interface.
          </Typography>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {projects.map((project) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white text-black min-h-[600px]">
                    <div className="relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6">
                        <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <div className="text-primary font-bold text-sm mb-2 uppercase tracking-wide">
                          Featured Project
                        </div>
                        <Typography variant="h2" className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                          {project.title}
                        </Typography>
                        <div className="bg-secondary-orange/10 text-secondary-orange px-4 py-2 rounded-full text-sm font-bold inline-block mb-6">
                          {project.impact}
                        </div>
                      </div>
                      
                      <Typography variant="body" className="text-neutral-gray mb-8 leading-relaxed text-lg">
                        {project.description}
                      </Typography>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="font-bold px-8">
                          Explore Project
                          <ExternalLink className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="font-bold px-8">
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-secondary-orange scale-125' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProjectsCarousel;
