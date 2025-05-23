
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, BookOpen, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
  bgColor: string;
  gradient: string;
}

const FocusAreaCard = ({ icon, title, description, link, color, bgColor, gradient }: FocusAreaProps) => {
  return (
    <Link 
      to={link}
      className={`group p-8 bg-white rounded-2xl transition-all duration-300 flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 border border-gray-100 relative overflow-hidden`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className={`p-4 rounded-2xl inline-flex mb-6 ${color} w-16 h-16 items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-neutral-dark mb-6 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
          {description}
        </p>
        <div className="mt-auto">
          <span className="inline-flex items-center text-primary font-medium group-hover:text-white group-hover:underline transition-colors duration-300">
            Learn more
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const FocusAreas = () => {
  const areas = [
    {
      icon: <Scale size={30} className="text-white" />,
      title: "Accessible Legal Update",
      description: "Increasing accessibility of quality legal aid services to the marginalized communities in particular women.",
      link: "/programs/legal-empowerment",
      color: "bg-primary",
      bgColor: "bg-primary/5",
      gradient: "bg-gradient-to-br from-primary to-primary-dark"
    },
    {
      icon: <Users size={30} className="text-white" />,
      title: "Empowered Communities",
      description: "Promoting legally empowered communities, in particular women, through legal awareness and education.",
      link: "/programs/gender-justice",
      color: "bg-secondary-teal",
      bgColor: "bg-secondary-teal/5",
      gradient: "bg-gradient-to-br from-secondary-teal to-secondary-teal/80"
    },
    {
      icon: <LayoutGrid size={30} className="text-white" />,
      title: "Conducive Environment",
      description: "Enhancing a conducive environment for sustainable access to justice and advocating for justice reform.",
      link: "/programs/climate-justice",
      color: "bg-secondary-orange",
      bgColor: "bg-secondary-orange/5",
      gradient: "bg-gradient-to-br from-secondary-orange to-secondary-orange/80"
    },
    {
      icon: <BookOpen size={30} className="text-white" />,
      title: "Institutional Sustainability",
      description: "Institutional development and sustainability of LSF and the legal aid sector across Tanzania.",
      link: "/programs/digital-transformation",
      color: "bg-secondary-yellow",
      bgColor: "bg-secondary-yellow/5",
      gradient: "bg-gradient-to-br from-secondary-yellow to-secondary-yellow/80"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-secondary-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-secondary-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-secondary-yellow/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="bg-gray-400 rounded-full w-1 h-1"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary-teal rounded-full"></div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">Our Focus</span>
            <div className="w-12 h-1 bg-gradient-to-r from-secondary-teal to-primary rounded-full"></div>
          </div>
          <h2 className="mb-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary-teal to-primary bg-clip-text text-transparent">
            We Focus On Delivering In 4 Key Areas
          </h2>
          <p className="text-neutral-dark max-w-3xl mx-auto text-lg mb-12 leading-relaxed">
            Our strategic approach focuses on these primary areas to ensure comprehensive access to justice throughout Tanzania
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {areas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
              color={area.color}
              bgColor={area.bgColor}
              gradient={area.gradient}
            />
          ))}
        </div>
        
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg inline-block">
            <Link to="/what-we-do">
              <Button className="bg-gradient-to-r from-primary to-secondary-teal hover:from-primary-dark hover:to-secondary-teal/80 text-white text-lg px-10 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Learn About Our Approach
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
