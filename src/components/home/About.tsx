
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Scale, Heart } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-secondary-teal/5 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-secondary-teal/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Floating Icons */}
      <div className="absolute top-20 right-10 opacity-10">
        <Scale size={60} className="text-primary" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Users size={60} className="text-secondary-teal" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary-teal rounded-full"></div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">About LSF</span>
            </div>
            
            <h2 className="mb-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Who We Are
            </h2>
            
            <div className="space-y-6">
              <p className="text-lg text-neutral-dark leading-relaxed">
                We are the leading non-profit organization promoting access to justice for all through innovative legal empowerment approaches.
              </p>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm">
                <p className="text-lg text-neutral-dark leading-relaxed">
                  Legal Services Facility (LSF) is a non-profit organization that strives to increase access to justice for all, in particular for women through a legal empowerment approach. Established in 2011, we work with over 180 community-based legal aid providers across all 184 districts of Tanzania.
                </p>
              </div>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 py-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2011</div>
                  <div className="text-sm text-neutral-gray">Established</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-teal">184</div>
                  <div className="text-sm text-neutral-gray">Districts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-orange">180+</div>
                  <div className="text-sm text-neutral-gray">Partners</div>
                </div>
              </div>
            </div>
            
            <Link 
              to="/about" 
              className="inline-flex items-center bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Read More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="relative">
            {/* Image Container with Enhanced Design */}
            <div className="relative z-10">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/background with mother umage .png" 
                  alt="Tanzanian paralegals in a community meeting" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100 z-20">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-secondary-teal/10 rounded-lg">
                  <Heart className="h-6 w-6 text-secondary-teal" />
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">26,000+</div>
                  <div className="text-sm text-neutral-gray">Lives Transformed</div>
                </div>
              </div>
            </div>
            
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-teal/10 to-primary/10 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary-orange/10 to-secondary-teal/10 rounded-2xl transform -translate-x-2 -translate-y-2 -z-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
