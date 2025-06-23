
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket, Heart, Scale, Shield, Sparkles, Star } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const FuturisticCallToAction = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />
        
        {/* Animated Mesh Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-50"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-l from-teal-400/10 via-blue-500/10 to-purple-600/10 opacity-30"
            style={{
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
            }}
          />
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_48%,rgba(255,255,255,0.1)_52%,transparent_52%)] bg-[length:40px_40px] animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_48%,rgba(255,255,255,0.05)_48%,rgba(255,255,255,0.05)_52%,transparent_52%)] bg-[length:60px_60px] animate-pulse delay-1000" />
        </div>

        {/* Floating Orbs */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 16}px`,
              height: `${8 + Math.random() * 16}px`,
              background: `radial-gradient(circle, ${
                ['rgba(59,130,246,0.3)', 'rgba(139,92,246,0.3)', 'rgba(236,72,153,0.3)', 'rgba(34,197,94,0.3)'][Math.floor(Math.random() * 4)]
              }, transparent)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Dynamic Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-blue-400/40 via-transparent to-transparent transform -skew-x-12 animate-pulse" />
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-purple-400/40 via-transparent to-transparent transform skew-x-12 animate-pulse delay-1000" />
          <div className="absolute top-0 left-2/3 w-1 h-full bg-gradient-to-b from-pink-400/40 via-transparent to-transparent transform -skew-x-12 animate-pulse delay-2000" />
        </div>
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center">
          {/* Floating Badge */}
          <div 
            className="inline-flex items-center mb-12 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 scale-150" />
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-8 py-4 border border-white/30 shadow-2xl">
                <div className="flex items-center gap-4">
                  <Sparkles className="h-6 w-6 text-black animate-pulse" />
                  <Typography variant="overline" className="text-black font-black text-lg uppercase tracking-wider">
                    Join the Movement
                  </Typography>
                  <Sparkles className="h-6 w-6 text-black animate-pulse delay-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-12">
            <Typography 
              variant="display" 
              className="text-white font-black text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-6"
              style={{
                textShadow: '0 0 100px rgba(255,255,255,0.3), 0 0 200px rgba(59,130,246,0.2)',
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`
              }}
            >
              Be Part of the
            </Typography>
            <Typography 
              variant="display" 
              className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 font-black text-7xl md:text-8xl lg:text-9xl leading-[0.9]"
              style={{
                textShadow: '0 0 60px rgba(255,165,0,0.5)',
              }}
            >
              Justice Revolution
            </Typography>
          </div>

          {/* Description */}
          <div className="relative mb-16 group max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/30 hover:border-white/50 transition-all duration-500">
              <Typography variant="body" className="text-white/95 text-2xl md:text-3xl leading-relaxed">
                Whether you need legal assistance, want to support our mission, or partner with us to create change – 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-bold"> there's a place for you in our community.</span>
              </Typography>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {[
              {
                title: "Get Legal Help",
                description: "Access free legal assistance and guidance",
                icon: <Scale className="h-10 w-10" />,
                color: "from-emerald-500 to-teal-600",
                link: "/legal-help",
                bgColor: "emerald"
              },
              {
                title: "Support Our Mission",
                description: "Make a donation to expand justice access",
                icon: <Heart className="h-10 w-10" />,
                color: "from-pink-500 to-rose-600",
                link: "/donate",
                bgColor: "pink"
              },
              {
                title: "Partner With Us",
                description: "Collaborate to create lasting change",
                icon: <Shield className="h-10 w-10" />,
                color: "from-blue-500 to-indigo-600",
                link: "/contact",
                bgColor: "blue"
              }
            ].map((card, index) => (
              <Link key={index} to={card.link} className="group block">
                <div className="relative">
                  {/* Card Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700 scale-110`} />
                  
                  {/* Main Card */}
                  <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl p-10 border border-white/30 hover:border-white/50 transition-all duration-700 hover:scale-110 hover:-translate-y-8 shadow-2xl hover:shadow-4xl">
                    
                    {/* Icon */}
                    <div className={`mb-8 p-6 rounded-3xl bg-gradient-to-r ${card.color} inline-flex transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-2xl`}>
                      <div className="text-white">{card.icon}</div>
                    </div>

                    {/* Content */}
                    <Typography variant="h2" className="text-white font-black text-2xl mb-4 group-hover:text-yellow-400 transition-colors">
                      {card.title}
                    </Typography>
                    
                    <Typography variant="body" className="text-white/80 text-lg leading-relaxed mb-8">
                      {card.description}
                    </Typography>

                    {/* Action Button */}
                    <div className={`inline-flex items-center bg-gradient-to-r ${card.color} text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}>
                      <span>Get Started</span>
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-2 h-2 bg-gradient-to-r ${card.color} rounded-full animate-ping`}
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${1 + Math.random()}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-12 mb-16">
            {[
              { icon: Star, label: "15+ Years Impact", color: "text-yellow-400" },
              { icon: Shield, label: "100% Free Services", color: "text-green-400" },
              { icon: Heart, label: "426K+ Lives Changed", color: "text-pink-400" },
              { icon: Rocket, label: "Innovation Leader", color: "text-blue-400" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110">
                <item.icon className={`h-8 w-8 ${item.color} animate-pulse`} />
                <span className="text-white/90 font-bold text-lg">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-500/50 rounded-full blur-3xl scale-150" />
            <Typography variant="body" className="relative text-white/80 text-xl font-semibold">
              Join thousands of Tanzanians who have already transformed their communities through justice.
            </Typography>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FuturisticCallToAction;
