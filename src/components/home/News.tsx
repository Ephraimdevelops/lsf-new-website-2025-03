
import { Link } from 'react-router-dom';

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link: string;
}

const NewsCard = ({ title, excerpt, date, image, link }: NewsCardProps) => {
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
      </div>
      <div className="p-6">
        <p className="text-sm text-neutral-gray mb-2">{date}</p>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-neutral-gray mb-4 line-clamp-2">{excerpt}</p>
        <span className="inline-flex items-center text-primary font-medium">
          Read more
          <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </span>
      </div>
    </Link>
  );
};

const News = () => {
  // Sample news data
  const newsItems = [
    {
      title: "LSF Launches New Climate Justice Initiative",
      excerpt: "Legal Services Facility has launched a new initiative to address climate justice issues affecting communities in coastal regions.",
      date: "May 10, 2023",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      link: "/news/climate-justice-initiative",
    },
    {
      title: "Digital Legal Aid Services Reach Rural Communities",
      excerpt: "Our digital transformation program has successfully extended legal aid services to previously unreached rural communities.",
      date: "April 22, 2023",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      link: "/news/digital-legal-aid",
    },
    {
      title: "LSF Partners with Government on Legal Empowerment",
      excerpt: "LSF has signed a Memorandum of Understanding with the Ministry of Justice to strengthen legal empowerment initiatives.",
      date: "March 15, 2023",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
      link: "/news/government-partnership",
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
            <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <NewsCard
              key={index}
              title={item.title}
              excerpt={item.excerpt}
              date={item.date}
              image={item.image}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
