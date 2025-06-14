
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Heart, Scale, Eye, PlayCircle } from 'lucide-react';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const impactStories = [
  {
    id: 1,
    title: 'Empowering Women Through Legal Education',
    location: 'Mwanza Region',
    image: '/lovable-uploads/0061b566-21e8-4b27-9bdc-9fa464f0b580.png',
    description: 'Community workshops have reached over 5,000 women, teaching them about their land rights and legal protections.',
    category: 'Women\'s Rights',
    beneficiaries: '5,247',
    hasVideo: true
  },
  {
    id: 2,
    title: 'Mobile Legal Clinics Reach Remote Villages',
    location: 'Dodoma Region',
    image: '/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png',
    description: 'Our mobile clinics bring justice directly to communities that have never had access to legal services.',
    category: 'Access to Justice',
    beneficiaries: '12,350',
    hasVideo: false
  },
  {
    id: 3,
    title: 'Youth Advocacy Training Programs',
    location: 'Dar es Salaam',
    image: '/lovable-uploads/97ffee5d-3957-47c9-820d-9c74a1766fa5.png',
    description: 'Training the next generation of legal advocates to champion justice in their communities.',
    category: 'Capacity Building',
    beneficiaries: '3,156',
    hasVideo: true
  },
  {
    id: 4,
    title: 'Digital Innovation for Rural Communities',
    location: 'Arusha Region',
    image: '/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png',
    description: 'Haki Yangu App connects remote communities with paralegals through innovative technology.',
    category: 'Digital Innovation',
    beneficiaries: '8,942',
    hasVideo: false
  }
];

const VisualImpactSection = () => {
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-white via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-teal/5 rounded-full blur-3xl"></div>
      </div>

      <Container size="xl" className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary-teal/10 rounded-full px-8 py-4 mb-8">
            <Heart className="h-6 w-6 mr-3 text-primary" />
            <Typography variant="overline" className="text-primary font-bold text-lg tracking-wider">
              STORIES OF IMPACT
            </Typography>
          </div>
          <Typography variant="display" className="mb-8 font-heading text-6xl lg:text-7xl">
            Real People.
            <span className="block text-secondary-orange">Real Change.</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-4xl mx-auto text-2xl leading-relaxed">
            See how our work transforms lives across Tanzania, from bustling cities to remote villages.
          </Typography>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Large Featured Story */}
          <div className="lg:col-span-8">
            <div 
              className="group relative h-[600px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer"
              onMouseEnter={() => setHoveredStory(impactStories[0].id)}
              onMouseLeave={() => setHoveredStory(null)}
            >
              <img 
                src={impactStories[0].image}
                alt={impactStories[0].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Multi-layer overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-secondary-orange text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider">
                    {impactStories[0].category}
                  </span>
                  {impactStories[0].hasVideo && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-4 text-white/90">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{impactStories[0].location}</span>
                </div>
                
                <Typography variant="h1" className="text-white mb-4 text-4xl lg:text-5xl">
                  {impactStories[0].title}
                </Typography>
                
                <Typography variant="body" className="text-white/90 mb-6 text-xl leading-relaxed max-w-2xl">
                  {impactStories[0].description}
                </Typography>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-secondary-teal">
                    <Users className="h-6 w-6" />
                    <span className="text-2xl font-bold">{impactStories[0].beneficiaries}</span>
                    <span className="text-lg">People Helped</span>
                  </div>
                  
                  <Link 
                    to={`/impact/story/${impactStories[0].id}`}
                    className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all duration-300 flex items-center gap-3 shadow-lg"
                  >
                    Read Full Story
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Smaller Stories Grid */}
          <div className="lg:col-span-4 space-y-8">
            {impactStories.slice(1, 3).map((story) => (
              <div 
                key={story.id}
                className="group relative h-[280px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onMouseEnter={() => setHoveredStory(story.id)}
                onMouseLeave={() => setHoveredStory(null)}
              >
                <img 
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-secondary-teal text-white px-4 py-2 rounded-full text-xs font-bold uppercase">
                      {story.category}
                    </span>
                    {story.hasVideo && (
                      <PlayCircle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2 text-white/80 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{story.location}</span>
                  </div>
                  
                  <Typography variant="h4" className="text-white mb-2 text-lg leading-tight">
                    {story.title}
                  </Typography>
                  
                  <div className="flex items-center gap-2 text-secondary-teal text-sm">
                    <Users className="h-4 w-4" />
                    <span className="font-bold">{story.beneficiaries}</span>
                    <span>helped</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Full Width Story */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div 
              className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onMouseEnter={() => setHoveredStory(impactStories[3].id)}
              onMouseLeave={() => setHoveredStory(null)}
            >
              <img 
                src={impactStories[3].image}
                alt={impactStories[3].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <span className="bg-primary text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider mb-6 self-start">
                  {impactStories[3].category}
                </span>
                
                <Typography variant="h2" className="text-white mb-4 text-3xl lg:text-4xl">
                  {impactStories[3].title}
                </Typography>
                
                <Typography variant="body" className="text-white/90 mb-6 text-lg leading-relaxed max-w-lg">
                  {impactStories[3].description}
                </Typography>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-secondary-orange">
                    <Users className="h-5 w-5" />
                    <span className="text-xl font-bold">{impactStories[3].beneficiaries}</span>
                    <span>People Helped</span>
                  </div>
                  
                  <Link 
                    to={`/impact/story/${impactStories[3].id}`}
                    className="text-white hover:text-secondary-orange transition-colors font-bold flex items-center gap-2"
                  >
                    <Eye className="h-5 w-5" />
                    View Story
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="bg-gradient-to-br from-primary via-primary-dark to-black rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white shadow-2xl">
            <div className="bg-secondary-orange/20 rounded-full p-6 mb-6">
              <Heart className="h-12 w-12 text-secondary-orange" />
            </div>
            
            <Typography variant="h3" className="mb-4 text-2xl">
              Join Our Impact
            </Typography>
            
            <Typography variant="body" className="text-white/90 mb-8 leading-relaxed">
              Be part of creating these transformative stories across Tanzania.
            </Typography>
            
            <Link 
              to="/contact"
              className="bg-secondary-orange hover:bg-secondary-orange/90 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Involved
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default VisualImpactSection;
