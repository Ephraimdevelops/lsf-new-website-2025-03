
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-panton text-neutral-dark">Who We Are</h2>
            <p className="text-lg mb-6 text-neutral-dark font-calibri">
              We are the leading non-profit organization promoting access to justice for all.
            </p>
            <p className="text-lg mb-8 text-neutral-dark font-calibri">
              Legal Services Facility (LSF) is a leading non-profit organization that strives to increase access to justice for all, in particular for women through a legal empowerment approach. Established in 2011, we work with over 180 community-based legal aid providers across all 184 districts of Tanzania.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-md font-bold transition duration-300 text-lg font-calibri"
            >
              Read More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Tanzanian paralegals in a community meeting" 
                className="rounded-lg shadow-lg w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-secondary-teal rounded-lg transform translate-x-4 translate-y-4 -z-0 opacity-50"></div>
            
            {/* Call to action card */}
            <div className="absolute -bottom-10 -left-10 bg-primary p-6 rounded-lg shadow-lg max-w-xs text-white z-20">
              <h3 className="text-xl font-panton mb-2">Need Legal Aid?</h3>
              <p className="font-calibri mb-4">CALL A PARALEGAL</p>
              <div className="flex flex-col gap-2">
                <a href="tel:+255800110303" className="bg-white text-primary hover:bg-white/90 px-4 py-2 rounded text-center font-bold transition-colors font-calibri">
                  Call Now
                </a>
                <a href="#haki-yangu" className="bg-secondary-teal text-white hover:bg-secondary-teal/90 px-4 py-2 rounded text-center font-bold transition-colors font-calibri">
                  Download Haki Yangu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
