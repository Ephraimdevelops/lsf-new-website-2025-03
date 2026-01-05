import { Smartphone, Shield, Clock, Globe, CheckCircle, Apple, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HakiYanguDownload = () => {
  const features = [
    { icon: <Shield className="h-5 w-5" />, title: '100% Secure', description: 'Enterprise-grade encryption' },
    { icon: <Clock className="h-5 w-5" />, title: '24/7 Access', description: 'Legal help anytime' },
    { icon: <Globe className="h-5 w-5" />, title: 'Nationwide', description: 'All regions covered' },
    { icon: <CheckCircle className="h-5 w-5" />, title: 'Free to Use', description: 'No hidden costs' },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-secondary-teal via-secondary-teal to-secondary-teal-dark text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-3 mb-6 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 border border-white/30">
              <Smartphone className="h-4 w-4" />
              <span className="font-bold text-sm uppercase tracking-widest">Mobile App</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Justice in Your <br />
              <span className="text-secondary-yellow">Pocket</span>
            </h2>

            <p className="text-white/90 text-xl leading-relaxed mb-10 max-w-lg">
              Join <strong>45,000+ Tanzanians</strong> accessing legal services through their smartphones. Download Haki Yangu today.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{feature.title}</h4>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-black hover:bg-black/90 text-white h-16 px-8 rounded-2xl group"
              >
                <Smartphone className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs opacity-70">GET IT ON</div>
                  <div className="text-base font-bold">Google Play</div>
                </div>
              </Button>
              <Button
                size="lg"
                className="bg-black hover:bg-black/90 text-white h-16 px-8 rounded-2xl group"
              >
                <Apple className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs opacity-70">DOWNLOAD ON</div>
                  <div className="text-base font-bold">App Store</div>
                </div>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-10 border-t border-white/20">
              <div>
                <p className="text-3xl font-black">45K+</p>
                <p className="text-white/70 text-sm">Downloads</p>
              </div>
              <div>
                <p className="text-3xl font-black">15%</p>
                <p className="text-white/70 text-sm">Digital Intake</p>
              </div>
              <div>
                <p className="text-3xl font-black">4.5★</p>
                <p className="text-white/70 text-sm">App Rating</p>
              </div>
            </div>
          </div>

          {/* App Visual */}
          <div className="relative">
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden border border-white/20">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-yellow/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

              <img
                src="/lovable-uploads/2.png"
                alt="Haki Yangu App"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-secondary-yellow text-black px-6 py-4 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6" />
                <div>
                  <p className="font-black">Free Download</p>
                  <p className="text-xs opacity-70">iOS & Android</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HakiYanguDownload;
