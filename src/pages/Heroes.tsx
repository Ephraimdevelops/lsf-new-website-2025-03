import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Layout from '../components/layout/Layout';
import HeroesPageHero from '../components/heroes/HeroesPageHero';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import SuccessStoryCard from '../components/shared/SuccessStoryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Heart, Users, Scale, ArrowRight, MapPin, Award, CheckCircle, Star, Briefcase, GraduationCap, Target } from 'lucide-react';

const impactStats = [
  {
    icon: <Users className="h-8 w-8" />,
    number: "75,000+",
    label: "Lives Transformed",
    description: "Individuals who received life-changing legal assistance"
  },
  {
    icon: <Scale className="h-8 w-8" />,
    number: "89%",
    label: "Success Rate",
    description: "Cases resolved successfully in favor of our clients"
  },
  {
    icon: <Heart className="h-8 w-8" />,
    number: "2,500+",
    label: "Families Reunited",
    description: "Families brought together through our legal interventions"
  },
  {
    icon: <Award className="h-8 w-8" />,
    number: "156",
    label: "Awards & Recognition",
    description: "Recognition for outstanding legal advocacy work"
  }
];



const Heroes = () => {
  // Fetch stories from Convex
  const stories = useQuery(api.stories.get) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroesPageHero />



      {/* Success Stories Grid - Premium Donor-Focused Design */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white via-neutral-50/50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col items-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-bold text-sm uppercase tracking-widest text-primary">
                Real Stories of Impact
              </span>
            </div>

            <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight text-center tracking-tight">
              Lives Changed.
              <br />
              <span className="text-primary">
                Justice Delivered.
              </span>
            </Typography>

            <Typography variant="body" className="text-lg md:text-xl text-neutral-600 max-w-3xl leading-relaxed text-center">
              Every story represents a family reunited, a community empowered, and the transformative power of legal aid reaching those who need it most.
            </Typography>
          </div>

          {/* Story Cards Grid - 3 columns for impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <SuccessStoryCard
                key={story._id}
                story={story}
                linkTo={`/stories/${story._id}`}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Typography variant="body" className="text-neutral-600 mb-6">
              Your support makes these stories possible.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105">
                <Heart className="mr-2 h-5 w-5" />
                Support Our Mission
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary font-bold px-10 py-4 rounded-full transition-all duration-300">
                Read All Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics - Premium Dark Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-neutral-900 via-primary-dark to-neutral-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-teal/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full mb-8">
              <Award className="h-5 w-5 text-secondary-orange" />
              <span className="font-bold text-sm uppercase tracking-widest text-white/90">
                Proven Impact
              </span>
            </div>

            <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Real Impact.
              <br />
              <span className="text-secondary-orange">
                Real Lives Changed.
              </span>
            </Typography>

            <Typography variant="body" className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Every number represents a life changed, a family protected, and a community strengthened through access to justice.
            </Typography>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center hover:from-white/15 hover:to-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                {/* Subtle gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

                {/* Icon */}
                <div className="w-18 h-18 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <div className="text-white p-4">
                    {stat.icon}
                  </div>
                </div>

                {/* Number - enhanced contrast */}
                <Typography variant="h1" className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
                  {stat.number}
                </Typography>

                {/* Label */}
                <Typography variant="h4" className="font-bold text-white text-lg mb-3">
                  {stat.label}
                </Typography>

                {/* Description - improved readability */}
                <Typography variant="bodySmall" className="text-white/80 leading-relaxed">
                  {stat.description}
                </Typography>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <Typography variant="body" className="text-center text-white/50 text-sm uppercase tracking-widest mb-8">
              Trusted by Leading Organizations
            </Typography>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              <img src="/lovable-uploads/28d292f2-ef17-4f1a-b33b-a06f39dec3ea.png" alt="Partner" className="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png" alt="Partner" className="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="/lovable-uploads/d0aa1db9-f1b6-4c1a-a98f-1d5b6f106317.png" alt="Partner" className="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Heroes;