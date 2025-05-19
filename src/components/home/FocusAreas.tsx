
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, BookOpen, MapPin, FileText } from 'lucide-react';

interface FocusAreaProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}

const FocusAreaCard = ({ icon, title, description, link, color }: FocusAreaProps) => {
  return (
    <Link 
      to={link}
      className="group p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className={`p-3 rounded-full inline-flex mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors font-panton">
        {title}
      </h3>
      <p className="text-neutral-gray mb-4 font-calibri">
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
      icon: <Scale size={24} className="text-primary" />,
      title: "Legal Aid & Paralegals",
      description: "We support communities through free legal assistance by trained paralegals.",
      link: "/programs/legal-empowerment",
      color: "bg-primary/10"
    },
    {
      icon: <Users size={24} className="text-secondary-teal" />,
      title: "Women's Rights",
      description: "Supporting women to access justice and secure their legal rights.",
      link: "/programs/gender-justice",
      color: "bg-secondary-teal/10"
    },
    {
      icon: <BookOpen size={24} className="text-secondary-green" />,
      title: "Legal Literacy",
      description: "Educating communities about their legal rights and responsibilities.",
      link: "/programs/digital-transformation",
      color: "bg-secondary-green/10"
    },
    {
      icon: <MapPin size={24} className="text-secondary-orange" />,
      title: "Justice for Marginalized",
      description: "Ensuring access to justice for vulnerable and marginalized groups.",
      link: "/programs/climate-justice",
      color: "bg-secondary-orange/10"
    },
    {
      icon: <FileText size={24} className="text-accent" />,
      title: "Policy & Advocacy",
      description: "Advocating for policy reforms that promote access to justice for all.",
      link: "/what-we-do",
      color: "bg-accent/10"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-panton">Our Focus Areas</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto font-calibri">
            Explore our key program areas where we're making a difference across Tanzania.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => (
            <FocusAreaCard
              key={index}
              icon={area.icon}
              title={area.title}
              description={area.description}
              link={area.link}
              color={area.color}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/what-we-do">
            <Button className="font-calibri">
              Learn About Our Approach
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
