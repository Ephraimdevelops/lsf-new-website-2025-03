
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Database, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HakiYanguHighlight = () => {
  return (
    <section className="py-16 bg-primary-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4 font-calibri">
              Digital Transformation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-panton">
              Haki Yangu: Justice at Your Fingertips
            </h2>
            <p className="text-lg mb-6 text-neutral-gray font-calibri">
              Our innovative digital platform connects Tanzanians with legal resources and support, 
              making justice accessible to everyone regardless of location or economic status.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 font-panton">Mobile Access</h3>
                  <p className="text-neutral-gray font-calibri">
                    Connect with legal aid providers through our mobile application.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 font-panton">Resource Library</h3>
                  <p className="text-neutral-gray font-calibri">
                    Access legal guides and documents in simple, everyday language.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 font-panton">Expert Support</h3>
                  <p className="text-neutral-gray font-calibri">
                    Connect directly with trained paralegals in your community.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="font-calibri">
                Try Haki Yangu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/digital-transformation">
                <Button variant="outline" size="lg" className="font-calibri">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Haki Yangu App" 
                className="w-full rounded-lg"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-md max-w-xs">
              <div className="flex items-center mb-2">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600 font-calibri">Online Now</span>
              </div>
              <p className="text-neutral-gray text-sm font-calibri">
                5,000+ users accessing legal aid through Haki Yangu
              </p>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-md max-w-xs">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-primary font-calibri">Impact</span>
              </div>
              <p className="text-neutral-gray text-sm font-calibri">
                76% of users report successful resolution of legal matters
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HakiYanguHighlight;
