
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Download, CalendarIcon, Search, Filter, FileText, ChevronDown, BookOpen, Eye, TrendingUp } from 'lucide-react';
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
      window.open(publication.fileUrl, '_blank');
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'report': return 'bg-primary/10 text-primary border-primary/20';
      case 'research': return 'bg-secondary-teal/10 text-secondary-teal border-secondary-teal/20';
      case 'guide': return 'bg-secondary-orange/10 text-secondary-orange border-secondary-orange/20';
      case 'brief': return 'bg-secondary-yellow/10 text-secondary-yellow border-secondary-yellow/20';
      case 'manual': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'toolkit': return 'bg-green-100 text-green-600 border-green-200';
      case 'survey': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <HeroSection
        icon={<BookOpen className="h-8 w-8" />}
        badge="Knowledge Base"
        title="Publications & Research"
        description="Explore our comprehensive collection of research reports, policy briefs, and resources driving justice reform across Tanzania"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />
      
      {/* Enhanced Filters Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="relative flex-grow lg:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search publications, topics, or keywords..."
                className="pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-secondary-teal transition-colors shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="lg:ml-auto">
              <Collapsible
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                className="w-full lg:w-auto"
              >
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full lg:w-auto flex items-center justify-between gap-2 rounded-xl border-2 border-gray-200 hover:border-secondary-teal transition-colors px-6 py-3"
                  >
                    <Filter size={16} />
                    Advanced Filters
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 lg:absolute lg:right-0 lg:mt-2 lg:bg-white lg:shadow-xl lg:rounded-2xl lg:p-6 lg:z-10 lg:min-w-[280px] lg:border lg:border-gray-200">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="publication-type" className="block text-sm font-semibold text-gray-700 mb-2">
                        Publication Type
                      </label>
                      <Select value={publicationType} onValueChange={setPublicationType}>
                        <SelectTrigger className="w-full rounded-xl border-2" id="publication-type">
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
                      <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                        Publication Year
                      </label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-full rounded-xl border-2" id="year">
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
                      className="w-full rounded-xl"
                      onClick={() => {
                        setSearchTerm('');
                        setPublicationType('all');
                        setYear('all');
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Filter Summary */}
          {(searchTerm || publicationType !== 'all' || year !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-teal/10 text-secondary-teal border border-secondary-teal/20">
                  Search: "{searchTerm}"
                </span>
              )}
              {publicationType !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                  Type: {publicationType.charAt(0).toUpperCase() + publicationType.slice(1)}
                </span>
              )}
              {year !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-orange/10 text-secondary-orange border border-secondary-orange/20">
                  Year: {year}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{publications.length}+</div>
              <div className="text-sm text-gray-600 font-medium">Total Publications</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-teal/10 to-secondary-teal/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Download className="h-8 w-8 text-secondary-teal" />
              </div>
              <div className="text-3xl font-bold text-secondary-teal mb-1">25K+</div>
              <div className="text-sm text-gray-600 font-medium">Downloads</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-orange/10 to-secondary-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-8 w-8 text-secondary-orange" />
              </div>
              <div className="text-3xl font-bold text-secondary-orange mb-1">100K+</div>
              <div className="text-sm text-gray-600 font-medium">Page Views</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-yellow/10 to-secondary-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-secondary-yellow" />
              </div>
              <div className="text-3xl font-bold text-secondary-yellow mb-1">15+</div>
              <div className="text-sm text-gray-600 font-medium">Policy Changes</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Publications Grid */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPublications.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-neutral-dark mb-4">
                  {filteredPublications.length} {filteredPublications.length === 1 ? 'Publication' : 'Publications'} Found
                </h2>
                <p className="text-neutral-gray">Discover evidence-based insights and practical resources</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPublications.map((publication) => (
                  <div 
                    key={publication.id} 
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-secondary-teal/30 transform hover:-translate-y-2"
                  >
                    {/* Enhanced Image Header */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={publication.cover} 
                        alt={publication.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Floating Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border ${getTypeColor(publication.type)}`}>
                          <FileText className="h-3 w-3 mr-1" />
                          {publication.type.toUpperCase()}
                        </span>
                      </div>

                      {/* File Size Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 shadow-lg">
                          {publication.fileSize}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="p-8">
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <CalendarIcon className="h-4 w-4 mr-2" /> 
                        {new Date(publication.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      
                      <Link to={`/publications/${publication.id}`}>
                        <h3 className="text-xl font-bold mb-4 text-neutral-dark line-clamp-2 group-hover:text-secondary-teal transition-colors duration-300">
                          {publication.title}
                        </h3>
                      </Link>
                      
                      <p className="text-neutral-gray text-sm line-clamp-3 leading-relaxed mb-6">
                        {publication.excerpt}
                      </p>
                      
                      {/* Enhanced Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <Link 
                          to={`/publications/${publication.id}`}
                          className="inline-flex items-center text-secondary-teal font-semibold hover:text-secondary-teal/80 transition-colors text-sm group/link"
                        >
                          Read More
                          <ChevronDown className="ml-1 h-4 w-4 -rotate-90 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2 rounded-xl border-2 hover:bg-secondary-teal hover:text-white hover:border-secondary-teal transition-all duration-300"
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
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-dark">No Publications Found</h3>
              <p className="text-neutral-gray mb-8 max-w-md mx-auto">
                We couldn't find any publications matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setPublicationType('all');
                  setYear('all');
                }}
                className="rounded-xl px-8 py-3"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
