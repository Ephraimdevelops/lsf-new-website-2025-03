
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Download, TrendingUp, Users, Award, Newspaper, Sparkles, Eye, Upload, File } from 'lucide-react';
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
      title: 'Community Paralegals Graduate from Training Program',
      excerpt: 'New cohort of 150 paralegals ready to serve rural communities across 20 districts.',
      category: 'Training',
      date: '2024-06-03',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true,
      readTime: '4 min'
    },
    {
      id: '4',
      title: 'Mobile Legal Clinics Reach Remote Villages',
      excerpt: 'Expanding access to justice through innovative mobile outreach programs in hard-to-reach areas.',
      category: 'Outreach',
      date: '2024-06-01',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      featured: true,
      readTime: '6 min'
    }
  ];

  const uploadedDocuments = [
    {
      id: '1',
      title: 'Digital Transformation of Legal Aid Services',
      excerpt: 'Comprehensive analysis of how technology is revolutionizing access to justice in rural communities.',
      type: 'Annual Report',
      date: '2024-06-10',
      downloadUrl: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      fileSize: '12.5 MB',
      category: 'Impact Report'
    },
    {
      id: '2',
      title: 'Women\'s Land Rights Policy Framework',
      excerpt: 'Evidence-based policy recommendations for strengthening legal protections for women across Tanzania.',
      type: 'Policy Brief',
      date: '2024-06-08',
      downloadUrl: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      fileSize: '8.2 MB',
      category: 'Policy Document'
    },
    {
      id: '3',
      title: 'Community Paralegal Networks Implementation Guide',
      excerpt: 'Best practices and strategies for establishing effective paralegal programs in underserved communities.',
      type: 'Implementation Guide',
      date: '2024-06-05',
      downloadUrl: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      fileSize: '15.3 MB',
      category: 'Training Material'
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-primary/20">
            <TrendingUp className="h-5 w-5 mr-3 text-primary" />
            <Typography variant="caption" className="text-primary font-bold text-sm">
              LATEST UPDATES
            </Typography>
          </div>
          
          <Typography variant="h1" className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold">
            News &<span className="block text-primary">Research</span>
            
          </Typography>
          
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto text-lg leading-relaxed">
            Discover our latest impact stories and evidence-based research driving policy change across Tanzania
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* News Section - 3 columns */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-xl">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h2" className="text-neutral-dark font-bold text-2xl">Breaking News</Typography>
                  <Typography variant="body" className="text-neutral-gray">Latest developments and impact stories</Typography>
                </div>
              </div>
              <Link 
                to="/news" 
                className="inline-flex items-center bg-primary/10 hover:bg-primary hover:text-white text-primary px-6 py-3 rounded-full font-medium transition-all duration-300"
              >
                <Typography variant="body" className="font-medium">View All</Typography>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="group block"
                >
                  <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-primary/30 group-hover:-translate-y-2 h-full">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          news.category === 'Innovation' ? 'bg-secondary-teal text-white' :
                          news.category === 'Legal Victory' ? 'bg-secondary-orange text-white' :
                          news.category === 'Training' ? 'bg-primary text-white' :
                          'bg-secondary-teal text-white'
                        }`}>
                          {news.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center">
                        <Eye size={10} className="mr-1" />
                        {news.readTime}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center text-sm text-neutral-gray mb-2">
                        <Calendar size={12} className="mr-2" />
                        {new Date(news.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <Typography variant="h4" className="text-neutral-dark group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight font-bold text-sm">
                        {news.title}
                      </Typography>
                      
                      <Typography variant="bodySmall" className="text-neutral-gray line-clamp-2 mb-3 leading-relaxed text-xs">
                        {news.excerpt}
                      </Typography>
                      
                      <div className="flex items-center text-primary font-bold group-hover:text-primary-dark transition-colors">
                        <Typography variant="bodySmall" className="font-bold text-xs">Read More</Typography>
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Documents Section - 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-secondary-teal to-secondary-teal-dark p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h2" className="text-neutral-dark font-bold text-2xl">Documents</Typography>
                  <Typography variant="body" className="text-neutral-gray">Recent uploads and publications</Typography>
                </div>
              </div>
              <Link 
                to="/publications" 
                className="inline-flex items-center bg-secondary-teal/10 hover:bg-secondary-teal hover:text-white text-secondary-teal px-6 py-3 rounded-full font-medium transition-all duration-300"
              >
                <Typography variant="body" className="font-medium">View All</Typography>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-6">
              {uploadedDocuments.map((document, index) => (
                <div 
                  key={document.id} 
                  className="group"
                >
                  <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-secondary-teal/30 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 relative">
                    {document.isNew && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                          <Sparkles size={10} className="mr-1" />
                          NEW
                        </div>
                      </div>
                    )}

                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={document.image}
                        alt={document.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="bg-secondary-teal text-white text-xs font-bold px-2 py-1 rounded-full">
                          {document.type.toUpperCase()}
                        </span>
                        <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {document.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center text-xs text-neutral-gray mb-2">
                        <Calendar size={10} className="mr-2" />
                        {new Date(document.date).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <Typography variant="h4" className="text-neutral-dark group-hover:text-secondary-teal transition-colors mb-2 line-clamp-2 leading-tight font-bold text-sm">
                        {document.title}
                      </Typography>
                      
                      <Typography variant="bodySmall" className="text-neutral-gray line-clamp-2 mb-4 leading-relaxed text-xs">
                        {document.excerpt}
                      </Typography>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-neutral-gray">
                          {document.fileSize}
                        </div>
                        <div className="flex items-center gap-3">
                          <Link 
                            to={`/publications/${document.id}`}
                            className="inline-flex items-center text-secondary-teal hover:text-secondary-teal-dark transition-colors font-bold text-xs"
                          >
                            <Typography variant="small" className="font-bold">View</Typography>
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                          <a 
                            href={document.downloadUrl}
                            className="bg-gradient-to-r from-secondary-teal to-secondary-teal-dark text-white px-3 py-1 rounded-full flex items-center hover:shadow-lg transition-all text-xs font-bold"
                            download
                          >
                            <Download size={10} className="mr-1" />
                            Download
                          </a>
                        </div>
                      </div>
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
