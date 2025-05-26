
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Download, ExternalLink, TrendingUp } from 'lucide-react';
import { dataService } from '@/services/dataService';

const CompactNewsUpdates = () => {
  const featuredNews = dataService.getNews(2, true);
  const featuredPublications = dataService.getPublications(2, true);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[45px] font-black leading-[47.7px] text-[#231f20] mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Latest News & Impact Stories
          </h2>
          <p className="text-[20px] font-light leading-[35px] text-black max-w-4xl mx-auto" style={{ fontFamily: 'akzidenz-grotesk, Arial, Helvetica, sans-serif' }}>
            Stay informed about our ongoing efforts to transform lives and strengthen access to justice across Tanzania
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* News Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-dark">Breaking News</h3>
              <Link 
                to="/news" 
                className="text-primary font-semibold hover:text-primary-dark transition-colors text-sm flex items-center"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {featuredNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="group block"
                >
                  <article className="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all duration-300 hover:border-primary/20">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-secondary-orange text-white text-xs px-2 py-1 rounded font-bold">
                          {news.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={10} className="mr-1" />
                          {new Date(news.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-neutral-dark line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {news.title}
                      </h4>
                      <p className="text-xs text-neutral-gray line-clamp-2 leading-relaxed">
                        {news.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Publications Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-dark">Latest Publications</h3>
              <Link 
                to="/publications" 
                className="text-secondary-teal font-semibold hover:text-secondary-teal/80 transition-colors text-sm flex items-center"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {featuredPublications.map((publication, index) => (
                <div 
                  key={publication.id} 
                  className="group"
                >
                  <article className="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all duration-300 hover:border-secondary-teal/20">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img 
                        src={publication.image} 
                        alt={publication.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-secondary-teal text-white text-xs px-2 py-1 rounded font-bold flex items-center">
                          <FileText size={10} className="mr-1" />
                          {publication.type.toUpperCase()}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={10} className="mr-1" />
                          {new Date(publication.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short'
                          })}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-neutral-dark line-clamp-2 group-hover:text-secondary-teal transition-colors mb-2">
                        {publication.title}
                      </h4>
                      <p className="text-xs text-neutral-gray line-clamp-2 leading-relaxed mb-2">
                        {publication.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/publications/${publication.id}`}
                          className="text-xs text-secondary-teal font-semibold hover:text-secondary-teal/80 transition-colors flex items-center"
                        >
                          Read More <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                        {publication.downloadUrl && (
                          <a 
                            href={publication.downloadUrl}
                            className="text-xs bg-secondary-teal/10 text-secondary-teal px-2 py-1 rounded flex items-center hover:bg-secondary-teal hover:text-white transition-all"
                            download
                          >
                            <Download size={10} className="mr-1" />
                            PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-primary mb-1">15K+</div>
              <div className="text-sm text-gray-600">Stories Published</div>
            </div>
            <div>
              <div className="text-2xl font-black text-secondary-teal mb-1">50+</div>
              <div className="text-sm text-gray-600">Research Reports</div>
            </div>
            <div>
              <div className="text-2xl font-black text-secondary-orange mb-1">100K+</div>
              <div className="text-sm text-gray-600">Monthly Readers</div>
            </div>
            <div>
              <div className="text-2xl font-black text-secondary-green mb-1">25+</div>
              <div className="text-sm text-gray-600">Awards Won</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactNewsUpdates;
