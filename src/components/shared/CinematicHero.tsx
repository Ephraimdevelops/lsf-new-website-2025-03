
import { cn } from "@/lib/utils";

interface CinematicHeroProps {
    title: string;
    description?: string;
    badge?: string;
    backgroundImage: string;
    brandPattern?: string; // Optional brand pattern to display at bottom
    className?: string;
}

const CinematicHero = ({
    title,
    description,
    badge,
    backgroundImage,
    brandPattern,
    className
}: CinematicHeroProps) => {
    return (
        <section className={cn("relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden", className)}>
            {/* Background Image with Parallax-like fixed feel or just cover */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            ></div>

            {/* Cinematic Gradient Overlay - smooth dark fade */}
            <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>

            {/* Content */}
            <div className="container relative z-10 px-4 text-center">
                {badge && (
                    <div className="animate-fade-in opacity-0 [animation-delay:0.2s] inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-primary text-white rounded-full shadow-lg">
                        <span className="font-bold text-sm md:text-base uppercase tracking-widest">{badge}</span>
                    </div>
                )}

                <h1 className="animate-fade-in opacity-0 [animation-delay:0.4s] text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight shadow-xl">
                    {title}
                </h1>

                {description && (
                    <p className="animate-fade-in opacity-0 [animation-delay:0.6s] text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
                        {description}
                    </p>
                )}
            </div>

            {/* Brand Pattern at Bottom Border */}
            {brandPattern && (
                <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 lg:h-24 overflow-hidden z-20">
                    <img
                        src={brandPattern}
                        alt=""
                        className="w-full h-full object-cover object-top opacity-90"
                        aria-hidden="true"
                    />
                </div>
            )}
        </section>
    );
};

export default CinematicHero;
