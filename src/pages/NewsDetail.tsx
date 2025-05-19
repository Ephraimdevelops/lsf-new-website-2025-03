
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';

// This would typically come from an API
const newsItems = [
  {
    id: 'legal-empowerment-initiatives',
    title: 'Legal Empowerment Initiatives Making Impact in Rural Tanzania',
    content: `
      <p>Our recent programs have reached over 200 villages, providing critical legal aid and education to marginalized communities. Through our network of paralegals and community legal workers, we have been able to bring justice closer to those who need it most.</p>
      
      <p>The legal empowerment initiatives focus on:</p>
      <ul>
        <li>Training community paralegals</li>
        <li>Conducting legal awareness sessions</li>
        <li>Providing free legal aid to vulnerable groups</li>
        <li>Supporting community-based dispute resolution mechanisms</li>
      </ul>
      
      <p>These efforts have resulted in increased access to justice for thousands of Tanzanians who previously had limited recourse to legal remedies.</p>
    `,
    date: 'May 15, 2023',
    author: 'LSF Team',
    category: 'Legal Empowerment',
    image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gender-justice-workshop',
    title: 'Gender Justice Workshop Series Empowers Women Across Tanzania',
    content: `
      <p>Our workshops have trained over 500 women on legal rights and economic empowerment strategies. The workshops addressed critical issues such as land rights, inheritance, gender-based violence, and economic justice.</p>
      
      <p>Key outcomes from the workshop series include:</p>
      <ul>
        <li>Increased awareness of women's legal rights</li>
        <li>Formation of women's support networks</li>
        <li>Development of community action plans</li>
        <li>Engagement with local authorities on gender-responsive policies</li>
      </ul>
      
      <p>Participants reported feeling more confident to assert their rights and support other women in their communities.</p>
    `,
    date: 'April 22, 2023',
    author: 'Gender Justice Team',
    category: 'Gender Justice',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'climate-justice-advocacy',
    title: 'Climate Justice Advocacy Leads to Policy Changes',
    content: `
      <p>Our advocacy work has resulted in new local policies protecting vulnerable communities from climate-related displacement. Working with coastal communities particularly affected by rising sea levels and erosion, we have helped document impacts and develop community-led adaptation strategies.</p>
      
      <p>Our climate justice initiatives include:</p>
      <ul>
        <li>Community-based climate monitoring</li>
        <li>Legal training on environmental rights</li>
        <li>Advocacy with local and national authorities</li>
        <li>Development of community adaptation plans</li>
      </ul>
      
      <p>These efforts have helped ensure that climate policies and interventions are sensitive to the needs of the most vulnerable communities.</p>
    `,
    date: 'March 10, 2023',
    author: 'Climate Justice Team',
    category: 'Climate Justice',
    image: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'digital-legal-aid',
    title: 'Digital Legal Aid Services Reach Rural Communities',
    content: `
      <p>Our digital transformation program has successfully extended legal aid services to previously unreached rural communities. Through mobile legal clinics and digital tools, we have been able to provide legal advice and support to remote areas.</p>
      
      <p>The digital legal aid program includes:</p>
      <ul>
        <li>Mobile legal clinics equipped with digital resources</li>
        <li>SMS-based legal information services</li>
        <li>Online case management system for paralegals</li>
        <li>Virtual legal consultations for remote communities</li>
      </ul>
      
      <p>This innovative approach has significantly reduced the distance and time required for rural communities to access legal services.</p>
    `,
    date: 'February 18, 2023',
    author: 'Digital Transformation Team',
    category: 'Digital Transformation',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'government-partnership',
    title: 'LSF Partners with Government on Legal Empowerment',
    content: `
      <p>LSF has signed a Memorandum of Understanding with the Ministry of Justice to strengthen legal empowerment initiatives across Tanzania. This partnership will enhance coordination between government agencies and civil society organizations.</p>
      
      <p>Key aspects of the partnership include:</p>
      <ul>
        <li>Joint planning and implementation of legal aid services</li>
        <li>Sharing of resources and expertise</li>
        <li>Collaborative monitoring and evaluation</li>
        <li>Policy development and reform initiatives</li>
      </ul>
      
      <p>This government partnership marks an important step in institutionalizing legal empowerment approaches within the justice system.</p>
    `,
    date: 'January 25, 2023',
    author: 'LSF Leadership Team',
    category: 'Legal Empowerment',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  }
];

const NewsDetail = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const newsItem = newsItems.find(item => item.id === newsId);
  
  if (!newsItem) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-panton mb-4">News Article Not Found</h1>
            <p className="mb-8 font-calibri">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/news" className="inline-flex items-center text-primary hover:underline font-calibri">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to News
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pt-16">
        {/* Hero Image */}
        <div 
          className="w-full h-[40vh] md:h-[50vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${newsItem.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container mx-auto px-4 pb-8 md:pb-16">
              <div className="text-white max-w-3xl">
                <div className="mb-4">
                  <span className="inline-block bg-primary/20 text-white text-sm font-medium px-3 py-1 rounded-full mr-3 font-calibri">
                    {newsItem.category}
                  </span>
                  <span className="text-sm text-white/80 font-calibri">
                    {newsItem.date}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-panton">
                  {newsItem.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <Link 
                to="/news" 
                className="inline-flex items-center mb-8 text-primary hover:underline font-calibri"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to News
              </Link>
              
              <div 
                className="prose prose-lg max-w-none font-calibri"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
              />
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold font-calibri">Author</h3>
                <p className="font-calibri">{newsItem.author}</p>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-xl font-bold mb-4 font-panton">Recent News</h3>
                <div className="space-y-4">
                  {newsItems
                    .filter(item => item.id !== newsId)
                    .slice(0, 3)
                    .map(item => (
                      <Link 
                        key={item.id}
                        to={`/news/${item.id}`}
                        className="block group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium group-hover:text-primary transition font-calibri">
                              {item.title}
                            </h4>
                            <p className="text-xs text-neutral-gray font-calibri">
                              {item.date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
                <Link 
                  to="/news" 
                  className="inline-flex items-center text-primary hover:underline mt-4 text-sm font-calibri"
                >
                  View all news
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;
