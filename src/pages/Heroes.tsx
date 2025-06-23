import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import Container from '../components/shared/Container';
import Typography from '../components/shared/Typography';
import SuccessStoryCard from '../components/shared/SuccessStoryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Scale, ArrowRight, Quote, MapPin, Calendar, Award, CheckCircle, Star, Briefcase, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    id: 'story-1',
    name: 'Amina Hassan',
    location: 'Dar es Salaam',
    category: 'Land Rights',
    title: 'Securing Her Family\'s Future',
    story: 'After her husband\'s death, Amina faced eviction from her family home. With LSF\'s help, she successfully defended her inheritance rights and secured land titles for her three children.',
    outcome: 'Family home secured, children\'s education funded through property rights',
    image: 'https://images.unsplash.com/photo-1494790108755-2616c82ca017?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2024',
    impact: 'High',
    tags: ['Women\'s Rights', 'Property Law', 'Family Protection'],
    quote: 'After her husband\'s death, Amina faced eviction from her family home. With LSF\'s help, she successfully defended her inheritance rights and secured land titles for her three children.',
    brief: 'After Amina\'s husband passed away, her in-laws attempted to evict her from her ancestral home. With guidance from an LSF-trained paralegal, Amina learned about women\'s inheritance rights and successfully retained her home.'
  },
  {
    id: 'story-2',
    name: 'Joseph Mwalimu',
    location: 'Mwanza',
    category: 'Employment Rights',
    title: 'Fighting Workplace Discrimination',
    story: 'Joseph was unfairly dismissed from his teaching position due to his disability. LSF represented him in court, resulting in reinstatement and compensation for lost wages.',
    outcome: 'Reinstated to position, received 18 months back pay, policy changes implemented',
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
    outcome: 'Safety secured, full custody granted, launched successful small business',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2023',
    impact: 'Life-Saving',
    tags: ['GBV Protection', 'Family Law', 'Economic Empowerment'],
    quote: 'Grace escaped an abusive marriage with LSF\'s assistance. We helped her obtain a restraining order, secure custody of her children, and access counseling services.',
    brief: 'Grace endured years of domestic violence before finding the courage to seek help. LSF provided comprehensive support including legal aid, counseling, and economic empowerment training.'
  },
  {
    id: 'story-4',
    name: 'David Msigwa',
    location: 'Dodoma',
    category: 'Criminal Defense',
    title: 'Proven Innocent After 3 Years',
    story: 'Wrongfully accused of theft, David spent three years in prison before LSF took his case. New evidence and legal advocacy led to his complete exoneration.',
    outcome: 'Charges dropped, compensation awarded, criminal justice reform advocacy',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    year: '2023',
    impact: 'Life-Changing',
    tags: ['Criminal Justice', 'Wrongful Conviction', 'Legal Reform'],
    quote: 'Wrongfully accused of theft, David spent three years in prison before LSF took his case. New evidence and legal advocacy led to his complete exoneration.',
    brief: 'David was wrongfully convicted based on circumstantial evidence. LSF\'s investigation uncovered new evidence and witness testimony that proved his innocence, leading to his release and compensation.'
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
      <HeroSection
        icon={<Heart className="h-8 w-8" />}
        badge="Success Stories"
        title="Heroes of Justice"
        description="Meet the brave individuals whose lives have been transformed through access to justice. These are stories of courage, resilience, and the power of legal empowerment to change lives."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary-teal/5">
        <Container>
          <div className="text-center mb-12">
            <Typography variant="h2" className="mb-6">Real Impact, Real Lives</Typography>
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

      {/* Success Stories Grid - Using new card design */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-primary mb-4 mx-auto"></div>
            <Typography variant="h2" className="mb-6">Stories of Transformation</Typography>
            <Typography variant="body" className="text-neutral-gray max-w-2xl mx-auto">
              Behind every legal victory is a human story of courage, determination, and hope. These are the heroes who refused to give up on justice.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <SuccessStoryCard 
                key={story.id} 
                story={story} 
                linkTo={`/heroes/${story.id}`}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary/5">
        <Container>
          <div className="text-center">
            <Typography variant="h2" className="mb-6">Your Story Could Be Next</Typography>
            <Typography variant="body" className="text-neutral-gray mb-8 max-w-2xl mx-auto">
              Don't let legal challenges hold you back. Join thousands of Tanzanians who have found justice and transformed their lives with our help.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/legal-help">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Legal Help Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/news">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Read More Stories
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <Typography variant="h2" className="mb-6">Stay Inspired</Typography>
            <Typography variant="body" className="text-neutral-gray mb-8">
              Subscribe to receive regular updates about our impact and new success stories from across Tanzania.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button className="bg-primary hover:bg-primary/90 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Heroes;
