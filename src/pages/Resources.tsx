
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/shared/HeroSection';
import Breadcrumb from '@/components/shared/Breadcrumb';
import Container from '@/components/shared/Container';
import Section from '@/components/shared/Section';
import Typography from '@/components/shared/Typography';
import Card from '@/components/shared/Card';
import PartnershipsSection from '@/components/shared/PartnershipsSection';
import GetInvolvedCTA from '@/components/what-we-do/GetInvolvedCTA';
import { 
  BookOpen, 
  Download, 
  Video, 
  FileText, 
  Search,
  Filter,
  Users,
  Globe,
  Scale,
  Heart,
  Clock,
  Eye,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const resourceCategories = [
    { id: 'all', name: 'All Resources', count: 156, icon: <Globe className="h-5 w-5" /> },
    { id: 'legal-aid', name: 'Legal Aid', count: 45, icon: <Scale className="h-5 w-5" /> },
    { id: 'gender-justice', name: 'Gender Justice', count: 32, icon: <Heart className="h-5 w-5" /> },
    { id: 'capacity-building', name: 'Capacity Building', count: 28, icon: <Users className="h-5 w-5" /> },
    { id: 'policy-advocacy', name: 'Policy & Advocacy', count: 24, icon: <FileText className="h-5 w-5" /> },
    { id: 'climate-justice', name: 'Climate Justice', count: 18, icon: <Globe className="h-5 w-5" /> },
    { id: 'research', name: 'Research & Reports', count: 15, icon: <BookOpen className="h-5 w-5" /> }
  ];

  const resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'pdf', name: 'PDF Documents' },
    { id: 'video', name: 'Videos' },
    { id: 'toolkit', name: 'Toolkits' },
    { id: 'report', name: 'Reports' },
    { id: 'guide', name: 'Guides' },
    { id: 'template', name: 'Templates' }
  ];

  const featuredResources = [
    {
      id: 1,
      title: "Legal Aid Coordination Handbook 2024",
      description: "Comprehensive guide for legal aid providers on coordination, referral systems, and quality service delivery.",
      category: "legal-aid",
      type: "guide",
      format: "PDF",
      pages: 85,
      language: "English/Swahili",
      downloadCount: 2340,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=300&h=200&fit=crop",
      featured: true,
      updated: "2024-01-15"
    },
    {
      id: 2,
      title: "Women's Land Rights Training Kit",
      description: "Interactive training materials for paralegals working on women's property and inheritance rights.",
      category: "gender-justice",
      type: "toolkit",
      format: "PDF + Videos",
      pages: 120,
      language: "Swahili",
      downloadCount: 1890,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop",
      featured: true,
      updated: "2024-02-10"
    },
    {
      id: 3,
      title: "Community Paralegal Certification Program",
      description: "Complete certification curriculum for training community paralegals, including assessment tools.",
      category: "capacity-building",
      type: "toolkit",
      format: "PDF + Templates",
      pages: 95,
      language: "English/Swahili",
      downloadCount: 1650,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
      featured: true,
      updated: "2024-01-28"
    }
  ];

  const allResources = [
    {
      id: 4,
      title: "Climate Justice Legal Framework Analysis",
      description: "Detailed analysis of Tanzania's legal framework for addressing climate-related displacement and adaptation.",
      category: "climate-justice",
      type: "report",
      format: "PDF",
      pages: 67,
      language: "English",
      downloadCount: 890,
      rating: 4.6,
      updated: "2023-12-05"
    },
    {
      id: 5,
      title: "Policy Advocacy Strategy Guide",
      description: "Step-by-step guide for civil society organizations on effective policy advocacy at national and local levels.",
      category: "policy-advocacy",
      type: "guide",
      format: "PDF",
      pages: 54,
      language: "English/Swahili",
      downloadCount: 1230,
      rating: 4.5,
      updated: "2024-01-12"
    },
    {
      id: 6,
      title: "Annual Impact Report 2023",
      description: "Comprehensive overview of LSF's impact, programs, and achievements throughout 2023.",
      category: "research",
      type: "report",
      format: "PDF",
      pages: 128,
      language: "English",
      downloadCount: 2100,
      rating: 4.8,
      updated: "2024-03-01"
    },
    {
      id: 7,
      title: "Legal Aid Quality Standards Template",
      description: "Standardized template for legal aid organizations to assess and improve service quality.",
      category: "legal-aid",
      type: "template",
      format: "PDF + Word",
      pages: 32,
      language: "English/Swahili",
      downloadCount: 1450,
      rating: 4.4,
      updated: "2023-11-20"
    },
    {
      id: 8,
      title: "Paralegal Training Video Series",
      description: "Complete video training series covering essential skills for community paralegals.",
      category: "capacity-building",
      type: "video",
      format: "MP4",
      duration: "4 hours",
      language: "Swahili",
      downloadCount: 980,
      rating: 4.7,
      updated: "2024-02-14"
    }
  ];

  const partnersData = [
    {
      name: "USAID Tanzania",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      description: "Primary funding partner",
      category: "international"
    },
    {
      name: "Ford Foundation",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      description: "Strategic partner",
      category: "international"
    },
    {
      name: "Tanzania Law Society",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      description: "Professional body",
      category: "civil-society"
    },
    {
      name: "Ministry of Justice",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      description: "Government partner",
      category: "government"
    }
  ];

  const filteredResources = [...featuredResources, ...allResources].filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="bg-neutral-light py-4">
        <Container size="xl">
          <Breadcrumb />
        </Container>
      </div>

      <HeroSection
        icon={<BookOpen className="h-8 w-8" />}
        badge="RESOURCES"
        title="Knowledge Hub for Legal Empowerment"
        description="Access our comprehensive collection of guides, toolkits, reports, and training materials designed to strengthen legal aid delivery and advance access to justice across Tanzania."
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop"
      />

      {/* Resource Categories Overview */}
      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="overline" className="text-primary font-bold mb-4">
              RESOURCE CATEGORIES
            </Typography>
            <Typography variant="h2" className="mb-6">
              Explore Our Knowledge Collection
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our resources are organized by thematic areas to help you quickly find 
              the information and tools most relevant to your work.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.slice(1).map((category, index) => (
              <Card 
                key={category.id} 
                variant="elevated" 
                hover 
                className={`text-center cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {category.icon}
                  </div>
                </div>
                <Typography variant="h4" className="mb-2">
                  {category.name}
                </Typography>
                <Typography variant="bodySmall" className="text-primary font-semibold">
                  {category.count} Resources
                </Typography>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Resources */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Featured Resources
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Our most popular and recently updated resources
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <Card key={resource.id} variant="elevated" hover className="group overflow-hidden">
                <div className="relative">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-secondary-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {resource.format}
                  </div>
                </div>
                
                <div className="p-6">
                  <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors">
                    {resource.title}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray mb-4 leading-relaxed">
                    {resource.description}
                  </Typography>
                  
                  {/* Resource Meta */}
                  <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-t border-b border-neutral-100">
                    <div className="text-center">
                      <Typography variant="bodySmall" className="font-semibold text-primary">
                        {resource.pages} pages
                      </Typography>
                      <Typography variant="caption" className="text-neutral-gray">
                        Content
                      </Typography>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-secondary-yellow fill-current mr-1" />
                        <Typography variant="bodySmall" className="font-semibold">
                          {resource.rating}
                        </Typography>
                      </div>
                      <Typography variant="caption" className="text-neutral-gray">
                        Rating
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-neutral-gray">
                      <Download className="h-4 w-4 mr-1" />
                      {resource.downloadCount.toLocaleString()} downloads
                    </div>
                    <div className="flex items-center text-sm text-neutral-gray">
                      <Clock className="h-4 w-4 mr-1" />
                      Updated {resource.updated}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Resource Library with Search */}
      <Section variant="default" padding="xl">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">
              Complete Resource Library
            </Typography>
            <Typography variant="body" className="text-neutral-gray">
              Search and filter our entire collection of resources
            </Typography>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-gray" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {resourceCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {resourceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} variant="elevated" hover className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      {resource.type === 'video' ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <Typography variant="caption" className="text-primary font-semibold uppercase">
                        {resource.type}
                      </Typography>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-secondary-yellow fill-current mr-1" />
                        <span className="text-xs text-neutral-gray">{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Typography variant="caption" className="text-neutral-gray">
                    {resource.format}
                  </Typography>
                </div>
                
                <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors">
                  {resource.title}
                </Typography>
                
                <Typography variant="bodySmall" className="text-neutral-gray mb-4 leading-relaxed">
                  {resource.description}
                </Typography>
                
                <div className="flex items-center justify-between mb-4 text-xs text-neutral-gray">
                  <span>{resource.downloadCount.toLocaleString()} downloads</span>
                  <span>Updated {resource.updated}</span>
                </div>
                
                <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resource
                </Button>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <Typography variant="h4" className="text-neutral-600 mb-2">
                No resources found
              </Typography>
              <Typography variant="body" className="text-neutral-500">
                Try adjusting your search criteria or filters
              </Typography>
            </div>
          )}
        </Container>
      </Section>

      {/* Resource Request */}
      <Section variant="secondary" padding="lg">
        <Container size="xl">
          <div className="max-w-4xl mx-auto">
            <Card variant="elevated" className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <Typography variant="h3" className="mb-4">
                Can't Find What You're Looking For?
              </Typography>
              <Typography variant="body" className="text-neutral-gray mb-6 max-w-2xl mx-auto">
                We're continuously expanding our resource library. If you need specific materials 
                or have suggestions for new resources, we'd love to hear from you.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Request a Resource
                </Button>
                <Button size="lg" variant="outline">
                  Suggest New Content
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Partners Section */}
      <PartnershipsSection
        title="Knowledge Partners"
        subtitle="Organizations collaborating with us to develop and share resources"
        partners={partnersData}
      />

      {/* Call to Action */}
      <GetInvolvedCTA />
    </Layout>
  );
};

export default Resources;
