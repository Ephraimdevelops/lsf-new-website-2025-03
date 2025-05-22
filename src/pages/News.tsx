
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

interface NewsItemProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
  category: string;
}

const NewsCard = ({ title, excerpt, date, image, link, category }: NewsItemProps) => {
  return (
    <Link 
      to={link}
      className="block group overflow-hidden border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-lg bg-white h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold uppercase py-1 px-2 rounded">
          {category}
        </span>
      </div>
      <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
        <p className="text-sm text-neutral-gray mb-2">{date}</p>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-neutral-gray mb-4 flex-grow">{excerpt}</p>
        <span className="inline-flex items-center text-primary font-medium mt-auto">
          Read more
          <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

const FeaturedNewsCard = ({ title, excerpt, date, image, link, category }: NewsItemProps) => {
  return (
    <Link 
      to={link}
      className="block group overflow-hidden border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-lg bg-white md:flex"
    >
      <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold uppercase py-1 px-2 rounded">
          {category}
        </span>
      </div>
      <div className="p-8 md:w-1/2 md:flex md:flex-col md:justify-center">
        <p className="text-sm text-neutral-gray mb-2">{date}</p>
        <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-neutral-gray mb-6 text-lg">{excerpt}</p>
        <span className="inline-flex items-center text-primary font-medium">
          Read more
          <ArrowRight className="ml-1 h-5 w-5" />
        </span>
      </div>
    </Link>
  );
};

// News data
const allNewsItems = [
  {
    id: 'climate-justice-initiative',
    title: "LSF Launches New Climate Justice Initiative in Coastal Regions",
    excerpt: "Legal Services Facility has launched a new initiative to address climate justice issues affecting communities in coastal regions. The program aims to empower local communities with legal knowledge and tools to protect their rights and resources in the face of environmental challenges.",
    date: "May 10, 2023",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    link: "/news/climate-justice-initiative",
    category: "Climate Justice",
    featured: true
  },
  {
    id: 'digital-legal-aid',
    title: "Digital Legal Aid Services Reach Rural Communities",
    excerpt: "Our digital transformation program has successfully extended legal aid services to previously unreached rural communities. Through mobile legal clinics and digital tools, we have been able to provide legal advice and support to over 5,000 people in remote areas who would otherwise have no access to justice services.",
    date: "April 22, 2023",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/news/digital-legal-aid",
    category: "Digital Transformation",
    featured: false
  },
  {
    id: 'government-partnership',
    title: "LSF Partners with Government on Legal Empowerment",
    excerpt: "LSF has signed a Memorandum of Understanding with the Ministry of Justice to strengthen legal empowerment initiatives across Tanzania. This partnership will enhance coordination between government agencies and civil society organizations working on access to justice.",
    date: "March 15, 2023",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/news/government-partnership",
    category: "Legal Empowerment",
    featured: false
  },
  {
    id: 'gender-justice-impact',
    title: "New Research Reveals Impact of Gender Justice Programs",
    excerpt: "A recent study highlights the significant impact of LSF's gender justice programs in transforming communities and supporting women's rights. The research shows that women who participated in our programs reported a 40% increase in awareness of their legal rights and a 30% increase in confidence to assert these rights.",
    date: "February 28, 2023",
    image: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/news/gender-justice-impact",
    category: "Gender Justice",
    featured: false
  },
  {
    id: 'paralegal-training',
    title: "LSF Completes Training for 100 New Paralegals",
    excerpt: "LSF recently completed an intensive training program for 100 new community paralegals who will provide frontline legal support in their local areas. These paralegals are now equipped to handle common legal issues, provide basic legal education, and refer complex cases to lawyers.",
    date: "January 20, 2023",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/news/paralegal-training",
    category: "Legal Empowerment",
    featured: false
  },
  {
    id: 'climate-justice-workshop',
    title: "Climate Justice Workshop Engages Youth Leaders",
    excerpt: "A recent workshop on climate justice brought together 50 youth leaders from coastal communities to discuss environmental challenges and develop action plans. The participants learned about climate change impacts, legal frameworks for environmental protection, and strategies for community advocacy.",
    date: "December 12, 2022",
    image: "https://images.unsplash.com/photo-1552799446-159ba9523315?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/news/climate-justice-workshop",
    category: "Climate Justice",
    featured: false
  },
  {
    id: 'mobile-app-launch',
    title: "LSF Launches Mobile App for Legal Information",
    excerpt: "LSF has launched a new mobile application that provides easy access to legal information and resources. The app, available in both English and Swahili, offers guidance on common legal issues, contact information for legal aid providers, and a feature to schedule consultations with paralegals.",
    date: "November 5, 2022",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/news/mobile-app-launch",
    category: "Digital Transformation",
    featured: false
  }
];

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', 'Climate Justice', 'Digital Transformation', 'Gender Justice', 'Legal Empowerment'];
  
  const featuredNews = allNewsItems.find(item => item.featured);
  
  const filteredNews = activeCategory === 'All' 
    ? allNewsItems.filter(item => !item.featured) 
    : allNewsItems.filter(item => item.category === activeCategory && !item.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
            <p className="text-xl opacity-90">
              Stay informed about our latest initiatives, partnerships, and impact in promoting justice for all.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured News */}
          {featuredNews && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
              <FeaturedNewsCard
                title={featuredNews.title}
                excerpt={featuredNews.excerpt}
                date={featuredNews.date}
                image={featuredNews.image}
                link={featuredNews.link}
                category={featuredNews.category}
              />
            </div>
          )}
          
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Latest News</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, index) => (
              <NewsCard
                key={index}
                title={item.title}
                excerpt={item.excerpt}
                date={item.date}
                image={item.image}
                link={item.link}
                category={item.category}
              />
            ))}
          </div>
          
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-neutral-gray">No news articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
