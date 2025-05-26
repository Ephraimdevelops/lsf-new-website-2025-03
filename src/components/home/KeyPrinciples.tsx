
import { Scale, Heart, Users, Shield, Lightbulb } from 'lucide-react';

const KeyPrinciples = () => {
  const principles = [
    {
      icon: Scale,
      title: "We are independent, impartial, and neutral",
      description: "Our work is guided by legal principles, not political agendas."
    },
    {
      icon: Heart,
      title: "We are guided by compassion and empathy",
      description: "Every person deserves dignity and access to justice."
    },
    {
      icon: Users,
      title: "We are committed to community empowerment",
      description: "Local solutions for local challenges, building sustainable change."
    },
    {
      icon: Shield,
      title: "We are transparent and accountable",
      description: "Open about our methods, impact, and use of resources."
    },
    {
      icon: Lightbulb,
      title: "We are committed to innovation and excellence",
      description: "Constantly improving our approaches to maximize impact."
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-[45px] font-black leading-[47.7px] text-[#231f20] mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
            The Principles That Drive Us
          </h2>
          <p className="text-[20px] font-light leading-[35px] text-black max-w-3xl mx-auto" style={{ fontFamily: 'akzidenz-grotesk, Arial, Helvetica, sans-serif' }}>
            Our commitment to justice is built on unwavering principles that guide every action we take
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <principle.icon className="h-6 w-6 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-neutral-dark mb-2 leading-tight">
                    {principle.title}
                  </h3>
                  <p className="text-neutral-gray text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyPrinciples;
