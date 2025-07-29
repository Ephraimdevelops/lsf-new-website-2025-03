import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Section, Container, Heading, Text } from '../design-system';
import { useNews } from '@/hooks/useContent';
import { format } from 'date-fns';

interface INews {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  date: string;
}

const CleanNewsSection: React.FC = () => {
  const { news } = useNews();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [newsData, setNewsData] = React.useState<INews[]>([]);

  React.useEffect(() => {
    const initializeNews = async () => {
      try {
        if (news) {
          setNewsData(news as INews[]);
          setLoading(false);
        }
      } catch (e) {
        setError(e as Error);
        setLoading(false);
      }
    };

    initializeNews();
  }, [news]);

  if (loading) {
    return (
      <Section>
        <Container>
          <div className="animate-pulse">
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-gray-100 rounded-lg p-4 h-[300px]"></div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <Container>
          <div className="text-center text-red-500">
            Failed to load news. Please try again later.
          </div>
        </Container>
      </Section>
    );
  }

  const featuredNews = newsData[0];
  const recentNews = newsData.slice(1, 4);

  if (!featuredNews) {
    return null;
  }

  return (
    <Section>
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured News */}
          <div className="lg:col-span-8">
            <Link
              to={`/news/${featuredNews.id}`}
              className="group block relative overflow-hidden rounded-2xl"
            >
              {featuredNews.image && (
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-[400px] object-cover transition duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <Text className="text-white/80 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(featuredNews.date), 'MMMM dd, yyyy')}
                </Text>
                <Heading level={2} className="text-white">
                  {featuredNews.title}
                </Heading>
                <Text className="text-white/80 mt-2">
                  {featuredNews.excerpt}
                </Text>
              </div>
            </Link>
          </div>

          {/* Recent News */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <Heading level={2}>Recent News</Heading>
              <Link
                to="/news"
                className="text-primary hover:text-primary/80 flex items-center gap-2"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {recentNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="block p-4 rounded-lg hover:bg-gray-50 transition"
                >
                  <Text className="text-gray-600 flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(item.date), 'MMMM dd, yyyy')}
                  </Text>
                  <Heading level={3} className="text-lg">
                    {item.title}
                  </Heading>
                  <Text className="text-gray-600 mt-1 line-clamp-2">
                    {item.excerpt}
                  </Text>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CleanNewsSection;
