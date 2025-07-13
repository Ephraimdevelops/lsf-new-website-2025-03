import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Amina Mwalimu',
    role: 'Community Paralegal',
    location: 'Mwanza Region',
    quote: 'LSF training transformed my life and my community. I now help resolve land disputes and family conflicts that previously went unaddressed. The support and resources from LSF make me confident in providing quality legal assistance.',
    image: '/lovable-uploads/background with mother umage .png',
    rating: 5
  },
  {
    id: 2,
    name: 'Dr. James Kibwana',
    role: 'Regional Commissioner',
    location: 'Dodoma Region',
    quote: 'The partnership with LSF has revolutionized access to justice in our region. Their mobile legal clinics reach the most remote areas, and their digital platform has made legal services accessible to thousands of our residents.',
    image: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
    rating: 5
  },
  {
    id: 3,
    name: 'Sarah Mwanga',
    role: 'Women\'s Group Leader',
    location: 'Arusha Region',
    quote: 'Thanks to LSF\'s women\'s land rights program, I successfully defended my inheritance rights and now help other women in my community do the same. Knowledge is power, and LSF gave us that knowledge.',
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    rating: 5
  },
  {
    id: 4,
    name: 'Hon. Emmanuel Nchimbi',
    role: 'High Court Judge',
    location: 'Dar es Salaam',
    quote: 'LSF\'s work in legal empowerment has significantly reduced the backlog in our courts by resolving disputes at the community level. Their paralegals are well-trained and provide invaluable service to the justice system.',
    image: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
    rating: 5
  },
  {
    id: 5,
    name: 'Mary Kimani',
    role: 'Development Partner',
    location: 'UN Women Tanzania',
    quote: 'LSF\'s innovative approach to combining technology with traditional legal services is remarkable. Their impact on gender justice and women\'s empowerment aligns perfectly with our sustainable development goals.',
    image: '/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png',
    rating: 5
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-primary/5">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-secondary-orange/10 rounded-full px-6 py-3 mb-6">
            <span className="text-secondary-orange font-medium text-sm uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light mb-4 text-foreground">
            Voices of <span className="text-primary font-medium">Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear from the communities, partners, and stakeholders whose lives have been 
            transformed through our legal empowerment initiatives.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
            <CardContent className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Quote Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Quote className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Stars */}
                  <div className="flex justify-center lg:justify-start gap-1 mb-4">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg lg:text-xl text-foreground mb-6 leading-relaxed italic">
                    "{currentTestimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                      <img 
                        src={currentTestimonial.image} 
                        alt={currentTestimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentTestimonial.role}
                      </div>
                      <div className="text-sm text-primary">
                        {currentTestimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevTestimonial}
            className="rounded-full w-10 h-10 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Indicators */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextTestimonial}
            className="rounded-full w-10 h-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-light text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction Rate</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary-teal/5 to-secondary-teal/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-light text-secondary-teal mb-2">15,000+</div>
              <div className="text-sm text-muted-foreground">Community Members Served</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary-green/5 to-secondary-green/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-light text-secondary-green mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Partner Organizations</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;