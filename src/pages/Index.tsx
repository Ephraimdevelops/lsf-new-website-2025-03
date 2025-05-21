
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import FocusAreas from '../components/home/FocusAreas';
import Publications from '../components/home/Publications';
import SuccessStories from '../components/home/SuccessStories';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import FeaturedNewsCarousel from '../components/home/FeaturedNewsCarousel';
import NewsTicker from '../components/home/NewsTicker';
import LegalAidFinder from '../components/home/LegalAidFinder';
import HakiYanguHighlight from '../components/home/HakiYanguHighlight';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { analyticsService } from '@/services/api';

const Index = () => {
  // Track homepage visits
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await analyticsService.recordPageView('/');
      } catch (error) {
        console.error("Failed to record page view:", error);
      }
    };
    
    trackPageView();
  }, []);

  return (
    <Layout>
      {/* Section 1: Hero with News Ticker */}
      <Hero />
      <NewsTicker />
      
      {/* Section 2: Our Impact & Strategic Focus Areas */}
      <ImpactStats />
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 font-panton">Our Focus Areas</h2>
              <p className="text-neutral-gray max-w-2xl font-calibri">
                Explore our key program areas where we're making a difference across Tanzania.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/what-we-do">
                <Button variant="outline" className="font-calibri">
                  See Our Approach
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <FocusAreas />
        </div>
      </section>
      
      {/* Section 3: Publications */}
      <section className="bg-neutral-light py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 font-panton">Latest Publications</h2>
              <p className="text-neutral-gray max-w-2xl font-calibri">
                Research, reports, and resources to support justice and legal empowerment.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/publications">
                <Button variant="outline" className="font-calibri">
                  View All Publications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <Publications />
        </div>
      </section>
      
      {/* Section 4: Testimonials / Our Heroes */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-panton">Our Heroes</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto font-calibri">
              Meet the people whose lives have been transformed through our work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {heroes.map((hero, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={hero.image} 
                    alt={hero.name} 
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 font-panton">{hero.name}</h3>
                  <p className="text-neutral-gray mb-4 font-calibri">
                    <em>"{hero.quote}"</em>
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-dark font-calibri">{hero.location}</span>
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded font-calibri">{hero.program}</span>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Section 5: About Us */}
      <About />
      
      {/* Section 6: Haki Yangu Highlight */}
      <HakiYanguHighlight />
      
      {/* Section 7: Get Legal Help */}
      <LegalAidFinder />
      
      {/* Additional: Featured News (Optional if needed elsewhere) */}
      <FeaturedNewsCarousel />
      
      {/* Contact section at bottom */}
      <Contact />
    </Layout>
  );
};

// Updated heroes data based on real impact stories
const heroes = [
  {
    name: "Mariam Kombo",
    location: "Dodoma, Tanzania",
    program: "Gender Justice",
    quote: "After facing eviction from my family land, LSF's paralegal helped me secure my property rights and restore my livelihood.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Mwanza Youth Legal Club",
    location: "Mwanza, Tanzania",
    program: "Youth Empowerment",
    quote: "Our school legal club has taught over 200 students about their rights and how to access justice when needed.",
    image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Joseph Masanja",
    location: "Arusha, Tanzania",
    program: "Digital Transformation",
    quote: "Through the Haki Yangu app, I was able to connect with a paralegal who helped my community resolve a critical water rights dispute.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

export default Index;
