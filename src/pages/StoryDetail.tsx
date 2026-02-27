import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useVisitorId } from '@/hooks/useVisitorId';
import { Id } from "../../convex/_generated/dataModel";
import { ArrowLeft, Share2, MapPin, Heart, ArrowRight, Quote } from 'lucide-react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import SuccessStoryCard from '../components/shared/SuccessStoryCard';
import { Button } from '@/components/ui/button';

const StoryDetail = () => {
    const { storyId } = useParams<{ storyId: string }>();

    // Scroll to top when story changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [storyId]);

    const logEvent = useMutation(api.analytics.logEvent);
    const visitorId = useVisitorId();

    // Fetch all stories for the related section
    const allStoriesQuery = useQuery(api.stories.get);
    const isLoading = allStoriesQuery === undefined;
    const allStories = allStoriesQuery || [];

    // Find the current story
    const story = allStories.find(s => s._id === storyId);

    // SEO and Analytics
    useEffect(() => {
        if (story) {
            document.title = `${story.title} | LSF Stories`;
            logEvent({
                type: "story_view",
                resourceId: story._id,
                resourceType: "story",
                visitorId: visitorId,
                meta: { title: story.title, person: story.personName },
            });
        }
        return () => { document.title = 'Legal Services Facility'; };
    }, [story, logEvent, visitorId]);

    // Get related stories (excluding current)
    const relatedStories = allStories.filter(s => s._id !== storyId).slice(0, 3);

    // Show loading spinner while data is being fetched
    if (isLoading) {
        return (
            <Layout>
                <section className="min-h-screen flex items-center justify-center bg-neutral-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <Typography variant="body" className="text-neutral-600">Loading story...</Typography>
                    </div>
                </section>
            </Layout>
        );
    }

    // Only show "Not Found" after loading is complete and story truly doesn't exist
    if (!story) {
        return (
            <Layout>
                <section className="min-h-screen flex items-center justify-center bg-neutral-50">
                    <Container>
                        <div className="text-center">
                            <Typography variant="h1" className="text-4xl font-bold mb-4">Story Not Found</Typography>
                            <Typography variant="body" className="text-neutral-600 mb-8">
                                We couldn't find the story you're looking for.
                            </Typography>
                            <Link to="/heroes">
                                <Button>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to All Stories
                                </Button>
                            </Link>
                        </div>
                    </Container>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Cinematic Hero Section - 95vh with center alignment and fixed background */}
            <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
                {/* Fixed background image for parallax effect */}
                <div
                    className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
                    style={{ backgroundImage: `url(${story.imageUrl || '/lovable-uploads/background with mother umage .png'})` }}
                >
                    {/* Cinematic gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent"></div>
                </div>

                {/* Back button - top left */}
                <div className="absolute top-8 left-0 right-0 z-20">
                    <div className="container mx-auto px-4">
                        <Link to="/heroes" className="inline-flex items-center text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Stories
                        </Link>
                    </div>
                </div>

                {/* Center-aligned content */}
                <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
                    {/* Location badge */}
                    <div className="mb-8">
                        <span className="inline-flex items-center text-white bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-sm font-medium">
                            <MapPin className="h-4 w-4 mr-2 text-secondary-orange" />
                            {story.location}
                        </span>
                    </div>

                    {/* Main heading */}
                    <Typography variant="h1" className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight drop-shadow-2xl">
                        {story.title}
                    </Typography>

                    {/* Subtitle */}
                    <Typography variant="body" className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12">
                        {story.personName}'s journey to justice
                    </Typography>

                    {/* Scroll indicator */}
                    <div className="animate-bounce">
                        <div className="w-8 h-14 border-2 border-white/50 rounded-full mx-auto flex justify-center pt-2">
                            <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Content */}
            <section className="py-16 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        {/* Quote Block */}
                        <div className="bg-gradient-to-r from-primary/5 to-secondary-teal/5 border-l-4 border-primary p-8 my-12 rounded-r-xl">
                            <Quote className="h-10 w-10 text-primary/30 mb-4" />
                            <blockquote className="text-2xl italic text-neutral-800 leading-relaxed">
                                "{story.quote || story.story.replace(/<[^>]*>/g, '').substring(0, 200)}..."
                            </blockquote>
                            <footer className="mt-6 font-bold text-primary text-lg">
                                — {story.personName}, {story.location}
                            </footer>
                        </div>

                        {/* Story Details */}
                        <div className="prose prose-lg max-w-none">
                            <Typography variant="h2" className="text-3xl font-bold mb-6">The Full Story</Typography>
                            <div
                                className="text-neutral-700 text-lg leading-relaxed [&_p]:mb-4 [&_span]:inline"
                                dangerouslySetInnerHTML={{ __html: story.story }}
                            />
                        </div>

                        {/* Share & CTA */}
                        <div className="flex flex-col md:flex-row justify-between items-center bg-neutral-50 rounded-2xl p-8 my-12 gap-6">
                            <div>
                                <Typography variant="h4" className="font-bold mb-3">Share this inspiring story</Typography>
                                <div className="flex gap-3">
                                    <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                    <button className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors">
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <Link to="/legal-help">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    <Heart className="mr-2 h-5 w-5" />
                                    Get Legal Help
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Related Stories */}
            {relatedStories.length > 0 && (
                <section className="py-16 bg-neutral-50">
                    <Container>
                        <div className="text-center mb-12">
                            <Typography variant="h2" className="text-3xl font-bold mb-4">More Inspiring Stories</Typography>
                            <Typography variant="body" className="text-neutral-600">
                                Discover more journeys of courage and justice
                            </Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedStories.map((relatedStory) => (
                                <SuccessStoryCard
                                    key={relatedStory._id}
                                    story={relatedStory}
                                    linkTo={`/stories/${relatedStory._id}`}
                                />
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/heroes">
                                <Button variant="outline" size="lg">
                                    View All Success Stories
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </Container>
                </section>
            )}
        </Layout>
    );
};

export default StoryDetail;
