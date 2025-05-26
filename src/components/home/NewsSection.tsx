
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, ExternalLink } from 'lucide-react';
import { dataService } from '@/services/dataService';

const NewsSection = () => {
  const featuredNews = dataService.getNews(3, true);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-1 bg-primary"></div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Latest Updates</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">
              News & Impact Stories
            </h2>
          </div>
          <Link 
            to="/news" 
            className="hidden md:inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors group"
          >
            View All News
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* News Grid - More compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredNews.map((news, index) => (
            <Link 
              key={news.id} 
              to={`/news/${news.id}`}
              className="group block transform hover:-translate-y-1 transition-all duration-300"
            >
              <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20 h-full">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-secondary-orange text-white">
                      {news.category}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center text-xs">
                      <Calendar size={12} className="mr-1" />
                      {new Date(news.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 text-neutral-dark line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {news.title}
                  </h3>
                  
                  <p className="text-neutral-gray text-sm line-clamp-2 leading-relaxed mb-3">
                    {news.excerpt}
                  </p>
                  
                  <div className="flex items-center text-primary font-semibold text-sm">
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center md:hidden">
          <Link 
            to="/news" 
            className="inline-flex items-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All News
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
