
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Sparkles, Shield, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const heroSlides = [
  {
    id: 1,
    title: "Transforming",
    subtitle: "Lives Through Justice",
    description: "Every person deserves access to justice. We're making it happen across Tanzania, one community at a time.",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    stat: "426K+",
    statLabel: "Lives Transformed",
    color: "from-purple-600 to-blue-600",
    particles: "purple"
  },
  {
    id: 2,
    title: "Empowering",
    subtitle: "Communities to Thrive",
    description: "Building sustainable legal empowerment systems that reach every corner of Tanzania.",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    stat: "105K+",
    statLabel: "Groups Supported",
    color: "from-emerald-600 to-teal-600",
    particles: "emerald"
  },
  {
    id: 3,
    title: "Innovating",
    subtitle: "Justice for All",
    description: "Revolutionary approaches to legal aid that break barriers and create lasting change.",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    stat: "$47M+",
    statLabel: "Impact Investment",
    color: "from-orange-600 to-red-600",
    particles: "orange"
  }
];

const CinematicHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Background with Parallax */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-[8000ms] ease-in-out transform scale-110"
          style={{ 
            backgroundImage: `url(${currentSlideData.image})`,
            transform: `scale(1.1) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        
        {/* Dynamic Color Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.color} opacity-90 transition-all duration-8000`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/60" />
        
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)] animate-pulse delay-2000" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-white/20 rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <Container size="xl" className="relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen py-20">
          {/* Main Content */}
          <div className="lg:col-span-8 text-white">
            {/* Floating Stats Badge */}
            <div className="flex items-center gap-6 mb-12">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative bg-white/20 backdrop-blur-xl rounded-full px-8 py-6 border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-center gap-4">
                    <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
                    <div>
                      <div className="text-3xl font-bold text-white">{currentSlideData.stat}</div>
                      <div className="text-white/80 text-sm font-medium">{currentSlideData.statLabel}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="text-white/90 font-semibold text-lg">15+ Years Impact</span>
              </div>
            </div>

            {/* Main Headlines with 3D Effect */}
            <div className="mb-12">
              <Typography 
                variant="display" 
                className="text-8xl md:text-9xl lg:text-[10rem] font-black mb-6 leading-[0.85] text-white drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                style={{
                  textShadow: '0 0 60px rgba(255,255,255,0.3), 0 0 120px rgba(255,255,255,0.1)',
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`
                }}
              >
                {currentSlideData.title}
              </Typography>
              <Typography 
                variant="h1" 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 drop-shadow-lg"
              >
                {currentSlideData.subtitle}
              </Typography>
            </div>

            {/* Description with Glassmorphism */}
            <div className="relative mb-12 group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/10 backdrop-blur-xl border-l-4 border-yellow-400 rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500">
                <Typography variant="body" className="text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed max-w-4xl">
                  {currentSlideData.description}
                </Typography>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-8">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-pink-500 text-black px-12 py-8 text-2xl font-black rounded-2xl shadow-2xl hover:shadow-yellow-500/50 transform hover:-translate-y-4 hover:scale-110 transition-all duration-500"
                asChild
              >
                <Link to="/legal-help" className="flex items-center gap-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Shield className="h-8 w-8 group-hover:animate-bounce" />
                  <span>Get Legal Help Now</span>
                  <ArrowRight className="h-8 w-8 group-hover:translate-x-3 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group relative overflow-hidden border-3 border-white/70 text-white hover:bg-white/20 hover:border-white backdrop-blur-xl px-12 py-8 text-2xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500"
                asChild
              >
                <Link to="/what-we-do" className="flex items-center gap-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Play className="h-7 w-7 group-hover:scale-125 transition-transform duration-300" />
                  <span>Watch Our Story</span>
                  <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { icon: Shield, label: "100% Free Services", color: "text-green-400" },
                { icon: Heart, label: "426K+ Lives Changed", color: "text-pink-400" },
                { icon: Star, label: "15+ Years Experience", color: "text-yellow-400" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                  <span className="text-white/90 font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Action Panel */}
          <div className="lg:col-span-4">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
              
              <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl p-10 border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-105 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-8 py-4 mb-6 shadow-lg">
                    <Sparkles className="h-6 w-6 text-black animate-pulse" />
                    <span className="text-black font-black uppercase tracking-wider text-lg">Quick Access</span>
                  </div>
                  <Typography variant="h2" className="text-white mb-4 font-black text-3xl">
                    Need Legal Help?
                  </Typography>
                  <Typography variant="body" className="text-white/80 text-lg">
                    Get immediate assistance or learn about our services
                  </Typography>
                </div>

                <div className="space-y-6">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-500 text-white py-6 text-xl font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/50 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300" asChild>
                    <Link to="/legal-help">
                      <Shield className="mr-3 h-6 w-6" />
                      Find Legal Aid
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full border-2 border-white/70 text-white hover:bg-white/20 hover:border-white py-6 text-xl font-bold rounded-2xl backdrop-blur-sm transform hover:-translate-y-1 hover:scale-105 transition-all duration-300" asChild>
                    <Link to="/contact">
                      <Heart className="mr-3 h-6 w-6" />
                      Contact Us
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" className="w-full text-white/90 hover:bg-white/10 py-6 text-xl font-bold rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300" asChild>
                    <Link to="/resources">
                      Learn More
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Link>
                  </Button>
                </div>

                {/* Enhanced Trust Indicators */}
                <div className="mt-10 pt-8 border-t border-white/20">
                  <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      15+ Years Experience
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500" />
                      100% Free Services
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <span className="flex items-center justify-center gap-2 text-white/90 font-bold">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-1000" />
                      426K+ People Helped
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Slide Navigation */}
        <div className="absolute bottom-8 left-8 flex gap-4 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`group relative w-16 h-2 rounded-full transition-all duration-500 ${
                currentSlide === index 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50' 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                currentSlide === index ? 'bg-white/30 blur-sm scale-150' : ''
              }`} />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CinematicHero;
