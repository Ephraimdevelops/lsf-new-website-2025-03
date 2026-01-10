import { useState, useEffect, useRef } from 'react';
import Container from '@/components/shared/Container';
import { CalendarClock, Users, Scale, MapPin } from 'lucide-react';

const stats = [
    {
        value: 15,
        suffix: '+',
        label: 'Years of Impact',
        icon: <CalendarClock className="w-6 h-6 md:w-8 md:h-8" />
    },
    {
        value: 40,
        suffix: 'M+',
        label: 'People Reached',
        icon: <Users className="w-6 h-6 md:w-8 md:h-8" />
    },
    {
        value: 4000,
        suffix: '+',
        label: 'Paralegals',
        icon: <Scale className="w-6 h-6 md:w-8 md:h-8" />
    },
    {
        value: 168,
        suffix: '',
        label: 'Districts',
        icon: <MapPin className="w-6 h-6 md:w-8 md:h-8" />
    },
];

// Animated number component
const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const duration = 2000;
                    const steps = 60;
                    const increment = value / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= value) {
                            setCount(value);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated]);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    };

    return (
        <span ref={ref}>
            {formatNumber(count)}{suffix}
        </span>
    );
};

const HomeImpactNumbers = () => {
    return (
        <section className="py-12 md:py-20 relative overflow-hidden bg-primary/95 text-white">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "40px 40px"
                }}
            />

            <Container className="relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            {/* Icon Circle */}
                            <div className="mb-4 p-4 rounded-full bg-white/10 text-white backdrop-blur-sm group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg border border-white/10">
                                {stat.icon}
                            </div>

                            {/* Number */}
                            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 text-white drop-shadow-sm">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </p>

                            {/* Label */}
                            <p className="text-white/80 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default HomeImpactNumbers;
