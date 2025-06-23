
import { useState } from 'react';
import { ChevronRight, Quote, MapPin, Star } from 'lucide-react';
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
    quote: "LSF helped me reclaim my family's land and taught me to help other women do the same. Now I'm a voice for justice in my community.",
    brief: "Through LSF's legal aid program, Amina successfully challenged a land grab that threatened her family's livelihood.",
    category: "Land Rights"
  },
  {
    id: 2,
    name: "James Mwalimu",
    title: "Community Paralegal Leader",
    location: "Mwanza Region",
    year: "2022",
    image: "/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png",
    quote: "The paralegal training transformed my life. I've resolved over 200 cases and become a beacon of hope for my community.",
    brief: "James completed LSF's comprehensive paralegal training program and established a community justice center.",
    category: "Community Leadership"
  },
  {
    id: 3,
    name: "Sarah Kimaro",
    title: "Women's Rights Advocate",
    location: "Arusha Region",
    year: "2023",
    image: "/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png",
    quote: "LSF's support helped me escape domestic violence and now I help other women find their voice and legal protection.",
    brief: "Sarah received legal aid for domestic violence cases and later became an advocate for women's rights.",
    category: "Women's Rights"
  }
];

const InteractiveStorySection = () => {
  const [activeStory, setActiveStory] = useState(0);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ 
            backgroundImage: `url(${stories[activeStory].image})`,
            filter: 'blur(2px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Navigation Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              {/* Section Header */}
              <div className="mb-12">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
                  <Quote className="h-5 w-5 mr-3 text-white" />
                  <Typography variant="overline" className="text-white font-bold">
                    REAL STORIES
                  </Typography>
                </div>
                <Typography variant="h1" className="text-white mb-4">
                  Heroes of Justice
                </Typography>
                <Typography variant="body" className="text-white/80 text-lg">
                  Meet the people whose lives have been transformed through legal empowerment.
                </Typography>
              </div>

              {/* Story Navigation */}
              <div className="space-y-4">
                {stories.map((story, index) => (
                  <button
                    key={story.id}
                    onClick={() => setActiveStory(index)}
                    className={`group w-full text-left p-6 rounded-2xl border transition-all duration-500 hover:scale-105 transform ${
                      activeStory === index
                        ? 'bg-white/20 backdrop-blur-xl border-white/40 shadow-xl'
                        : 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center transition-all duration-300 ${
                        activeStory === index ? 'scale-110' : 'group-hover:scale-105'
                      }`}>
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="h4" className="text-white font-bold mb-1">
                          {story.name}
                        </Typography>
                        <Typography variant="bodySmall" className="text-white/70">
                          {story.title}
                        </Typography>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-white/60 transition-all duration-300 ${
                        activeStory === index ? 'rotate-90 text-white' : 'group-hover:translate-x-1'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>

              <Link to="/heroes">
                <button className="mt-8 w-full bg-white text-primary hover:bg-white/90 font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  Read All Stories
                  <ChevronRight className="inline h-5 w-5 ml-2" />
                </button>
              </Link>
            </div>
          </div>

          {/* Active Story Display */}
          <div className="lg:col-span-8">
            <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/30 hover:border-white/50 transition-all duration-700 shadow-2xl">
              
              {/* Story Image Header */}
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={stories[activeStory].image} 
                  alt={stories[activeStory].name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-primary shadow-lg">
                    {stories[activeStory].category}
                  </span>
                </div>

                {/* Year Badge */}
                <div className="absolute top-6 right-6">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30">
                    {stories[activeStory].year}
                  </span>
                </div>

                {/* Story Info Overlay */}
                <div className="absolute bottom-6 left-6">
                  <Typography variant="h2" className="text-white font-bold mb-2">
                    {stories[activeStory].name}
                  </Typography>
                  <div className="flex items-center text-white/90">
                    <MapPin className="h-5 w-5 mr-2" />
                    {stories[activeStory].location}
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-10">
                {/* Quote */}
                <div className="relative mb-8">
                  <Quote className="h-12 w-12 text-primary/30 absolute -top-4 -left-4" />
                  <Typography variant="body" className="text-white italic text-xl leading-relaxed pl-8">
                    "{stories[activeStory].quote}"
                  </Typography>
                </div>

                {/* Brief Description */}
                <Typography variant="body" className="text-white/80 mb-8 text-lg leading-relaxed">
                  {stories[activeStory].brief}
                </Typography>

                {/* Action Button */}
                <div className="flex justify-center">
                  <Link to={`/heroes/${stories[activeStory].id}`}>
                    <button className="bg-primary text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                      Read Full Story
                      <ChevronRight className="inline h-5 w-5 ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default InteractiveStorySection;
