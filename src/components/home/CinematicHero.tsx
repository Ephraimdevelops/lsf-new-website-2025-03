import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Sparkles, Shield, Heart, Users } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';

const heroSlides = [
  {
    id: 1,
    heroName: "Amina Hassan",
    story: "Amina reclaimed her family's land and now advocates for women's rights in her community.",
    image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png",
    beneficiaryImage: "public/lovable-uploads/3.png",
    stat: "500+",
    statLabel: "Families Helped",
    color: "from-primary to-primary-dark",
    particles: "primary"
  },
  {
    id: 2,
    heroName: "James Mwalimu",
    story: "James resolved over 200 cases as a community paralegal, becoming a beacon of hope.",
    image: "/lovable-uploads/james-mwalimu.png",
    beneficiaryImage: "/lovable-uploads/james-beneficiary.png",
    stat: "200+",
    statLabel: "Cases Resolved",
    color: "from-primary to-primary-dark",
    particles: "primary"
  },
  {
    id: 3,
    heroName: "Sarah Kimaro",
    story: "Sarah escaped domestic violence and now helps other women find their voice.",
    image: "/lovable-uploads/sarah-kimaro.png",
    beneficiaryImage: "/lovable-uploads/sarah-beneficiary.png",
    stat: "100+",
    statLabel: "Women Empowered",
    color: "from-primary to-primary-dark",
    particles: "primary"
  },
  {
    id: 4,
    heroName: "Fatuma Juma",
    story: "Fatuma secured educational rights for children in her village with LSF’s support.",
    image: "/lovable-uploads/fatuma-juma.png",
    beneficiaryImage: "/lovable-uploads/fatuma-beneficiary.png",
    stat: "300+",
    statLabel: "Children Educated",
    color: "from-primary to-primary-dark",
    particles: "primary"
  },
  {
    id: 5,
    heroName: "David Mbise",
    story: "David led environmental protection efforts to save his village’s natural resources.",
    image: "/lovable-uploads/david-mbise.png",
    beneficiaryImage: "/lovable-uploads/david-beneficiary.png",
    stat: "1000+",
    statLabel: "Trees Planted",
    color: "from-primary to-primary-dark",
    particles: "primary"
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
    const handleMouseMove = (e) => {
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
          className="absolute inset-0 bg-cover bg-center transition-all duration-8000 ease-in-out transform scale-110"
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
          {/* Beneficiary Image (Floating Left Section) */}
          <div className="lg:col-span-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700" />
              <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl p-10 border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-105 shadow-2xl">
                <img
                  src={currentSlideData.beneficiaryImage}
                  alt={currentSlideData.heroName}
                  className="w-full h-auto rounded-2xl object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 text-white">
          
            {/* Main Headlines with 3D Effect */}
            <div className="mb-12">
              <Typography 
                variant="display" 
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[0.85] text-white drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                style={{
                  textShadow: '0 0 60px rgba(255,255,255,0.3), 0 0 120px rgba(255,255,255,0.1)',
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`
                }}
              >
                Our Heroes
              </Typography>
              <Typography 
                variant="h1" 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark drop-shadow-lg"
              >
                {currentSlideData.heroName}
              </Typography>
            </div>

            {/* Description with Glassmorphism */}
            <div className="relative mb-12 group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/10 backdrop-blur-xl border-l-4 border-primary rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500">
                <Typography variant="body" className="text-md md:text-lg lg:text-xl text-white/95 leading-relaxed max-w-4xl">
                  {currentSlideData.story}
                </Typography>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-8">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-10 py-6 text-xl font-black rounded-2xl shadow-2xl hover:shadow-primary/50 transform hover:-translate-y-4 hover:scale-110 transition-all duration-500"
                asChild
              >
                <Link to={`/heroes/${currentSlideData.id}`} className="flex items-center gap-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Shield className="h-6 w-6 group-hover:animate-bounce" />
                  <span>Read {currentSlideData.heroName}'s Story</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group relative overflow-hidden border-3 border-white/70 text-white hover:bg-white/20 hover:border-white backdrop-blur-xl px-10 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500"
                asChild
              >
                <Link to="/heroes" className="flex items-center gap-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Play className="h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
                  <span>Meet More Heroes</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { icon: Shield, label: "100% Free Services", color: "text-primary" },
                { icon: Heart, label: "426K+ Lives Changed", color: "text-primary" },
                { icon: Star, label: "15+ Years Experience", color: "text-primary" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-white/90 font-semibold">{item.label}</span>
                </div>
              ))}
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
                  ? 'bg-gradient-to-r from-primary to-primary-dark shadow-lg shadow-primary/50' 
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