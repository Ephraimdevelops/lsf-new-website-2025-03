import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, Target, GraduationCap, Heart, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useStories } from '@/hooks/useStories';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

type RawStory = {
  id?: string | number;
  name?: string;
  heading?: string;
  location?: string;
  publishedDate?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  brief?: string;
  quote?: string;
  category?: string;
  [k: string]: any;
};

type Story = {
  id: string | number;
  name: string;
  heading?: string;
  location?: string;
  year?: string;
  image: string;
  thumbnail: string;
  brief?: string;
  quote?: string;
  category?: string;
  impact?: string;
  achievement?: string;
};

const MOCK_STORIES: Story[] = [
  {
    id: 'm1',
    name: 'Maria Santos',
    heading: 'Fighting for Land Rights',
    location: 'Dar es Salaam, Tanzania',
    year: '2023',
    image: '/lovable-uploads/WhatsApp Image 2024-06-19 at 11.45.15.jpeg',
    thumbnail: '/lovable-uploads/WhatsApp Image 2024-06-19 at 11.45.15.jpeg',
    brief: 'Secured legal protection for 500 families facing eviction through community paralegal training and legal advocacy.',
    quote: 'Legal empowerment gave us the voice we never knew we had. Now we can protect our homes and our future.',
    category: 'Land Rights',
    impact: '500 families protected',
    achievement: 'Community paralegal leader'
  },
  {
    id: 'm2',
    name: 'James Okoye',
    heading: 'Healthcare Access Victory',
    location: 'Arusha, Tanzania',
    year: '2023',
    image: '/lovable-uploads/Land (Uyui).JPG',
    thumbnail: '/lovable-uploads/Land (Uyui).JPG',
    brief: 'Helped build a clinic for an underserved community and trained 50 healthcare advocates.',
    quote: 'Knowledge of our rights transformed despair into determination. We built our own solutions.',
    category: 'Healthcare Rights',
    impact: '50 advocates trained',
    achievement: 'Healthcare champion'
  },
  {
    id: 'm3',
    name: 'Fatima Al-Rashid',
    heading: "Women's Education Champion",
    location: 'Mwanza, Tanzania',
    year: '2023',
    image: '/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png',
    thumbnail: '/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png',
    brief: 'Opened educational opportunities for 200+ girls and established legal literacy programs.',
    quote: 'When women know their rights, they change entire communities. Education is our strongest weapon.',
    category: 'Education Rights',
    impact: '200+ girls educated',
    achievement: 'Education pioneer'
  },
  {
    id: 'm4',
    name: 'Ahmed Hassan',
    heading: 'Labor Rights Advocate',
    location: 'Dodoma, Tanzania',
    year: '2023',
    image: '/lovable-uploads/Untitled design-5.png',
    thumbnail: '/lovable-uploads/Untitled design-5.png',
    brief: 'Organized workers and secured fair wages for 300+ factory workers through legal advocacy.',
    quote: 'Every worker deserves dignity and fair treatment. Legal knowledge is our shield against exploitation.',
    category: 'Labor Rights',
    impact: '300+ workers helped',
    achievement: 'Labor rights leader'
  }
];

const normalize = (raw: RawStory | Story): Story => {
  const r: any = raw || {};
  const year = r.publishedDate
    ? (() => {
        const d = new Date(r.publishedDate);
        return Number.isFinite(d.getFullYear()) ? d.getFullYear().toString() : '';
      })()
    : r.year || '';

  return {
    id: r.id ?? Math.random().toString(36).slice(2, 9),
    name: r.name ?? r.title ?? 'Untitled',
    heading: r.heading ?? r.title ?? '',
    location: r.location ?? '',
    year,
    image: r.image || r.imageUrl || '/lovable-uploads/fallback-image.png',
    thumbnail: r.thumbnail || r.thumbnailUrl || r.imageUrl || r.image || '/lovable-uploads/fallback-thumb.png',
    brief: r.brief ?? '',
    quote: r.quote ?? '',
    category: r.category ?? '',
    impact: r.impact ?? '',
    achievement: r.achievement ?? ''
  };
};

