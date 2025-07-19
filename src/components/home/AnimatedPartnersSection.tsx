
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Handshake } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const partners = [
  { id: 1, name: "Government of Tanzania", logo: "/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png", category: "government" },
  { id: 2, name: "World Bank", logo: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png", category: "international" },
  { id: 3, name: "USAID", logo: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png", category: "international" },
  { id: 4, name: "Ford Foundation", logo: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png", category: "foundation" },
];

const partnerCategories = [
  {
    key: "government",
    title: "Government Partners",
    description: "Working with national and local government institutions",
    icon: <Globe className="h-6 w-6" />,
    color: "from-blue-500 to-indigo-600",
    count: 12
  },
  {
    key: "international",
    title: "International Organizations",
    description: "Global partnerships for sustainable development",
    icon: <Users className="h-6 w-6" />, 
    color: "from-emerald-500 to-teal-600",
    count: 8
  },
  {
    key: "foundation",
    title: "Foundations & Donors",
    description: "Strategic funding and capacity building partnerships",
    icon: <Handshake className="h-6 w-6" />,
    color: "from-purple-500 to-violet-600",
    count: 15
  },
  {
    key: "civil_society",
    title: "Civil Society",
    description: "Grassroots organizations and community groups",
    icon: <Users className="h-6 w-6" />,
    color: "from-orange-500 to-red-500",
    count: 200
  }
];

const AnimatedPartnersSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredPartners = activeCategory 
    ? partners.filter(partner => partner.category === activeCategory)
    : partners;

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(59,130,246,0.4)_49%,rgba(59,130,246,0.4)_51%,transparent_51%)] bg-[length:20px_20px] animate-pulse" />
        </div>

        {/* Floating Network Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <circle
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r="2"
                fill="rgba(59, 130, 246, 0.3)"
                className="animate-pulse"
                style={{ animationDelay: `${Math.random() * 3}s` }}
              />
              <line
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
                className="animate-pulse"
                style={{ animationDelay: `${Math.random() * 3}s` }}
              />
            </g>
          ))}
        </svg>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-blue-200/50 shadow-lg">
            <Handshake className="h-6 w-6 mr-4 text-blue-600" />
            <Typography variant="overline" className="text-blue-600 font-bold text-lg">
              OUR NETWORK
            </Typography>
          </div>

          <Typography variant="display" className="font-black text-6xl lg:text-7xl mb-6 leading-tight">
            <span className="text-gray-900">Strategic</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Partnerships
            </span>
          </Typography>

          <Typography variant="body" className="text-gray-600 max-w-4xl mx-auto text-xl leading-relaxed">
            Building a powerful network of organizations committed to transforming justice across Tanzania and beyond.
          </Typography>
        </div>

        {/* Partner Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerCategories.map((category, index) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(activeCategory === category.key ? null : category.key)}
              className={`group relative p-8 rounded-3xl border transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                activeCategory === category.key
                  ? 'bg-white border-blue-300 shadow-2xl ring-4 ring-blue-500/20'
                  : 'bg-white/80 border-gray-200 hover:border-blue-300 hover:shadow-xl'
              }`}
            >
              {/* Background Gradient on Active */}
              {activeCategory === category.key && (
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-5 rounded-3xl`} />
              )}

              <div className={`mb-4 p-3 rounded-2xl bg-gradient-to-r ${category.color} inline-flex transition-all duration-300 ${
                activeCategory === category.key ? 'scale-125' : 'group-hover:scale-110'
              }`}>
                <div className="text-white">{category.icon}</div>
              </div>

              <Typography variant="h4" className={`font-bold mb-2 transition-colors ${
                activeCategory === category.key ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
              }`}>
                {category.title}
              </Typography>

              <Typography variant="bodySmall" className="text-gray-600 mb-4 leading-relaxed">
                {category.description}
              </Typography>

              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${category.color} text-white font-bold text-lg`}>
                {category.count}+
              </div>
            </button>
          ))}
        </div>

        {/* Partner Logos Carousel */}
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 shadow-xl">
            <Typography variant="h3" className="text-center text-gray-900 font-bold mb-8">
              {activeCategory 
                ? `${partnerCategories.find(cat => cat.key === activeCategory)?.title} Network`
                : 'Our Global Network'
              }
            </Typography>

            {/* Animated Logo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-8 gap-8 items-center">
              {filteredPartners.map((partner, index) => (
                <div
                  key={partner.id}
                  className={`group relative transition-all duration-700 hover:scale-110 ${
                    currentIndex === index ? 'scale-110 ring-4 ring-blue-500/20 rounded-2xl' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="relative aspect-square bg-white rounded-2xl p-4 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                    />
                    
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-10">
                      {partner.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Partner Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-600 mb-2">235+</div>
                <div className="text-gray-600 font-semibold">Active Partners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-purple-600 mb-2">25+</div>
                <div className="text-gray-600 font-semibold">Countries Reached</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-pink-600 mb-2">15+</div>
                <div className="text-gray-600 font-semibold">Years Building Networks</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white/80 backdrop-blur-xl rounded-2xl px-8 py-6 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <Typography variant="body" className="text-gray-700 font-semibold text-lg">
              Interested in partnering with us to expand justice across Tanzania?
            </Typography>
            <Link to="/partners">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg flex items-center">
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AnimatedPartnersSection;
