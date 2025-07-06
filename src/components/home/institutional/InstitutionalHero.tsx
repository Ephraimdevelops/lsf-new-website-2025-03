import { ArrowRight, Globe, Users, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstitutionalHero = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Clean geometric background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-r from-secondary-teal/5 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 lg:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-7">
            {/* UN-style badge */}
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
              <Globe className="h-5 w-5 mr-3 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Legal Support Facility
              </span>
            </div>
            
            {/* Main headline - UN serif style */}
            <h1 className="text-5xl lg:text-7xl font-serif font-light text-neutral-900 mb-8 leading-tight">
              Justice for
              <span className="block font-medium text-primary">Everyone</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-neutral-600 mb-12 leading-relaxed max-w-2xl font-light">
              Empowering communities across Tanzania through accessible legal services, 
              innovative technology, and sustainable partnerships.
            </p>
            
            {/* Apple-style CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link 
                to="/what-we-do"
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md"
              >
                Explore Our Work
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <Link 
                to="/impact"
                className="inline-flex items-center justify-center border-2 border-neutral-300 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-[1.02] bg-white hover:bg-neutral-50"
              >
                View Impact Report
              </Link>
            </div>
            
            {/* Key metrics - UN institutional style */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2.8M+</div>
                <div className="text-sm text-neutral-600 uppercase tracking-wide">People Reached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-teal mb-2">31</div>
                <div className="text-sm text-neutral-600 uppercase tracking-wide">Regions Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-orange mb-2">78%</div>
                <div className="text-sm text-neutral-600 uppercase tracking-wide">Success Rate</div>
              </div>
            </div>
          </div>
          
          {/* Right visual */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary-teal/10 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/background with mother umage .png"
                  alt="LSF empowering communities"
                  className="w-full h-96 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Scale className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Legal Empowerment</h3>
                      <p className="text-sm text-neutral-600">Accessible justice for all</p>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionalHero;