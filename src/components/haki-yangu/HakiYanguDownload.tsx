import { Smartphone, Shield, Clock, Globe, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const HakiYanguDownload = () => {
  const features = [
    { icon: Shield, label: 'Secure & Private', description: 'Your data is protected' },
    { icon: Clock, label: '24/7 Access', description: 'Anytime, anywhere' },
    { icon: Globe, label: 'Nationwide', description: 'All 168 districts' },
  ];

  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      {/* Background Pattern - Subtle Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left text-white">
            <Typography variant="overline" className="text-white/80 mb-6 text-lg font-bold tracking-[0.3em] uppercase">
              Mobile App
            </Typography>

            <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Justice in Your Pocket
            </Typography>

            <Typography variant="body" className="text-white/90 text-xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Join <strong className="font-bold text-white border-b-2 border-white/30">45,000+ Tanzanians</strong> accessing legal services instantly through the Haki Yangu app.
            </Typography>

            {/* Features - Clean transparent cards */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-white font-bold text-sm">{feature.label}</p>
                </div>
              ))}
            </div>

            {/* App Store Buttons - High contrast */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-black/80 h-16 px-8 rounded-2xl shadow-lg border border-white/10 transition-transform hover:-translate-y-1">
                <Smartphone className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs opacity-70">GET IT ON</div>
                  <div className="text-base font-bold -mt-0.5">Google Play</div>
                </div>
              </Button>
              <Button size="lg" className="bg-black text-white hover:bg-black/80 h-16 px-8 rounded-2xl shadow-lg border border-white/10 transition-transform hover:-translate-y-1">
                <Apple className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs opacity-70">DOWNLOAD ON</div>
                  <div className="text-base font-bold -mt-0.5">App Store</div>
                </div>
              </Button>
            </div>
          </div>

          {/* App Visual - Simplified Premium display */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative z-10">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/20 rounded-[3rem] blur-3xl scale-110"></div>

              {/* Phone mockup */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 border border-white/20 shadow-2xl">
                <img
                  src="/lovable-uploads/2.png"
                  alt="Haki Yangu App"
                  className="w-64 h-auto drop-shadow-2xl mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HakiYanguDownload;
