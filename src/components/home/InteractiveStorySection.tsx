// src/components/home/InteractiveStorySection.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, TrendingUp, Target, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useStories } from '@/hooks/useStories';
import { DesignIcon } from '../design-system';
import Text from '../shared/Typography';
/**
 * Lightweight Story types
 */
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
};

/**
 * Mock fallback (Unsplash images) - used in dev or when API fails
 */
const MOCK_STORIES: Story[] = [
  {
    id: 'm1',
    name: 'Maria Santos',
    heading: 'Fighting for Land Rights',
    location: 'São Paulo, Brazil',
    year: '2023',
    image: '/lovable-uploads/WhatsApp Image 2024-06-19 at 11.45.15.jpeg',
    thumbnail: '/lovable-uploads/WhatsApp Image 2024-06-19 at 11.45.15.jpeg',
    brief: 'Secured legal protection for 500 families facing eviction.',
    quote: 'Legal empowerment gave us the voice we never knew we had.',
    category: 'Housing Rights',
  },
  {
    id: 'm2',
    name: 'James Okoye',
    heading: 'Healthcare Access Victory',
    location: 'Lagos, Nigeria',
    year: '2023',
    image: '/lovable-uploads/Land (Uyui).JPG',
    thumbnail: '/lovable-uploads/Land (Uyui).JPG',
    brief: 'Helped build a clinic for an underserved community.',
    quote: 'Knowledge of our rights transformed despair into determination.',
    category: 'Healthcare',
  },
  {
    id: 'm3',
    name: 'Fatima Al-Rashid',
    heading: "Women's Education Champion",
    location: 'Amman, Jordan',
    year: '2023',
    image: '/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png',
    thumbnail: '/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png',
    brief: 'Opened educational opportunities for 200+ girls.',
    quote: 'When women know their rights, they change entire communities.',
    category: 'Education',
  },
];

/**
 * Normalize incoming raw objects to Story shape safely
 */
const normalize = (raw: RawStory | Story): Story => {
  const r: any = raw || {};
  const year =
    r.publishedDate
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
  };
};

/**
 * Small helper: fetch JSON with timeout and one retry
 */
async function fetchWithTimeoutAndRetry(url: string, timeoutMs = 8000, retries = 1) {
  const attempt = async () => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal, credentials: 'same-origin' });
      clearTimeout(id);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const json = await res.json();
      return json;
    } finally {
      clearTimeout(id);
    }
  };

  let lastErr: any = null;
  for (let i = 0; i <= retries; i++) {
    try {
      return await attempt();
    } catch (err) {
      lastErr = err;
      // small delay before retry
      if (i < retries) await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw lastErr;
}

/**
 * Minimal runtime validator for the API response
 * Accepts `{ testimonials: [...] }` or `{ data: [...] }` or `[...]`
 */
function extractStoriesFromApi(payload: any): RawStory[] | null {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.testimonials)) return payload.testimonials;
  if (Array.isArray(payload.data)) return payload.data;
  // If array nested under 'testimonials' or 'data' keys
  return null;
}

