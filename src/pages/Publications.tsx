import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Download, CalendarIcon, Search, Filter, FileText, ChevronDown, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { publicationService } from '@/services/api';

interface Publication {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  type: string;
  cover: string;
  fileUrl: string;
  fileSize: string;
}

const getPublications = (): Publication[] => {
  return [
    {
      id: "annual-report-2023",
      title: "Annual Report 2023: Impact and Progress in Legal Aid Delivery",
      excerpt: "A comprehensive report detailing LSF's activities, achievements, and impact across Tanzania during the 2023 fiscal year.",
      date: "March 15, 2023",
      type: "Report",
      cover: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9jdXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/annual-report-2023.pdf",
      fileSize: "3.2 MB"
    },
    {
      id: "womens-land-rights",
      title: "Women's Land Rights in Tanzania: Challenges and Opportunities",
      excerpt: "A research study examining the status of women's land rights in Tanzania, identifying key challenges and proposing strategies for improvement.",
      date: "January 20, 2023",
      type: "Research",
      cover: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGxhbmQlMjBmYXJtfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/womens-land-rights.pdf",
      fileSize: "2.8 MB"
    },
    {
      id: "digital-legal-services",
      title: "Digital Legal Services: Best Practices and Lessons Learned",
      excerpt: "A guide exploring effective approaches to implementing digital legal services in rural and underserved communities based on LSF's experience.",
      date: "November 10, 2022",
      type: "Guide",
      cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlnaXRhbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/digital-legal-services.pdf",
      fileSize: "4.5 MB"
    },
    {
      id: "policy-brief-climate-justice",
      title: "Policy Brief: Climate Justice and Legal Empowerment",
      excerpt: "A concise policy brief outlining key recommendations for integrating climate justice considerations into legal empowerment initiatives.",
      date: "October 05, 2022",
      type: "Brief",
      cover: "https://images.unsplash.com/photo-1569163139500-66446e7f7233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNsaW1hdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/policy-brief-climate-justice.pdf",
      fileSize: "1.5 MB"
    },
    {
      id: "legal-aid-handbook",
      title: "Legal Aid Handbook for Community Paralegals",
      excerpt: "A comprehensive manual providing guidance and resources for community paralegals working in rural and underserved areas of Tanzania.",
      date: "August 22, 2022",
      type: "Manual",
      cover: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxhd3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/legal-aid-handbook.pdf",
      fileSize: "5.1 MB"
    },
    {
      id: "gender-justice-toolkit",
      title: "Gender Justice Toolkit: Addressing GBV Through Legal Empowerment",
      excerpt: "A practical toolkit providing strategies and resources for addressing gender-based violence through community-based legal empowerment approaches.",
      date: "June 15, 2022",
      type: "Toolkit",
      cover: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHdvbWVufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/gender-justice-toolkit.pdf",
      fileSize: "3.7 MB"
    },
    {
      id: "justice-needs-survey-2022",
      title: "Justice Needs Survey 2022: Understanding Legal Needs in Tanzania",
      excerpt: "A comprehensive survey documenting the legal needs and challenges faced by communities across Tanzania, with regional analysis and recommendations.",
      date: "April 10, 2022",
      type: "Survey",
      cover: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN1cnZleXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/justice-needs-survey-2022.pdf",
      fileSize: "4.2 MB"
    },
    {
      id: "annual-report-2022",
      title: "Annual Report 2022: Building Back Better After COVID-19",
      excerpt: "A report outlining LSF's activities and impact during 2022, with special focus on recovery and adaptation strategies following the COVID-19 pandemic.",
      date: "March 20, 2022",
      type: "Report",
      cover: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW5udWFsJTIwcmVwb3J0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      fileUrl: "/publications/annual-report-2022.pdf",
      fileSize: "3.5 MB"
    }
  ];
};

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [publicationType, setPublicationType] = useState('all');
  const [year, setYear] = useState('all');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Load publications
  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await publicationService.getAllPublications();
        // setPublications(response);
        
        // Using sample data for now
        const data = getPublications();
        setPublications(data);
        setFilteredPublications(data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPublications();
  }, []);
  
  // Filter publications when search term, type, or year changes
  useEffect(() => {
    const filtered = publications.filter(pub => {
      const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pub.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = publicationType === 'all' || pub.type.toLowerCase() === publicationType.toLowerCase();
      const matchesYear = year === 'all' || new Date(pub.date).getFullYear().toString() === year;
      return matchesSearch && matchesType && matchesYear;
    });
    
    setFilteredPublications(filtered);
  }, [searchTerm, publicationType, year, publications]);
  
  // Get unique publication types for the filter
  const types = ['all', ...Array.from(new Set(publications.map(pub => pub.type.toLowerCase())))];
  
  // Get unique years for the filter
  const years = ['all', ...Array.from(new Set(publications.map(pub => new Date(pub.date).getFullYear().toString())))];
  
  // Track publication download
  const handleDownload = async (publication: Publication) => {
    try {
      // In a real app, this would track downloads
      // await publicationService.trackDownload(publication.id);
      
      // Open the file in a new tab
      window.open(publication.fileUrl, '_blank');
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };
  
  return (
    <Layout>
      {/* Hero Section with Background */}
      <HeroSection
        icon={<BookOpen className="h-8 w-8" />}
        badge="Knowledge Base"
        title="Publications"
        description="Access our research, reports, policy briefs, and tools to enhance your understanding of legal empowerment"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />
      
      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search publications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="md:ml-auto">
              <Collapsible
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                className="w-full md:w-auto"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto flex items-center justify-between gap-2">
                    <Filter size={16} />
                    Filters
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 md:absolute md:right-0 md:mt-2 md:bg-white md:shadow-lg md:rounded-lg md:p-4 md:z-10 md:min-w-[200px] md:border">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="publication-type" className="block text-sm text-gray-600 mb-1">
                        Publication Type
                      </label>
                      <Select
                        value={publicationType}
                        onValueChange={setPublicationType}
                      >
                        <SelectTrigger className="w-full" id="publication-type">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="year" className="block text-sm text-gray-600 mb-1">
                        Year
                      </label>
                      <Select
                        value={year}
                        onValueChange={setYear}
                      >
                        <SelectTrigger className="w-full" id="year">
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((yearOption) => (
                            <SelectItem key={yearOption} value={yearOption}>
                              {yearOption === 'all' ? 'All Years' : yearOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm('');
                        setPublicationType('all');
                        setYear('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>
      
      {/* Publications Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPublications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPublications.map((publication) => (
                <div 
                  key={publication.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={publication.cover} 
                      alt={publication.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {publication.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3 text-sm text-gray-500">
                      <CalendarIcon size={14} className="mr-1" /> 
                      {new Date(publication.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <Link to={`/publications/${publication.id}`}>
                      <h3 className="text-lg font-bold mb-3 hover:text-primary transition-colors">
                        {publication.title}
                      </h3>
                    </Link>
                    <p className="text-neutral-gray text-sm mb-5 line-clamp-3">
                      {publication.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        <FileText size={14} className="inline mr-1" />
                        {publication.fileSize}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDownload(publication)}
                      >
                        <Download size={14} />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold mb-2">No Publications Found</h3>
              <p className="text-neutral-dark mb-8">
                We couldn't find any publications matching your search criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setPublicationType('all');
                  setYear('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
