import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, Download, ExternalLink } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';

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
  },
  {
    id: 4,
    title: "New Legal Aid Clinics Launched",
    excerpt: "Expanding access to justice with new clinics in rural areas.",
    category: "Expansion",
    date: "2024-01-20",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    color: "from-yellow-500 to-orange-600",
    featured: false
  },
  {
    id: 5,
    title: "Youth Empowerment Through Legal Education",
    excerpt: "Engaging the next generation in legal rights and responsibilities.",
    category: "Education",
    date: "2024-01-25",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    color: "from-purple-500 to-violet-600",
    featured: false
  },
  {
    id: 6,
    title: "Partnership with Local NGOs Strengthens Impact",
    excerpt: "Collaborating for a greater reach and deeper community engagement.",
    category: "Partnership",
    date: "2024-01-30",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    color: "from-red-500 to-pink-600",
    featured: false
  },
  {
    id: 7,
    title: "Advocacy for Policy Change Gains Momentum",
    excerpt: "Pushing for reforms to improve legal frameworks and protections.",
    category: "Advocacy",
    date: "2024-02-01",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    color: "from-teal-500 to-cyan-600",
    featured: false
  },
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
  const [activeTab, setActiveTab] = useState('news');

  // Filter and limit to 6 non-featured news items
  const otherNews = newsItems.filter(item => !item.featured).slice(0, 6);

  return (
    <section className="relative py-14 overflow-hidden">
      {/* Simplified White Background */}
      <div className="absolute inset-0 bg-white" />

      <Container size="2xl" className="relative z-10 px-5">
        {/* Header */}
        <div className="text-center mb-12">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
            Latest Updates
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
          News & <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent"></span>
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Development
            </span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed about our latest initiatives, partnerships, and impact stories from across Tanzania.
          </p>
         
        </div>
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-2xl p-1.2 border border-gray-300">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === 'news'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              Latest News
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === 'publications'
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
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
                  <Link key={news.id} to={`/news/${news.id}`} className="group block h-[600px]">
                    <div className="relative h-full overflow-hidden rounded-3xl border border-gray-300 bg-gradient-to-br from-white to-gray-100 transition-all duration-700 hover:scale-105 shadow-xl hover:shadow-2xl">
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
                        <Typography variant="h2" className="text-white font-black text-xl md:text-2xl mb-3 leading-tight">
                          {news.title}
                        </Typography>
                        <Typography variant="body" className="text-white/90 text-base leading-relaxed mb-4">
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
                  </Link>
                ))}
              </div>

              {/* Other News */}
              <div className="lg:col-span-5">
                <div className="h-[600px] overflow-y-auto">
                  <div className="space-y-6 p-4">
                    {otherNews.map((news) => (
                      <Link key={news.id} to={`/news/${news.id}`} className="group block">
                        <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 border border-gray-300 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl">
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
                              <Typography variant="h3" className="text-gray-900 font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-base">
                                {news.title}
                              </Typography>
                              <Typography variant="bodySmall" className="text-gray-600 leading-relaxed text-sm">
                                {news.excerpt}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <Link to="/news">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                      View All News
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </button>
                  </Link>
                </div>
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
              {publications.map((pub) => (
                <div key={pub.id} className="group">
                  <div className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 border border-gray-300 transition-all duration-700 hover:scale-105 hover:-translate-y-4 shadow-xl hover:shadow-2xl">
                    <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${pub.color} inline-flex transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                      <Download className="h-8 w-8 text-white" />
                    </div>

                    <Typography variant="h3" className="text-gray-900 font-bold text-lg mb-4 leading-tight">
                      {pub.title}
                    </Typography>

                    <Typography variant="body" className="text-gray-700 mb-6 leading-relaxed text-base">
                      {pub.description}
                    </Typography>

                    <div className="flex items-center justify-between mb-6">
                      <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {pub.type}
                      </span>
                      <span className="text-gray-600 text-sm">
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
                  <ExternalLink className="ml-2 h-5 w-5" /></button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ParallaxNewsSection;