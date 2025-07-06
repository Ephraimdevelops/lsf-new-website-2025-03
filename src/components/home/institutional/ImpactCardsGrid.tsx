import { Users, BookOpen, Gavel, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const impactAreas = [
  {
    icon: Users,
    title: "Community Empowerment",
    description: "Training paralegals and building local capacity for sustainable legal support across Tanzania.",
    stats: "4,000+ paralegals trained",
    color: "from-primary to-primary-dark",
    link: "/what-we-do/capacity-building",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png"
  },
  {
    icon: Gavel,
    title: "Access to Justice",
    description: "Providing direct legal aid services to vulnerable populations, ensuring no one is left behind.",
    stats: "85% case resolution rate",
    color: "from-secondary-teal to-secondary-teal-dark",
    link: "/what-we-do/direct-implementation",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png"
  },
  {
    icon: BookOpen,
    title: "Policy & Advocacy",
    description: "Influencing legal frameworks and policies to create systemic change for marginalized communities.",
    stats: "15 policy reforms influenced",
    color: "from-secondary-orange to-secondary-orange-dark",
    link: "/what-we-do/advocacy-policy",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png"
  },
  {
    icon: Heart,
    title: "Digital Innovation",
    description: "Leveraging technology to expand reach and improve service delivery through digital platforms.",
    stats: "50,000+ app downloads",
    color: "from-secondary-yellow to-secondary-yellow-dark",
    link: "/what-we-do/digital-transformation",
    image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png"
  }
];

const ImpactCardsGrid = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-neutral-900 mb-6">
            Our Impact Areas
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed">
            Through four strategic approaches, we're transforming the legal landscape 
            and creating lasting change for communities across Tanzania.
          </p>
        </div>
        
        {/* Apple-style cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {impactAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <Link 
                key={index}
                to={area.link}
                className="group block"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-100 hover:border-neutral-200 overflow-hidden">
                  {/* Background image */}
                  <div className="absolute inset-0 opacity-5">
                    <img src={area.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${area.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-neutral-900 mb-4 group-hover:text-primary transition-colors">
                      {area.title}
                    </h3>
                    
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      {area.description}
                    </p>
                    
                    {/* Stats badge */}
                    <div className="inline-flex items-center bg-neutral-100 rounded-full px-4 py-2 mb-4">
                      <span className="text-sm font-medium text-neutral-700">
                        {area.stats}
                      </span>
                    </div>
                    
                    {/* Apple-style arrow */}
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactCardsGrid;