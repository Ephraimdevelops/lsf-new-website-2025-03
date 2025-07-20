
import { Link } from 'react-router-dom';
import { Download, Smartphone, MapPin, Users, Clock, Shield, Container } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const HakiYanguHighlight = () => {
  return (
    <section className="py-0 lg:py-20 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">

            <div className="text-left mb-12">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
            Digital Legal Aid
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
          Download  <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent"></span>
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
            HAKI Yangu App
            </span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get instant access to legal support, connect with paralegals, and resolve disputes 
          right from your mobile phone. Justice is now just a tap away.
          </p>
         
        </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-primary p-2 rounded-lg flex-shrink-0">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="h4" className="text-neutral-dark mb-1">
                    24/7 Access
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Legal support anytime, anywhere
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-secondary-teal p-2 rounded-lg flex-shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="h4" className="text-neutral-dark mb-1">
                    Expert Paralegals
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Connect with trained professionals
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-secondary-orange p-2 rounded-lg flex-shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="h4" className="text-neutral-dark mb-1">
                    Local Support
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Find help in your community
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-secondary-green p-2 rounded-lg flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="h4" className="text-neutral-dark mb-1">
                    Secure & Private
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    Your information stays protected
                  </Typography>
                </div>
              </div>
            </div>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                <Download className="mr-2 h-5 w-5" />
                Download for Android
              </button>
              <button className="inline-flex items-center justify-center bg-neutral-dark hover:bg-neutral-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                <Download className="mr-2 h-5 w-5" />
                Download for iOS
              </button>
            </div>
            
            {/* App Stats */}
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Typography variant="h3" className="text-primary mb-1">5K+</Typography>
                <Typography variant="small" className="text-neutral-gray">Downloads</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="text-secondary-teal mb-1">4.8</Typography>
                <Typography variant="small" className="text-neutral-gray">Rating</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="text-secondary-orange mb-1">76%</Typography>
                <Typography variant="small" className="text-neutral-gray">Success Rate</Typography>
              </div>
            </div>
          </div>
          
          {/* App Preview */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative max-w-sm mx-auto">
              {/* image  */}
              <div>
                  <img 
                    src="public/lovable-uploads/2.png" 
                    alt="Haki Yangu App Interface" 
                    className="w-full h-full object-cover rounded-t-xxl rounded-b-none"
                  />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <Typography variant="small" className="text-neutral-dark font-medium">Online</Typography>
                </div>
                <Typography variant="bodySmall" className="text-neutral-gray">
                  184 districts covered
                </Typography>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-primary text-white p-4 rounded-xl shadow-lg">
                <Typography variant="small" className="text-white/90 mb-1">Quick Response</Typography>
                <Typography variant="h4" className="text-white">Under 2 hours</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
   
  );
};

export default HakiYanguHighlight;
