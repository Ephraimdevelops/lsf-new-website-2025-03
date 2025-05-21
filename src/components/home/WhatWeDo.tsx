
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, Lightbulb, BookOpen, LayoutGrid } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  link: string;
}

const ServiceCard = ({ icon, title, description, color, link }: ServiceCardProps) => {
  return (
    <Link to={link} className="block">
      <div className={`p-6 rounded-lg transition-all duration-300 hover:shadow-xl h-full ${color} group hover:translate-y-[-5px]`}>
        <div className="text-white group-hover:scale-110 transition-transform duration-300 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 font-panton text-white">{title}</h3>
        <p className="text-white/90 mb-4 font-calibri">{description}</p>
        <div className="inline-flex items-center text-white font-medium hover:underline font-calibri">
          Learn more
          <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

const WhatWeDo = () => {
  const services = [
    {
      icon: <Scale className="h-10 w-10" />,
      title: "Grant Making",
      description: "Result-oriented grants aim to facilitate legal empowerment with increased protection of women's rights to land, property, safety and security.",
      color: "bg-primary",
      link: "/what-we-do#grant-making"
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Capacity Building",
      description: "The LSF supports legal aid providers to build and develop capacities both institutionally and technically, enhancing their ability to deliver services.",
      color: "bg-secondary-teal",
      link: "/what-we-do#capacity-building"
    },
    {
      icon: <LayoutGrid className="h-10 w-10" />,
      title: "Partnerships & Networking",
      description: "LSF works closely with key stakeholders in the country and across the region, including government, developing partners, private sector, and Civil Society.",
      color: "bg-secondary-orange",
      link: "/what-we-do#partnerships-networking"
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Learning and Research",
      description: "Learning is promoted by rigorously establishing what works and what does not work. We pilot different approaches and systematically monitor our partners.",
      color: "bg-secondary-green",
      link: "/what-we-do#learning-research"
    },
    {
      icon: <Lightbulb className="h-10 w-10" />,
      title: "Policy and Advocacy",
      description: "We engage extensively in policy and advocacy efforts, spanning from grassroots initiatives to the national stage, ensuring that voices of the marginalized are heard.",
      color: "bg-primary",
      link: "/what-we-do#policy-advocacy"
    }
  ];
  
  return (
    <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton">What We Do</h2>
          <p className="max-w-2xl mx-auto text-neutral-gray font-calibri text-lg mb-8">
            Our comprehensive approach to promoting access to justice focuses on these key service areas
          </p>
          <div className="w-24 h-1 bg-secondary-teal mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              link={service.link}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/what-we-do" className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-md font-bold transition duration-300 text-lg font-calibri">
            Explore All Our Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
