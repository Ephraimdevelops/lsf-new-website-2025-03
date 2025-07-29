import { useHeroSlides } from '@/hooks/useContent';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function HomeHero() {
  const { slides, loading, error } = useHeroSlides();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading hero content</div>;

  return (
    <div className="relative">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'relative h-[600px] bg-cover bg-center bg-no-repeat',
            'transition-opacity duration-500'
          )}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50">
            <div className="container mx-auto h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  {slide.description}
                </p>
                {slide.ctaText && slide.ctaLink && (
                  <Button asChild>
                    <a href={slide.ctaLink}>{slide.ctaText}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
