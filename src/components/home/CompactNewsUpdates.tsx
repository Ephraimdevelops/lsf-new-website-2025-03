
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Download, TrendingUp, Users, Award, Newspaper, Sparkles } from 'lucide-react';
import { dataService } from '@/services/dataService';
import Typography from '@/components/shared/Typography';

const CompactNewsUpdates = () => {
  const featuredNews = [
    {
      id: '1',
      title: 'LSF Launches Revolutionary Digital Legal Aid Platform Across Tanzania',
      excerpt: 'Groundbreaking technology makes legal services accessible to rural communities through innovative mobile app and AI-powered guidance system.',
      category: 'Innovation',
      date: '2024-06-08',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true
    },
    {
      id: '2',
      title: 'Major Victory: Supreme Court Rules in Favor of Women\'s Land Rights',
      excerpt: 'Historic legal precedent established after LSF\'s strategic litigation empowers thousands of women across Tanzania to secure property ownership.',
      category: 'Legal Victory',
      date: '2024-06-05',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true
    },
    {
      id: '3',
      title: 'Climate Justice Program Reaches 50,000 Vulnerable Families',
      excerpt: 'Comprehensive legal empowerment initiative provides climate-affected communities with tools to secure compensation and adaptation resources.',
      category: 'Climate Justice',
      date: '2024-06-03',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true
    },
    {
      id: '4',
      title: 'International Recognition: LSF Wins Global Justice Innovation Award',
      excerpt: 'Organization honored for transformative approach to community legal empowerment and sustainable justice delivery across East Africa.',
      category: 'Recognition',
      date: '2024-06-01',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: false
    }
  ];

  const featuredPublications = [
    {
      id: '1',
      title: 'Digital Transformation of Legal Aid Services: A Tanzania Case Study',
      excerpt: 'Comprehensive analysis of how technology is revolutionizing access to justice in rural and marginalized communities.',
      type: 'Research Report',
      date: '2024-06-10',
      downloadUrl: '#',
      isNew: true
    },
    {
      id: '2',
      title: 'Women\'s Land Rights and Climate Resilience: Policy Framework 2024',
      excerpt: 'Evidence-based policy recommendations for strengthening legal protections for women facing climate-related displacement.',
      type: 'Policy Brief',
      date: '2024-06-08',
      downloadUrl: '#',
      isNew: true
    },
    {
      id: '3',
      title: 'Community Paralegal Networks: Building Sustainable Justice Systems',
      excerpt: 'Best practices guide for establishing and maintaining effective paralegal programs in underserved communities.',
      type: 'Best Practices',
      date: '2024-06-05',
      downloadUrl: '#',
      isNew: false
    },
    {
      id: '4',
      title: 'Impact Assessment: Five Years of Legal Empowerment in Tanzania',
      excerpt: 'Comprehensive evaluation of LSF\'s strategic interventions and their measurable impact on access to justice outcomes.',
      type: 'Impact Report',
      date: '2024-06-01',
      downloadUrl: '#',
      isNew: false
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-secondary-teal/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <TrendingUp className="h-6 w-6 mr-4 text-primary" />
            <Typography variant="overline" className="text-primary font-bold text-lg">
              LATEST UPDATES
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-8 text-5xl md:text-6xl font-bold">
            Breaking News &
            <span className="block text-primary">Research</span>
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-xl leading-relaxed">
            Discover our latest impact stories and evidence-based research driving transformative policy change across Tanzania
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-2xl">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h2" className="text-neutral-dark font-bold">Latest News</Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">Real-time updates from the field</Typography>
                </div>
              </div>
              <Link 
                to="/news" 
                className="inline-flex items-center bg-primary/10 hover:bg-primary hover:text-white text-primary px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Typography variant="bodySmall" className="font-medium">View All</Typography>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-8">
              {featuredNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="group block"
                >
                  <article className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-primary/20 group-hover:-translate-y-2">
                    <div className="flex gap-8 p-8">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary-teal/10">
                        <img 
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            news.category === 'Innovation' ? 'bg-secondary-teal text-white' :
                            news.category === 'Legal Victory' ? 'bg-secondary-orange text-white' :
                            news.category === 'Climate Justice' ? 'bg-secondary-yellow text-black' :
                            'bg-primary text-white'
                          }`}>
                            {news.category}
                          </span>
                          <div className="flex items-center text-sm text-neutral-gray">
                            <Calendar size={14} className="mr-2" />
                            {new Date(news.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <Typography variant="h3" className="text-neutral-dark group-hover:text-primary transition-colors mb-4 line-clamp-2 leading-tight">
                          {news.title}
                        </Typography>
                        <Typography variant="body" className="text-neutral-gray line-clamp-3 mb-6 leading-relaxed">
                          {news.excerpt}
                        </Typography>
                        <div className="flex items-center text-primary font-bold group-hover:text-primary-dark transition-colors">
                          <Typography variant="body" className="font-bold">Read Full Story</Typography>
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* New Publications Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal-dark p-3 rounded-2xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h3" className="text-neutral-dark font-bold">New Publications</Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">Fresh research & insights</Typography>
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
            
            <div className="space-y-6">
              {featuredPublications.map((publication, index) => (
                <div 
                  key={publication.id} 
                  className="group"
                >
                  <article className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:border-secondary-teal/30 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
                    {/* New Label with Flickering Effect */}
                    {publication.isNew && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-bold px-3 py-1 rounded-full flex items-center animate-pulse">
                          <Sparkles size={10} className="mr-1 animate-spin" />
                          NEW
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-secondary-teal/20 text-secondary-teal text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <FileText size={10} className="mr-1" />
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
                    
                    <Typography variant="h4" className="text-neutral-dark group-hover:text-secondary-teal transition-colors mb-3 line-clamp-2 leading-tight font-bold">
                      {publication.title}
                    </Typography>
                    
                    <Typography variant="small" className="text-neutral-gray line-clamp-3 mb-4 leading-relaxed">
                      {publication.excerpt}
                    </Typography>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/publications/${publication.id}`}
                        className="inline-flex items-center text-secondary-teal hover:text-secondary-teal-dark transition-colors font-bold text-sm"
                      >
                        <Typography variant="small" className="font-bold">Read More</Typography>
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      {publication.downloadUrl && (
                        <a 
                          href={publication.downloadUrl}
                          className="bg-gradient-to-r from-secondary-teal to-secondary-teal-dark text-white px-3 py-2 rounded-full flex items-center hover:shadow-lg transition-all text-xs font-bold"
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

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-secondary-teal/10 p-6 rounded-2xl border border-primary/20 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <Typography variant="h3" className="text-primary mb-1 font-bold">25+</Typography>
                <Typography variant="small" className="text-neutral-gray font-medium">Policy Changes Influenced</Typography>
              </div>
              <div className="bg-gradient-to-br from-secondary-teal/10 to-secondary-orange/10 p-6 rounded-2xl border border-secondary-teal/20 text-center">
                <Users className="h-8 w-8 text-secondary-teal mx-auto mb-3" />
                <Typography variant="h3" className="text-secondary-teal mb-1 font-bold">150K+</Typography>
                <Typography variant="small" className="text-neutral-gray font-medium">Research Participants</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactNewsUpdates;
