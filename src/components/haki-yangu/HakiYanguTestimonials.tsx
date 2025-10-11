import { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const HakiYanguTestimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const testimonials = [
    {
      name: "Sarah Mwalimu",
      location: "Dar es Salaam",
      role: "Teacher",
      rating: 5,
      content: "Haki Yangu helped me understand my land rights when my family was facing eviction. The paralegal connected me with was so knowledgeable and supportive. I got the help I needed within hours.",
      image: "/lovable-uploads/testimonial-1.jpg"
    },
    {
      name: "Juma Kimaro",
      location: "Arusha",
      role: "Farmer",
      rating: 5,
      content: "As someone living in a remote village, I never thought I could access legal help. This app changed everything. Now I can get legal advice right from my phone, even without internet.",
      image: "/lovable-uploads/testimonial-2.jpg"
    },
    {
      name: "Grace Mwamba",
      location: "Mwanza",
      role: "Small Business Owner",
      rating: 5,
      content: "The document templates saved me thousands of shillings. I was able to create proper contracts for my business without hiring expensive lawyers. The app is a game-changer!",
      image: "/lovable-uploads/testimonial-3.jpg"
    },
    {
      name: "Ahmed Hassan",
      location: "Zanzibar",
      role: "Student",
      rating: 5,
      content: "The educational videos helped me understand my rights as a tenant. When my landlord tried to increase rent unfairly, I knew exactly what to do. Knowledge is power!",
      image: "/lovable-uploads/testimonial-4.jpg"
    },
    {
      name: "Mary Kisanga",
      location: "Dodoma",
      role: "Community Leader",
      rating: 5,
      content: "Our entire village now uses Haki Yangu. We've resolved so many disputes that used to divide our community. It's bringing peace and understanding to our people.",
      image: "/lovable-uploads/testimonial-5.jpg"
    },
    {
      name: "Peter Mwangi",
      location: "Kilimanjaro",
      role: "Driver",
      rating: 5,
      content: "When I had an accident and the insurance company was giving me trouble, Haki Yangu connected me with a legal expert who helped me get fair compensation. I'm forever grateful.",
      image: "/lovable-uploads/testimonial-6.jpg"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <Typography variant="h2" className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Stories from
              <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
                Real Users
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Hear from Tanzanians whose lives have been transformed through accessible legal support.
            </Typography>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-neutral-100 h-full relative">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary-orange rounded-2xl flex items-center justify-center shadow-lg">
                    <Quote className="h-6 w-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Content */}
                  <Typography variant="body" className="text-muted-foreground leading-relaxed mb-6">
                    "{testimonial.content}"
                  </Typography>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary-orange rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <Typography variant="h4" className="text-lg font-bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="bodySmall" className="text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HakiYanguTestimonials;
