
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, Scale, BookOpen, Lightbulb } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-panton">{title}</h3>
      <p className="text-neutral-gray mb-4 font-calibri">{description}</p>
      <Link 
        to={`/what-we-do#${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="inline-flex items-center text-primary font-medium hover:underline font-calibri"
      >
        Learn more
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

const WhatWeDo = () => {
  const services = [
    {
      icon: <Award className="h-10 w-10" />,
      title: "Grant Making",
      description: "Result-oriented grants aim to facilitate legal empowerment with increased protection of women's rights to land, property, safety and security."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Capacity Building",
      description: "The LSF supports legal aid providers to build and develop capacities both institutionally and technically, enhancing their ability to deliver services."
    },
    {
      icon: <Scale className="h-10 w-10" />,
      title: "Partnerships & Networking",
      description: "LSF works closely with key stakeholders in the country and across the region, including government, developing partners, private sector, and Civil Society."
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Learning and Research",
      description: "Learning is promoted by rigorously establishing what works and what does not work. We pilot different approaches and systematically monitor our partners."
    },
    {
      icon: <Lightbulb className="h-10 w-10" />,
      title: "Policy and Advocacy",
      description: "We engage extensively in policy and advocacy efforts, spanning from grassroots initiatives to the national stage, ensuring that voices of the marginalized are heard."
    }
  ];
  
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton">What We Do</h2>
          <p className="max-w-2xl mx-auto text-neutral-gray font-calibri text-lg">
            Our comprehensive approach to promoting access to justice focuses on these key service areas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/what-we-do" 
            className="inline-flex items-center bg-primary text-white hover:bg-primary-dark px-8 py-4 rounded-md font-bold transition duration-300 text-lg font-calibri"
          >
            Explore All Our Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
