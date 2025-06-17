
import { Leaf, TreePine, Droplets, Sun, Wind, Recycle, Users, BookOpen, FileText, Video, Download, ExternalLink } from 'lucide-react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Breadcrumb from '../components/shared/Breadcrumb';

const climateResources = [
  {
    id: 'climate-rights-guide',
    title: 'Climate Rights and Environmental Justice in Tanzania',
    description: 'Comprehensive guide to understanding environmental rights, climate justice, and legal pathways for climate-related grievances.',
    type: 'PDF Guide',
    category: 'Legal Framework',
    language: 'Swahili & English',
    pages: 45,
    downloadUrl: '#',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'community-adaptation',
    title: 'Community-Based Climate Adaptation Strategies',
    description: 'Practical toolkit for communities to develop and implement climate adaptation measures while understanding their legal rights.',
    type: 'Interactive Toolkit',
    category: 'Community Action',
    language: 'Swahili',
    pages: 32,
    downloadUrl: '#',
    image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'water-rights',
    title: 'Water Rights and Climate Resilience',
    description: 'Understanding water access rights, drought preparedness, and legal mechanisms for water security in changing climate.',
    type: 'Legal Brief',
    category: 'Water Justice',
    language: 'English',
    pages: 28,
    downloadUrl: '#',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'indigenous-knowledge',
    title: 'Indigenous Climate Knowledge and Legal Protection',
    description: 'Documenting traditional ecological knowledge and its legal protection in the context of climate change adaptation.',
    type: 'Research Report',
    category: 'Traditional Knowledge',
    language: 'Swahili & English',
    pages: 67,
    downloadUrl: '#',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'climate-litigation',
    title: 'Climate Litigation Guide for Legal Practitioners',
    description: 'Step-by-step guide for lawyers and paralegals on building climate justice cases and representing affected communities.',
    type: 'Training Manual',
    category: 'Legal Practice',
    language: 'English',
    pages: 89,
    downloadUrl: '#',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'youth-climate-action',
    title: 'Youth Climate Advocacy and Legal Empowerment',
    description: 'Empowering young Tanzanians to understand their rights and take legal action on climate issues affecting their future.',
    type: 'Workshop Guide',
    category: 'Youth Engagement',
    language: 'Swahili',
    pages: 24,
    downloadUrl: '#',
    image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

const keyTopics = [
  {
    icon: <TreePine className="h-8 w-8" />,
    title: 'Forest Rights & REDD+',
    description: 'Understanding community forest rights, REDD+ mechanisms, and legal protections for forest-dependent communities.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: <Droplets className="h-8 w-8" />,
    title: 'Water Security & Justice',
    description: 'Legal frameworks for water access, drought response, and protecting water rights during climate stress.',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: <Sun className="h-8 w-8" />,
    title: 'Energy Transition Rights',
    description: 'Community rights in renewable energy projects and ensuring just energy transition for all.',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    icon: <Wind className="h-8 w-8" />,
    title: 'Adaptation & Resilience',
    description: 'Legal tools for building community resilience and accessing climate adaptation funding.',
    color: 'from-purple-500 to-pink-600'
  }
];

const successStories = [
  {
    title: 'Mara River Basin Communities',
    description: 'Successfully advocated for community water rights during drought, ensuring access for 12,000 people.',
    impact: '12,000 people',
    location: 'Mara Region'
  },
  {
    title: 'Coastal Mangrove Protection',
    description: 'Legal intervention prevented mangrove destruction, protecting 500 families from coastal erosion.',
    impact: '500 families',
    location: 'Coastal Tanzania'
  },
  {
    title: 'Indigenous Forest Rights',
    description: 'Secured traditional forest use rights for Hadza community, preserving cultural practices and biodiversity.',
    impact: '2,500 Hadza people',
    location: 'Northern Tanzania'
  }
];

const ClimateJusticeResources = () => {
  const breadcrumbItems = [
    { name: "Resources", href: "/resources" },
    { name: "Climate Justice" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<Leaf className="h-8 w-8" />}
        badge="Climate Justice Resources"
        title="Climate Justice & Environmental Rights"
        description="Empowering communities with knowledge and tools to defend their environmental rights and build climate resilience through legal empowerment."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Breadcrumb */}
      <div className="bg-neutral-light/50 py-4 border-b">
        <Container>
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* Key Topics Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Key Climate Justice Areas</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Understanding the intersection of climate change and legal rights across critical environmental sectors.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyTopics.map((topic, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${topic.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>
                    {topic.icon}
                  </div>
                  <Typography variant="h3" className="mb-4 font-semibold">
                    {topic.title}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {topic.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Featured Climate Justice Resources</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Essential publications and tools for understanding and exercising climate rights in Tanzania.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {climateResources.filter(resource => resource.featured).map((resource) => (
              <Card key={resource.id} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden">
                <div className="relative overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={resource.image} 
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">
                      <Leaf className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="outline" className="border-white text-white mb-2">
                      {resource.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <Typography variant="h3" className="font-bold mb-3 group-hover:text-green-600 transition-colors">
                    {resource.title}
                  </Typography>
                  
                  <Typography variant="body" className="text-neutral-gray text-sm mb-4 leading-relaxed">
                    {resource.description}
                  </Typography>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-gray mb-6">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {resource.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {resource.pages} pages
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* All Resources Grid */}
      <section className="py-16 bg-neutral-light">
        <Container>
          <Typography variant="h2" className="text-center mb-12">All Climate Justice Resources</Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {climateResources.filter(resource => !resource.featured).map((resource) => (
              <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={resource.image} 
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-green-700">
                      {resource.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <Typography variant="h4" className="font-semibold mb-3">
                    {resource.title}
                  </Typography>
                  
                  <Typography variant="bodySmall" className="text-neutral-gray mb-4">
                    {resource.description}
                  </Typography>
                  
                  <div className="flex items-center justify-between text-sm text-neutral-gray mb-4">
                    <span>{resource.type}</span>
                    <span>{resource.pages} pages</span>
                  </div>
                  
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-green-50">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Climate Justice in Action</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Real stories of communities using legal empowerment to defend their environmental rights and build climate resilience.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <Typography variant="h3" className="mb-4 font-semibold">
                    {story.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray mb-4">
                    {story.description}
                  </Typography>
                  <div className="space-y-2">
                    <Badge className="bg-green-600 text-white">
                      {story.impact}
                    </Badge>
                    <div className="text-sm text-neutral-gray">{story.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <Container>
          <div className="text-center">
            <Typography variant="h2" className="text-white mb-6">Need Climate Justice Legal Support?</Typography>
            <Typography variant="body" className="text-green-100 mb-8 max-w-2xl mx-auto">
              Connect with our network of environmental law experts and climate justice advocates across Tanzania.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                Find Legal Support
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Join Our Network
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default ClimateJusticeResources;
