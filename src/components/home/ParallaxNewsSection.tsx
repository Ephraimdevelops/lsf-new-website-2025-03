import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, Download, ExternalLink } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const newsItems = [
  {
    id: 1,
    title: "LSF Empowers 26,000+ Tanzanians Through Legal Aid Revolution",
    excerpt: "Community paralegals provide essential legal support across the nation, transforming access to justice in rural and urban areas.",
    category: "Impact Story",
    date: "2024-01-15",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    color: "from-emerald-500 to-teal-600",
    featured: true
  },
  {
    id: 2,
    title: "Digital Innovation: Haki Yangu App Reaches 10,000+ Users",
    excerpt: "Revolutionary mobile platform connects vulnerable communities with legal support, breaking geographical barriers.",
    category: "Technology",
    date: "2024-01-10",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    color: "from-blue-500 to-indigo-600",
    featured: false
  },
  {
    id: 3,
    title: "Climate Justice Initiative Protects 2,000+ Families",
    excerpt: "New program addresses environmental legal challenges, empowering communities to defend their land rights.",
    category: "Climate Justice",
    date: "2024-01-05",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    color: "from-green-500 to-emerald-600",
    featured: false
  }
];

const publications = [
  {
    id: 1,
    title: "Annual Impact Report 2024: Justice That Works",
    description: "Comprehensive analysis of LSF's achievements and impact across Tanzania",
    type: "Annual Report",
    pages: "64 pages",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: 2,
    title: "Gender Justice Research Brief",
    description: "Evidence-based insights on women's access to legal empowerment",
    type: "Research Brief",
    pages: "24 pages",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: 3,
    title: "Digital Legal Aid Innovation Study",
    description: "Technology integration in community-based legal services",
    type: "Study Report",
    pages: "32 pages",
    color: "from-cyan-500 to-blue-600"
  }
];

const ParallaxNewsSection = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'publications'>('news');

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: "url('/lovable-uploads/background with mother umage .png')",
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
        
        {/* Dynamic Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-blue-400/30 via-transparent to-transparent transform -skew-x-12 animate-pulse" />
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-purple-400/30 via-transparent to-transparent transform skew-x-12 animate-pulse delay-1000" />
        </div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-white/20">
            <Calendar className="h-6 w-6 mr-4 text-blue-400" />
            <Typography variant="overline" className="text-blue-400 font-bold text-lg">
              NEWSROOM
            </Typography>
          </div>

          <Typography variant="display" className="text-white font-black text-6xl lg:text-7xl mb-6 leading-tight">
            Latest Updates
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              & Publications
            </span>
          </Typography>

          <Typography variant="body" className="text-white/80 max-w-3xl mx-auto text-xl leading-relaxed">
            Stay informed with real stories from the field and comprehensive research that shapes justice across Tanzania.
          </Typography>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'news'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Latest News
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'publications'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Publications
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="relative">
          {/* News Section */}
          <div className={`transition-all duration-700 ${
            activeTab === 'news' 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-8 pointer-events-none absolute inset-0'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Featured News */}
              <div className="lg:col-span-7">
                {newsItems.filter(item => item.featured).map((news) => (
                  <Link key={news.id} to={`/news/${news.id}`} className="group block">
                    <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/30 hover:border-white/50 transition-all duration-700 hover:scale-105 shadow-2xl hover:shadow-4xl">
                      <div className="relative h-80 overflow-hidden">
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        <div className="absolute top-6 left-6">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${news.color} shadow-lg`}>
                            <Tag className="h-4 w-4 mr-2" />
                            {news.category}
                          </span>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6">
                          <Typography variant="h2" className="text-white font-black text-2xl md:text-3xl mb-3 leading-tight">
                            {news.title}
                          </Typography>
                          <Typography variant="body" className="text-white/90 text-lg leading-relaxed mb-4">
                            {news.excerpt}
                          </Typography>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-white/80">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(news.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center text-white font-semibold group-hover:text-blue-400 transition-colors">
                              Read More
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Other News */}
              <div className="lg:col-span-5">
                <div className="space-y-6">
                  {newsItems.filter(item => !item.featured).map((news) => (
                    <Link key={news.id} to={`/news/${news.id}`} className="group block">
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            <img 
                              src={news.image} 
                              alt={news.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${news.color}`}>
                                {news.category}
                              </span>
                            </div>
                            <Typography variant="h4" className="text-white font-bold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {news.title}
                            </Typography>
                            <Typography variant="bodySmall" className="text-white/70 line-clamp-2 leading-relaxed">
                              {news.excerpt}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link to="/news">
                  <button className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                    View All News
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Publications Section */}
          <div className={`transition-all duration-700 ${
            activeTab === 'publications' 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-8 pointer-events-none absolute inset-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publications.map((pub, index) => (
                <div key={pub.id} className="group">
                  <div className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 hover:border-white/50 transition-all duration-700 hover:scale-105 hover:-translate-y-4 shadow-xl hover:shadow-2xl`}>
                    
                    {/* Publication Icon */}
                    <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${pub.color} inline-flex transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                      <Download className="h-8 w-8 text-white" />
                    </div>

                    <Typography variant="h3" className="text-white font-bold text-xl mb-4 leading-tight">
                      {pub.title}
                    </Typography>

                    <Typography variant="body" className="text-white/80 mb-6 leading-relaxed">
                      {pub.description}
                    </Typography>

                    <div className="flex items-center justify-between mb-6">
                      <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        {pub.type}
                      </span>
                      <span className="text-white/60 text-sm">
                        {pub.pages}
                      </span>
                    </div>

                    <button className={`w-full bg-gradient-to-r ${pub.color} text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl flex items-center justify-center`}>
                      <Download className="mr-2 h-5 w-5" />
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/publications">
                <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl flex items-center mx-auto">
                  View All Publications
                  <ExternalLink className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ParallaxNewsSection;