const InteractiveStorySection: React.FC<{ storiesProp?: RawStory[]; autoplayMs?: number }> = ({
  storiesProp,
  autoplayMs = 5000,
}) => {
  // try existing hook if available
  const hook = useStories?.() ?? { stories: [] as RawStory[], loading: false, error: null };
  const hookStories = Array.isArray(hook.stories) && hook.stories.length ? hook.stories : null;
  const hookLoading = Boolean(hook.loading);
  const hookError = hook.error ?? null;

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

  // If neither storiesProp nor hook provided items, try fetching from API /testimonials
  useEffect(() => {
    let mounted = true;

    async function tryFetchTestimonials() {
      // If parent provided or hook provided stories, no need to fetch
      if (storiesProp && storiesProp.length > 0) return;
      if (hookStories && hookStories.length > 0) return;

      try {
        // adjust URL depending on your proxy: '/testimonials' or '/api/testimonials'
        const res = await fetchWithTimeoutAndRetry('/testimonials', 8000, 1);
        const arr = extractStoriesFromApi(res);
        if (arr && arr.length > 0) {
          if (!mounted) return;
          setStories(arr.map(normalize));
          return;
        }
        // else keep mock
      } catch (err) {
        // network or parse error — keep mock stories
        // eslint-disable-next-line no-console
        console.warn('Failed to fetch /testimonials, using fallback mocks', err);
      }
    }

    tryFetchTestimonials();
    return () => {
      mounted = false;
    };
    // only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // adopt hookStories when they arrive (higher priority than API fetch attempt)
  useEffect(() => {
    if (storiesProp && storiesProp.length > 0) return; // prop wins
    if (hookStories && hookStories.length > 0) {
      setStories(hookStories.map(normalize));
      setActive(0);
    }
  }, [storiesProp, hookStories]);

  // autoplay (respect reduced-motion)
  useEffect(() => {
    if (prefersReduced) return;
    if (!stories || stories.length <= 1) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % stories.length), autoplayMs);
    return () => window.clearInterval(id);
  }, [stories, autoplayMs, prefersReduced]);

  // center thumbnail on active
  useEffect(() => {
    const container = thumbRef.current;
    if (!container) return;
    const child = container.children[active] as HTMLElement | undefined;
    if (!child) return;
    const cardWidth = child.offsetWidth;
    const scrollPos = active * cardWidth - (container.offsetWidth / 2) + (cardWidth / 2);
    container.scrollTo({ left: Math.max(0, scrollPos), behavior: 'smooth' });
  }, [active]);

  // UI helpers
  const safeStories = Array.isArray(stories) && stories.length > 0 ? stories : MOCK_STORIES;
  const current = safeStories[Math.min(Math.max(0, active), safeStories.length - 1)];

  // nav
  const prev = () => setActive((a) => (a - 1 + safeStories.length) % safeStories.length);
  const next = () => setActive((a) => (a + 1) % safeStories.length);
  const goTo = (i: number) => setActive(Math.max(0, Math.min(i, safeStories.length - 1)));

  return (
    <section id="our-heroes" className="py-5 bg-white">
      <Container size="2xl">
        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-8">


           <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-1 mb-8 border border-primary/20">
                <GraduationCap 
                  size="xl"
                  className="mr-4 w-13 h-13 bg-primary rounded-full animate-pulse"
                />
                <Text variant="overline" color="primary" className="font-bold text-lg tracking-widest">
                  Our Heroes 
                </Text>
              </div>

           <Typography variant="h2" className="mb-8 text-4xl md:text-6xl font-bold">
                Strengthening
                <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                  Access to Justice in Tanzania
                </span>
              </Typography>

          <Typography variant="body" className="text-gray-700 text-lg max-w-3xl mx-auto">
            The Legal Services Facility supports vulnerable Tanzanians through paralegal training, legal aid delivery, community outreach, and policy engagement — ensuring rights are known, claimed and protected across regions.
          </Typography>
        </div>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: hero */}
          <div className="lg:w-2/3 w-full rounded-lg overflow-hidden shadow-2xl relative">
            <img src={current.image} alt={current.name} className="w-full h-[540px] object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
            <div className="absolute left-6 bottom-6 right-6 pointer-events-auto">
              <div className="inline-block bg-primary 500/10 text-white px-3 py-1 rounded-md mb-3">
                <Typography variant="overline" className="text-teal ">{current.category || 'Featured'}</Typography>
              </div>

              <Typography variant="h3" className="text-3xl md:text-4xl text-white font-bold mb-2">
                {current.name}
              </Typography>

              <div className="flex items-center gap-3 text-white/90 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{current.location} {current.year ? `• ${current.year}` : ''}</span>
              </div>

              {current.quote && <blockquote className="text-white/90 italic max-w-2xl mb-4">“{current.quote}”</blockquote>}

              <div>
                {/* less rounded primary CTA */}
                <Link to={`/heroes/${current.id}`}>
                  <button className="bg-primary text-white px-5 py-2 rounded-md font-semibold shadow hover:shadow-lg transition">
                    Read Full Story
                  </button>
                </Link>
              </div>
            </div>

            {/* Prev/Next smaller rounded controls */}
            <button aria-label="Previous story" onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-md p-2 shadow transition hover:scale-105">
              <ChevronLeft className="w-5 h-5 text-primary-600" />
            </button>
            <button aria-label="Next story" onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-md p-2 shadow transition hover:scale-105">
              <ChevronRight className="w-5 h-5 text-primary-600" />
            </button>
          </div>

          {/* Right: vertical thumbnails */}
          <div className="lg:w-1/3 w-full space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-500 rounded-md px-3 py-1">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <Typography variant="overline" className="text-primary-500 font-medium">Our Stories</Typography>
              </div>
            </div>

            <div ref={thumbRef} className="flex flex-col gap-4 h-[500px] overflow-y-auto pr-2 no-scrollbar">
              {safeStories.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={`w-full flex gap-4 items-start p-3 rounded-md text-left transition ${
                    i === active ? 'ring-2 ring-primary-500 bg-white shadow-lg' : 'hover:bg-gray-50'
                  }`}
                  aria-current={i === active}
                >
                  <div className="w-40 h-35 flex-none overflow-hidden rounded-sm bg-gray-200">
                    <img src={s.thumbnail} alt={s.name} className="w-full h-full object-cover" loading={i === active ? 'eager' : 'lazy'} />
                  </div>

                  <div className="flex-1">
                    <Typography variant="h3" className="text-base font-500 text-primary 800">{s.name}</Typography>
                    <Typography variant="bodySmall" className="text-xs text-teal-500">{s.location} • {s.year}</Typography>
                    <Typography variant="body" className="text-sm text-gray-600 mt-2 line-clamp-3">{s.brief}</Typography>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Link to="/heroes">
                <button className="w-full bg-primary 500 text-white py-3 rounded-md font-semibold shadow hover:shadow-lg transition">
                  Explore All Heroes
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default InteractiveStorySection;
