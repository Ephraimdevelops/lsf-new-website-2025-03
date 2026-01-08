import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Newspaper, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNews, usePublications } from '@/hooks/useContent';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

interface ContentItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    publishedDate: string;
    category: string;
    type: 'news' | 'publication';
    readTime?: string;
}

const CompactNewsSection = () => {
    const [activeTab, setActiveTab] = useState<'news' | 'publications'>('news');
    const [items, setItems] = useState<ContentItem[]>([]);

    const { news } = useNews();
    const { publications } = usePublications();

    const getCategoryStyles = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('legal')) return 'bg-primary text-white';
        if (cat.includes('innov')) return 'bg-secondary-teal text-white';
        if (cat.includes('commun')) return 'bg-secondary-orange text-white';
        return 'bg-gray-800 text-white';
    };

    useEffect(() => {
        if (activeTab === 'news') {
            if (news && news.length > 0) {
                setItems(news.slice(0, 3).map((item: any) => ({
                    id: item._id || item.id,
                    title: item.title,
                    description: item.excerpt || item.content?.substring(0, 100) + '...',
                    imageUrl: item.image || '/lovable-uploads/placeholder.svg',
                    publishedDate: item.date || new Date().toISOString(),
                    category: item.category || 'News',
                    type: 'news',
                    readTime: item.readTime || '5 min read'
                })));
            } else {
                setItems([{
                    id: '1', title: 'Loading News...', description: 'Please wait...', imageUrl: '/lovable-uploads/placeholder.svg',
                    publishedDate: new Date().toISOString(), category: 'Update', type: 'news', readTime: '2 min'
                }]);
            }
        } else {
            if (publications && publications.length > 0) {
                setItems(publications.slice(0, 3).map((item: any) => ({
                    id: item._id || item.id,
                    title: item.title,
                    description: item.description || 'Access this resource...',
                    imageUrl: item.coverImageUrl || '/lovable-uploads/placeholder.svg',
                    publishedDate: item.publishedDate || new Date().toISOString(),
                    category: item.category || 'Publication',
                    type: 'publication'
                })));
            } else {
                setItems([{
                    id: '1', title: 'Loading...', description: 'Please wait...', imageUrl: '/lovable-uploads/placeholder.svg',
                    publishedDate: new Date().toISOString(), category: 'Resource', type: 'publication'
                }]);
            }
        }
    }, [activeTab, news, publications]);

    return (
        <section className="py-20 bg-gray-50">
            <Container>
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-3 bg-secondary-teal text-white rounded-full px-6 py-2 mb-5">
                        <Newspaper className="h-4 w-4" />
                        <span className="font-bold text-sm uppercase tracking-widest">Knowledge Hub</span>
                    </div>

                    <Typography variant="h2" className="font-bold text-gray-900 tracking-tight text-3xl md:text-4xl lg:text-5xl mb-4">
                        Latest <span className="text-primary">{activeTab === 'news' ? 'News' : 'Publications'}</span>
                    </Typography>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-gray-600 text-lg max-w-xl border-l-4 border-secondary-teal pl-6">
                            Stay informed with our latest updates, research, and resources.
                        </p>

                        <div className="inline-flex bg-white p-1 rounded-full shadow-sm">
                            <button
                                onClick={() => setActiveTab('news')}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'news'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                News
                            </button>
                            <button
                                onClick={() => setActiveTab('publications')}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'publications'
                                    ? 'bg-primary text-white'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Publications
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            to={item.type === 'news' ? `/news/${item.id}` : `/publications/${item.id}`}
                            className="group block"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                                <div className="relative h-44 overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryStyles(item.category)}`}>
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center text-gray-500 text-xs mb-2 gap-3">
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(item.publishedDate).toLocaleDateString()}
                                        </span>
                                        {item.readTime && (
                                            <span className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {item.readTime}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
                                        {item.description}
                                    </p>

                                    <span className="text-primary font-bold text-sm flex items-center uppercase tracking-wide">
                                        {item.type === 'news' ? 'Read Article' : 'Download'}
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Button asChild size="lg" variant="outline" className="border-2 border-gray-200 text-gray-900 hover:border-primary hover:bg-primary hover:text-white rounded-full px-8 h-12 text-base font-bold transition-all">
                        <Link to={activeTab === 'news' ? '/news' : '/publications'}>
                            View All {activeTab === 'news' ? 'News' : 'Resources'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default CompactNewsSection;
