
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Download, TrendingUp, Users, Award } from 'lucide-react';
import { dataService } from '@/services/dataService';

const NewsAndPublications = () => {
  const featuredNews = dataService.getNews(2, true);
  const featuredPublications = dataService.getPublications(2, true);

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[45px] font-black leading-[47.7px] text-[#231f20] mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Latest News & Research
          </h2>
          <p className="text-[20px] font-light leading-[35px] text-black max-w-4xl mx-auto" style={{ fontFamily: 'akzidenz-grotesk, Arial, Helvetica, sans-serif' }}>
            Stay informed about our ongoing efforts to transform lives and the evidence-based research driving policy change across Tanzania
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-dark">Breaking News</h3>
              <Link 
                to="/news" 
                className="text-primary font-semibold hover:text-primary-dark transition-colors text-sm flex items-center"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-6">
              {featuredNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="group block"
                >
                  <article className="flex gap-6 p-6 bg-white border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <img 
                        src="/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png"
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-secondary-orange text-white text-xs px-3 py-1 rounded-full font-bold">
                          {news.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          {new Date(news.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <h4 className="font-bold text-lg text-neutral-dark line-clamp-2 group-hover:text-primary transition-colors mb-3">
                        {news.title}
                      </h4>
                      <p className="text-sm text-neutral-gray line-clamp-2 leading-relaxed mb-3">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center text-primary font-semibold text-sm">
                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Publications Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-dark">Research</h3>
              <Link 
                to="/publications" 
                className="text-secondary-teal font-semibold hover:text-secondary-teal/80 transition-colors text-sm flex items-center"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-6">
              {featuredPublications.map((publication, index) => (
                <div 
                  key={publication.id} 
                  className="group"
                >
                  <article className="p-6 bg-gray-50 border border-gray-100 rounded-lg hover:shadow-lg transition-all duration-300 hover:border-secondary-teal/20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-secondary-teal text-white text-xs px-3 py-1 rounded-full font-bold flex items-center">
                        <FileText size={12} className="mr-1" />
                        {publication.type.toUpperCase()}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {new Date(publication.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short'
                        })}
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-neutral-dark line-clamp-2 group-hover:text-secondary-teal transition-colors mb-3">
                      {publication.title}
                    </h4>
                    <p className="text-sm text-neutral-gray line-clamp-3 leading-relaxed mb-4">
                      {publication.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/publications/${publication.id}`}
                        className="text-sm text-secondary-teal font-semibold hover:text-secondary-teal/80 transition-colors flex items-center"
                      >
                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                      {publication.downloadUrl && (
                        <a 
                          href={publication.downloadUrl}
                          className="text-xs bg-secondary-teal text-white px-3 py-2 rounded flex items-center hover:bg-secondary-teal/90 transition-all"
                          download
                        >
                          <Download size={12} className="mr-1" />
                          PDF
                        </a>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <TrendingUp className="h-6 w-6 text-secondary-teal mx-auto mb-2" />
                <div className="text-xl font-bold text-secondary-teal mb-1">15+</div>
                <div className="text-xs text-gray-600">Policy Changes Influenced</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-primary mb-1">50K+</div>
                <div className="text-xs text-gray-600">Research Participants</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsAndPublications;
