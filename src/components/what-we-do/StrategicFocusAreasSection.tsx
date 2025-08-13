
import { 
  ArrowRight, 
  DollarSign, 
  Users, 
  Megaphone, 
  BookOpen, 
  Zap,
  Scale, 
  GraduationCap, 
  Heart, 
  FileText, 
  Building, 
  Lightbulb,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

const StrategicFocusAreasSection = () => {
  const approaches = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Grant-Making and Management",
      description: "Funding over 100 organizations to deliver frontline legal aid in underserved regions.",
      image: "public/lovable-uploads/7.png",
      color: "from-primary to-primary-dark",
      link: "/what-we-do/grant-making",
      cta: "Explore Grant-Making"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Direct Project Implementation",
      description: "Designing high-impact programs like Wanawake Tunaweza for legal interventions.",
      image: "public/lovable-uploads/8.png",
      color: "from-primary to-primary-dark",
      link: "/what-we-do/direct-implementation",
      cta: "Discover Our Programs"
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Policy Influence and Advocacy",
      description: "Pushing for justice-centered laws from communities to parliament.",
      image: "public/lovable-uploads/9.png",
      color: "from-primary to-primary-dark",
      link: "/what-we-do/advocacy-policy",
      cta: "Learn About Advocacy"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Research, Monitoring, and Learning",
      description: "Translating evidence into action to improve programs and reforms.",
      image: "public/lovable-uploads/10.png",
      color: "from-primary to-primary-dark",
      link: "/what-we-do/learning-research",
      cta: "Explore Our Research"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Partnerships & Networking",
      description: "Scaling digital tools like Haki Yangu App for low-tech communities.",
      image: "public/lovable-uploads/11.png",
      color: "from-primary to-primary-dark",
      link: "/what-we-do/partnerships-networking",
      cta: "Join Our Network"
    }
  ];

  const focusAreas = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Expanding Access to Legal Aid",
      description: "We scale affordable, high-quality legal aid services so rural, underserved communities—especially women—can secure justice when they need it most.",
      stats: [
        "426,000+ beneficiaries served",
        "105,000+ legal providers supported"
      ],
      image: "/lovable-uploads/Land (Uyui).JPG",
      color: "from-secondary-orange to-secondary-orange/80",
      link: "/focus-areas/accessible-legal-aid",
      cta: "Explore Legal Aid"
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Advancing Legal Empowerment",
      description: "We equip communities with the knowledge, skills, and confidence to understand the law, claim their rights, and advocate for systemic change.",
      stats: [
        "39.8M+ reached via education",
        "Legal clubs and paralegal outreach"
      ],
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop&crop=faces",
      color: "from-secondary-teal to-secondary-teal/80",
      link: "/focus-areas/empowered-communities",
      cta: "Learn Empowerment"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Strengthening Gender Justice",
      description: "We confront gender-based violence, champion equality, and ensure women's rights are upheld through targeted programs, survivor services, and community advocacy.",
      stats: [
        "Sauti ya Mwanamke program",
        "Survivors aided with services"
      ],
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop&crop=faces",
      color: "from-primary to-primary-dark",
      link: "/resources/gender-justice",
      cta: "Discover Gender Justice"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Supporting Legal Reform",
      description: "We work with policymakers and stakeholders to strengthen laws, align policies with human rights, and create a justice system that serves all.",
      stats: [
        "Constitutional and code reforms",
        "Influenced key legal policies"
      ],
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&crop=faces",
      color: "from-secondary-yellow to-secondary-yellow/80",
      link: "/what-we-do/advocacy-policy",
      cta: "See Policy Impact"
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Building Justice Systems",
      description: "We strengthen paralegal units and civil society organisations, ensuring sustainable legal aid infrastructure that delivers long-term systemic improvements.",
      stats: [
        "Toolkits and capacity building",
        "Monitoring justice systems"
      ],
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop&crop=faces",
      color: "from-green-500 to-green-600",
      link: "/focus-areas/institutional-development",
      cta: "Explore Sustainability"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Promoting Inclusive Innovation",
      description: "We leverage technology and innovation to expand legal aid access for youth, persons with disabilities, and communities with limited digital resources.",
      stats: [
        "Haki Yangu App + WhatsApp bots",
        "Legal aid via SMS & USSD"
      ],
      image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=600&fit=crop&crop=faces",
      color: "from-purple-500 to-purple-600",
      link: "/focus-areas/digital-transformation",
      cta: "Discover Innovation"
    }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 13, 109, 0.3); }
          50% { box-shadow: 0 0 30px rgba(163, 15, 112, 0.5); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.5); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        .glow-effect { animation: glow 3s ease-in-out infinite; }
        .shimmer-effect { 
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 3s infinite;
          z-index: 1;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .glass-effect {
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hover-lift:hover {
          transform: translateY(-15px) scale(1.02);
        }
        .magnetic-hover {
          transition: transform 0.3s ease;
        }
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float 8s linear infinite;
        }
      `}</style>

      {/* Strategic Approaches Section */}
      <section id="approaches" className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 gradient-animate"></div>
        
        {/* Floating Particles */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <Container size="xl" className="relative z-10">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20 max-w-5xl mx-auto">
            <div className="inline-flex items-center glass-effect rounded-full px-8 py-4 mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse mr-4"></div>
              <Sparkles className="w-5 h-5 text-primary mr-2 animate-pulse" />
              <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
                HOW WE WORK
              </Text>
            </div>
            
            <div className="relative">
              <Typography variant="h2" className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                Our Proven Approaches to{" "}
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent gradient-animate">
                  Expanding Access to Justice in Tanzania
                </span>
              </Typography>
              
              {/* Glowing underline 
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full glow-effect"></div>*/}
            </div>
            
            <Typography variant="body" className="text-xl text-gray-700 leading-relaxed mt-8 max-w-3xl mx-auto">
              Our five revolutionary approaches drive impactful, sustainable change, empowering communities and transforming justice systems across Tanzania with cutting-edge innovation.
            </Typography>
          </div>

          {/* Enhanced Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className="group hover-lift cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-full">
                  {/* Main Card */}
                  <div className="glass-effect bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full backdrop-blur-xl border border-white/30">
                    {/* Background Image with Parallax Effect */}
                    <div 
                      className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 shimmer-effect"
                      style={{
                        backgroundImage: `url(${approach.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${approach.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="relative z-10 p-10 flex flex-col items-center text-center h-full">
                      {/* Enhanced Icon */}
                      <div className="relative mb-8">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${approach.color} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 float-animation`}>
                          {approach.icon}
                        </div>
                        {/* Icon glow effect */}
                        <div className={`absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${approach.color} opacity-50 blur-xl group-hover:blur-2xl transition-all duration-500`} />
                      </div>
                      
                      <Typography variant="h4" className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                        {approach.title}
                      </Typography>
                      
                      <Typography variant="body" className="text-gray-600 leading-relaxed mb-8 flex-grow">
                        {approach.description}
                      </Typography>
                      
                      {/* Enhanced CTA Button */}
                      <Link to={approach.link} className="mt-auto">
                        <Button className={`group/btn relative overflow-hidden rounded-full px-8 py-4 text-white bg-gradient-to-r ${approach.color} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                          <span className="relative z-10 flex items-center gap-3 font-semibold">
                            {approach.cta}
                            <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </span>
                          {/* Button shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Strategic Focus Areas Section */}
      <section id="focus-areas" className="py-32 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 gradient-animate"></div>
        
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <Container size="xl" className="relative z-10">
          {/* Spectacular Section Header */}
          <div className="text-center mb-20 max-w-5xl mx-auto">
            <div className="inline-flex items-center glass-effect rounded-full px-8 py-4 mb-8 shadow-2xl border border-white/20" style={{animation: 'pulse-glow 3s ease-in-out infinite'}}>
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse mr-4"></div>
              <Sparkles className="w-5 h-5 text-white mr-2 animate-pulse" />
              <Text variant="overline" color="white" className="font-bold text-lg tracking-widest">
                OUR PRIORITIES
              </Text>
            </div>
            
            <Typography variant="h2" className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Our Strategic Focus Areas for{" "}
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent gradient-animate">
                Legal Empowerment and Justice Reform
              </span>
            </Typography>
            
            <Typography variant="body" className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Our six transformative focus areas empower communities, reform systems, and scale sustainable justice across Tanzania with unprecedented impact and innovation.
            </Typography>
          </div>

          {/* Revolutionary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {focusAreas.map((area, index) => (
              <div
                key={index}
                className="group hover-lift cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="glass-effect bg-white/10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden backdrop-blur-xl border border-white/20 h-full">
                  {/* Enhanced Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Image overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                    
                    {/* Floating Icon */}
                    <div className={`absolute top-6 left-6 w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${area.color} shadow-xl float-animation backdrop-blur-sm`}>
                      {area.icon}
                    </div>
                    
                    {/* Shimmer effect overlay */}
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-8 flex flex-col gap-6">
                    <Typography variant="h4" className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                      {area.title}
                    </Typography>

                    <Typography variant="body" className="text-white/80 leading-relaxed">
                      {area.description}
                    </Typography>

                    {/* Enhanced Stats */}
                    <div className="flex flex-col gap-3">
                      {area.stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-3 group/stat">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 group-hover/stat:scale-110 transition-transform duration-300" />
                          <Typography variant="bodySmall" className={`bg-gradient-to-r ${area.color} bg-clip-text text-transparent font-bold text-sm`}>
                            {stat}
                          </Typography>
                        </div>
                      ))}
                    </div>

                    {/* Spectacular CTA Button */}
                    <Link to={area.link} className="mt-4">
                      <Button className={`group/btn relative overflow-hidden w-full rounded-full text-white bg-gradient-to-r ${area.color} shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 py-4`}>
                        <span className="relative z-10 flex items-center justify-center gap-3 font-bold">
                          {area.cta}
                          <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-2 group-hover/btn:scale-110 transition-all duration-300" />
                        </span>
                        {/* Multiple layered effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};

export default StrategicFocusAreasSection;