
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ImpactStats from '../components/home/ImpactStats';
import Programs from '../components/home/Programs';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import FeaturedNewsCarousel from '../components/home/FeaturedNewsCarousel';
import Publications from '../components/home/Publications';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedNewsCarousel />
      <ImpactStats />
      
      {/* Featured Programs Section */}
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
          <Programs />
        </div>
      </section>
      
      {/* Publications Section */}
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
      
      {/* Heroes Section */}
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
      
      <About />
      <Contact />
    </Layout>
  );
};

// Sample heroes data
const heroes = [
  {
    name: "Grace Mwakipesile",
    location: "Dodoma, Tanzania",
    program: "Legal Empowerment",
    quote: "When I was wrongfully evicted from my land, the community paralegal trained by LSF helped me reclaim my property.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Mwanza Women's Collective",
    location: "Mwanza, Tanzania",
    program: "Gender Justice",
    quote: "The legal empowerment program has transformed how our community addresses gender-based violence.",
    image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Samuel Kioko",
    location: "Arusha, Tanzania",
    program: "Digital Transformation",
    quote: "The mobile legal aid clinic reached our remote village and provided crucial services we needed.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

export default Index;
