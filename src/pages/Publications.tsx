
import { useState } from 'react';
import { ArrowDownToLine, FileText, Calendar, Search } from 'lucide-react';
import Layout from '../components/layout/Layout';

interface PublicationProps {
  title: string;
  description: string;
  date: string;
  type: string;
  downloadUrl: string;
  thumbnailUrl: string;
  category: string;
}

const PublicationCard = ({ title, description, date, type, downloadUrl, thumbnailUrl, category }: PublicationProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative h-48 overflow-hidden border-b">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold uppercase py-1 px-2 rounded">
          {category}
        </span>
        <span className="absolute top-3 right-3 bg-white text-neutral-dark text-xs font-bold uppercase py-1 px-2 rounded shadow">
          {type}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-neutral-gray mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-neutral-gray mb-4 flex-grow">{description}</p>
        <a 
          href={downloadUrl}
          className="inline-flex items-center text-primary font-medium hover:underline mt-auto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
          <ArrowDownToLine className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

const publicationsData: PublicationProps[] = [
  {
    title: "Access to Justice in Tanzania: Annual Report 2023",
    description: "This comprehensive report provides an overview of the state of access to justice in Tanzania, highlighting key challenges, achievements, and recommendations for future interventions.",
    date: "March 2023",
    type: "Report",
    downloadUrl: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Legal Empowerment"
  },
  {
    title: "Gender-Based Violence and Access to Justice: A Study of Rural Communities",
    description: "This research examines the prevalence of gender-based violence in rural Tanzania and assesses the effectiveness of legal aid services in addressing these issues.",
    date: "November 2022",
    type: "Research",
    downloadUrl: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Gender Justice"
  },
  {
    title: "Climate Change and Land Rights: Legal Implications for Coastal Communities",
    description: "This policy brief analyzes how climate change is affecting land rights in coastal communities and proposes legal solutions to address emerging challenges.",
    date: "September 2022",
    type: "Policy Brief",
    downloadUrl: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Climate Justice"
  },
  {
    title: "Digital Tools for Legal Aid Providers: A Handbook",
    description: "This practical handbook guides legal aid providers on how to effectively use digital tools to enhance their services and reach more clients, especially in remote areas.",
    date: "July 2022",
    type: "Guide",
    downloadUrl: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Digital Transformation"
  },
  {
    title: "The Impact of Paralegal Programs in Tanzania: 10 Years of LSF Support",
    description: "This evaluation report assesses the impact of LSF's support to paralegal programs across Tanzania over the past decade and identifies lessons learned for future programming.",
    date: "May 2022",
    type: "Evaluation",
    downloadUrl: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Legal Empowerment"
  },
  {
    title: "Customary Law and Women's Rights to Land: Reconciling Traditional Practices with Constitutional Guarantees",
    description: "This study examines the tensions between customary law and constitutional provisions regarding women's rights to land and proposes approaches for reconciliation.",
    date: "February 2022",
    type: "Research",
    downloadUrl: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Gender Justice"
  }
];

const PublicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeType, setActiveType] = useState<string>('All');
  
  const categories = ['All', 'Climate Justice', 'Digital Transformation', 'Gender Justice', 'Legal Empowerment'];
  const types = ['All', 'Report', 'Research', 'Policy Brief', 'Guide', 'Evaluation'];
  
  const filteredPublications = publicationsData.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pub.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || pub.category === activeCategory;
    const matchesType = activeType === 'All' || pub.type === activeType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary-teal text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Publications & Resources</h1>
            <p className="text-xl opacity-90">
              Access our research findings, policy briefs, reports, and educational resources on legal empowerment, gender justice, climate justice, and digital transformation.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-12">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search publications..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Category:</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        activeCategory === category 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Type:</label>
                <div className="flex flex-wrap gap-2">
                  {types.map(type => (
                    <button
                      key={type}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        activeType === type 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Publications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPublications.map((publication, index) => (
              <PublicationCard
                key={index}
                title={publication.title}
                description={publication.description}
                date={publication.date}
                type={publication.type}
                downloadUrl={publication.downloadUrl}
                thumbnailUrl={publication.thumbnailUrl}
                category={publication.category}
              />
            ))}
          </div>
          
          {filteredPublications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-xl font-bold">No publications found</h3>
              <p className="mt-2 text-neutral-gray">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PublicationsPage;
