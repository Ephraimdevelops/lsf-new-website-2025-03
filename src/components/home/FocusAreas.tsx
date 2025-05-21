
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, BookOpen, MapPin } from 'lucide-react';
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
      title: "Legal Empowerment",
      description: "Promoting rights awareness and supporting communities through free legal assistance by trained paralegals.",
      link: "/programs/legal-empowerment",
      color: "bg-primary",
      bgColor: "bg-primary/5"
    },
    {
      icon: <Users size={30} className="text-white" />,
      title: "Gender Justice",
      description: "Combatting GBV, FGM, and harmful practices while supporting women to access justice and secure their legal rights.",
      link: "/programs/gender-justice",
      color: "bg-secondary-teal",
      bgColor: "bg-secondary-teal/5"
    },
    {
      icon: <MapPin size={30} className="text-white" />,
      title: "Climate Justice",
      description: "Advancing access to justice in environmental disputes and supporting communities affected by climate change.",
      link: "/programs/climate-justice",
      color: "bg-secondary-orange",
      bgColor: "bg-secondary-orange/5"
    },
    {
      icon: <BookOpen size={30} className="text-white" />,
      title: "Digital Transformation",
      description: "Expanding reach through Haki Yangu and legal tech solutions to make justice accessible to all Tanzanians.",
      link: "/programs/digital-transformation",
      color: "bg-secondary-green",
      bgColor: "bg-secondary-green/5"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton">Our Strategic Focus Areas</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto font-calibri text-lg mb-12">
            Explore our key program areas where we're making a difference across Tanzania.
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
