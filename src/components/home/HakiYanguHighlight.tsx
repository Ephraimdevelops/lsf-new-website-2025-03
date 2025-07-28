import {
  Smartphone,
  Users,
  Globe,
  Apple,
  Download,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const HakiYanguHighlight = () => {
  const features = [
    {
      icon: <Smartphone className="text-primary w-6 h-6 mt-1" />,
      title: "Accessible by Phone",
      description:
        "Downloadable across devices, Haki Yangu brings legal access to even the most remote communities.",
    },
    {
      icon: <Users className="text-primary w-6 h-6 mt-1" />,
      title: "Connect with Paralegals",
      description:
        "Instantly link with trained community paralegals for legal guidance and support.",
    },
    {
      icon: <Globe className="text-primary w-6 h-6 mt-1" />,
      title: "National Coverage",
      description:
        "Operates across all 31 regions with thousands of active users and local networks.",
    },
  ];

  return (
    <section size="2xl" className=" py-0 lg:py-20 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="flex flex-col py-16 order-2 lg:order-1">
            <div className="text-left mb-0">
              <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-8 py-1 mb-8 border border-primary/20">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse mr-4" />
                <span className="text-sm font-bold uppercase tracking-widest text-primary">
                  Haki Yangu App
                </span>
              </div>
              <h2 className="mb-8 text-5xl md:text-6xl font-bold text-foreground">
                Your Gateway to
                <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                  Digital Justice.
                </span>
              </h2>
            </div>
            <div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                A nationwide mobile platform connecting Tanzanians to legal education, trained paralegals, and real-time justice support—anytime, anywhere.
              </p>
              <div className="space-y-4 mb-8">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4"
                  >
                    <div className="p-3 bg-background rounded-xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="group flex items-center gap-3 px-6 py-3 text-white font-bold rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Smartphone className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Download for Android</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#"
                  className="group flex items-center gap-3 px-6 py-3 text-white font-bold rounded-xl bg-muted hover:bg-muted/90"
                >
                  <Apple className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Download for iPhone</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-full order-1 lg:order-2">
            <img 
              src="/lovable-uploads/2.png" 
              alt="Haki Yangu App Screenshot" 
              className="w-full h-full object-cover rounded-b-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HakiYanguHighlight;
