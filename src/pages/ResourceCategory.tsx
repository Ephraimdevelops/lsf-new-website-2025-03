
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import ResourceCard from '../components/shared/ResourceCard';

interface ResourceCategoryProps {
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  backgroundImage?: string;
}

interface ResourceData {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  date: string;
  downloadUrl?: string;
  thumbnailUrl: string;
}

const ResourceCategory = ({ 
  category, 
  title, 
  description, 
  icon, 
  backgroundImage = "/lovable-uploads/background with mother umage .png"
}: ResourceCategoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>('All');
  
  const types = ['All', 'Report', 'Research', 'Policy Brief', 'Guide', 'Case Study', 'Toolkit'];

  // Sample resources data - in a real app, this would come from an API
  const resourcesData: ResourceData[] = [
    {
      id: '1',
      title: `${category} Annual Report 2023`,
      description: `This comprehensive report provides an overview of the state of ${category.toLowerCase()} in Tanzania, highlighting key challenges, achievements, and recommendations.`,
      type: "Report",
      category: category,
      date: "March 2023",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: '2',
      title: `${category} Research Study 2022`,
      description: `This research examines the current state of ${category.toLowerCase()} and assesses the effectiveness of interventions in addressing key challenges.`,
      type: "Research",
      category: category,
      date: "November 2022",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: '3',
      title: `${category} Policy Brief`,
      description: `This policy brief analyzes current ${category.toLowerCase()} policies and proposes recommendations for improvement.`,
      type: "Policy Brief",
      category: category,
      date: "September 2022",
      downloadUrl: "#",
      thumbnailUrl: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];
  
  // Filter resources based on search and filters
  const filteredResources = resourcesData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeType === 'All' || resource.type === activeType;
    
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={icon}
        badge={`${category} Resources`}
        title={title}
        description={description}
        backgroundImage={backgroundImage}
      />
      
      {/* Search and Filter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-12 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${category.toLowerCase()} resources...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          
          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                category={resource.category}
                date={resource.date}
                downloadUrl={resource.downloadUrl}
                thumbnailUrl={resource.thumbnailUrl}
                linkTo={`/resources/${resource.id}`}
              />
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <Filter className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-xl font-bold">No resources found</h3>
              <p className="mt-2 text-neutral-gray">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ResourceCategory;
