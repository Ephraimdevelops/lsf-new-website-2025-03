import { ArrowRight, Heart } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroesPageHero = () => {
    const images = [
        "/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png",
        "/lovable-uploads/wanawake tunaweza beenficiaries.jpg",
        "/lovable-uploads/SaveVid.Net_484842638_18264975178279523_2515659245077784889_n.jpg",
        "/lovable-uploads/WhatsApp Image 2025-01-30 at 04.36.07.jpeg"
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
        <section className="relative bg-black h-[85vh] min-h-[550px] overflow-hidden group">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                <Slider {...sliderSettings} className="h-full w-full [&_.slick-slider]:h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full">
                    {images.map((img, idx) => (
                        <div key={idx} className="h-full w-full relative">
                            <div className="absolute inset-0 bg-black/40 z-10" />
                            <img
                                src={img}
                                alt={`Heroes slide ${idx + 1}`}
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
                <div className="max-w-4xl space-y-6 animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-2 shadow-2xl backdrop-blur-md border border-white/10">
                        <Heart className="h-4 w-4" />
                        <span className="font-bold text-sm uppercase tracking-widest">Real Lives Changed</span>
                    </div>

                    <Typography variant="h1" className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl">
                        Meet Our <span className="text-white">Heroes</span>
                    </Typography>

                    <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md border-l-4 border-primary pl-6">
                        Behind every case is a human story. These are the people whose lives have been transformed through access to justice.
                    </Typography>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="#stories">
                            <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-5 rounded-full text-base shadow-lg transition-all duration-300 hover:-translate-y-1">
                                Read Their Stories
                                <ArrowRight className="ml-3 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/legal-help">
                            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 py-5 rounded-full text-base transition-all duration-300 hover:-translate-y-1">
                                Share Your Story
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroesPageHero;
