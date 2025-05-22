
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
        <p className="text-sm text-neutral-gray mb-2 font-calibri">{date}</p>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors font-panton">{title}</h3>
        <p className="text-neutral-gray mb-4 line-clamp-2 font-calibri">{excerpt}</p>
        <span className="inline-flex items-center text-primary font-medium font-calibri">
          Read more
          <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

// This component is no longer used in the homepage, but kept for reference
// The FeaturedNewsCarousel has replaced this component on the homepage
const News = () => {
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
      excerpt: "A recent study highlights the significant impact of LSF's gender justice programs in transforming communities.",
      date: "February 28, 2023",
      image: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/news/gender-justice-impact",
      category: "Gender Justice"
    },
  ];

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-panton font-bold mb-2">News & Updates</h2>
            <p className="text-neutral-gray font-calibri">Stay informed about our latest initiatives and impact.</p>
          </div>
          <Link 
            to="/news" 
            className="inline-flex items-center mt-4 md:mt-0 text-primary font-bold hover:underline font-calibri"
          >
            View all news
            <ArrowRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
