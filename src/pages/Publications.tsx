
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
import { usePublications } from '@/hooks/usePublications';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const Publications = () => {
  const { publications, loading, error, searchPublications } = usePublications();
  const [searchTerm, setSearchTerm] = useState('');
  const [publicationType, setPublicationType] = useState('all');
  const [year, setYear] = useState('all');
  const [filteredPublications, setFilteredPublications] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Update filtered publications when publications data changes
  useEffect(() => {
    if (publications.length > 0) {
      setFilteredPublications(publications);
    }
  }, [publications]);
  
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
  const handleDownload = async (publication: any) => {
    try {
      window.open(publication.file || publication.fileUrl, '_blank');
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

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState message={error} />
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <HeroSection
        icon={<BookOpen className="h-4 w-8" />}
        badge="Knowledge Base"
        title="Publications"
        description="Explore our comprehensive collection of reports, policy briefs, and resources driving justice reform across Tanzania"
        backgroundImage="/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png"
      />
      
      {/* Enhanced Filters Section */}
      <section className="py-10 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
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
                    <span>Filter Publications</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 lg:mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Publication Type
                      </label>
                      <Select value={publicationType} onValueChange={setPublicationType}>
                        <SelectTrigger className="w-full rounded-xl border-2">
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year
                      </label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-full rounded-xl border-2">
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year === 'all' ? 'All Years' : year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {filteredPublications.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <Typography variant="h2" className="text-gray-600 mb-4">
                {searchTerm || publicationType !== 'all' || year !== 'all' ? 'No Publications Found' : 'No Publications Available'}
              </Typography>
              <Typography variant="body" className="text-gray-500 mb-8">
                {searchTerm || publicationType !== 'all' || year !== 'all'
                  ? 'No publications found matching your criteria. Try adjusting your search terms or filters.'
                  : 'We don\'t have any publications at the moment. Please check back later.'
                }
              </Typography>
              {(searchTerm || publicationType !== 'all' || year !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setPublicationType('all');
                    setYear('all');
                  }}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-12">
                <Typography variant="h2" className="text-3xl md:text-4xl font-bold mb-4">
                  Publications & Resources
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  {filteredPublications.length} publication{filteredPublications.length !== 1 ? 's' : ''} found
                </Typography>
              </div>

              {/* Publications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPublications.map((publication) => (
                  <article key={publication.id} className="group">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30 group-hover:-translate-y-2">
                      {/* Image */}
                      {publication.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={publication.image}
                            alt={publication.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Type Badge */}
                        <div className="mb-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(publication.type)}`}>
                            <FileText className="h-3 w-3" />
                            {publication.type}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(publication.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Title */}
                        <Typography variant="h3" className="text-xl font-bold mb-3 text-neutral-dark group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {publication.title}
                        </Typography>

                        {/* Excerpt */}
                        <Typography variant="body" className="text-gray-600 mb-4 line-clamp-3">
                          {publication.excerpt}
                        </Typography>

                        {/* File Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            {publication.fileSize && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {publication.fileSize}
                              </span>
                            )}
                            {publication.pages && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {publication.pages}
                              </span>
                            )}
                          </div>
                          {publication.downloadCount && (
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {publication.downloadCount} downloads
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDownload(publication)}
                            className="flex-1 bg-primary hover:bg-primary-dark"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Link to={`/publications/${publication.slug || publication.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Publications;
