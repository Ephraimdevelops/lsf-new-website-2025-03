
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section className="py-16 md:py-24 pattern-bg text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Where We Came From</h2>
            <p className="text-lg mb-6">
              Legal Services Facility (LSF) is a basket fund established in 2011 as a 
              non-profit organization that strives to increase access to justice for all, 
              in particular for women through a legal empowerment approach.
            </p>
            <p className="text-lg mb-6">
              Our work focuses on supporting marginalized communities, promoting gender equality, 
              addressing climate justice, and leveraging digital transformation to enhance access to justice.
            </p>
            <Link 
              to="/about" 
              className="inline-block bg-white text-primary hover:bg-opacity-90 px-6 py-3 rounded-md font-bold transition duration-300"
            >
              Learn More About Us
            </Link>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png" 
                alt="LSF Mission" 
                className="rounded-lg shadow-lg"
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
