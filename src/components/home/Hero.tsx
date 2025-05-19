
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-primary pattern-bg text-white min-h-[75vh] flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/140e859b-26c6-4b1b-a99e-a8efaf084eb8.png"
              alt="LSF Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-panton font-bold mb-6">
            Promoting Justice for All
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-calibri">
            We are an independent basket fund promoting justice for all in Tanzania, 
            with a focus on legal empowerment, gender justice, climate justice, and digital transformation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/programs" 
              className="bg-white text-primary hover:bg-opacity-90 px-8 py-3 rounded-md font-bold transition duration-300 flex items-center font-calibri"
            >
              Our Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/donate" 
              className="bg-secondary-orange hover:bg-opacity-90 px-8 py-3 rounded-md font-bold transition duration-300 font-calibri"
            >
              Support Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="hidden lg:block absolute right-0 bottom-0 w-1/3 h-full opacity-20">
        <div className="w-full h-full bg-contain bg-no-repeat bg-right-bottom" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')" }}>
        </div>
      </div>
    </section>
  );
};

export default Hero;
