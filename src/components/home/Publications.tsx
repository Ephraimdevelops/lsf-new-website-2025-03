
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

interface PublicationCardProps {
  title: string;
  type: string;
  date: string;
  link: string;
}

const PublicationCard = ({ title, type, date, link }: PublicationCardProps) => {
  return (
    <Link 
      to={link}
      className="group p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="mb-4 text-primary">
        <FileText size={24} />
      </div>
      <div className="mb-3">
        <span className="text-sm text-neutral-gray font-calibri">{type} • {date}</span>
      </div>
      <h3 className="text-lg font-bold mb-4 group-hover:text-primary transition-colors font-panton">{title}</h3>
      <div className="mt-auto">
        <span className="inline-flex items-center text-primary font-medium group-hover:underline font-calibri">
          Read publication
          <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

const Publications = () => {
  const publications = [
    {
      title: "Annual Report 2023: Impact and Progress in Legal Aid Delivery",
      type: "Report",
      date: "March 2023",
      link: "/publications/annual-report-2023"
    },
    {
      title: "Women's Land Rights in Tanzania: Challenges and Opportunities",
      type: "Research",
      date: "January 2023",
      link: "/publications/womens-land-rights"
    },
    {
      title: "Digital Legal Services: Best Practices and Lessons Learned",
      type: "Guide",
      date: "November 2022",
      link: "/publications/digital-legal-services"
    },
    {
      title: "Policy Brief: Climate Justice and Legal Empowerment",
      type: "Brief",
      date: "October 2022",
      link: "/publications/policy-brief-climate-justice"
    }
  ];

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-panton font-bold mb-2">Publications</h2>
            <p className="text-neutral-gray font-calibri">
              Explore our research, reports, and resources
            </p>
          </div>
          <Link 
            to="/publications" 
            className="inline-flex items-center mt-4 md:mt-0 text-primary font-bold hover:underline font-calibri"
          >
            View all publications
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publications.map((pub, index) => (
            <PublicationCard
              key={index}
              title={pub.title}
              type={pub.type}
              date={pub.date}
              link={pub.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
