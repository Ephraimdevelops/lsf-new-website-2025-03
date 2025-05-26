
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Users, Lightbulb, BookOpen, LayoutGrid, DollarSign } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  link: string;
}

const ServiceCard = ({ icon, title, description, color, link }: ServiceCardProps) => {
  return (
    <Link to={link} className="block group">
      <div className={`p-6 rounded-xl transition-all duration-300 hover:shadow-xl h-full ${color} group hover:translate-y-[-2px]`}>
        <div className="text-white group-hover:scale-110 transition-transform duration-300 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-white/90 mb-4 text-sm leading-relaxed">{description}</p>
        <div className="inline-flex items-center text-white font-medium hover:underline text-sm">
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
      icon: <DollarSign className="h-8 w-8" />,
      title: "Grant Making",
      description: "Results-driven grants to strengthen legal empowerment — especially around land rights, property ownership, safety, and justice for women and girls.",
      color: "bg-primary",
      link: "/what-we-do#grant-making"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Capacity Building",
      description: "LSF strengthens both institutional and technical capacity among legal aid providers, paralegals, and community-based organizations.",
      color: "bg-secondary-teal",
      link: "/what-we-do#capacity-building"
    },
    {
      icon: <LayoutGrid className="h-8 w-8" />,
      title: "Partnerships & Networking",
      description: "We collaborate with a broad ecosystem of stakeholders including government institutions, civil society, development partners, and private actors.",
      color: "bg-secondary-orange",
      link: "/what-we-do#partnerships-networking"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Learning and Research",
      description: "Through continuous learning, piloting new models, and data-driven monitoring, we identify what works and improve what doesn't.",
      color: "bg-secondary-green",
      link: "/what-we-do#learning-research"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Policy and Advocacy",
      description: "Our advocacy spans grassroots to national levels — shaping inclusive laws, policies, and systems that ensure justice is a reality for all.",
      color: "bg-primary",
      link: "/what-we-do#policy-advocacy"
    }
  ];
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-primary via-primary-dark to-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-[45px] font-black leading-[47.7px] text-white mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
            What We Do
          </h2>
          <p className="text-[20px] font-light leading-[35px] text-white/90 max-w-4xl mx-auto" style={{ fontFamily: 'akzidenz-grotesk, Arial, Helvetica, sans-serif' }}>
            Our comprehensive approach to promoting access to justice focuses on these key service areas
          </p>
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
        
        <div className="mt-12 text-center">
          <Link to="/what-we-do" className="inline-flex items-center bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-bold transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Explore All Our Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
