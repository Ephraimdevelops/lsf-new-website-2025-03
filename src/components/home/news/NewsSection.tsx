
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Heading, Text } from '../../design-system';
import { featuredNews } from './newsData';

const NewsSection = () => {
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

      {/* Featured story - horizontal layout */}
      {featuredNews[0] && (
        <Link to="/news" className="group block mb-12">
          <article className="flex flex-col lg:flex-row gap-8 hover:opacity-95 transition-opacity duration-300">
            <div className="lg:w-3/5 relative overflow-hidden rounded-lg">
              <img 
                src={featuredNews[0].image}
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
              <Text variant="body" className="text-neutral-600 leading-relaxed mb-6">
                {featuredNews[0].excerpt}
              </Text>
              <div className="inline-flex items-center text-primary font-semibold group-hover:underline transition-all duration-300">
                Read the Story
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </article>
        </Link>
      )}

      {/* Additional stories - clean grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuredNews.slice(1).map((news) => (
          <Link key={news.id} to="/news" className="group block">
            <article className="hover:opacity-95 transition-opacity duration-300">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src={news.image}
                  alt={news.title}
                  className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary-orange text-white text-xs font-bold px-3 py-2 rounded-full">
                    {news.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-sm text-neutral-500 mb-3">
                <Calendar size={14} className="mr-2" />
                {new Date(news.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </div>
              <Heading variant="card" className="text-neutral-800 group-hover:text-primary transition-colors mb-3 leading-snug">
                {news.title}
              </Heading>
              <Text variant="body-small" className="text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                {news.excerpt}
              </Text>
              <div className="inline-flex items-center text-primary font-semibold group-hover:underline transition-all duration-300">
                Read More
                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </article>
          </Link>
        ))}
      </div>

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
