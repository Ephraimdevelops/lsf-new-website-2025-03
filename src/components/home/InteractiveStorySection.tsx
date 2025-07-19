import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const stories = [
  {
    id: 1,
    name: "Amina Hassan",
    title: "Land Rights Champion",
    location: "Morogoro Region",
    year: "2023",
    image: "/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png",
    thumbnail: "/lovable-uploads/thumbs/amina-thumb.png",
    quote: "LSF helped me reclaim my family's land and taught me to help others.",
    brief: "Amina challenged a land grab with LSF's legal aid, empowering her community.",
    category: "Land Rights"
  },
  {
    id: 2,
    name: "James Mwalimu",
    title: "Community Paralegal Leader",
    location: "Mwanza Region",
    year: "2022",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    thumbnail: "/lovable-uploads/thumbs/james-thumb.png",
    quote: "Paralegal training changed my life; I've resolved over 200 cases.",
    brief: "James established a community justice center after LSF training.",
    category: "Community Leadership"
  },
  {
    id: 3,
    name: "Sarah Kimaro",
    title: "Women's Rights Advocate",
    location: "Arusha Region",
    year: "2023",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    thumbnail: "/lovable-uploads/thumbs/sarah-thumb.png",
    quote: "LSF helped me escape violence and advocate for women’s rights.",
    brief: "Sarah became an advocate after receiving LSF’s legal support.",
    category: "Women's Rights"
  },
  {
    id: 4,
    name: "Fatuma Juma",
    title: "Education Rights Advocate",
    location: "Dodoma Region",
    year: "2024",
    image: "public/lovable-uploads/2.png",
    thumbnail: "public/lovable-uploads/2.png",
    quote: "LSF ensured my children’s education rights, inspiring others.",
    brief: "Fatuma secured educational access with LSF’s support.",
    category: "Education Rights"
  },
  {
    id: 5,
    name: "David Mbise",
    title: "Environmental Justice Leader",
    location: "Kilimanjaro Region",
    year: "2023",
    image: "public/lovable-uploads/2.png",
    thumbnail: "public/lovable-uploads/2.png",
    quote: "LSF helped me protect our land from illegal logging.",
    brief: "David led environmental protection efforts with LSF’s aid.",
    category: "Environmental Justice"
  },
  {
    id: 6,
    name: "Maryam Salum",
    title: "Youth Empowerment Mentor",
    location: "Zanzibar",
    year: "2024",
    image: "/lovable-uploads/2.png",
    thumbnail: "public/lovable-uploads/2.png",
    quote: "LSF’s mentorship helped me guide youth on their rights.",
    brief: "Maryam empowered youth through LSF’s programs.",
    category: "Youth Empowerment"
  }
];

const InteractiveStorySection = () => {
  const [activeStory, setActiveStory] = useState(0);
  const scrollRef = useRef(null);

  const scrollToStory = (index) => {
    setActiveStory(index);
    const scrollContainer = scrollRef.current;
    const cardWidth = scrollContainer.children[index].offsetWidth;
    const scrollPosition = index * cardWidth - (scrollContainer.offsetWidth / 2) + (cardWidth / 2);
    scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToStory(activeStory);
  }, []);

  const nextStory = () => scrollToStory((activeStory + 1) % stories.length);
  const prevStory = () => scrollToStory((activeStory - 1 + stories.length) % stories.length);

  return (
    <section className="relative py-16 bg-gray-900 overflow-hidden" id="our-heroes">
      {/* Background Layer */}
       {/* Multi-layer background treatment */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/lovable-uploads/background with mother umage .png')" }}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/85 to-black/90"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>
    
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-10 right-10 w-32 h-32 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
    </div>

    {/* Subtle overlay pattern */}
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,.2)_2px,transparent_0)] bg-[length:30px_30px]"></div>


      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16 space-y-9">
        <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30">
          <TrendingUp className="h-6 w-6 mr-4 text-secondary-orange" />
          <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
            MEASURABLE IMPACT
          </Typography>
        </div>

        <Typography variant="h2" className="mb-8 text-white text-5xl md:text-6xl font-bold">
          Real Stories.
          <span className="block text-secondary-orange">Our Heroes.</span>
        </Typography>

        <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-2xl leading-relaxed">
        Meet the extraordinary individuals who have reshaped their communities with LSF’s support.        </Typography>
      </div>

        {/* Hero Story Showcase */}
        <div className="relative mb-12">
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src={stories[activeStory].image || '/lovable-uploads/fallback-image.png'}
              alt={stories[activeStory].name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Typography variant="h3" className="text-white text-3xl font-bold mb-2">
                {stories[activeStory].name}
              </Typography>
              <div className="flex items-center text-white/90 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{stories[activeStory].location}</span>
                <span className="mx-2">•</span>
                <span>{stories[activeStory].year}</span>
              </div>
              <Typography variant="body" className="text-white/90 text-lg italic mb-4 max-w-2xl">
                "{stories[activeStory].quote}"
              </Typography>
              <Link to={`/heroes/${stories[activeStory].id}`}>
                <button className="bg-white text-blue-900 font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg">
                  Read Their Story
                </button>
              </Link>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Scrollable Story Bar */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => scrollToStory(index)}
              className={`flex-shrink-0 w-64 bg-white/10 rounded-xl p-4 transition-all duration-300 ${
                activeStory === index ? 'ring-2 ring-white scale-105' : 'hover:bg-white/20'
              } snap-center`}
            >
              <img
                src={story.thumbnail || '/lovable-uploads/fallback-thumb.png'}
                alt={story.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <Typography variant="h4" className="text-white text-base font-semibold mb-1">
                {story.name}
              </Typography>
              <Typography variant="bodySmall" className="text-white/80 text-sm line-clamp-2">
                {story.brief}
              </Typography>
            </button>
          ))}
        </div>

        {/* All Stories Link */}
        <div className="text-center mt-12">
          <Link to="/heroes">
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
              Explore All Heroes
            </button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default InteractiveStorySection;