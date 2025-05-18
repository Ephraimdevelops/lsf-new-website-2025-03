
import { useState } from 'react';
import { Search, Filter, FileText, Download, Book } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

interface ResourceProps {
  title: string;
  description: string;
  type: string;
  category: string;
  date: string;
  downloadUrl: string;
  thumbnailUrl: string;
}

const ResourceCard = ({ title, description, type, category, date, downloadUrl, thumbnailUrl }: ResourceProps) => {
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
        <p className="text-sm text-neutral-gray mb-2">{date}</p>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-neutral-gray mb-4 flex-grow">{description}</p>
        <a 
          href={downloadUrl}
          className="inline-flex items-center text-primary font-medium hover:underline mt-auto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
          <Download className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeType, setActiveType] = useState<string>('All');
  
  const categories = ['All', 'Climate Justice', 'Digital Transformation', 'Gender Justice', 'Legal Empowerment'];
  const types = ['All', 'Report', 'Research', 'Policy Brief', 'Guide', 'Case Study', 'Toolkit'];

  // Resources data
  const resourcesData: ResourceProps[] = [
    {
      title: "Access to Justice in Tanzania: Annual Report 2023",
      description: "This comprehensive report provides an overview of the state of access to justice in Tanzania, highlighting key challenges, achievements, and recommendations for future interventions.",
      type: "Report",
      category: "Legal Empowerment",
      date: "March 2023",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Gender-Based Violence and Access to Justice: A Study of Rural Communities",
      description: "This research examines the prevalence of gender-based violence in rural Tanzania and assesses the effectiveness of legal aid services in addressing these issues.",
      type: "Research",
      category: "Gender Justice",
      date: "November 2022",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Climate Change and Land Rights: Legal Implications for Coastal Communities",
      description: "This policy brief analyzes how climate change is affecting land rights in coastal communities and proposes legal solutions to address emerging challenges.",
      type: "Policy Brief",
      category: "Climate Justice",
      date: "September 2022",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Digital Tools for Legal Aid Providers: A Handbook",
      description: "This practical handbook guides legal aid providers on how to effectively use digital tools to enhance their services and reach more clients, especially in remote areas.",
      type: "Guide",
      category: "Digital Transformation",
      date: "July 2022",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "The Impact of Paralegal Programs in Tanzania: 10 Years of LSF Support",
      description: "This evaluation report assesses the impact of LSF's support to paralegal programs across Tanzania over the past decade and identifies lessons learned for future programming.",
      type: "Report",
      category: "Legal Empowerment",
      date: "May 2022",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Customary Law and Women's Rights to Land: Reconciling Traditional Practices with Constitutional Guarantees",
      description: "This study examines the tensions between customary law and constitutional provisions regarding women's rights to land and proposes approaches for reconciliation.",
      type: "Research",
      category: "Gender Justice",
      date: "February 2022",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "A Guide to Climate Justice Advocacy in Tanzania",
      description: "This toolkit provides practical guidance for advocates working on climate justice issues in Tanzania, with a focus on legal strategies and community mobilization.",
      type: "Toolkit",
      category: "Climate Justice",
      date: "October 2021",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Digital Transformation in Legal Aid: Case Studies from Tanzania",
      description: "This publication presents case studies of successful digital transformation initiatives in legal aid provision across Tanzania.",
      type: "Case Study",
      category: "Digital Transformation",
      date: "August 2021",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Legal Aid Baseline Survey Report",
      description: "This report presents findings from a comprehensive baseline survey of legal aid services in Tanzania, identifying gaps and opportunities for intervention.",
      type: "Report",
      category: "Legal Empowerment",
      date: "June 2021",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];
  
  // Filter resources based on search and filters
  const filteredResources = resourcesData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    const matchesType = activeType === 'All' || resource.type === activeType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources</h1>
            <p className="text-xl opacity-90">
              Access our research findings, policy briefs, reports, and educational resources on legal empowerment, gender justice, climate justice, and digital transformation.
            </p>
          </div>
        </div>
      </section>
      
      {/* Resources Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Browse Resources by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Link to="/resources?category=legal-empowerment" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full">
                <div className="h-40 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Legal Empowerment Resources" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Legal Empowerment</h3>
                  <p className="text-neutral-gray mb-4">Reports, guides, and tools on legal aid, paralegals, and access to justice</p>
                  <div className="flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium">{resourcesData.filter(r => r.category === 'Legal Empowerment').length} resources</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/resources?category=gender-justice" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full">
                <div className="h-40 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Gender Justice Resources" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Gender Justice</h3>
                  <p className="text-neutral-gray mb-4">Resources on women's rights, gender-based violence, and gender equality</p>
                  <div className="flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium">{resourcesData.filter(r => r.category === 'Gender Justice').length} resources</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/resources?category=climate-justice" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full">
                <div className="h-40 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Climate Justice Resources" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Climate Justice</h3>
                  <p className="text-neutral-gray mb-4">Publications on environmental rights, climate adaptation, and resilience</p>
                  <div className="flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium">{resourcesData.filter(r => r.category === 'Climate Justice').length} resources</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/resources?category=digital-transformation" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 h-full">
                <div className="h-40 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Digital Transformation Resources" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Digital Transformation</h3>
                  <p className="text-neutral-gray mb-4">Resources on technology for legal services and digital justice solutions</p>
                  <div className="flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium">{resourcesData.filter(r => r.category === 'Digital Transformation').length} resources</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-12">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
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
          
          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={index}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                category={resource.category}
                date={resource.date}
                downloadUrl={resource.downloadUrl}
                thumbnailUrl={resource.thumbnailUrl}
              />
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-xl font-bold">No resources found</h3>
              <p className="mt-2 text-neutral-gray">Try adjusting your search or filters</p>
            </div>
          )}
          
          {/* Publications and Research Section */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Publications & Research</h2>
              <p className="text-neutral-gray max-w-2xl mx-auto">
                Explore our in-depth publications, research papers, and academic collaborations.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Link 
                to="/publications" 
                className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-md font-bold transition-colors duration-300 inline-flex items-center"
              >
                View Publications Library
                <Book className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;
