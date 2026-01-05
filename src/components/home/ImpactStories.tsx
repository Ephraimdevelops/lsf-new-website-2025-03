import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowRight, Quote, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Link } from 'react-router-dom';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const ImpactStories = () => {
    const stories = useQuery(api.stories.get) || [];
    const [carouselApi, setCarouselApi] = useState<any>();
    const [current, setCurrent] = useState(0);

    // Use all stories for the slider, or fallback if loading/empty
    // Duplicate fallback data to ensure smooth looping
    const displayStories = stories.length > 0 ? stories : [
        { _id: '1', title: 'Loading...', story: '...', personName: '...', location: '...', imageUrl: '' },
        { _id: '2', title: 'Loading...', story: '...', personName: '...', location: '...', imageUrl: '' },
        { _id: '3', title: 'Loading...', story: '...', personName: '...', location: '...', imageUrl: '' },
        { _id: '4', title: 'Loading...', story: '...', personName: '...', location: '...', imageUrl: '' },
    ];

    useEffect(() => {
        if (!carouselApi) {
            return;
        }

        setCurrent(carouselApi.selectedScrollSnap());

        carouselApi.on("select", () => {
            setCurrent(carouselApi.selectedScrollSnap());
        });
    }, [carouselApi]);

    const activeStory = displayStories[current] || displayStories[0];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden transition-colors duration-1000 bg-gradient-to-br from-primary via-primary-dark to-[#3b0d12]">
            {/* Dynamic Background Image with Blur */}
            <div className="absolute inset-0 z-0 transition-opacity duration-1000">
                <div
                    key={activeStory._id}
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform scale-110 blur-3xl opacity-50"
                    style={{
                        backgroundImage: `url(${activeStory.imageUrl || '/lovable-uploads/Untitled design-5.png'})`
                    }}
                />
                {/* Dark rich overlay to increase contrast while keeping color */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-primary/80 to-black/90 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Creative Background Elements overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-orange rounded-full blur-[128px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold uppercase tracking-[0.2em] bg-white/10 border border-white/10 text-secondary-orange rounded shadow-sm backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary-orange animate-pulse"></span>
                            Real Lives Changed
                        </span>
                        <Typography variant="h2" className="mb-6 font-bold text-white tracking-tight text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
                            Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Stories</span>
                        </Typography>
                        <Typography variant="body" className="text-xl text-white/90 leading-relaxed max-w-2xl font-light drop-shadow-md">
                            Behind every case is a human story. Discover how legal aid is transforming lives and communities across Tanzania, one person at a time.
                        </Typography>
                    </div>

                    <div className="hidden md:block pb-2">
                        <Button asChild variant="default" size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white border-0 rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <Link to="/impact">
                                View All Stories
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative w-full">
                    <Carousel
                        setApi={setCarouselApi}
                        opts={{
                            align: "center", // Center the active item
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="select-none py-6">
                            {displayStories.map((story, index) => (
                                <CarouselItem key={story._id} className="md:basis-1/2 lg:basis-1/3 h-full px-3">
                                    <Link to={`/stories/${story._id}`} className="block h-full">
                                        <div
                                            className={`
                                                group relative h-[520px] rounded-3xl overflow-hidden 
                                                transition-all duration-500 ease-out transform-gpu
                                                ${index === current
                                                    ? 'scale-100 opacity-100 shadow-2xl shadow-black/50'
                                                    : 'scale-[0.96] opacity-60 hover:opacity-85 hover:scale-[0.98]'}
                                            `}
                                        >
                                            {/* Background Image */}
                                            <div className="absolute inset-0">
                                                <img
                                                    src={story.imageUrl || "/lovable-uploads/Untitled design-5.png"}
                                                    alt={story.personName}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/lovable-uploads/Untitled design-5.png';
                                                    }}
                                                />
                                                {/* Cinematic Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            </div>

                                            {/* Top Badge - Location */}
                                            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30">
                                                <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-lg">
                                                    <MapPin className="w-3.5 h-3.5 text-secondary-orange" />
                                                    {story.location}
                                                </span>
                                                {story.featured && (
                                                    <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-secondary-orange text-white rounded-full shadow-lg">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            {/* Bottom Content */}
                                            <div className="absolute inset-x-0 bottom-0 z-30 p-8">
                                                {/* Accent Line */}
                                                <div className="w-12 h-1 bg-gradient-to-r from-secondary-orange to-orange-400 rounded-full mb-5 group-hover:w-20 transition-all duration-500" />

                                                {/* Title */}
                                                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 tracking-tight">
                                                    {story.title}
                                                </h3>

                                                {/* Story Preview - Reveals on Hover */}
                                                <div className="overflow-hidden max-h-0 group-hover:max-h-32 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                                    <p className="text-white/80 text-sm leading-relaxed mb-5 line-clamp-3">
                                                        "{story.story}"
                                                    </p>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-5 border-t border-white/10">
                                                    {/* Author Info */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-secondary-orange to-orange-500 flex items-center justify-center font-bold text-white text-base shadow-lg">
                                                            {story.personName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="text-white font-semibold text-sm block">{story.personName}</span>
                                                            <span className="text-white/50 text-xs">Beneficiary</span>
                                                        </div>
                                                    </div>

                                                    {/* CTA Button */}
                                                    <div className="flex items-center gap-2 text-white/70 group-hover:text-secondary-orange transition-colors duration-300">
                                                        <span className="text-xs font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">Read</span>
                                                        <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-secondary-orange flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="hidden md:flex justify-end gap-4 mt-8 pr-4">
                            <CarouselPrevious className="static translate-y-0 w-14 h-14 bg-white/5 hover:bg-secondary-orange border border-white/10 text-white hover:border-secondary-orange transition-all duration-300" />
                            <CarouselNext className="static translate-y-0 w-14 h-14 bg-white/5 hover:bg-secondary-orange border border-white/10 text-white hover:border-secondary-orange transition-all duration-300" />
                        </div>
                    </Carousel>
                </div>

                <div className="mt-12 md:hidden text-center">
                    <Button asChild variant="default" size="lg" className="w-full bg-secondary-orange text-white rounded-full">
                        <Link to="/impact">
                            View All Stories
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ImpactStories;
