import { useState } from 'react';
import { Calendar, Clock, ArrowRight, Newspaper, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedDate: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

const SimpleNewsSection = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'publications'>('news');

  // Static data - always visible
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'LSF Launches New Digital Legal Aid Platform Across Tanzania',
      description: 'The Legal Services Facility (LSF) has successfully launched a comprehensive digital platform that connects rural communities with legal professionals, revolutionizing access to justice in Tanzania.',
      imageUrl: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      publishedDate: '2024-01-15',
      category: 'Legal Innovation',
      readTime: '4 min read',
      featured: true
    },
    {
      id: '2',
      title: 'Women\'s Land Rights Initiative Reaches 10,000 Beneficiaries',
      description: 'Our latest initiative focusing on women\'s land rights has successfully empowered over 10,000 women across 15 regions, providing them with essential legal knowledge and support.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-12',
      category: 'Gender Justice',
      readTime: '3 min read',
      featured: true
    },
    {
      id: '3',
      title: 'Climate Justice Program Expands to Coastal Regions',
      description: 'LSF\'s climate justice initiative now covers all coastal regions, helping communities understand and protect their environmental rights in the face of climate change.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-10',
      category: 'Climate Justice',
      readTime: '5 min read',
      featured: false
    },
    {
      id: '4',
      title: 'New Paralegal Training Program Graduates 500+ Professionals',
      description: 'Our comprehensive paralegal training program has successfully graduated over 500 legal professionals, expanding our network of community legal support across Tanzania.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-08',
      category: 'Capacity Building',
      readTime: '6 min read',
      featured: true
    },
    {
      id: '5',
      title: 'Digital Transformation Initiative Reaches Rural Communities',
      description: 'LSF\'s digital transformation program has successfully brought legal technology to over 100 rural communities, bridging the digital divide in legal services.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-05',
      category: 'Digital Innovation',
      readTime: '4 min read',
      featured: false
    },
    {
      id: '6',
      title: 'Partnership with Government Strengthens Legal Aid Access',
      description: 'LSF\'s new partnership with the Tanzanian government has significantly improved legal aid accessibility, reaching over 50,000 people in the first quarter.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-03',
      category: 'Partnership',
      readTime: '5 min read',
      featured: false
    }
  ];

  const publicationsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Access to Justice in Rural Tanzania: A Comprehensive Study',
      description: 'This comprehensive study examines the challenges and opportunities for improving access to justice in rural Tanzania, with recommendations for policy makers and practitioners.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-20',
      category: 'Research Report',
      readTime: '45 pages',
      featured: true
    },
    {
      id: '2',
      title: 'Women\'s Legal Rights Handbook',
      description: 'A practical guide for women in Tanzania to understand their legal rights, including land ownership, inheritance, and protection from gender-based violence.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-18',
      category: 'Legal Guide',
      readTime: '32 pages',
      featured: true
    },
    {
      id: '3',
      title: 'Climate Justice and Community Rights',
      description: 'This publication explores the intersection of climate change and legal rights, providing communities with tools to protect their environmental rights.',
      imageUrl: '/lovable-uploads/placeholder.svg',
      publishedDate: '2024-01-15',
      category: 'Policy Brief',
      readTime: '28 pages',
      featured: false
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentItems = activeTab === 'news' ? newsItems : publicationsItems;

  return (
    <section className="py-24 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <Newspaper className="h-6 w-6 text-primary animate-pulse" />
            <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
              Latest Updates
            </Typography>
          </div>
          
          <Typography variant="h2" className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Stay Informed with
            <span className="block bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange bg-clip-text text-transparent">
              Our Latest News & Publications
            </span>
          </Typography>
          
          <Typography 
            variant="body" 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Discover the latest developments in legal aid, policy updates, and success stories from communities across Tanzania.
          </Typography>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-neutral-100">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'news'
                  ? 'bg-gradient-to-r from-primary to-secondary-orange text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <Newspaper className="h-5 w-5" />
                News & Updates
              </div>
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'publications'
                  ? 'bg-gradient-to-r from-primary to-secondary-orange text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                Publications
              </div>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentItems.map((item, index) => (
            <div key={item.id} className="group transition-all duration-300 hover:-translate-y-2">
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 h-full">
                {/* Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                    }}
                  />
                  {item.featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary-orange text-white">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  <Typography variant="h4" className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </Typography>

                  <Typography variant="body" className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </Typography>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.publishedDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {item.readTime}
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary-orange hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            View All {activeTab === 'news' ? 'News' : 'Publications'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default SimpleNewsSection;
