
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, Download, TrendingUp, Users, Award, Newspaper, Sparkles, Eye, ExternalLink } from 'lucide-react';
import Typography from '@/components/shared/Typography';

// Redesigned cards with more visual delight
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
      title: "Supreme Court Rules in Favor of Women's Land Rights",
      excerpt: "Historic legal precedent established after LSF's strategic litigation empowers thousands of women across Tanzania.",
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
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c4c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
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
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      fileSize: '12.5 MB',
      category: 'Impact Report',
      pages: '84 pages'
    },
    {
      id: '2',
      title: "Women's Land Rights Policy Framework",
      excerpt: 'Evidence-based policy recommendations for strengthening legal protections for women across Tanzania.',
      type: 'Policy Brief',
      date: '2024-06-08',
      downloadUrl: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      fileSize: '8.2 MB',
      category: 'Policy Document',
      pages: '56 pages'
    },
    {
      id: '3',
      title: 'Community Paralegal Networks Implementation Guide',
      excerpt: 'Best practices and strategies for establishing effective paralegal programs in underserved communities.',
      type: 'Implementation Guide',
      date: '2024-06-05',
      downloadUrl: '/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      fileSize: '15.3 MB',
      category: 'Training Material',
      pages: '124 pages'
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Beautiful Glowing Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 right-36 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-28 w-64 h-64 bg-secondary-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-secondary-orange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-secondary-orange/10 to-secondary-teal/10 backdrop-blur-md rounded-full px-9 py-5 mb-8 border border-secondary-orange/20">
            <TrendingUp className="h-7 w-7 mr-4 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange tracking-widest font-black text-lg">
              NEWS & RESEARCH
            </Typography>
          </div>
          <Typography variant="display" className="mb-8 font-heading text-6xl lg:text-7xl">
            Latest <span className="text-secondary-orange">Stories</span> &amp; <span className="text-secondary-teal">Publications</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-2xl leading-relaxed">
            Discover our most recent impact stories and cutting-edge research transforming Tanzania's justice landscape.
          </Typography>
        </div>

        <div className="flex flex-col lg:flex-row gap-14">
          {/* News Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-primary to-secondary-orange p-4 rounded-2xl shadow-lg">
                  <Newspaper className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Typography variant="h2" className="text-neutral-dark font-bold text-3xl">Breaking News</Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray text-lg">Latest developments &amp; impact</Typography>
                </div>
              </div>
              <Link 
                to="/news" 
                className="inline-flex items-center bg-primary/10 hover:bg-primary hover:text-white text-primary px-9 py-4 rounded-full font-semibold transition-all duration-300 text-lg"
              >
                <Typography variant="bodySmall" className="font-extrabold">View All</Typography>
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {featuredNews.map((news) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="group block"
                >
                  <article className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-secondary-orange/50 group-hover:-translate-y-2 h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary-orange/70 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-black shadow-lg ${
                          news.category === 'Innovation' ? 'bg-secondary-teal text-white' :
                          news.category === 'Legal Victory' ? 'bg-secondary-orange text-white' :
                          news.category === 'Training' ? 'bg-primary text-white' :
                          'bg-secondary-teal text-white'
                        }`}>
                          {news.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-white font-bold flex items-center">
                        <Eye size={13} className="mr-2" />
                        {news.readTime}
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="flex items-center text-xs text-neutral-gray mb-2">
                        <Calendar size={13} className="mr-3" />
                        {new Date(news.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <Typography variant="h4" className="text-neutral-dark font-heading font-bold group-hover:text-secondary-orange transition-colors mb-2 line-clamp-2">
                        {news.title}
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray line-clamp-3 leading-relaxed mb-3">
                        {news.excerpt}
                      </Typography>
                      <div className="flex items-center text-primary font-bold group-hover:text-secondary-orange transition-colors">
                        <Typography variant="small" className="font-bold">Read More</Typography>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Publications/Research Section */}
          <div className="flex-[0.95] min-w-[350px] lg:max-w-sm">
            <div className="flex items-center gap-5 mb-10">
              <div className="bg-gradient-to-br from-secondary-teal to-primary-dark p-4 rounded-2xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <Typography variant="h3" className="text-secondary-teal font-heading font-bold text-2xl">Latest Publications</Typography>
                <Typography variant="bodySmall" className="text-neutral-gray">Recent research &amp; reports</Typography>
              </div>
            </div>
            <div className="flex flex-col gap-7">
              {uploadedDocuments.map((doc) => (
                <div key={doc.id} className="relative group">
                  <article className="bg-white border-2 border-secondary-teal/10 rounded-3xl overflow-hidden hover:border-secondary-teal/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 p-0">
                    {doc.isNew && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gradient-to-r from-secondary-orange to-secondary-yellow text-white text-xs font-black px-3 py-2 rounded-full flex items-center shadow-lg">
                          <Sparkles size={12} className="mr-2" />
                          NEW
                        </div>
                      </div>
                    )}
                    <div className="relative h-36 overflow-hidden">
                      <img 
                        src={doc.image}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary-teal/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="bg-secondary-teal text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
                          {doc.type.toUpperCase()}
                        </span>
                        <span className="bg-black/60 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full">
                          {doc.pages}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 pb-4">
                      <div className="flex items-center text-xs text-neutral-gray mb-2">
                        <Calendar size={12} className="mr-2" />
                        {new Date(doc.date).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <Typography variant="h4" className="text-neutral-dark font-heading font-bold group-hover:text-secondary-teal transition-colors mb-2 line-clamp-2 text-[18px] leading-tight">
                        {doc.title}
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-gray line-clamp-3 mb-3 leading-snug text-[15px]">
                        {doc.excerpt}
                      </Typography>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-neutral-gray font-medium">{doc.fileSize}</span>
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/publications/${doc.id}`}
                            className="inline-flex items-center text-secondary-teal hover:text-secondary-teal-dark transition-colors font-bold text-xs"
                          >
                            <Typography variant="small" className="font-bold">View</Typography>
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                          <a 
                            href={doc.downloadUrl}
                            className="bg-gradient-to-r from-secondary-teal to-secondary-teal/80 text-white px-3 py-2 rounded-full flex items-center hover:shadow-lg transition-all text-xs font-black shadow-md"
                            download
                          >
                            <Download size={12} className="mr-2" />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-4 pt-6">
              <Link 
                to="/publications"
                className="w-1/2 flex items-center justify-center rounded-xl bg-secondary-teal hover:bg-secondary-teal/90 text-white font-bold px-4 py-4 transition-all duration-300 shadow-lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                All Pubs
              </Link>
              <Link 
                to="/resources"
                className="w-1/2 flex items-center justify-center rounded-xl border-2 border-secondary-teal text-secondary-teal font-bold px-4 py-4 hover:bg-secondary-teal/10 transition-all duration-300"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompactNewsUpdates;

