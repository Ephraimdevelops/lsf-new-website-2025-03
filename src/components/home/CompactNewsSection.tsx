import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Newspaper, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNews, usePublications } from '@/hooks/useContent';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedDate: string;
  category: string;
  type: 'news' | 'publication';
}

const CompactNewsSection = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'publications'>('news');
  const [items, setItems] = useState<ContentItem[]>([]);

  const { news, loading: newsLoading } = useNews();
  const { publications, loading: publicationsLoading } = usePublications();

  // Fallback items
  const fallbackNews: ContentItem[] = [
    {
      id: '1',
      title: 'Mama Samia Legal Aid Campaign Reaches 15,000+ Citizens',
      description: 'The nationwide campaign provided free legal services to vulnerable communities across Tanzania.',
      imageUrl: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
      publishedDate: '2024-04-30',
      category: 'Legal Empowerment',
      type: 'news',
    },
    {
      id: '2',
      title: 'Haki Yangu Mobile App Expands Digital Access',
      description: 'LSF\'s digital transformation initiative connects users with legal resources through mobile technology.',
      imageUrl: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
      publishedDate: '2024-03-15',
      category: 'Digital Innovation',
      type: 'news',
    },
    {
      id: '3',
      title: 'New Climate Justice Initiative Launches',
      description: 'LSF launches groundbreaking program to address climate-related legal issues affecting communities.',
      imageUrl: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
      publishedDate: '2024-02-22',
      category: 'Climate Justice',
      type: 'news',
    },
  ];

  const fallbackPubs: ContentItem[] = [
    {
      id: '1',
      title: 'LSF Annual Report 2023',
      description: 'Comprehensive annual report showcasing the impact of legal aid services across Tanzania.',
      imageUrl: '/lovable-uploads/09086165-bb32-43b3-ae0a-b266fd207f36.png',
      publishedDate: '2024-01-15',
      category: 'Annual Report',
      type: 'publication',
    },
    {
      id: '2',
      title: 'Policy Brief: Gender Justice Mechanisms',
      description: 'Analysis and recommendations for improving gender justice systems in Tanzania.',
      imageUrl: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
      publishedDate: '2023-11-20',
      category: 'Policy Brief',
      type: 'publication',
    },
    {
      id: '3',
      title: 'Community Paralegal Training Guide',
      description: 'Comprehensive training manual for community paralegals.',
      imageUrl: '/lovable-uploads/7cdc0b2c-cc42-4f40-9196-2324a35f30a1.png',
      publishedDate: '2023-09-10',
      category: 'Training Guide',
      type: 'publication',
    },
  ];

  useEffect(() => {
    if (activeTab === 'news') {
      if (news && news.length > 0) {
        const transformed = news.slice(0, 3).map((item: any) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.excerpt || item.content?.substring(0, 100) + '...',
          imageUrl: item.image || '/lovable-uploads/placeholder.svg',
          publishedDate: item.date || new Date().toISOString(),
          category: item.category || 'News',
          type: 'news' as const,
        }));
        setItems(transformed);
      } else {
        setItems(fallbackNews);
      }
    } else {
      if (publications && publications.length > 0) {
        const transformed = publications.slice(0, 3).map((item: any) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description || 'Read more...',
          imageUrl: item.coverImageUrl || '/lovable-uploads/placeholder.svg',
          publishedDate: item.publishedDate || new Date().toISOString(),
          category: item.category || 'Publication',
          type: 'publication' as const,
        }));
        setItems(transformed);
      } else {
        setItems(fallbackPubs);
      }
    }
  }, [activeTab, news, publications]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isLoading = newsLoading || publicationsLoading;

  return (
    <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
              <Newspaper className="h-4 w-4 text-secondary-orange" />
              <span className="text-white font-bold text-sm uppercase tracking-widest">Latest Updates</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              News & <span className="text-secondary-orange">Resources</span>
            </h2>
            <p className="text-white/70 text-lg max-w-xl">
              Stay informed with our latest stories, reports, and publications.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-1 bg-white/10 backdrop-blur-sm p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'news'
                  ? 'bg-secondary-orange text-white'
                  : 'text-white/70 hover:text-white'
                }`}
            >
              <Newspaper className="h-4 w-4" />
              News
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'publications'
                  ? 'bg-secondary-orange text-white'
                  : 'text-white/70 hover:text-white'
                }`}
            >
              <FileText className="h-4 w-4" />
              Publications
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 h-96 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Link
                key={item.id}
                to={item.type === 'news' ? `/news/${item.id}` : `/publications/${item.id}`}
                className="group flex flex-col rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-secondary-orange/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lovable-uploads/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-secondary-orange text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-secondary-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-6 line-clamp-2 flex-grow">
                    {item.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(item.publishedDate)}
                    </div>
                    <div className="flex items-center gap-2 text-secondary-orange font-bold text-sm group-hover:gap-3 transition-all">
                      Read
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link to={activeTab === 'news' ? '/news' : '/publications'}>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-10 py-5 rounded-full text-lg">
              View All {activeTab === 'news' ? 'News' : 'Publications'}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CompactNewsSection;
