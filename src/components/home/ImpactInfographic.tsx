
import { TrendingUp, Users, MapPin, Award, Heart, Scale, Zap, Globe } from 'lucide-react';

const ImpactInfographic = () => {
  const impactData = [
    {
      icon: Users,
      value: "26,000+",
      label: "Lives Transformed",
      description: "Individuals directly helped through our programs",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: MapPin,
      value: "184",
      label: "Districts Covered",
      description: "Complete national coverage across Tanzania",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Scale,
      value: "500+",
      label: "Paralegals Trained",
      description: "Community champions delivering justice",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Award,
      value: "15+",
      label: "Policy Changes",
      description: "Legislative improvements influenced",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: Heart,
      value: "85%",
      label: "Success Rate",
      description: "Cases resolved favorably for clients",
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    },
    {
      icon: Zap,
      value: "5,000+",
      label: "Digital Users",
      description: "People helped through Haki Yangu app",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <TrendingUp className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-sm uppercase tracking-wider">Our Impact</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Measuring Justice in Numbers
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Every statistic represents real lives changed, communities empowered, and justice delivered across Tanzania
          </p>
        </div>

        {/* Infographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {impactData.map((item, index) => (
            <div 
              key={index}
              className="group relative"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animation: 'fade-in 0.8s ease-out forwards'
              }}
            >
              {/* Main Card */}
              <div className={`${item.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 backdrop-blur-sm`}>
                {/* Icon with Gradient Background */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  {/* Floating Sparkle */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                </div>
                
                {/* Statistics */}
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.value}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {item.label}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Progress Bar Animation */}
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ 
                        width: '0%',
                        animation: `progress-${index} 2s ease-out ${index * 0.2}s forwards`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Connecting Lines for Visual Flow */}
              {index < impactData.length - 1 && index % 3 !== 2 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/40 to-white/20 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Central Call to Action */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-4xl mx-auto border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <Globe className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Join the Movement for Justice
            </h3>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              These numbers represent just the beginning. Together, we can reach every corner of Tanzania and ensure justice for all.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Involved
              </button>
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-8 py-4 rounded-xl font-bold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Styles for Progress Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress-0 { to { width: 95%; } }
        @keyframes progress-1 { to { width: 100%; } }
        @keyframes progress-2 { to { width: 88%; } }
        @keyframes progress-3 { to { width: 75%; } }
        @keyframes progress-4 { to { width: 85%; } }
        @keyframes progress-5 { to { width: 70%; } }
      `}</style>
    </section>
  );
};

export default ImpactInfographic;
