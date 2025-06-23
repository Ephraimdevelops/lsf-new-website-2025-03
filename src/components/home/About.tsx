
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Scale } from 'lucide-react';
import { Container, Heading, Text } from '../design-system';

const About = () => {
  return (
    <Container size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content */}
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Heart className="h-5 w-5 mr-3 text-primary" />
            <Text variant="overline" className="text-primary font-bold text-sm">
              ABOUT US
            </Text>
          </div>
          
          <Heading variant="hero" className="mb-6 font-heading text-4xl md:text-5xl">
            Transforming Lives Through 
            <span className="text-primary block mt-2">Accessible Justice</span>
          </Heading>
          
          <Text variant="body-large" className="text-neutral-600 mb-8 text-lg leading-relaxed">
            For over a decade, the Legal Services Facility has been at the forefront of 
            expanding access to justice across Tanzania. We bridge the gap between communities 
            and legal services through innovative approaches, strategic partnerships, and 
            unwavering commitment to equality.
          </Text>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">12+</div>
              <div className="text-sm text-neutral-600">Years Impact</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-teal mb-2">1M+</div>
              <div className="text-sm text-neutral-600">Lives Touched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-orange mb-2">25</div>
              <div className="text-sm text-neutral-600">Regions</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/about" 
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Our Story
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/impact" 
              className="inline-flex items-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              See Our Impact
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="order-1 lg:order-2">
          <div className="relative">
            <img 
              src="/lovable-uploads/background with mother umage .png"
              alt="Community empowerment through legal services"
              className="w-full h-[500px] object-cover rounded-xl shadow-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl"></div>
            
            {/* Floating stats */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <div className="font-bold text-lg">4,000+</div>
                      <div className="text-sm text-neutral-600">Paralegals Trained</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Scale className="h-8 w-8 text-secondary-teal" />
                    <div>
                      <div className="font-bold text-lg">184</div>
                      <div className="text-sm text-neutral-600">Communities Served</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default About;