const EnhancedStorySection: React.FC<{ storiesProp?: RawStory[]; autoplayMs?: number }> = ({
  storiesProp,
  autoplayMs = 8000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 });

  const hook = useStories?.() ?? { stories: [] as RawStory[], loading: false, error: null };
  const hookStories = Array.isArray(hook.stories) && hook.stories.length ? hook.stories : null;

  const [stories, setStories] = useState<Story[]>(
    storiesProp && Array.isArray(storiesProp) && storiesProp.length > 0
      ? storiesProp.map(normalize)
      : hookStories
      ? hookStories.map(normalize)
      : MOCK_STORIES
  );

  const [active, setActive] = useState<number>(0);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (storiesProp && storiesProp.length > 0) return;
    if (hookStories && hookStories.length > 0) {
      setStories(hookStories.map(normalize));
      setActive(0);
    }
  }, [storiesProp, hookStories]);

  useEffect(() => {
    if (prefersReduced) return;
    if (!stories || stories.length <= 1) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % stories.length), autoplayMs);
    return () => window.clearInterval(id);
  }, [stories, autoplayMs, prefersReduced]);

  useEffect(() => {
    const container = thumbRef.current;
    if (!container) return;
    const child = container.children[active] as HTMLElement | undefined;
    if (!child) return;
    const cardWidth = child.offsetWidth;
    const scrollPos = active * cardWidth - (container.offsetWidth / 2) + (cardWidth / 2);
    container.scrollTo({ left: Math.max(0, scrollPos), behavior: 'smooth' });
  }, [active]);

  const safeStories = Array.isArray(stories) && stories.length > 0 ? stories : MOCK_STORIES;
  const current = safeStories[Math.min(Math.max(0, active), safeStories.length - 1)];

  const prev = () => setActive((a) => (a - 1 + safeStories.length) % safeStories.length);
  const next = () => setActive((a) => (a + 1) % safeStories.length);
  const goTo = (i: number) => setActive(Math.max(0, Math.min(i, safeStories.length - 1)));

  const categoryColors = {
    'Land Rights': 'from-green-500 to-emerald-600',
    'Healthcare Rights': 'from-blue-500 to-cyan-600',
    'Education Rights': 'from-purple-500 to-indigo-600',
    'Labor Rights': 'from-orange-500 to-red-600'
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-background via-neutral-50/50 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container size="2xl" className="relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
              <Heart className="h-6 w-6 text-primary animate-pulse" />
              <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
                Our Heroes
              </Typography>
            </div>
            
            <Typography 
              variant="h2" 
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Strengthening
              <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                Access to Justice
              </span>
            </Typography>
            
            <Typography 
              variant="body" 
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              Meet the community champions who are transforming lives through legal empowerment. 
              These inspiring stories show how knowledge, determination, and support can create lasting change across Tanzania.
            </Typography>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Featured Story */}
            <div className="lg:col-span-2">
              <div className="relative group transition-all duration-700 delay-300">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                {/* Navigation */}
                <button
                  onClick={prev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  aria-label="Next story"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  {/* Category Badge */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryColors[current.category as keyof typeof categoryColors] || 'from-primary to-secondary-orange'} text-white px-4 py-2 rounded-full shadow-lg`}>
                      <Target className="h-4 w-4" />
                      <span className="font-semibold text-sm">{current.category}</span>
                    </div>
                  </div>

                  {/* Name and Achievement */}
                  <Typography variant="h3" className="text-white mb-2 text-3xl lg:text-4xl font-bold leading-tight">
                    {current.name}
                  </Typography>
                  
                  {current.achievement && (
                    <Typography variant="body" className="text-white/80 mb-4 text-lg">
                      {current.achievement}
                    </Typography>
                  )}

                  {/* Location & Year */}
                  <div className="flex items-center gap-3 text-white/80 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{current.location} • {current.year}</span>
                  </div>

                  {/* Impact */}
                  {current.impact && (
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">{current.impact}</span>
                      </div>
                    </div>
                  )}

                  {/* Quote */}
                  {current.quote && (
                    <blockquote className="text-white/95 italic text-lg mb-6 max-w-2xl leading-relaxed">
                      "{current.quote}"
                    </blockquote>
                  )}

                  {/* CTA */}
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold group">
                    <Link to={`/heroes/${current.id}`}>
                      Read Full Story
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Story Thumbnails */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2">
                  <Users className="w-4 h-4" />
                  <Typography variant="overline" className="text-primary font-semibold">More Stories</Typography>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {safeStories.map((story, i) => (
                  <button
                    key={story.id}
                    onClick={() => goTo(i)}
                    className={`w-full flex gap-4 items-start p-4 rounded-2xl text-left transition-all duration-300 ${
                      i === active 
                        ? 'bg-white shadow-xl border-2 border-primary scale-105' 
                        : 'bg-white/50 hover:bg-white hover:shadow-lg border border-neutral-200'
                    }`}
                    aria-current={i === active}
                  >
                    <div className="w-20 h-20 flex-none overflow-hidden rounded-xl bg-neutral-200">
                      <img 
                        src={story.thumbnail} 
                        alt={story.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                        loading={i === active ? 'eager' : 'lazy'} 
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Typography variant="h5" className="text-base font-bold text-neutral-900 mb-1 truncate">
                        {story.name}
                      </Typography>
                      <Typography variant="bodySmall" className="text-neutral-600 mb-2 text-sm">
                        {story.location} • {story.year}
                      </Typography>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        story.category === 'Land Rights' ? 'bg-green-100 text-green-700' :
                        story.category === 'Healthcare Rights' ? 'bg-blue-100 text-blue-700' :
                        story.category === 'Education Rights' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {story.category}
                      </div>
                      {story.impact && (
                        <Typography variant="bodySmall" className="text-neutral-500 mt-2 text-xs">
                          {story.impact}
                        </Typography>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/heroes">
                    Explore All Heroes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Story Indicators */}
          <div className="flex justify-center mt-16 space-x-3">
            {safeStories.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`transition-all duration-500 ${
                  index === active 
                    ? 'w-12 h-3 bg-primary rounded-full shadow-lg' 
                    : 'w-3 h-3 bg-neutral-300 hover:bg-primary/50 rounded-full'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EnhancedStorySection;
