
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
}

const FocusAreaCard = ({ icon, title, description, link, color, bgColor }: FocusAreaProps) => {
  return (
    <Link 
      to={link}
      className={`group p-8 ${bgColor} rounded-lg transition-all duration-300 flex flex-col h-full hover:shadow-xl`}
    >
      <div className={`p-4 rounded-full inline-flex mb-5 ${color} w-16 h-16 items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors font-panton">
        {title}
      </h3>
      <p className="text-neutral-dark mb-6 font-calibri">
        {description}
      </p>
      <div className="mt-auto">
        <span className="inline-flex items-center text-primary font-medium group-hover:underline font-calibri">
          Learn more
          <ArrowRight className="ml-1 h-4 w-4" />
        </span>
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
      bgColor: "bg-primary/5"
    },
    {
      icon: <Users size={30} className="text-white" />,
      title: "Empowered Communities",
      description: "Promoting legally empowered communities, in particular women, through legal awareness and education.",
      link: "/programs/gender-justice",
      color: "bg-secondary-teal",
      bgColor: "bg-secondary-teal/5"
    },
    {
      icon: <LayoutGrid size={30} className="text-white" />,
      title: "Conducive Environment",
      description: "Enhancing a conducive environment for sustainable access to justice and advocating for justice reform.",
      link: "/programs/climate-justice",
      color: "bg-secondary-orange",
      bgColor: "bg-secondary-orange/5"
    },
    {
      icon: <BookOpen size={30} className="text-white" />,
      title: "Institutional Sustainability",
      description: "Institutional development and sustainability of LSF and the legal aid sector across Tanzania.",
      link: "/programs/digital-transformation",
      color: "bg-secondary-green",
      bgColor: "bg-secondary-green/5"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton">We Focus On Delivering In 4 Key Areas</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto font-calibri text-lg mb-12">
            Our strategic approach focuses on these primary areas to ensure comprehensive access to justice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {areas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
              color={area.color}
              bgColor={area.bgColor}
            />
          ))}
        </div>
        
        <div className="mt-14 text-center">
          <Link to="/what-we-do">
            <Button className="bg-primary hover:bg-primary-dark text-white font-calibri text-lg px-8 py-6 h-auto">
              Learn About Our Approach
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
