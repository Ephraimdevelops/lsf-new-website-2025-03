import { Leaf, TreePine, Droplets, Sun, Wind, Recycle, Users, BookOpen, FileText, Video, Download, ExternalLink } from 'lucide-react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    location: 'Coastal Region'
  }
];

const ClimateJusticeResources = () => {
  return (
    <Layout>
      <HeroSection
        icon={<Leaf className="h-8 w-8" />}
        badge="Resources"
        title="Climate Justice Resources"
        description="Legal tools, guides, and resources for protecting environmental rights and advancing climate justice in Tanzania."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Key Topics Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              Key Climate Justice Areas
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Our climate justice work spans multiple interconnected areas, from forest rights to energy transition, ensuring comprehensive protection for all communities.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyTopics.map((topic, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <CardContent className="p-6 relative">
                  <div className="text-primary mb-4">
                    {topic.icon}
                  </div>
                  <Typography variant="h4" className="mb-3">
                    {topic.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray text-sm">
                    {topic.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Resources */}
      <section className="py-16">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              Featured Climate Justice Resources
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Essential guides and tools for understanding and advancing climate justice in Tanzania.
            </Typography>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {climateResources.filter(resource => resource.featured).map((resource) => (
              <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {resource.type}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                    {resource.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray mb-4 text-sm">
                    {resource.description}
                  </Typography>
                  
                  <div className="flex items-center justify-between text-sm text-neutral-gray mb-4">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {resource.pages} pages
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {resource.language}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {climateResources.filter(resource => !resource.featured).map((resource) => (
              <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-all duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-green-400 to-emerald-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-white/90 text-green-700 border-green-200">
                      {resource.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Typography variant="h4" className="mb-2 group-hover:text-primary transition-colors text-sm font-semibold">
                    {resource.title}
                  </Typography>
                  <Typography variant="body" className="text-neutral-gray mb-3 text-xs line-clamp-2">
                    {resource.description}
                  </Typography>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-gray mb-3">
                    <span>{resource.type}</span>
                    <span>{resource.pages} pages</span>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-green-50">
        <Container size="xl">
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-4">
              Climate Justice Success Stories
            </Typography>
            <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
              Real examples of how our climate justice resources and advocacy have protected communities and environmental rights.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h3" className="mb-2">
                      {story.title}
                    </Typography>
                    <Typography variant="body" className="text-neutral-gray text-sm mb-3">
                      {story.description}
                    </Typography>
                    <div className="flex items-center text-sm">
                      <Badge variant="outline" className="mr-2 bg-green-50 text-green-700 border-green-200">
                        {story.impact}
                      </Badge>
                      <span className="text-neutral-gray">{story.location}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <Container size="xl">
          <div className="text-center max-w-3xl mx-auto">
            <Typography variant="h2" className="text-white mb-6">
              Join the Climate Justice Movement
            </Typography>
            <Typography variant="body" className="text-white/90 mb-8">
              Climate change affects us all, but impacts the most vulnerable first and worst. Download our resources, share them with your community, and join us in building a just and sustainable future for Tanzania.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Download className="mr-2 h-5 w-5" />
                Download All Resources
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <ExternalLink className="mr-2 h-5 w-5" />
                Contact Our Team
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default ClimateJusticeResources;
