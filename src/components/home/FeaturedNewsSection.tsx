import { ArrowRight, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const featuredNews = [
  {
    id: '1',
    title: 'LSF Launches Digital Legal Aid Platform in Rural Tanzania',
    excerpt: 'New mobile application connects remote communities with legal services, reaching over 10,000 users in first month.',
    date: '2024-01-15',
    category: 'Digital Innovation',
    image: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
    readTime: '3 min read',
    featured: true
  },
  {
    id: '2',
    title: 'Partnership with Ministry of Justice Strengthens Legal Framework',
    excerpt: 'Historic MOU signed to enhance access to justice across all 31 regions of Tanzania.',
    date: '2024-01-10',
    category: 'Policy',
    image: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
    readTime: '5 min read'
  },
  {
    id: '3',
    title: 'Women\'s Land Rights Training Reaches 5,000 Participants',
    excerpt: 'Comprehensive training program empowers women across Tanzania to understand and claim their land rights.',
    date: '2024-01-08',
    category: 'Gender Justice',
    image: '/lovable-uploads/background with mother umage .png',
    readTime: '4 min read'
  },
  {
    id: '4',
    title: 'Climate Justice Initiative Wins International Recognition',
    excerpt: 'LSF\'s innovative approach to climate justice receives UN Sustainable Development Award.',
    date: '2024-01-05',
    category: 'Climate Justice',
    image: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
    readTime: '2 min read'
  }
];

const FeaturedNewsSection = () => {
  const mainNews = featuredNews[0];
  const sideNews = featuredNews.slice(1);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Latest Updates
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light mb-4 text-foreground">
            News & <span className="text-primary font-medium">Developments</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about our latest initiatives, partnerships, and impact stories from across Tanzania.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img 
                  src={mainNews.image} 
                  alt={mainNews.title}
                  className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary text-white">
                  {mainNews.category}
                </Badge>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-medium text-white mb-3 leading-tight">
                    {mainNews.title}
                  </h3>
                  <div className="flex items-center text-white/80 text-sm gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(mainNews.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {mainNews.readTime}
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {mainNews.excerpt}
                </p>
                <Button variant="outline" className="group/btn">
                  Read Full Story
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Side News */}
          <div className="space-y-6">
            {sideNews.map((news) => (
              <Card key={news.id} className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex">
                  <div className="w-24 lg:w-32 flex-shrink-0">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <Badge variant="secondary" className="text-xs mb-2">
                      {news.category}
                    </Badge>
                    <h4 className="font-medium text-sm leading-tight mb-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(news.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {news.readTime}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            {/* View All News */}
            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <h4 className="font-medium mb-2">Stay Updated</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest news and updates from LSF delivered to your inbox.
                </p>
                <Button asChild variant="ghost" className="w-full group">
                  <Link to="/news">
                    View All News
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsSection;