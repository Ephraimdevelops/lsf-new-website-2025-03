import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Download, FileText, Newspaper, BookOpen } from 'lucide-react';
import { Section, Container, Heading, Text } from '../design-system';

const newsItems = [
  {
    id: 1,
    title: "LSF Empowers 26,000+ Tanzanians Through Legal Aid Revolution",
    excerpt: "Community paralegals provide essential legal support across the nation, transforming access to justice in rural and urban areas.",
    category: "Impact Story",
    date: "2024-01-15",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    featured: true
  },
  {
    id: 2,
    title: "Digital Innovation: Haki Yangu App Reaches 10,000+ Users",
    excerpt: "Revolutionary mobile platform connects vulnerable communities with legal support, breaking geographical barriers.",
    category: "Technology",
    date: "2024-01-10",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    featured: false
  },
  {
    id: 3,
    title: "Climate Justice Initiative Protects 2,000+ Families",
    excerpt: "New program addresses environmental legal challenges, empowering communities to defend their land rights.",
    category: "Climate Justice",
    date: "2024-01-05",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
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
    image: "/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png"
  },
  {
    id: 2,
    title: "Gender Justice Research Brief",
    description: "Evidence-based insights on women's access to legal empowerment",
    type: "Research Brief",
    pages: "24 pages",
    image: "/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png"
  },
  {
    id: 3,
    title: "Digital Legal Aid Innovation Study",
    description: "Technology integration in community-based legal services",
    type: "Study Report", 
    pages: "32 pages",
    image: "/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png"
  }
];

const CleanNewsSection = () => {
  return (
    <Section className="py-16 bg-white">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary rounded-full px-6 py-3 mb-6">
            <Newspaper className="h-5 w-5 mr-2 text-white" />
            <Text variant="overline" className="text-white font-bold text-sm">
              NEWSROOM
            </Text>
          </div>
          <Heading variant="hero" className="mb-6 font-heading text-4xl md:text-5xl text-neutral-900">
            Latest Stories & Publications
          </Heading>
          <Text variant="body-large" color="neutral" className="max-w-3xl mx-auto text-lg leading-relaxed">
            Stay informed with real stories from the field and comprehensive research that shapes justice across Tanzania.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* News Stories - Left Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <Heading variant="section" className="text-2xl font-bold text-neutral-900 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-primary" />
                Latest Stories
              </Heading>
              <Link 
                to="/news" 
                className="inline-flex items-center text-primary hover:text-primary-dark font-semibold transition-colors group"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="space-y-8">
              {newsItems.map((news, index) => (
                <Link key={news.id} to={`/news/${news.id}`} className="group block">
                  <article className="flex flex-col md:flex-row gap-6 bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                    <div className={`${index === 0 ? 'md:w-2/3' : 'md:w-1/3'} flex-shrink-0`}>
                      <div className={`${index === 0 ? 'h-64' : 'h-32'} rounded-lg overflow-hidden`}>
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    
                    <div className={`${index === 0 ? 'md:w-1/3' : 'md:w-2/3'} flex flex-col justify-center`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          {news.category}
                        </span>
                        <div className="flex items-center text-sm text-neutral-500">
                          <Calendar size={14} className="mr-1" />
                          {new Date(news.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <Heading variant={index === 0 ? "section" : "card"} className="text-neutral-900 group-hover:text-primary transition-colors mb-3 leading-tight">
                        {news.title}
                      </Heading>
                      
                      <Text variant="body" className="text-neutral-600 mb-4 leading-relaxed">
                        {news.excerpt}
                      </Text>
                      
                      <div className="inline-flex items-center text-primary font-semibold text-sm group-hover:underline">
                        Read Story
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Publications - Right Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-8">
              <Heading variant="section" className="text-2xl font-bold text-neutral-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-secondary-teal" />
                Publications
              </Heading>
              <Link 
                to="/publications" 
                className="inline-flex items-center text-secondary-teal hover:text-secondary-teal/80 font-semibold transition-colors group"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="space-y-6">
              {publications.map((pub) => (
                <Link key={pub.id} to={`/publications/${pub.id}`} className="group block">
                  <article className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-secondary-teal/30">
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                        <img 
                          src={pub.image} 
                          alt={pub.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-secondary-teal text-white text-xs font-bold px-2 py-1 rounded">
                            {pub.type}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {pub.pages}
                          </span>
                        </div>
                        
                        <Heading variant="card" className="text-neutral-900 group-hover:text-secondary-teal transition-colors mb-2 leading-tight text-sm">
                          {pub.title}
                        </Heading>
                      </div>
                    </div>
                    
                    <Text variant="small" className="text-neutral-600 mb-4 leading-relaxed">
                      {pub.description}
                    </Text>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center text-secondary-teal font-semibold text-sm group-hover:underline">
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <button className="inline-flex items-center bg-secondary-teal hover:bg-secondary-teal/90 text-white px-3 py-2 rounded text-xs font-semibold transition-colors">
                        <Download size={12} className="mr-1" />
                        PDF
                      </button>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Publication CTA */}
            <div className="mt-8 text-center">
              <Link
                to="/publications"
                className="inline-flex items-center bg-secondary-teal hover:bg-secondary-teal/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <FileText className="mr-2 h-4 w-4" />
                All Publications
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CleanNewsSection;