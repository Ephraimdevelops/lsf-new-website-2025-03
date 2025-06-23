
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Scale, BookOpen, Lightbulb, Shield } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const approaches = [
  {
    id: 1,
    title: "Grant Making & Management",
    description: "Strategic funding that amplifies grassroots justice initiatives across Tanzania",
    detailedDesc: "We channel resources through transparent, competitive grants that empower local organizations to create lasting change in their communities.",
    icon: <Target className="h-8 w-8" />,
    color: "from-emerald-500 to-teal-600",
    bgPattern: "emerald",
    stats: "$47M+ Disbursed",
    link: "/what-we-do/grant-making",
    image: "/lovable-uploads/background with mother umage .png"
  },
  {
    id: 2,
    title: "Direct Implementation",
    description: "Leading transformative projects that demonstrate best practices and fill critical gaps",
    detailedDesc: "Our hands-on approach ensures immediate impact while building sustainable models that others can replicate across Tanzania.",
    icon: <Users className="h-8 w-8" />,
    color: "from-blue-500 to-indigo-600",
    bgPattern: "blue",
    stats: "200+ Projects Led",
    link: "/what-we-do/direct-implementation",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png"
  },
  {
    id: 3,
    title: "Policy & Advocacy",
    description: "Shaping the legal landscape through strategic advocacy and evidence-based reform",
    detailedDesc: "We work at the systemic level to create enabling environments where justice can flourish for all Tanzanians.",
    icon: <Scale className="h-8 w-8" />,
    color: "from-purple-500 to-violet-600",
    bgPattern: "purple",
    stats: "15+ Reforms Influenced",
    link: "/what-we-do/policy-advocacy",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png"
  },
  {
    id: 4,
    title: "Research & Innovation",
    description: "Pioneering evidence-based solutions that revolutionize access to justice",
    detailedDesc: "Our research drives innovation in legal empowerment, creating new pathways to justice that are scalable and sustainable.",
    icon: <Lightbulb className="h-8 w-8" />,
    color: "from-orange-500 to-red-500",
    bgPattern: "orange",
    stats: "50+ Studies Published",
    link: "/learning-research",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png"
  },
  {
    id: 5,
    title: "Capacity Building",
    description: "Strengthening organizations and individuals to become powerful agents of change",
    detailedDesc: "We invest in human potential, building the skills and systems needed for sustainable legal empowerment.",
    icon: <BookOpen className="h-8 w-8" />,
    color: "from-cyan-500 to-blue-500",
    bgPattern: "cyan",
    stats: "4,000+ Paralegals Trained",
    link: "/what-we-do/capacity-building",
    image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png"
  },
  {
    id: 6,
    title: "Institutional Development",
    description: "Building robust systems that ensure long-term sustainability and growth",
    detailedDesc: "We strengthen the foundation of justice by developing institutions that can continue the work for generations.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-pink-500 to-rose-500",
    bgPattern: "pink",
    stats: "200+ Partners Strengthened",
    link: "/institutional-development",
    image: "/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png"
  }
];

const ImmersiveApproachSection = () => {
  const [activeApproach, setActiveApproach] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
        
        {/* Animated Geometric Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_30%,rgba(59,130,246,0.1)_30%,rgba(59,130,246,0.1)_70%,transparent_70%)] bg-[length:60px_60px] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(-45deg,transparent_30%,rgba(139,92,246,0.1)_30%,rgba(139,92,246,0.1)_70%,transparent_70%)] bg-[length:80px_80px] animate-pulse delay-1000" />
        </div>

        {/* Floating Elements */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-blue-200/50 shadow-lg">
            <Target className="h-6 w-6 mr-4 text-blue-600" />
            <Typography variant="overline" className="text-blue-600 font-bold text-lg">
              OUR APPROACH
            </Typography>
          </div>

          <Typography variant="display" className="font-black text-6xl lg:text-7xl mb-6 leading-tight">
            <span className="text-gray-900">Strategic</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Interventions
            </span>
          </Typography>

          <Typography variant="body" className="text-gray-600 max-w-4xl mx-auto text-xl leading-relaxed">
            Our comprehensive approach ensures that every intervention creates ripple effects of positive change across Tanzania's justice landscape.
          </Typography>
        </div>

        {/* Approaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approaches.map((approach, index) => (
            <div
              key={approach.id}
              className="group relative"
              onMouseEnter={() => {
                setHoveredCard(approach.id);
                setActiveApproach(approach.id);
              }}
              onMouseLeave={() => {
                setHoveredCard(null);
                setActiveApproach(null);
              }}
            >
              {/* Card Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${approach.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700 scale-110`} />
              
              {/* Main Card */}
              <div className={`relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-200/50 hover:border-white transition-all duration-700 hover:scale-105 hover:-translate-y-4 shadow-xl group-hover:shadow-3xl ${
                activeApproach === approach.id ? 'ring-4 ring-blue-500/20' : ''
              }`}>
                
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={approach.image} 
                    alt={approach.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500`} />
                  
                  {/* Floating Icon */}
                  <div className={`absolute top-6 left-6 p-4 rounded-2xl bg-gradient-to-r ${approach.color} shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                    <div className="text-white">{approach.icon}</div>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute bottom-6 right-6">
                    <span className="bg-white/90 text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      {approach.stats}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <Typography variant="h3" className="text-gray-900 font-bold text-xl mb-4 group-hover:text-blue-600 transition-colors">
                    {approach.title}
                  </Typography>

                  <Typography variant="body" className="text-gray-600 mb-6 leading-relaxed">
                    {approach.description}
                  </Typography>

                  {/* Expandable Detailed Description */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    activeApproach === approach.id ? 'max-h-32 opacity-100 mb-6' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                      <Typography variant="bodySmall" className="text-gray-700 leading-relaxed">
                        {approach.detailedDesc}
                      </Typography>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={approach.link}>
                    <button className={`group/btn w-full bg-gradient-to-r ${approach.color} text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center`}>
                      <span>Explore Further</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </button>
                  </Link>
                </div>

                {/* Animated Border */}
                <div className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r ${approach.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />

                {/* Floating Particles on Hover */}
                {hoveredCard === approach.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${approach.color} rounded-full animate-ping`}
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

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/80 backdrop-blur-xl rounded-2xl px-8 py-6 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <Typography variant="body" className="text-gray-700 font-semibold text-lg">
              Want to learn more about our comprehensive approach?
            </Typography>
            <Link to="/what-we-do">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg flex items-center">
                Explore All Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(0px) rotate(180deg); }
          75% { transform: translateY(10px) rotate(270deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ImmersiveApproachSection;
