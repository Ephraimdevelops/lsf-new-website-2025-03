import { ArrowRight, TrendingUp, PlayCircle, Users, Scale } from 'lucide-react';
import { useState } from 'react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImpactPageHero = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const images = [
        "/lovable-uploads/msaada kisheria lsf yazindua .webp",
        "/lovable-uploads/Danida-lsf-signing.jpg",
        "/lovable-uploads/lsf-10years-annivervasry.jpg",
        "/lovable-uploads/Screenshot 2023-11-27 at 3.55.01 PM.png"
    ];

    const sliderSettings = {
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        fade: true,
        arrows: false,
        pauseOnHover: false,
        speed: 2000,
        cssEase: "cubic-bezier(0.87, 0, 0.13, 1)"
    };

    return (
        <>
            <section className="relative bg-black h-[90vh] min-h-[600px] overflow-hidden group">
                {/* Background Slider */}
                <div className="absolute inset-0 z-0">
                    <Slider {...sliderSettings} className="h-full w-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full">
                        {images.map((img, idx) => (
                            <div key={idx} className="h-full w-full relative">
                                <div className="absolute inset-0 bg-black/40 z-10" />
                                <img
                                    src={img}
                                    alt={`Impact slide ${idx + 1}`}
                                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-linear"
                                />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

                {/* Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center pb-20">
                    <div className="max-w-5xl space-y-6 animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-bold text-sm uppercase tracking-widest">The Legacy</span>
                        </div>

                        <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter drop-shadow-2xl">
                            A Decade of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Defining Justice.</span>
                        </Typography>

                        <Typography variant="body" className="text-white/80 text-xl md:text-2xl max-w-3xl leading-relaxed font-light drop-shadow-md border-l-4 border-secondary-yellow pl-8 py-2">
                            From a $52M Grant Fund to Tanzania's Direct Implementer. <br />
                            <span className="text-white font-medium">We are rewriting the rules of legal empowerment.</span>
                        </Typography>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <Button
                                size="lg"
                                onClick={() => document.getElementById('impact-timeline')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-primary hover:bg-secondary-orange/90 text-white font-black px-10 py-7 text-lg rounded-full shadow-[0_0_30px_-5px_rgba(234,179,8,0.4)] transition-all duration-300 hover:scale-105"
                            >
                                Explore the Legacy
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => setIsVideoOpen(true)}
                                className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black font-bold px-10 py-7 text-lg rounded-full flex items-center transition-all duration-300 hover:scale-105"
                            >
                                <PlayCircle className="mr-3 h-6 w-6" />
                                Watch Our Story
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Sticky Stat Bar - Bottom of Hero - Stylized like Footer (Orange/Primary) */}
                <div className="absolute bottom-0 left-0 right-0 z-30 bg-primary shadow-2xl border-t border-white/10 hidden lg:block">
                    {/* Pattern Overlay matching footer */}
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] bg-cover bg-center mix-blend-overlay" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex justify-between items-center py-8 text-white divide-x divide-white/10">
                            <div className="flex-1 px-8 flex items-center gap-6">
                                <div className="p-3 bg-white/20 rounded-full text-white">
                                    <TrendingUp className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-white">$52M USD</p>
                                    <p className="text-sm uppercase tracking-widest text-white/80 font-bold">Invested in Justice</p>
                                </div>
                            </div>
                            <div className="flex-1 px-8 flex items-center gap-6">
                                <div className="p-3 bg-white/20 rounded-full text-white">
                                    <Users className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-white">200+ Partners</p>
                                    <p className="text-sm uppercase tracking-widest text-white/80 font-bold">Across 168 Districts</p>
                                </div>
                            </div>
                            <div className="flex-1 px-8 flex items-center gap-6">
                                <div className="p-3 bg-white/20 rounded-full text-white">
                                    <Scale className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-white">2 Landmark Acts</p>
                                    <p className="text-sm uppercase tracking-widest text-white/80 font-bold">Enacted (2017/18)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {
                isVideoOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <button
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <iframe
                                src="https://www.youtube.com/embed/x40sHV8NcFA?autoplay=1"
                                title="Impact Video"
                                className="w-full h-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ImpactPageHero;
