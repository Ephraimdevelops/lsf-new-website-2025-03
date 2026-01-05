import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernAboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 }) as React.RefObject<HTMLElement>;

  return (
    <section
      ref={sectionRef as any}
      className="pt-16 md:pt-24 pb-0 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 h-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end h-full">

          {/* Content Side */}
          <div className={`flex flex-col justify-center pb-16 md:pb-24 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-start mb-6">
              <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-primary text-white rounded-full">
                Who We Are
              </span>
            </div>

            <Typography
              variant="h2"
              className="mb-8 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-neutral-900 tracking-tight"
            >
              Justice Within <span className="text-primary">Reach</span>
            </Typography>

            <div className="space-y-6 text-lg text-neutral-600 leading-relaxed md:pr-10">
              <p className="font-medium text-neutral-900">
                We believe the law should protect everyone, everywhere.
              </p>

              <p>
                Since 2009, LSF has worked to bring justice closer to the people. We know that for many Tanzanians,
                the legal system feels far away, expensive, or too difficult to understand. We are here to change that.
              </p>

              <p>
                We are bridging the gap between the law and the community. By training local experts and using
                simple technology, we ensure that every citizen—especially women and those in rural areas—can claim their rights.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white rounded-xl px-8 h-14 text-base font-semibold transition-all hover:scale-105 shadow-md hover:shadow-xl">
                <Link to="/about">
                  Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-neutral-200 text-neutral-900 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white rounded-xl px-8 h-14 text-base font-semibold transition-all">
                <Link to="/what-we-do">
                  Our Programs
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Side */}
          <div className={`relative h-full transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="relative z-10 h-full overflow-hidden rounded-t-3xl">
              <img
                src="/lovable-uploads/Untitled design-5.png"
                alt="LSF Community Work"
                className="w-full h-full object-cover object-bottom transform hover:scale-105 transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ModernAboutSection;
