import { ArrowRight, Heart, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToActionBanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
      {/* Subtle geometric patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-r from-white/5 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="h-8 w-8 text-white" />
          </div>
          
          {/* Main content */}
          <h2 className="text-4xl lg:text-5xl font-serif font-light mb-6 leading-tight">
            Ready to Make a Difference?
          </h2>
          
          <p className="text-xl text-white/90 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
            Whether you're seeking legal support, want to partner with us, or are interested 
            in supporting our mission, we're here to help create a more just Tanzania.
          </p>
          
          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link 
              to="/legal-help"
              className="group bg-white hover:bg-neutral-50 text-primary px-8 py-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Get Legal Help</h3>
                <p className="text-sm text-neutral-600 mb-3">Connect with our legal aid services</p>
                <div className="flex items-center justify-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                  Start here
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/partners"
              className="group bg-white hover:bg-neutral-50 text-primary px-8 py-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-teal/20 transition-colors">
                  <Heart className="h-6 w-6 text-secondary-teal" />
                </div>
                <h3 className="font-semibold mb-2">Partner With Us</h3>
                <p className="text-sm text-neutral-600 mb-3">Join our mission for justice</p>
                <div className="flex items-center justify-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
            
            <Link 
              to="/contact"
              className="group bg-white hover:bg-neutral-50 text-primary px-8 py-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-orange/20 transition-colors">
                  <Mail className="h-6 w-6 text-secondary-orange" />
                </div>
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-neutral-600 mb-3">Get in touch with our team</p>
                <div className="flex items-center justify-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                  Get in touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
          
          {/* Secondary CTA */}
          <div className="border-t border-white/20 pt-8">
            <p className="text-white/80 mb-4">
              Stay updated with our latest impact stories and announcements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
              <button className="bg-white hover:bg-neutral-100 text-primary px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionBanner;