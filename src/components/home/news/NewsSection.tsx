
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Heading, Text } from '../../design-system';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const NewsSection = () => {
  const featuredNews = useQuery(api.news.getFeatured);

  // Loading state
  if (featuredNews === undefined) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-12">
        <div>
          <Heading variant="section" color="neutral" className="font-bold text-3xl mb-2">
            Featured Stories
          </Heading>
          <Text variant="body" color="neutral" className="text-lg">
            Latest developments & impact stories
          </Text>
        </div>
        <Link
          to="/news"
          className="hidden md:inline-flex items-center text-primary hover:text-secondary-teal px-6 py-3 font-semibold transition-colors duration-300 text-base group"
        >
          <Text variant="body" className="font-semibold">View All Stories</Text>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {featuredNews.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <Text variant="body">No news stories found.</Text>
        </div>
      ) : (
        <>
          {/* Featured story - horizontal layout */}
          {featuredNews[0] && (
            <Link to={`/news/${featuredNews[0]._id}`} className="group block mb-12">
              <article className="flex flex-col lg:flex-row gap-8 hover:opacity-95 transition-opacity duration-300">
                <div className="lg:w-3/5 relative overflow-hidden rounded-lg">
                  <img
                    src={featuredNews[0].image || '/lovable-uploads/placeholder.svg'}
                    alt={featuredNews[0].title}
                    className="w-full h-80 lg:h-96 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-neutral-800 text-xs font-bold px-4 py-2 rounded-full">
                      FEATURED
                    </span>
                  </div>
                </div>
                <div className="lg:w-2/5 flex flex-col justify-center">
                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <Calendar size={14} className="mr-2" />
                    {new Date(featuredNews[0].date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <Heading variant="section" className="text-neutral-800 group-hover:text-primary transition-colors mb-4 leading-tight">
                    {featuredNews[0].title}
                  </Heading>
                  {/* Render HTML content safely or just strip tags for excerpt */}
                  <div className="text-neutral-600 leading-relaxed mb-6 line-clamp-3" dangerouslySetInnerHTML={{ __html: featuredNews[0].excerpt }} />

                  <div className="inline-flex items-center text-primary font-semibold group-hover:underline transition-all duration-300">
                    Read the Story
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Additional stories - equal height cards to match publications */}
          <div className="space-y-8">
            {featuredNews.slice(1).map((news) => (
              <Link key={news._id} to={`/news/${news._id}`} className="group block">
                <article className="hover:opacity-95 transition-opacity duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden bg-neutral-100">
                      <img
                        src={news.image || '/lovable-uploads/placeholder.svg'}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                          {news.category}
                        </span>
                        <span className="bg-secondary-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                          STORY
                        </span>
                      </div>

                      <Heading variant="card" color="neutral" className="leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-2">
                        {news.title}
                      </Heading>

                      <div className="flex items-center text-sm text-neutral-500 mb-3">
                        <Calendar size={14} className="mr-2" />
                        {new Date(news.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-primary hover:text-secondary-teal font-semibold text-sm hover:underline transition-all duration-300">
                          Read More
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Mobile CTA */}
      <div className="text-center mt-12 md:hidden">
        <Link
          to="/news"
          className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300"
        >
          View All Stories
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default NewsSection;
