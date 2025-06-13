
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Download, TrendingUp, Users, Award, Newspaper, Sparkles, Eye } from 'lucide-react';
import { dataService } from '@/services/dataService';
import Typography from '@/components/shared/Typography';

const CompactNewsUpdates = () => {
  const featuredNews = [
    {
      id: '1',
      title: 'LSF Launches Revolutionary Digital Legal Aid Platform',
      excerpt: 'Groundbreaking technology makes legal services accessible to rural communities through innovative mobile app.',
      category: 'Innovation',
      date: '2024-06-08',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true,
      readTime: '3 min'
    },
    {
      id: '2',
      title: 'Supreme Court Rules in Favor of Women\'s Land Rights',
      excerpt: 'Historic legal precedent established after LSF\'s strategic litigation empowers thousands of women across Tanzania.',
      category: 'Legal Victory',
      date: '2024-06-05',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true,
      readTime: '5 min'
    },
    {
      id: '3',
      title: 'Climate Justice Program Reaches 50,000 Families',
      excerpt: 'Comprehensive legal empowerment initiative provides climate-affected communities with essential resources.',
      category: 'Climate Justice',
      date: '2024-06-03',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true,
      readTime: '4 min'
    }
  ];

  const featuredPublications = [
    {
      id: '1',
      title: 'Digital Transformation of Legal Aid Services',
      excerpt: 'Comprehensive analysis of how technology is revolutionizing access to justice in rural communities.',
      type: 'Research Report',
      date: '2024-06-10',
      downloadUrl: '#',
      isNew: true,
      pages: 45
    },
    {
      id: '2',
      title: 'Women\'s Land Rights Policy Framework 2024',
      excerpt: 'Evidence-based policy recommendations for strengthening legal protections for women.',
      type: 'Policy Brief',
      date: '2024-06-08',
      downloadUrl: '#',
      isNew: true,
      pages: 28
    },
    {
      id: '3',
      title: 'Community Paralegal Networks Guide',
      excerpt: 'Best practices for establishing effective paralegal programs in underserved communities.',
      type: 'Best Practices',
      date: '2024-06-05',
      downloadUrl: '#',
      isNew: false,
      pages: 32
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-primary/20">
            <TrendingUp className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="caption" className="text-primary font-bold text-sm">
              LATEST UPDATES
            </Typography>
          </div>
          
          <Typography variant="h2" className="mb-4 text-3xl md:text-4xl font-bold">
            News &
            <span className="block text-primary">Research</span>
          </Typography>
          
          <Typography variant="bodySmall" className="text-neutral-gray max-w-2xl mx-auto text-base leading-relaxed">
            Discover our latest impact stories and evidence-based research driving policy change
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Section - 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl">
                  <Newspaper className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="h3" className="text-neutral-dark font-bold text-lg">Breaking News</Typography>
                  <Typography variant="small" className="text-neutral-gray">Latest developments</Typography>
                </div>
              </div>
              <Link 
                to="/news" 
                className="inline-flex items-center bg-primary/10 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm"
              >
                <Typography variant="small" className="font-medium">View All</Typography>
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="group block"
                >
                  <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-primary/30 group-hover:-translate-y-2 h-full">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          news.category === 'Innovation' ? 'bg-secondary-teal text-white' :
                          news.category === 'Legal Victory' ? 'bg-secondary-orange text-white' :
                          news.category === 'Climate Justice' ? 'bg-secondary-yellow text-black' :
                          'bg-primary text-white'
                        }`}>
                          {news.category}
                        </span>
                      </div>

                      {/* Read Time */}
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center">
                        <Eye size={10} className="mr-1" />
                        {news.readTime}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center text-xs text-neutral-gray mb-3">
                        <Calendar size={12} className="mr-2" />
                        {new Date(news.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <Typography variant="h4" className="text-neutral-dark group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-tight font-bold text-base">
                        {news.title}
                      </Typography>
                      
                      <Typography variant="small" className="text-neutral-gray line-clamp-2 mb-4 leading-relaxed">
                        {news.excerpt}
                      </Typography>
                      
                      <div className="flex items-center text-primary font-bold group-hover:text-primary-dark transition-colors text-sm">
                        <Typography variant="small" className="font-bold">Read More</Typography>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Publications Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal-dark p-2 rounded-xl">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Typography variant="h3" className="text-neutral-dark font-bold text-lg">Research</Typography>
                  <Typography variant="small" className="text-neutral-gray">Fresh insights</Typography>
                </div>
              </div>
              <Link 
                to="/publications" 
                className="inline-flex items-center bg-secondary-teal/10 hover:bg-secondary-teal hover:text-white text-secondary-teal px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm"
              >
                <Typography variant="small" className="font-medium">View All</Typography>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {featuredPublications.map((publication, index) => (
                <div 
                  key={publication.id} 
                  className="group"
                >
                  <article className="bg-white border border-gray-200 rounded-xl p-5 hover:border-secondary-teal/30 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
                    {/* New Label */}
                    {publication.isNew && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <Sparkles size={8} className="mr-1" />
                          NEW
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-secondary-teal/20 text-secondary-teal text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <FileText size={8} className="mr-1" />
                        {publication.type.toUpperCase()}
                      </span>
                      <div className="flex items-center text-xs text-neutral-gray">
                        <Calendar size={10} className="mr-1" />
                        {new Date(publication.date).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    
                    <Typography variant="h4" className="text-neutral-dark group-hover:text-secondary-teal transition-colors mb-2 line-clamp-2 leading-tight font-bold text-sm">
                      {publication.title}
                    </Typography>
                    
                    <Typography variant="small" className="text-neutral-gray line-clamp-2 mb-3 leading-relaxed text-xs">
                      {publication.excerpt}
                    </Typography>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/publications/${publication.id}`}
                        className="inline-flex items-center text-secondary-teal hover:text-secondary-teal-dark transition-colors font-bold text-xs"
                      >
                        <Typography variant="small" className="font-bold">Read More</Typography>
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      {publication.downloadUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-gray">{publication.pages}p</span>
                          <a 
                            href={publication.downloadUrl}
                            className="bg-gradient-to-r from-secondary-teal to-secondary-teal-dark text-white px-3 py-1 rounded-full flex items-center hover:shadow-lg transition-all text-xs font-bold"
                            download
                          >
                            <Download size={8} className="mr-1" />
                            PDF
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactNewsUpdates;
