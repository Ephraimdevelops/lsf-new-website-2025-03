
import { Scale, Heart, Users, Shield, Lightbulb } from 'lucide-react';

const KeyPrinciples = () => {
  const principles = [
    {
      icon: Scale,
      title: "We are independent, impartial, and neutral",
      description: "Our work is guided by legal principles, not political agendas.",
      color: "from-primary/10 to-primary/20",
      iconColor: "text-primary",
      borderColor: "border-primary/20"
    },
    {
      icon: Heart,
      title: "We are guided by compassion and empathy",
      description: "Every person deserves dignity and access to justice.",
      color: "from-secondary-teal/10 to-secondary-teal/20",
      iconColor: "text-secondary-teal",
      borderColor: "border-secondary-teal/20"
    },
    {
      icon: Users,
      title: "We are committed to community empowerment",
      description: "Local solutions for local challenges, building sustainable change.",
      color: "from-secondary-orange/10 to-secondary-orange/20",
      iconColor: "text-secondary-orange",
      borderColor: "border-secondary-orange/20"
    },
    {
      icon: Shield,
      title: "We are transparent and accountable",
      description: "Open about our methods, impact, and use of resources.",
      color: "from-secondary-yellow/10 to-secondary-yellow/20",
      iconColor: "text-secondary-yellow",
      borderColor: "border-secondary-yellow/20"
    },
    {
      icon: Lightbulb,
      title: "We are committed to innovation and excellence",
      description: "Constantly improving our approaches to maximize impact.",
      color: "from-purple-100 to-purple-200",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary-teal/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-secondary-orange/5 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Our Foundation</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-6 bg-gradient-to-r from-neutral-dark via-primary to-secondary-teal bg-clip-text text-transparent leading-tight">
            The Principles That Drive Us
          </h2>
          
          <p className="text-xl text-neutral-gray max-w-4xl mx-auto leading-relaxed">
            Our unwavering commitment to justice is built on these core principles that guide every action we take and every decision we make
          </p>
          
          {/* Decorative line */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <div 
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl border-2 ${principle.borderColor} transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02]`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fade-in 0.6s ease-out forwards'
              }}
            >
              {/* Card Header with Gradient */}
              <div className={`h-2 bg-gradient-to-r ${principle.color}`}></div>
              
              <div className="p-8">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${principle.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <principle.icon className={`h-10 w-10 ${principle.iconColor}`} />
                  </div>
                  
                  {/* Floating decoration */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-bold text-lg text-neutral-dark mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                    {principle.title}
                  </h3>
                  
                  <p className="text-neutral-gray text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>

                {/* Bottom decoration */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className={`w-12 h-1 bg-gradient-to-r ${principle.color} rounded-full mx-auto group-hover:w-20 transition-all duration-500`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-dark mb-4">
              Guided by Principle, Driven by Impact
            </h3>
            <p className="text-neutral-gray mb-6">
              These principles aren't just words—they're the foundation of everything we do to advance justice and equality across Tanzania.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {principles.map((principle, index) => (
                <div key={index} className={`w-3 h-3 rounded-full bg-gradient-to-r ${principle.color} animate-pulse`} style={{ animationDelay: `${index * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default KeyPrinciples;
