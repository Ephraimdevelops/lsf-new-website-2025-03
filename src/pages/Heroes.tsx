import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import SuccessStoryCard from '../components/shared/SuccessStoryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Heart, Users, Scale, Crown, ArrowRight, Quote, MapPin, Calendar, Award, CheckCircle, Star, Briefcase, GraduationCap, Target, Phone, MessageSquare, Shield } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


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

const successStories = [
  {
    id: 'story-2',
    name: 'Joseph Mwalimu',
    location: 'Mwanza',
    category: 'Employment Rights',
    title: 'Fighting Workplace Discrimination',
    story: 'Joseph was unfairly dismissed from his teaching position due to his disability. LSF represented him in court, resulting in reinstatement and compensation for lost wages.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2024',
    impact: 'High',
    tags: ['Disability Rights', 'Employment Law', 'Anti-Discrimination'],
    quote: 'Joseph was unfairly dismissed from his teaching position due to his disability. LSF represented him in court, resulting in reinstatement and compensation for lost wages.',
    brief: 'Joseph was a dedicated teacher for over 10 years when he was unfairly dismissed due to his disability. LSF provided legal representation that not only restored his position but also led to policy changes protecting disabled workers.'
  },
  {
    id: 'story-3',
    name: 'Grace Kimani',
    location: 'Arusha',
    category: 'Gender-Based Violence',
    title: 'Breaking the Cycle of Violence',
    story: 'Grace escaped an abusive marriage with LSF\'s assistance. We helped her obtain a restraining order, secure custody of her children, and access counseling services.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2023',
    impact: 'Life-Saving',
    tags: ['GBV Protection', 'Family Law', 'Economic Empowerment'],
    quote: 'Grace escaped an abusive marriage with LSF\'s assistance. We helped her obtain a restraining order, secure custody of her children, and access counseling services.',
    brief: 'Grace endured years of domestic violence before finding the courage to seek help. LSF provided comprehensive support including legal aid, counseling, and economic empowerment training.'
  },
  {
    id: 'story-5',
    name: 'Fatuma Ali',
    location: 'Mbeya',
    category: 'Child Rights',
    title: 'Education Rights for Every Child',
    story: 'When Fatuma\'s daughter was denied school admission due to lack of birth certificate, LSF helped secure legal documentation and fought for her right to education.',
    outcome: 'Birth certificate obtained, school admission secured, scholarship awarded',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2024',
    impact: 'Educational',
    tags: ['Child Rights', 'Education Access', 'Documentation'],
    quote: 'When Fatuma\'s daughter was denied school admission due to lack of birth certificate, LSF helped secure legal documentation and fought for her right to education.',
    brief: 'Fatuma\'s daughter was denied education because she lacked a birth certificate. LSF helped navigate the bureaucratic process and ensured her daughter\'s right to education was protected.'
  },
  {
    id: 'story-6',
    name: 'Emmanuel Ndege',
    location: 'Kilimanjaro',
    category: 'Environmental Justice',
    title: 'Protecting Community Resources',
    story: 'Emmanuel led his community in fighting illegal mining that threatened their water supply. LSF provided legal representation that resulted in mine closure and environmental restoration.',
    outcome: 'Mining operations stopped, water supply restored, community compensation',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2023',
    impact: 'Environmental',
    tags: ['Environmental Law', 'Community Rights', 'Natural Resources'],
    quote: 'Emmanuel led his community in fighting illegal mining that threatened their water supply. LSF provided legal representation that resulted in mine closure and environmental restoration.',
    brief: 'When illegal mining operations threatened the community\'s water source, Emmanuel organized resistance. LSF provided legal expertise that successfully shut down the illegal operations.'
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Life-Saving': return 'bg-red-100 text-red-800 border-red-200';
    case 'Life-Changing': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'High': return 'bg-green-100 text-green-800 border-green-200';
    case 'Educational': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Environmental': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Heroes = () => {
  return (
    <Layout>
      {/* Hero Section */}
    {/* Heroes Section */}
<section className="relative">
  <div className="relative h-[90vh] overflow-hidden">
    {/* Sliding background images */}
    <Slider
      autoplay
      autoplaySpeed={4000}
      infinite
      fade
      arrows={false}
      pauseOnHover={false}
      speed={1000}
      className="absolute inset-0"
    >
      {[
        "/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png",
        "/lovable-uploads/second-hero-image.jpg",
        "/lovable-uploads/third-hero-image.jpg"
      ].map((img, idx) => (
        <div key={idx} className="h-[90vh]">
          <img
            src={img}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </Slider>

    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"></div>

    <Container size="xl" className="relative z-10 h-full flex items-center">
      <div className="max-w-4xl text-white drop-shadow-lg">

        {/* Icon */}
        <div className="mb-8">
          <div className="bg-secondary-orange/20 p-6 rounded-full backdrop-blur-sm border border-secondary-orange/30 shadow-lg shadow-secondary-orange/40 inline-flex">
            <Crown className="h-08 w-08 text-secondary-orange drop-shadow-md" />
          </div>
        </div>
        {/* Title */}
        <Typography
          variant="h1"
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
        >
          Our
          <br />
          <span className="text-secondary-orange drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Heroes
          </span>
        </Typography>

        {/* Description */}
        <Typography
          variant="body"
          className="text-xl md:text-2xl mb-12 max-w-3xl text-white/90 leading-relaxed drop-shadow-md"
        >
          Meet the brave individuals whose lives have been transformed through
          access to justice. These are stories of courage, resilience, and the
          power of legal empowerment to change lives.
        </Typography>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            size="lg"
            className="bg-secondary-orange hover:bg-secondary-orange/90 text-xl px-8 py-4 shadow-lg shadow-secondary-orange/40"
          >
            <MessageSquare className="mr-3 h-6 w-6" />
            Submit Report Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-primary text-xl px-8 py-4 shadow-lg shadow-black/40"
          >
            <Phone className="mr-3 h-6 w-6" />
            Get Legal Help
          </Button>
        </div>
      </div>
    </Container>
  </div>
</section>



      {/* Success Stories Grid - Using new card design with reduced height */}
      <section className="py-16 bg-white">
      <Container>
      <div className="flex flex-col items-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-3">
            <Target className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm uppercase tracking-wider text-neutral-900">
              Our Heroes
            </span>
          </div>
          
          <Typography variant="h1" className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight text-center">
            Stories of <br className="block md:hidden" />
            <span className="text-primary">Transformation.</span>
          </Typography>
          
          <Typography variant="body" className="text-lg text-neutral-600 max-w-3xl leading-relaxed text-center">
            Behind every legal victory is a human story of courage, determination, and hope. These are the heroes who refused to give up on justice.
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {successStories.map((story) => (
            <SuccessStoryCard 
              key={story.id} 
              story={story} 
              linkTo={`/heroes/${story.id}`}
            />
          ))}
        </div>
      </Container>
      </section >

      {/* Impact Statistics */}
      <section className="bg-neutral-dark text-white overflow-hidden py-16">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight text-centermb-6">Real Impact, Real Lives</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Every number represents a life changed, a family protected, and a community strengthened through access to justice.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                    {stat.icon}
                  </div>
                  <Typography variant="h1" className="text-primary font-black mb-2">
                    {stat.number}
                  </Typography>
                  <Typography variant="h4" className="font-semibold mb-2">
                    {stat.label}
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Heroes;