
import { Link } from 'react-router-dom';
import { Scale, Users, Cloud, Smartphone } from 'lucide-react';

interface ProgramCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const ProgramCard = ({ title, description, icon, color, link }: ProgramCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
      <div className={`h-2 ${color}`}></div>
      <div className="p-6">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${color} bg-opacity-10`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-neutral-gray mb-4">{description}</p>
        <Link 
          to={link}
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          Learn more
          <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

const Programs = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h2>
          <p className="max-w-2xl mx-auto text-neutral-gray">
            We work across four key program areas to promote justice and empower communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProgramCard
            title="Legal Empowerment"
            description="Enhancing access to justice through community-based legal aid providers and paralegals."
            icon={<Scale className="text-primary" />}
            color="bg-primary"
            link="/programs/legal-empowerment"
          />
          <ProgramCard
            title="Gender Justice"
            description="Advancing women's rights and addressing gender-based violence and discrimination."
            icon={<Users className="text-secondary-green" />}
            color="bg-secondary-green"
            link="/programs/gender-justice"
          />
          <ProgramCard
            title="Climate Justice"
            description="Supporting communities affected by climate change and promoting environmental rights."
            icon={<Cloud className="text-secondary-teal" />}
            color="bg-secondary-teal"
            link="/programs/climate-justice"
          />
          <ProgramCard
            title="Digital Transformation"
            description="Leveraging technology to improve access to justice and legal information."
            icon={<Smartphone className="text-secondary-orange" />}
            color="bg-secondary-orange"
            link="/programs/digital-transformation"
          />
        </div>
      </div>
    </section>
  );
};

export default Programs;
