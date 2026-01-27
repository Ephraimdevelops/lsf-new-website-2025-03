import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

// Helper to strip HTML tags from content
const stripHtml = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const ImpactStories = () => {
    const stories = useQuery(api.stories.get) || [];

    const displayStories = stories.length > 0 ? stories.slice(0, 3) : [
        {
            _id: '1',
            title: 'A Mother\'s Fight for Land Rights',
            story: 'After years of struggle, Maria finally secured her family\'s land rights with help from our paralegals.',
            personName: 'Maria Joseph',
            location: 'Mwanza Region',
            imageUrl: '/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png'
        },
        {
            _id: '2',
            title: 'Justice for Unfair Dismissal',
            story: 'John was wrongfully dismissed from his job. Our legal aid team helped him receive fair compensation.',
            personName: 'John Mwamba',
            location: 'Dar es Salaam',
            imageUrl: '/lovable-uploads/second-hero-image.jpg'
        },
        {
            _id: '3',
            title: 'Protecting Inheritance Rights',
            story: 'When her husband passed, Fatima faced losing everything. We helped her claim her rightful inheritance.',
            personName: 'Fatima Hassan',
            location: 'Arusha Region',
            imageUrl: '/lovable-uploads/third-hero-image.jpg'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <Container>
                {/* Section Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-3 bg-secondary-orange text-white rounded-full px-6 py-2 mb-5">
                        <Heart className="h-4 w-4" />
                        <span className="font-bold text-sm uppercase tracking-widest">Real Lives Changed</span>
                    </div>

                    <Typography variant="h2" className="font-bold text-gray-900 tracking-tight text-3xl md:text-4xl lg:text-5xl mb-4">
                        Impact <span className="text-primary">Stories</span>
                    </Typography>

                    <p className="text-gray-600 text-lg max-w-2xl border-l-4 border-secondary-orange pl-6">
                        Behind every case is a human story. Discover how legal aid transforms lives across Tanzania.
                    </p>
                </div>

                {/* Stories Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {displayStories.map((story) => (
                        <Link
                            key={story._id}
                            to={`/stories/${story._id}`}
                            className="group block"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={story.imageUrl}
                                        alt={story.personName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                                    <div className="absolute top-4 left-4">
                                        <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            {story.location}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-white font-bold text-lg">{story.personName}</p>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {story.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                        {stripHtml(story.story)}
                                    </p>
                                    <span className="text-primary font-bold text-sm flex items-center uppercase tracking-wide">
                                        Read Story
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Button asChild size="lg" variant="outline" className="border-2 border-gray-200 text-gray-900 hover:border-primary hover:bg-primary hover:text-white rounded-full px-8 h-12 text-base font-bold transition-all">
                        <Link to="/heroes">
                            View All Stories
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default ImpactStories;
