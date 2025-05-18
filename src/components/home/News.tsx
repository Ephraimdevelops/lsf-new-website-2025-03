
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
  category?: string;
}

const NewsCard = ({ title, excerpt, date, image, link, category }: NewsCardProps) => {
  return (
    <Link 
      to={link}
      className="block group overflow-hidden border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-lg bg-white"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold uppercase py-1 px-2 rounded">
            {category}
          </span>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm text-neutral-gray mb-2">{date}</p>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-neutral-gray mb-4 line-clamp-2">{excerpt}</p>
        <span className="inline-flex items-center text-primary font-medium">
          Read more
          <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

const FeaturedNewsCard = ({ title, excerpt, date, image, link, category }: NewsCardProps) => {
  return (
    <Link 
      to={link}
      className="block group overflow-hidden border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-lg bg-white md:flex md:h-96"
    >
      <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold uppercase py-1 px-2 rounded">
            {category}
          </span>
        )}
      </div>
      <div className="p-6 md:w-1/2 md:flex md:flex-col md:justify-center">
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

const News = () => {
  // Featured news item
  const featuredNews = {
    title: "LSF Launches New Climate Justice Initiative in Coastal Regions",
    excerpt: "Legal Services Facility has launched a new initiative to address climate justice issues affecting communities in coastal regions. The program aims to empower local communities with legal knowledge and tools to protect their rights and resources in the face of environmental challenges.",
    date: "May 10, 2023",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    link: "/news/climate-justice-initiative",
    category: "Climate Justice"
  };

  // Sample news data
  const newsItems = [
    {
      title: "Digital Legal Aid Services Reach Rural Communities",
      excerpt: "Our digital transformation program has successfully extended legal aid services to previously unreached rural communities.",
      date: "April 22, 2023",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/news/digital-legal-aid",
      category: "Digital Transformation"
    },
    {
      title: "LSF Partners with Government on Legal Empowerment",
      excerpt: "LSF has signed a Memorandum of Understanding with the Ministry of Justice to strengthen legal empowerment initiatives.",
      date: "March 15, 2023",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/news/government-partnership",
      category: "Legal Empowerment"
    },
    {
      title: "New Research Reveals Impact of Gender Justice Programs",
      excerpt: "A recent study highlights the significant impact of LSF's gender justice programs in transforming communities and supporting women's rights.",
      date: "February 28, 2023",
      image: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/news/gender-justice-impact",
      category: "Gender Justice"
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">News & Updates</h2>
            <p className="text-neutral-gray">Stay informed about our latest initiatives and impact.</p>
          </div>
          <Link 
            to="/news" 
            className="inline-flex items-center mt-4 md:mt-0 text-primary font-bold hover:underline"
          >
            View all news
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        {/* Featured News */}
        <div className="mb-12">
          <FeaturedNewsCard
            title={featuredNews.title}
            excerpt={featuredNews.excerpt}
            date={featuredNews.date}
            image={featuredNews.image}
            link={featuredNews.link}
            category={featuredNews.category}
          />
        </div>
        
        {/* Regular News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
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
      </div>
    </section>
  );
};

export default News;
