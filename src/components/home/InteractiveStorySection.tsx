
import { useState } from 'react';
import { ChevronRight, Quote, MapPin, Calendar, Star } from 'lucide-react';
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
    outcome: "Amina now leads a women's legal rights group and has helped 50+ families secure their land rights.",
    category: "Land Rights",
    color: "from-emerald-500 to-teal-600"
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
    outcome: "His center has resolved 200+ disputes and trained 15 additional paralegals.",
    category: "Community Leadership",
    color: "from-blue-500 to-indigo-600"
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
    outcome: "She has supported 80+ women through legal processes and established a safe house.",
    category: "Women's Rights",
    color: "from-pink-500 to-rose-600"
  }
];

const InteractiveStorySection = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with Parallax Effect */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ 
            backgroundImage: `url(${stories[activeStory].image})`,
            filter: 'blur(2px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60" />
        
        {/* Animated Mesh Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.1)_75%)] bg-[length:20px_20px] animate-pulse" />
        </div>
      </div>

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Navigation Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              {/* Section Header */}
              <div className="mb-12">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
                  <Quote className="h-5 w-5 mr-3 text-yellow-400" />
                  <Typography variant="overline" className="text-yellow-400 font-bold">
                    REAL STORIES
                  </Typography>
                </div>
                <Typography variant="display" className="text-white font-black text-5xl lg:text-6xl mb-4 leading-tight">
                  Heroes of 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">
                    Justice
                  </span>
                </Typography>
                <Typography variant="body" className="text-white/80 text-lg leading-relaxed">
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
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${story.color} flex items-center justify-center transition-all duration-300 ${
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
                <button className="mt-8 w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-pink-500 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  Read All Stories
                  <ChevronRight className="inline h-5 w-5 ml-2" />
                </button>
              </Link>
            </div>
          </div>

          {/* Active Story Display */}
          <div className="lg:col-span-8">
            <div 
              className="relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Main Story Card */}
              <div className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/30 hover:border-white/50 transition-all duration-700 hover:scale-105 shadow-2xl ${
                isHovered ? 'shadow-4xl' : ''
              }`}>
                
                {/* Story Image Header */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={stories[activeStory].image} 
                    alt={stories[activeStory].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${stories[activeStory].color} shadow-lg`}>
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
                    <Typography variant="h2" className="text-white font-black text-3xl mb-2">
                      {stories[activeStory].name}
                    </Typography>
                    <div className="flex items-center text-white/90 text-lg">
                      <MapPin className="h-5 w-5 mr-2" />
                      {stories[activeStory].location}
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-10">
                  {/* Quote */}
                  <div className="relative mb-8">
                    <Quote className="h-12 w-12 text-yellow-400/30 absolute -top-4 -left-4" />
                    <Typography variant="body" className="text-white italic text-xl leading-relaxed pl-8">
                      "{stories[activeStory].quote}"
                    </Typography>
                  </div>

                  {/* Brief Description */}
                  <Typography variant="body" className="text-white/80 mb-6 text-lg leading-relaxed">
                    {stories[activeStory].brief}
                  </Typography>

                  {/* Outcome Box */}
                  <div className={`bg-gradient-to-r ${stories[activeStory].color} bg-opacity-20 rounded-2xl p-6 border border-white/20`}>
                    <Typography variant="h4" className="text-white font-bold mb-3 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-400" />
                      Impact Achieved
                    </Typography>
                    <Typography variant="body" className="text-white/90 leading-relaxed">
                      {stories[activeStory].outcome}
                    </Typography>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 flex justify-center">
                    <Link to={`/heroes/${stories[activeStory].id}`}>
                      <button className={`bg-gradient-to-r ${stories[activeStory].color} text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl`}>
                        Read Full Story
                        <ChevronRight className="inline h-5 w-5 ml-2" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Animation Elements */}
              {isHovered && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-yellow-400/60 rounded-full animate-ping"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random()}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default InteractiveStorySection;
