
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Calendar, Share2, MessageSquare, Bookmark, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { newsService } from '@/services/api';
import NotFound from './NotFound';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
  tags: string[];
}

// In a real app, this would be fetched from an API
const getNewsItem = (id: string): NewsItem | undefined => {
  const newsItems: Record<string, NewsItem> = {
    'mama-samia-legal-aid': {
      id: 'mama-samia-legal-aid',
      title: "Mama Samia Legal Aid Campaign Reaches 15,000+ Citizens",
      excerpt: "The nationwide campaign provided free legal services to vulnerable communities across Tanzania, focusing on women's rights, land disputes, and family law matters.",
      content: `<p>DODOMA, TANZANIA - The Legal Services Facility (LSF) is proud to announce the successful completion of the Mama Samia Legal Aid Campaign, which has provided essential legal services to over 15,000 citizens across Tanzania.</p>
      
      <p>The three-month campaign, named in honor of President Samia Suluhu Hassan's commitment to justice and equality, focused on providing free legal aid services to vulnerable communities, with special attention to women, children, the elderly, and persons with disabilities.</p>
      
      <p>"Access to justice should not be a privilege for the few, but a right for all Tanzanians," said Jane Doe, Executive Director of LSF. "Through the Mama Samia Campaign, we've been able to reach communities that previously had limited or no access to legal services."</p>
      
      <h3>Campaign Highlights</h3>
      
      <p>The campaign deployed mobile legal clinics to 45 districts across Tanzania, with a team of over 200 trained paralegals providing services including:</p>
      
      <ul>
        <li>Legal consultations on land disputes, inheritance rights, and family law</li>
        <li>Documentation assistance, including birth certificates and legal identity documents</li>
        <li>Alternative dispute resolution sessions</li>
        <li>Legal awareness and education programs</li>
      </ul>
      
      <p>In partnership with the Ministry of Constitutional and Legal Affairs and local government authorities, the campaign also established 15 permanent legal aid desks in previously underserved regions, ensuring continued access to legal services beyond the campaign period.</p>
      
      <h3>Impact Stories</h3>
      
      <p>Among those helped was Maria Joseph, a 57-year-old widow from Morogoro, who had been fighting to reclaim her land after her husband's death.</p>
      
      <p>"For three years I was told I had no right to the land because I am a woman," Maria shared. "The paralegals helped me understand my legal rights and represented me in front of the village elders. Now I have my land back and can support my family."</p>
      
      <p>LSF's monitoring data shows that 68% of the cases handled during the campaign were related to land and property rights, 22% involved family law matters including child support and divorce, and 10% addressed other legal issues including contractual disputes and employment rights.</p>
      
      <h3>Future Plans</h3>
      
      <p>Building on the success of the campaign, LSF has announced plans to expand its paralegal network to cover all 184 districts in Tanzania by the end of 2025, working closely with the government's legal sector reform program.</p>
      
      <p>"The demand for legal services we witnessed during this campaign demonstrates the critical need for continued investment in legal aid," noted John Smith, LSF's Program Director. "We are committed to ensuring that every Tanzanian, regardless of their economic status or location, can access the legal support they need."</p>
      
      <p>The next phase of the program will focus on strengthening digital legal aid services through the Haki Yangu mobile application, which allows citizens to connect with paralegals remotely and access legal information in Swahili.</p>`,
      date: "April 30, 2024",
      author: "LSF Communications Team",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Legal Empowerment",
      tags: ["legal aid", "campaign", "access to justice", "vulnerable communities"]
    },
    'haki-yangu-app-launch': {
      id: 'haki-yangu-app-launch',
      title: "Haki Yangu Mobile App Expands Access to Legal Services",
      excerpt: "LSF's digital transformation initiative has successfully connected over 5,000 users with legal resources and support through the new Haki Yangu mobile application.",
      content: `<p>DAR ES SALAAM, TANZANIA - The Legal Services Facility (LSF) has officially launched the Haki Yangu mobile application, marking a significant advancement in digital legal services across Tanzania.</p>
      
      <p>The Haki Yangu (My Rights) application, available for both Android and iOS devices, enables users to access legal information, connect with paralegals in their local area, and receive guidance on common legal issues directly from their mobile phones.</p>
      
      <p>"Digital technology offers unprecedented opportunities to expand access to justice," said John Smith, Director of Digital Transformation at LSF. "With mobile phone penetration in Tanzania now exceeding 85%, this app allows us to reach people who previously had limited access to legal resources."</p>
      
      <h3>Key Features</h3>
      
      <p>The Haki Yangu app offers several innovative features:</p>
      
      <ul>
        <li>A legal information database covering common legal issues in simplified, non-technical language</li>
        <li>A paralegal finder that connects users with trained legal aid providers in their vicinity</li>
        <li>Document templates for common legal procedures</li>
        <li>Case tracking functionality for ongoing legal matters</li>
        <li>A chatbot providing preliminary legal guidance in both Swahili and English</li>
      </ul>
      
      <p>Since its soft launch three months ago, over 5,000 users across Tanzania have downloaded the application, with the highest usage reported in Dar es Salaam, Mwanza, Arusha, and Dodoma regions.</p>
      
      <h3>Addressing Digital Divide</h3>
      
      <p>Recognizing that not all communities have equal access to digital technology, LSF has implemented complementary measures to ensure the app's benefits reach those most in need.</p>
      
      <p>"We've trained 100 community digital ambassadors who are equipped with tablets and can assist people who don't have smartphones or need help navigating the app," explained Jane Doe, LSF Executive Director. "Our goal is to ensure that digital transformation enhances rather than replaces our existing community-based legal aid services."</p>
      
      <p>The app development was supported by funding from the European Union and technical assistance from the UNDP Accelerator Lab Tanzania.</p>
      
      <h3>Impact and Future Development</h3>
      
      <p>Early user data shows promising results, with 76% of users reporting that the app helped them resolve a legal query without needing to travel to seek in-person assistance. The most frequently accessed information relates to land rights, inheritance, marriage and divorce, and employment law.</p>
      
      <p>"Before, I would have needed to travel 30 kilometers to speak with a paralegal," shared Hassan Mohammed, a farmer from Morogoro Region. "Now I can get information immediately and only travel when necessary. It saves time and money."</p>
      
      <p>LSF plans to continue expanding the app's functionality, with upcoming features including integration with court case management systems, an expanded document repository, and live consultation sessions with legal experts.</p>
      
      <p>"This is just the beginning of our digital justice journey," noted Smith. "As we gather user feedback and data on legal needs, we'll continue enhancing the platform to make justice more accessible for all Tanzanians."</p>
      
      <p>The Haki Yangu app can be downloaded from the Google Play Store and Apple App Store at no cost, and works with minimal data usage to ensure accessibility across varying connectivity levels.</p>`,
      date: "March 15, 2024",
      author: "LSF Digital Team",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      category: "Digital Transformation",
      tags: ["mobile app", "digital legal services", "legal technology", "access to justice"]
    }
    // Additional news items would be added here
  };
  
  return newsItems[id];
};

