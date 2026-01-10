import { useState } from 'react';
import { ArrowRight, Scale, Heart, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { useIntersectionObserverCallback } from '@/hooks/useIntersectionObserver';

const ModernAboutSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useIntersectionObserverCallback(setIsVisible, { threshold: 0.1 }) as React.RefObject<HTMLElement>;

    const highlights = [
        { icon: Scale, label: 'Legal Aid', description: 'For all Tanzanians' },
        { icon: Heart, label: 'Community First', description: 'People-centered approach' },
        { icon: Users, label: 'Partnerships', description: '50+ organizations' },
    ];

    return (
        <section
            ref={sectionRef as any}
            className="py-20 bg-white"
        >
            <Container>
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Content Side */}
                    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

                        {/* Colored Pill Badge */}
                        <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 mb-6">
                            <Target className="h-4 w-4" />
                            <span className="font-bold text-sm uppercase tracking-widest">Who We Are</span>
                        </div>

                        <Typography variant="h2" className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 tracking-tight">
                            Justice Within <span className="text-primary">Reach</span>
                        </Typography>

                        {/* Border-left accent */}
                        <div className="border-l-4 border-primary pl-6 mb-8">
                            <p className="font-medium text-gray-900 text-lg mb-3">
                                We believe the law should protect everyone, everywhere.
                            </p>

                            <p className="text-gray-600 leading-relaxed mb-3">
                                Since 2009, LSF has worked to bring justice closer to the people. We know that for many Tanzanians,
                                the legal system feels far away, expensive, or too difficult to understand.
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                We are bridging the gap between the law and the community through training local experts and using technology.
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {highlights.map((item, index) => (
                                <div key={index} className="group">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                        <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-gray-900 font-bold text-sm">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-5 h-auto text-base font-bold transition-all hover:scale-105 shadow-lg">
                            <Link to="/about">
                                Our Story
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Image Side */}
                    <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <img
                            src="/lovable-uploads/Untitled design-5.png"
                            alt="LSF Community Work"
                            className="w-full h-[500px] object-cover rounded-3xl"
                        />
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default ModernAboutSection;
