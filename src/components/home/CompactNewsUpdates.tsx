
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Download, TrendingUp, Users, Award, Newspaper } from 'lucide-react';
import { dataService } from '@/services/dataService';
import Typography from '@/components/shared/Typography';

const CompactNewsUpdates = () => {
  const featuredNews = dataService.getNews(3, true);
  const featuredPublications = dataService.getPublications(3, true);

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography variant="overline" className="text-primary mb-4">
            Stay Informed
          </Typography>
          <Typography variant="display" className="text-neutral-dark mb-6">
            Latest News & Research
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
            Discover our impact stories and evidence-based research driving policy change across Tanzania
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <Typography variant="h2" className="text-neutral-dark">Latest News</Typography>
              </div>
              <Link 
                to="/news" 
                className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <Typography variant="bodySmall" className="text-primary font-medium">View All</Typography>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-6">
              {featuredNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="group block"
                >
                  <article className="bg-white border border-gray-100 rounded-xl p-6 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 overflow-hidden rounded-lg">
                        <img 
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                            {news.category}
                          </span>
                          <div className="flex items-center text-xs text-neutral-gray">
                            <Calendar size={12} className="mr-1" />
                            {new Date(news.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <Typography variant="h3" className="text-neutral-dark group-hover:text-primary transition-colors mb-3 line-clamp-2">
                          {news.title}
                        </Typography>
                        <Typography variant="bodySmall" className="text-neutral-gray line-clamp-2 mb-4">
                          {news.excerpt}
                        </Typography>
                        <div className="flex items-center text-primary">
                          <Typography variant="bodySmall" className="text-primary font-medium">Read More</Typography>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Publications Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-secondary-teal/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-secondary-teal" />
                </div>
                <Typography variant="h3" className="text-neutral-dark">Research</Typography>
              </div>
              <Link 
                to="/publications" 
                className="inline-flex items-center text-secondary-teal hover:text-secondary-teal/80 transition-colors"
              >
                <Typography variant="small" className="text-secondary-teal font-medium">View All</Typography>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {featuredPublications.map((publication, index) => (
                <div 
                  key={publication.id} 
                  className="group"
                >
                  <article className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-secondary-teal/20 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-secondary-teal/10 text-secondary-teal text-xs font-bold px-2 py-1 rounded flex items-center">
                        <FileText size={10} className="mr-1" />
                        {publication.type.toUpperCase()}
                      </span>
                      <div className="flex items-center text-xs text-neutral-gray">
                        <Calendar size={10} className="mr-1" />
                        {new Date(publication.date).getFullYear()}
                      </div>
                    </div>
                    <Typography variant="h4" className="text-neutral-dark group-hover:text-secondary-teal transition-colors mb-2 line-clamp-2">
                      {publication.title}
                    </Typography>
                    <Typography variant="small" className="text-neutral-gray line-clamp-3 mb-3">
                      {publication.excerpt}
                    </Typography>
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/publications/${publication.id}`}
                        className="inline-flex items-center text-secondary-teal hover:text-secondary-teal/80 transition-colors"
                      >
                        <Typography variant="small" className="text-secondary-teal font-medium">Read More</Typography>
                        <ArrowRight className="ml-1 h-2 w-2" />
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
                  </article>
                </div>
              ))}
            </div>

            {/* Impact Stats */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
              <Typography variant="h4" className="text-neutral-dark mb-4 text-center">Impact by Numbers</Typography>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <Typography variant="bodySmall" className="text-neutral-gray">Policy Changes</Typography>
                  </div>
                  <Typography variant="h4" className="text-primary">15+</Typography>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-secondary-teal" />
                    <Typography variant="bodySmall" className="text-neutral-gray">Lives Impacted</Typography>
                  </div>
                  <Typography variant="h4" className="text-secondary-teal">426K+</Typography>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-secondary-orange" />
                    <Typography variant="bodySmall" className="text-neutral-gray">Recognition</Typography>
                  </div>
                  <Typography variant="h4" className="text-secondary-orange">25+</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactNewsUpdates;
