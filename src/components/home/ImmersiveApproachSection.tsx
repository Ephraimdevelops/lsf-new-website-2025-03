
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Target, Users, Lightbulb, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const approaches = [
  {
    id: 1,
    title: "Grant Making & Strategic Funding",
    description: "Channeling resources to grassroots justice initiatives through transparent, competitive grants that empower local organizations.",
    icon: <Target className="h-8 w-8" />,
    link: "/approaches/grant-making",
    stats: "500+ grants awarded",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    color: "primary"
  },
  {
    id: 2,
    title: "Direct Implementation",
    description: "Leading key projects directly to demonstrate best practices, fill urgent gaps, and create scalable models for justice delivery.",
    icon: <Users className="h-8 w-8" />,
    link: "/approaches/direct-implementation",
    stats: "200+ projects implemented",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    color: "primary"
  },
  {
    id: 3,
    title: "Research & Innovation",
    description: "Investing in rigorous research and innovative solutions that generate evidence for effective legal empowerment strategies.",
    icon: <Lightbulb className="h-8 w-8" />,
    link: "/approaches/research-innovation",
    stats: "50+ research studies",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    color: "primary"
  },
  {
    id: 4,
    title: "Policy & Advocacy",
    description: "Shaping the policy landscape through strategic advocacy, evidence-backed policy briefs, and systemic reform initiatives.",
    icon: <Handshake className="h-8 w-8" />,
    link: "/approaches/advocacy-policy",
    stats: "25+ policy reforms",
    image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png",
    color: "primary"
  }
];

const ImmersiveApproachSection = () => {
  const [activeApproach, setActiveApproach] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveApproach((prev) => (prev + 1) % approaches.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(1deg); }
            50% { transform: translateY(-20px) rotate(0deg); }
            75% { transform: translateY(-10px) rotate(-1deg); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(147, 30, 92, 0.3); }
            50% { box-shadow: 0 0 40px rgba(147, 30, 92, 0.6); }
          }

          .approach-card {
            transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .approach-card:hover {
            transform: translateY(-12px) scale(1.02);
          }

          .floating-element {
            animation: float 6s ease-in-out infinite;
          }

          .active-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
        `}
      </style>

      <section ref={sectionRef} className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
          
          {/* Floating Background Elements */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute floating-element"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${6 + Math.random() * 3}s`
                }}
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full blur-xl" />
              </div>
            ))}
          </div>
        </div>

        <Container size="xl" className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
              <Target className="h-5 w-5 mr-3 text-primary" />
              <Typography variant="overline" className="text-primary font-bold">
                HOW WE WORK
              </Typography>
            </div>

            <Typography variant="h1" className="mb-6">
              Our Strategic Approaches
            </Typography>

            <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto text-lg">
              We employ four complementary approaches to create lasting change in Tanzania's justice system.
            </Typography>
          </div>

          {/* Interactive Approaches Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {approaches.map((approach, index) => (
              <div
                key={approach.id}
                className={`approach-card group relative bg-white rounded-2xl p-8 border hover:border-primary/30 shadow-lg hover:shadow-xl cursor-pointer ${
                  activeApproach === index ? 'active-glow border-primary/50' : ''
                }`}
                onMouseEnter={() => setActiveApproach(index)}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <img 
                    src={approach.image} 
                    alt={approach.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`p-4 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300 ${
                      activeApproach === index ? 'bg-primary text-white scale-110' : ''
                    }`}>
                      {approach.icon}
                    </div>
                    <div className="flex-1">
                      <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                        {approach.title}
                      </Typography>
                      <Typography variant="body" className="text-gray-600 leading-relaxed">
                        {approach.description}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                      {approach.stats}
                    </div>
                    <Link to={approach.link}>
                      <button className="inline-flex items-center text-primary hover:text-primary-dark font-semibold transition-colors group/btn">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Active Indicator */}
                {activeApproach === index && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-200">
              <Typography variant="body" className="text-gray-700 font-semibold">
                Ready to learn more about our comprehensive approach?
              </Typography>
              <Link to="/what-we-do">
                <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center">
                  Explore Our Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ImmersiveApproachSection;
