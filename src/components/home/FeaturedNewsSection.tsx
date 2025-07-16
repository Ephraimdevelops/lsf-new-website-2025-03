import { ArrowRight, Calendar, Clock, ChevronRight, Download, FileText, Eye, BookOpen, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

// Mock DesignIcon component
const DesignIcon = ({ icon, size = "md", className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    {icon}
  </div>
);

// Mock Typography component
const Typography = ({ variant, children, className = "" }) => {
  const variants = {
    h2: "text-3xl lg:text-4xl font-light",
    overline: "text-xs uppercase tracking-wider"
  };
  
  return (
    <div className={`${variants[variant] || ''} ${className}`}>
      {children}
    </div>
  );
};

const Text = ({ variant, color, children, className = "" }) => (
  <span className={`${className}`}>{children}</span>
);

const featuredNews = [
  {
    id: '1',
    title: 'LSF Launches Digital Legal Aid Platform in Rural Tanzania',
    excerpt: 'New mobile application connects remote communities with legal services, reaching over 10,000 users in first month.',
    date: '2024-01-15',
    category: 'Digital Innovation',
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    readTime: '3 min read',
    type: 'news'
  },
  {
    id: '2',
    title: 'Partnership with Ministry of Justice Strengthens Legal Framework',
    excerpt: 'Historic MOU signed to enhance access to justice across all 31 regions of Tanzania.',
    date: '2024-01-10',
    category: 'Policy',
    image: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
    readTime: '5 min read',
    type: 'news'
  },
  {
    id: '3',
    title: 'Women\'s Land Rights Training Reaches 5,000 Participants',
    excerpt: 'Comprehensive training program empowers women across Tanzania to understand and claim their land rights.',
    date: '2024-01-08',
    category: 'Gender Justice',
    image: '/lovable-uploads/background with mother umage .png',
    readTime: '4 min read',
    type: 'news'
  }
];

const featuredPublications = [
  {
    id: 'annual-report-2023',
    title: 'Annual Report 2023: Impact and Progress in Legal Aid Delivery',
    excerpt: 'A comprehensive report detailing LSF\'s activities, achievements, and impact across Tanzania during the 2023 fiscal year.',
    category: 'Report',
    date: '2023-03-15',
    downloadUrl: '/publications/annual-report-2023.pdf',
    fileSize: '3.2 MB',
    downloads: 2840,
    image: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
    type: 'publication'
  },
  {
    id: 'womens-land-rights',
    title: 'Women\'s Land Rights in Tanzania: Challenges and Opportunities',
    excerpt: 'Research study examining the status of women\'s land rights, identifying challenges and proposing strategies.',
    category: 'Research',
    date: '2023-01-20',
    downloadUrl: '/publications/womens-land-rights.pdf',
    fileSize: '2.8 MB',
    downloads: 1920,
    image: '/lovable-uploads/background with mother umage .png',
    type: 'publication'
  },
  {
    id: 'digital-legal-services',
    title: 'Digital Legal Services: Best Practices and Lessons Learned',
    excerpt: 'Guide exploring effective approaches to implementing digital legal services in rural communities.',
    category: 'Guide',
    date: '2022-11-10',
    downloadUrl: '/publications/digital-legal-services.pdf',
    fileSize: '4.5 MB',
    downloads: 3150,
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    type: 'publication'
  }
];

const UnifiedNewsPublications = () => {
  const [activeTab, setActiveTab] = useState('news');
  
  const currentData = activeTab === 'news' ? featuredNews : featuredPublications;
  const mainItem = currentData[0];
  const sideItems = currentData.slice(1);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
            Latest Updates
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
           News & <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent"></span>
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Developments
            </span>
          </Typography>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about our latest initiatives, partnerships, and impact stories from across Tanzania.
          </p>
         
        </div>


        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-muted rounded-full">
            <button
              onClick={() => setActiveTab('news')}
              className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'news'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Newspaper className="mr-2 h-4 w-4" />
              Latest News
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'publications'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Publications
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Featured Content */}
          <div className="lg:col-span-3">
            <Card className="group overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/50 backdrop-blur-sm">
              <div className="relative">
                <img 
                  src={mainItem.image} 
                  alt={mainItem.title}
                  className="w-full h-[24rem] lg:h-[28rem] object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <Badge className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm text-white px-4 py-2 text-sm font-medium">
                  {mainItem.category}
                </Badge>
                <div className="absolute bottom-8 left-6 right-6">
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    {mainItem.title}
                  </h3>
                  <div className="flex items-center text-white/90 text-base gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {new Date(mainItem.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    {activeTab === 'news' ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {mainItem.readTime}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        {mainItem.downloads?.toLocaleString()} downloads
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                  {mainItem.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  {activeTab === 'publications' && (
                    <div className="flex items-center gap-6 text-base text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {mainItem.fileSize}
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        {mainItem.downloads?.toLocaleString()} views
                      </span>
                    </div>
                  )}
                  <Button size="lg" className="group/btn ml-auto px-8 py-4 text-base">
                    {activeTab === 'news' ? (
                      <>
                        Read Full Story
                        <ArrowRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <Download className="mr-3 h-5 w-5" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Content */}
          <div className="lg:col-span-2 space-y-6">
            {sideItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-secondary-teal/90 backdrop-blur-sm text-white px-3 py-1 text-sm">
                    {item.category}
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="font-bold text-lg text-white mb-2 leading-tight drop-shadow-md group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center text-white/90 text-sm gap-3">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      {activeTab === 'news' ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.readTime}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {item.downloads?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                  <Button variant="ghost" className="w-full mt-4 group/btn justify-between">
                    {activeTab === 'news' ? 'Read More' : 'View Publication'}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedNewsPublications;