import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Layout from '@/components/layout/Layout';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { ArrowRight, Download, FileText, Calendar, Newspaper, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResourceCategoryProps {
  category: string;
  title: string;
  description: string;
  icon: ReactNode;
  accentColor?: string; // e.g., 'primary', 'secondary-teal', 'secondary-orange'
}

const ResourceCategory = ({
  category,
  title,
  description,
  icon,
  accentColor = 'primary'
}: ResourceCategoryProps) => {
  const [activeTab, setActiveTab] = useState('all');

  // Fetch news and publications from Convex, filtered by category
  const allNews = useQuery(api.news.get) || [];
  const allPublications = useQuery(api.publications.get) || [];

  // Filter by category (case-insensitive match)
  const categoryLower = category.toLowerCase();
  const filteredNews = allNews.filter((item: any) =>
    item.category?.toLowerCase().includes(categoryLower) ||
    item.keywords?.some((k: string) => k.toLowerCase().includes(categoryLower))
  );
  const filteredPublications = allPublications.filter((item: any) =>
    item.category?.toLowerCase().includes(categoryLower) ||
    item.type?.toLowerCase().includes(categoryLower)
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAccentClasses = () => {
    switch (accentColor) {
      case 'secondary-teal': return { bg: 'bg-secondary-teal', gradient: 'from-secondary-teal to-teal-700', text: 'text-secondary-teal' };
      case 'secondary-orange': return { bg: 'bg-secondary-orange', gradient: 'from-secondary-orange to-orange-700', text: 'text-secondary-orange' };
      default: return { bg: 'bg-primary', gradient: 'from-primary to-primary-dark', text: 'text-primary' };
    }
  };

  const accent = getAccentClasses();

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`relative py-24 md:py-32 bg-gradient-to-br ${accent.gradient} text-white overflow-hidden`}>
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('/pattern-bg.png')", backgroundSize: '150px', backgroundRepeat: 'repeat' }}
        />
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <Container size="2xl" className="relative z-10">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {icon}
              </div>
              <span className="font-bold text-sm uppercase tracking-widest">
                {category} Resources
              </span>
            </div>

            {/* Title */}
            <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {title}
            </Typography>

            {/* Description */}
            <Typography variant="body" className="text-xl text-white/90 max-w-2xl leading-relaxed">
              {description}
            </Typography>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-10">
              <div className="text-center">
                <p className="text-4xl font-black">{filteredNews.length}</p>
                <p className="text-white/80 text-sm">News Articles</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black">{filteredPublications.length}</p>
                <p className="text-white/80 text-sm">Publications</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section with Tabs */}
      <section className="py-16 bg-gray-50">
        <Container size="2xl">
          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <div>
                <Typography variant="h2" className="text-3xl font-bold text-gray-900 mb-2">
                  Browse {category} Content
                </Typography>
                <p className="text-gray-600">Explore news, publications, and resources on this topic.</p>
              </div>
              <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
                <TabsTrigger value="all" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                  All ({filteredNews.length + filteredPublications.length})
                </TabsTrigger>
                <TabsTrigger value="news" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Newspaper className="h-4 w-4 mr-2" /> News ({filteredNews.length})
                </TabsTrigger>
                <TabsTrigger value="publications" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                  <BookOpen className="h-4 w-4 mr-2" /> Publications ({filteredPublications.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* All Tab */}
            <TabsContent value="all">
              {filteredNews.length === 0 && filteredPublications.length === 0 ? (
                <EmptyState category={category} />
              ) : (
                <div className="space-y-12">
                  {/* News Section */}
                  {filteredNews.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Newspaper className={`h-5 w-5 ${accent.text}`} /> Latest News
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews.slice(0, 6).map((item: any) => (
                          <NewsCard key={item._id} item={item} accent={accent} formatDate={formatDate} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publications Section */}
                  {filteredPublications.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className={`h-5 w-5 ${accent.text}`} /> Publications & Reports
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPublications.slice(0, 6).map((item: any) => (
                          <PublicationCard key={item._id} item={item} accent={accent} formatDate={formatDate} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news">
              {filteredNews.length === 0 ? (
                <EmptyState category={category} type="news" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((item: any) => (
                    <NewsCard key={item._id} item={item} accent={accent} formatDate={formatDate} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Publications Tab */}
            <TabsContent value="publications">
              {filteredPublications.length === 0 ? (
                <EmptyState category={category} type="publications" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPublications.map((item: any) => (
                    <PublicationCard key={item._id} item={item} accent={accent} formatDate={formatDate} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center">
            <Typography variant="h2" className="text-3xl md:text-4xl font-bold mb-6">
              Can't Find What You're Looking For?
            </Typography>
            <p className="text-white/70 text-lg mb-10">
              Our team can help you find specific resources or create custom materials for your work in {category.toLowerCase()}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className={`${accent.bg} hover:opacity-90 text-white font-bold px-10 py-5 rounded-full`}>
                  Contact Our Team
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-gray-900 font-bold px-10 py-5 rounded-full">
                  Browse All Resources
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

// --- Sub-components ---

const NewsCard = ({ item, accent, formatDate }: { item: any; accent: any; formatDate: (d: string) => string }) => (
  <Link to={`/news/${item.slug || item._id}`} className="group">
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className={`inline-block ${accent.text} text-xs font-bold uppercase tracking-wider mb-2`}>
          {item.category}
        </span>
        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h4>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{item.excerpt}</p>
        <div className="flex items-center text-xs text-gray-500 mt-auto">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(item.date)}
        </div>
      </div>
    </div>
  </Link>
);

const PublicationCard = ({ item, accent, formatDate }: { item: any; accent: any; formatDate: (d: string) => string }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col group">
    <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
      <img
        src={item.coverImageUrl || '/placeholder.svg'}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
          {item.type}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {item.title}
      </h4>
      <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(item.publishedDate)}
        </span>
        {item.pdfUrl && (
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 ${accent.text} text-sm font-bold hover:underline`}
          >
            <Download className="h-4 w-4" /> Download
          </a>
        )}
      </div>
    </div>
  </div>
);

const EmptyState = ({ category, type }: { category: string; type?: string }) => (
  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <FileText className="h-10 w-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No {type || 'content'} found</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      We don't have any {type || 'resources'} categorized under "{category}" yet. Check back soon or explore other categories.
    </p>
    <Link to="/resources" className="inline-block mt-6">
      <Button variant="outline">Browse All Resources</Button>
    </Link>
  </div>
);

export default ResourceCategory;