const NewsDetail = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  
  useEffect(() => {
    const fetchNewsItem = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const item = await newsService.getNewsById(newsId);
        
        // Using sample data for now
        if (!newsId) {
          setNewsItem(null);
          return;
        }
        
        const item = getNewsItem(newsId);
        setNewsItem(item || null);
        
        // Fetch related news (simulated)
        // In a real app, this would be based on tags/categories
        setRelatedNews([
          {
            id: 'climate-justice-initiative',
            title: "New Climate Justice Initiative Tackles Environmental Legal Challenges",
            excerpt: "LSF launches a groundbreaking program to address climate-related legal issues affecting communities across Tanzania.",
            content: "",
            date: "February 22, 2024",
            author: "LSF Team",
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            category: "Climate Justice",
            tags: []
          },
          {
            id: 'paralegal-network-expansion',
            title: "Paralegal Network Now Covers 184 Districts Nationwide",
            excerpt: "LSF's expanded network of paralegal organizations now reaches every district in Tanzania.",
            content: "",
            date: "January 18, 2024",
            author: "LSF Team",
            image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            category: "Legal Empowerment",
            tags: []
          }
        ]);
      } catch (error) {
        console.error("Error fetching news item:", error);
        setNewsItem(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsItem();
  }, [newsId]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (!newsItem) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <Link to="/news" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft size={16} className="mr-1" />
            Back to News
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                {newsItem.category}
              </span>
              {newsItem.tags.map(tag => (
                <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{newsItem.title}</h1>
            
            <div className="flex items-center text-gray-500 text-sm mb-8">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" /> 
                {newsItem.date}
              </span>
              <span className="mx-2">•</span>
              <span>{newsItem.author}</span>
            </div>
            
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img 
                src={newsItem.image} 
                alt={newsItem.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
              />
              
              {/* Share Links */}
              <div className="border-t border-b border-gray-200 mt-8 py-6">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 size={18} />
                  <h4 className="font-bold">Share this article</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Facebook size={14} />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Twitter size={14} />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Linkedin size={14} />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Mail size={14} />
                    Email
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related News */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Related News</h3>
                <div className="space-y-6">
                  {relatedNews.map((item) => (
                    <Link key={item.id} to={`/news/${item.id}`} className="flex gap-4 group">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Latest News */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Latest News</h3>
                <div className="space-y-6">
                  {/* We'll show the same "related news" here as a placeholder */}
                  {relatedNews.map((item) => (
                    <Link key={`latest-${item.id}`} to={`/news/${item.id}`} className="flex gap-4 group">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="link" className="mt-4 w-full justify-center">
                  View All News
                </Button>
              </div>
              
              {/* CTA */}
              <div className="bg-primary text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Get Involved</h3>
                <p className="mb-4">Support our mission to increase access to justice for all Tanzanians.</p>
                <Link to="/donate">
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
