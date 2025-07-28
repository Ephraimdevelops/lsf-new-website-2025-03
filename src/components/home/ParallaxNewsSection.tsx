import { useState, useEffect } from 'react';
import Container from '../shared/Container';
import { ArrowRight, Calendar, Tag, Download, ExternalLink, ChevronLeft, ChevronRight, Scale, Users, FileText } from 'lucide-react';
// Mock Link component for demo
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);
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
    color: "from-blue-600 to-indigo-700",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    icon: <Scale className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Gender Justice Research Brief",
    description: "Evidence-based insights on women's access to legal empowerment",
    type: "Research Brief",
    pages: "24 pages",
    color: "from-emerald-600 to-teal-700",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    icon: <Users className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Digital Legal Aid Innovation Study",
    description: "Technology integration in community-based legal services",
    type: "Study Report",
    pages: "32 pages",
    color: "from-amber-600 to-orange-700",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    icon: <FileText className="h-6 w-6" />
  }
];

const ParallaxNewsSection = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter featured news for sliding
  const featuredNews = newsItems.filter(item => item.featured);
  const otherNews = newsItems.filter(item => !item.featured).slice(0, 6);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredNews.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredNews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === featuredNews.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredNews.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative py-14 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

      <Container size="2xl" className="relative z-10 px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 via-emerald-100 to-amber-100 backdrop-blur-sm rounded-full px-8 py-3 mb-8 border border-blue-200">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Text variant="overline" className="font-bold text-lg tracking-widest bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent">
              Latest Updates
            </Text>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
            News & 
            <span className="block bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent">
              Publications
            </span>
          </Typography>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stay informed about our latest initiatives, partnerships, and impact stories from across Tanzania.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-lg">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === 'news'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Latest News
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                activeTab === 'publications'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              {/* Sliding Featured News */}
              <div className="lg:col-span-7">
                <div 
                  className="relative h-[600px] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  {/* Slides */}
                  <div 
                    className="flex h-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredNews.map((news, index) => (
                      <Link key={news.id} to={`/news/${news.id}`} className="group block min-w-full h-full relative">
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
                      </Link>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-3">
                    {featuredNews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Other News */}
              <div className="lg:col-span-5">
                <div className="h-[600px] overflow-y-auto">
                  <div className="space-y-6 p-4">
                    {otherNews.map((news) => (
                      <Link key={news.id} to={`/news/${news.id}`} className="group block">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl">
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
                              <Typography variant="h3" className="text-slate-900 font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-base">
                                {news.title}
                              </Typography>
                              <Typography variant="bodySmall" className="text-slate-600 leading-relaxed text-sm">
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
                    <button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-emerald-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
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
                  <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-200 transition-all duration-700 hover:scale-105 hover:-translate-y-4 shadow-xl hover:shadow-2xl">
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={pub.image} 
                        alt={pub.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${pub.color} opacity-80`} />
                      
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white">
                          {pub.icon}
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full">
                          {pub.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <Typography variant="h3" className="text-slate-900 font-bold text-lg mb-4 leading-tight">
                        {pub.title}
                      </Typography>

                      <Typography variant="body" className="text-slate-600 mb-6 leading-relaxed text-base">
                        {pub.description}
                      </Typography>

                      <div className="flex items-center justify-between mb-6">
                        <span className="text-slate-500 text-sm font-medium">
                          {pub.pages}
                        </span>
                        <Download className="h-5 w-5 text-slate-400" />
                      </div>

                      <button className={`w-full bg-gradient-to-r ${pub.color} text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl flex items-center justify-center group-hover:shadow-2xl`}>
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/publications">
                <button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-emerald-600 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl flex items-center mx-auto">
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