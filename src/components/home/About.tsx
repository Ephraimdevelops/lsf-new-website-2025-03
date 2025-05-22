import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-pattern-waves"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">Who We Are</h2>
            <p className="text-lg mb-6 text-neutral-dark">
              We are the leading non-profit organization promoting access to justice for all.
            </p>
            <p className="text-lg mb-8 text-neutral-dark">
              Legal Services Facility (LSF) is a non-profit organization that strives to increase access to justice for all, in particular for women through a legal empowerment approach. Established in 2011, we work with over 180 community-based legal aid providers across all 184 districts of Tanzania.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-md font-bold transition duration-300 text-lg"
            >
              Read More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/background with mother umage .png" 
                alt="Tanzanian paralegals in a community meeting" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-secondary-teal rounded-lg transform translate-x-4 translate-y-4 -z-0 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
