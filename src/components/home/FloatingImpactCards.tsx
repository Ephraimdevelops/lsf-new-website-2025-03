
import { useState } from 'react';
import { TrendingUp, Users, Scale, Heart, Award, Globe } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const impactData = [
  {
    id: 1,
    value: "$47M+",
    label: "Disbursed as Grants",
    description: "Strategic funding to legal aid organizations",
    icon: <TrendingUp className="h-12 w-12" />,
    color: "from-emerald-400 to-teal-600",
    bgColor: "emerald",
    delay: "0s"
  },
  {
    id: 2,
    value: "426K+",
    label: "Lives Transformed",
    description: "Direct legal aid beneficiaries",
    icon: <Heart className="h-12 w-12" />,
    color: "from-pink-400 to-rose-600",
    bgColor: "pink",
    delay: "0.2s"
  },
  {
    id: 3,
    value: "105K+",
    label: "Groups Supported",
    description: "Community organizations empowered",
    icon: <Users className="h-12 w-12" />,
    color: "from-blue-400 to-indigo-600",
    bgColor: "blue",
    delay: "0.4s"
  },
  {
    id: 4,
    value: "39.8M+",
    label: "People Reached",
    description: "Through legal education programs",
    icon: <Globe className="h-12 w-12" />,
    color: "from-purple-400 to-purple-600",
    bgColor: "purple",
    delay: "0.6s"
  },
  {
    id: 5,
    value: "15+",
    label: "Years Impact",
    description: "Consistent community transformation",
    icon: <Award className="h-12 w-12" />,
    color: "from-yellow-400 to-orange-500",
    bgColor: "yellow",
    delay: "0.8s"
  },
  {
    id: 6,
    value: "100%",
    label: "Free Services",
    description: "No cost barrier to justice",
    icon: <Scale className="h-12 w-12" />,
    color: "from-cyan-400 to-teal-500",
    bgColor: "cyan",
    delay: "1s"
  }
];

const FloatingImpactCards = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.15)_0%,transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.15)_0%,transparent_50%)] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1)_0%,transparent_70%)] animate-pulse delay-2000" />
        </div>

        {/* Floating Orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <TrendingUp className="h-6 w-6 mr-4 text-emerald-400" />
            <Typography variant="overline" className="text-emerald-400 font-bold text-lg">
              MEASURABLE IMPACT
            </Typography>
          </div>

          <Typography variant="display" className="text-white font-black text-6xl lg:text-7xl mb-6 leading-tight">
            Numbers That
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
              Tell Our Story
            </span>
          </Typography>

          <Typography variant="body" className="text-white/80 max-w-3xl mx-auto text-xl leading-relaxed">
            Every statistic represents lives changed, communities empowered, and justice delivered across Tanzania.
          </Typography>
        </div>

        {/* Floating Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {impactData.map((item, index) => (
            <div
              key={item.id}
              className="group relative transform-gpu"
              style={{ animationDelay: item.delay }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700 scale-110`} />
              
              {/* Main Card */}
              <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-700 transform hover:-translate-y-8 hover:scale-105 hover:rotate-1 shadow-2xl group-hover:shadow-4xl ${
                hoveredCard === item.id ? 'animate-bounce' : ''
              }`}>
                
                {/* Icon with Animation */}
                <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${item.color} inline-flex transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                  <div className="text-white">{item.icon}</div>
                </div>

                {/* Value with Counter Animation */}
                <Typography 
                  variant="display" 
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${item.color} mb-4 font-black text-4xl md:text-5xl transition-all duration-500 group-hover:scale-110`}
                >
                  {item.value}
                </Typography>

                {/* Label */}
                <Typography variant="h3" className="text-white mb-3 font-bold text-xl group-hover:text-white/90 transition-colors">
                  {item.label}
                </Typography>

                {/* Description */}
                <Typography variant="body" className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                  {item.description}
                </Typography>

                {/* Animated Progress Bar */}
                <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transform origin-left transition-all duration-1000 delay-300 ${
                      hoveredCard === item.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </div>

                {/* Floating Particles on Hover */}
                {hoveredCard === item.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${item.color} rounded-full animate-ping`}
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animationDelay: `${Math.random() * 1}s`,
                          animationDuration: `${1 + Math.random()}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-full px-8 py-4 border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-105">
            <Typography variant="body" className="text-white/90 font-semibold text-lg">
              Want to see more detailed impact reports?
            </Typography>
            <a 
              href="/impact" 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 text-black px-6 py-2 rounded-full font-bold hover:from-teal-500 hover:to-emerald-400 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              View Full Report
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FloatingImpactCards;
