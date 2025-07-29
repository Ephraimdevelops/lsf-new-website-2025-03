import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useStories } from '@/hooks/useStories';

const InteractiveStorySection = () => {
  const { stories: backendStories = [], loading: storiesLoading } = useStories();
  const [activeStory, setActiveStory] = useState(0);
  const scrollRef = useRef(null);

  // Transform backend stories to match the component's expected structure
  const enhancedStories = backendStories.map(story => ({
    id: story.id,
    name: story.name,
    heading: story.heading, // Adjusted field name
    location: story.location,
    year: new Date(story.publishedDate).getFullYear().toString(),
    image: story.imageUrl,
    thumbnail: story.thumbnailUrl || story.imageUrl,
    brief: story.brief,
    quote: story.quote,
    category: story.category
  }));

  const scrollToStory = (index) => {
    setActiveStory(index);
    const scrollContainer = scrollRef.current;
    if (scrollContainer?.children[index]) {
      const cardWidth = scrollContainer.children[index].offsetWidth;
      const scrollPosition = index * cardWidth - (scrollContainer.offsetWidth / 2) + (cardWidth / 2);
      scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (enhancedStories.length > 0) {
      scrollToStory(activeStory);
    }
  }, [activeStory, enhancedStories.length]);

  const nextStory = () => scrollToStory((activeStory + 1) % enhancedStories.length);
  const prevStory = () => scrollToStory((activeStory - 1 + enhancedStories.length) % enhancedStories.length);

  if (storiesLoading || enhancedStories.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 bg-gray-900 overflow-hidden" id="our-heroes">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/WhatsApp Image 2025-01-28 at 19.02.57.jpeg')" }}
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

      <Container size="2xl" className="relative z-10 py-20">
        <div className="text-center mb-16 space-y-9">
          <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-8 py-2 border border-white/30">
            <TrendingUp className="h-6 w-6 mr-4 text-secondary-orange" />
            <Typography variant="overline" className="text-secondary-orange font-bold text-lg">
              Our Heroes
            </Typography>
          </div>

          <Typography variant="h2" className="mb-8 text-white text-5xl md:text-6xl font-bold">
            Real Stories.
            <span className="block text-secondary-orange">from Our Heroes.</span>
          </Typography>

          <Typography variant="body" className="text-white/90 max-w-4xl mx-auto text-2xl leading-relaxed">
            Meet courageous community members whose lives—and communities—have been transformed by legal empowerment.
          </Typography>
        </div>

        {/* Hero Story Showcase */}
        <div className="relative mb-12">
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-xl group">
            <img
              src={enhancedStories[activeStory].image || '/lovable-uploads/fallback-image.png'}
              alt={enhancedStories[activeStory].name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Typography variant="h3" className="text-white text-3xl font-bold mb-2">
                {enhancedStories[activeStory].name}
              </Typography>
              <div className="flex items-center text-white/90 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{enhancedStories[activeStory].location}</span>
                <span className="mx-2">•</span>
                <span>{enhancedStories[activeStory].year}</span>
              </div>
              <Typography variant="body" className="text-white/90 text-lg italic mb-4 max-w-2xl">
                "{enhancedStories[activeStory].quote}"
              </Typography>
              <Link to={`/heroes/${enhancedStories[activeStory].id}`}>
                <button className="bg-white text-blue-900 font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:bg-blue-100 hover:shadow-lg">
                  Read Their Story
                </button>
              </Link>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-10 bg-white/20 rounded-full hover:bg-white/30 transition-all"
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
          {enhancedStories.map((story, index) => (
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
                className="w-full h-32 object-cover rounded-lg mb-1"
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
            <button className="bg-gradient-to-r from-neutral-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
              Explore All Heroes
            </button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default InteractiveStorySection;