
import { ArrowRight, Users, Globe, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const ImpactHighlight = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="text-m font-semibold">Our Impact in Numbers</span>
            </div>
            
            <h2 className="text-[45px] font-black leading-[47.7px] mb-6" style={{ fontFamily: 'Avenir, sans-serif' }}>
              Transforming Lives Across Tanzania
            </h2>
            
            <p className="text-[20px] font-light leading-[35px] mb-8 text-white/90" style={{ fontFamily: 'akzidenz-grotesk, Arial, Helvetica, sans-serif' }}>
              Through community partnerships and innovative approaches, we're building a more just society where everyone has access to legal protection and empowerment.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-black mb-2 text-secondary-orange">426K+</div>
                <div className="text-sm text-white/80">People Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black mb-2 text-secondary-teal">184</div>
                <div className="text-sm text-white/80">Districts Reached</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black mb-2 text-secondary-yellow">105K+</div>
                <div className="text-sm text-white/80">Groups Supported</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black mb-2 text-white">$47M+</div>
                <div className="text-sm text-white/80">Grants Disbursed</div>
              </div>
            </div>

            <Link 
              to="/about"
              className="inline-flex items-center bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Learn About Our Impact
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Visual with Real LSF Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png"
                alt="LSF legal aid consultation session"
                className="rounded-lg shadow-lg aspect-square object-cover"
              />
              <img 
                src="/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png"
                alt="Community legal awareness gathering"
                className="rounded-lg shadow-lg aspect-square object-cover mt-8"
              />
              <img 
                src="/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png"
                alt="LSF community workshop on legal rights"
                className="rounded-lg shadow-lg aspect-square object-cover -mt-8"
              />
              <img 
                src="/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png"
                alt="LSF staff and community members"
                className="rounded-lg shadow-lg aspect-square object-cover"
              />
            </div>
            
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-primary p-6 rounded-lg shadow-xl max-w-xs">
              <div className="flex items-center mb-3">
                <Award className="h-8 w-8 text-secondary-orange mr-3" />
                <div>
                  <div className="text-2xl font-black text-primary">96%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
              <p className="text-xs text-gray-700">
                Of legal cases resolved successfully through our paralegal network
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactHighlight;
