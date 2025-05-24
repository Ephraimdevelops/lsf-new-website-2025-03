
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { dataService } from '@/services/dataService';

const NewsSection = () => {
  const featuredNews = dataService.getNews(4, true);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary-teal/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary-teal rounded-full"></div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wide">Latest News</span>
            <div className="w-16 h-1 bg-gradient-to-r from-secondary-teal to-primary rounded-full"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary-teal to-primary bg-clip-text text-transparent">
            Stay Updated
          </h2>
          
          <p className="text-xl text-neutral-dark max-w-2xl mx-auto leading-relaxed">
            Follow our latest initiatives, achievements, and community impact stories
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredNews.map((news, index) => (
            <Link 
              key={news.id} 
              to={`/news/${news.id}`}
              className="group block transform hover:-translate-y-2 transition-all duration-300"
            >
              <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/20 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-primary backdrop-blur-sm">
                      <Tag size={10} className="mr-1" />
                      {news.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-neutral-gray mb-3">
                    <Calendar size={14} className="mr-2" />
                    {new Date(news.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3 text-neutral-dark line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {news.title}
                  </h3>
                  
                  <p className="text-neutral-gray text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
                    {news.excerpt}
                  </p>
                  
                  <div className="flex items-center text-primary font-semibold text-sm group/link">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            to="/news" 
            className="inline-flex items-center bg-gradient-to-r from-primary to-secondary-teal hover:from-primary-dark hover:to-secondary-teal text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          >
            View All News
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
