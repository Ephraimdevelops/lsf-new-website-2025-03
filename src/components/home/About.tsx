
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 md:py-28 pattern-bg text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-panton">Who We Are</h2>
            <p className="text-lg mb-6 text-white/90 font-calibri">
              LSF is a non-profit advancing access to justice in Tanzania. We work with over 
              180 community-based legal aid providers to reach women, children, and marginalized 
              groups in all 184 districts.
            </p>
            <p className="text-lg mb-8 text-white/90 font-calibri">
              Established in 2011, Legal Services Facility (LSF) strives to increase access to justice 
              for all, in particular for women, through a legal empowerment approach focused on marginalized 
              communities, gender equality, climate justice, and digital transformation.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-md font-bold transition duration-300 text-lg font-calibri"
            >
              More About LSF
              <ArrowRight className="ml-2 h-5 w-5" />
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
