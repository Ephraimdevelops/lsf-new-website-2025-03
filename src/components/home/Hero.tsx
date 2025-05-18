
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-primary pattern-bg text-white min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Promoting Justice for All
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            We are an independent basket fund promoting justice for all in Tanzania, 
            with a focus on legal empowerment, gender justice, climate justice, and digital transformation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/programs" 
              className="bg-white text-primary hover:bg-opacity-90 px-8 py-3 rounded-md font-bold transition duration-300 flex items-center"
            >
              Our Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/donate" 
              className="bg-secondary-orange hover:bg-opacity-90 px-8 py-3 rounded-md font-bold transition duration-300"
            >
              Support Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="hidden lg:block absolute right-0 bottom-0 w-1/3 h-full opacity-20">
        <div className="w-full h-full bg-contain bg-no-repeat bg-right-bottom" 
             style={{ backgroundImage: "url('/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png')" }}>
        </div>
      </div>
    </section>
  );
};

export default Hero;
