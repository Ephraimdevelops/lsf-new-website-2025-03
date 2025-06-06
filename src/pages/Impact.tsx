
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { TrendingUp, Users, Scale, Target, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const impactStats = [
  {
    icon: <Users className="h-8 w-8" />,
    number: "50,000+",
    label: "People Reached",
    description: "Legal aid beneficiaries across Tanzania"
  },
  {
    icon: <Scale className="h-8 w-8" />,
    number: "1,200",
    label: "Cases Resolved",
    description: "Successful legal interventions"
  },
  {
    icon: <Target className="h-8 w-8" />,
    number: "184",
    label: "Districts",
    description: "Coverage across all districts"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    number: "85%",
    label: "Success Rate",
    description: "Favorable case outcomes"
  }
];

const impactStories = [
  {
    id: '1',
    title: 'Community Legal Education Program',
    location: 'Mwanza Region',
    date: '2023-2024',
    impact: '5,000 community members trained',
    description: 'Established community paralegal networks that have empowered local communities with legal knowledge and skills.',
    image: '/lovable-uploads/background with mother umage .png'
  },
  {
    id: '2',
    title: 'Mobile Legal Clinics Initiative',
    location: 'Rural Districts',
    date: '2023',
    impact: '12,000 people served',
    description: 'Brought legal services directly to remote communities, addressing land disputes and family law matters.',
    image: '/lovable-uploads/background with mother umage .png'
  },
  {
    id: '3',
    title: 'Women\'s Rights Advocacy',
    location: 'Dar es Salaam',
    date: '2022-2023',
    impact: '800 women supported',
    description: 'Provided legal support and advocacy for women facing domestic violence and property rights issues.',
    image: '/lovable-uploads/background with mother umage .png'
  }
];

const Impact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        icon={<TrendingUp className="h-8 w-8" />}
        badge="Our Impact"
        title="Measuring Justice"
        description="Discover the tangible difference we're making in communities across Tanzania through data-driven impact and real stories of transformation."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Impact Statistics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Impact by Numbers</h2>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
              Our commitment to access to justice is reflected in the measurable outcomes we achieve every year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-2">{stat.number}</h3>
                  <h4 className="text-lg font-semibold mb-2">{stat.label}</h4>
                  <p className="text-neutral-gray text-sm">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stories of Change</h2>
            <p className="text-xl text-neutral-gray max-w-2xl mx-auto">
              Behind every statistic is a real story of transformation and justice achieved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{story.title}</CardTitle>
                  <div className="flex items-center text-sm text-neutral-gray space-x-4">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {story.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {story.date}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                    {story.impact}
                  </div>
                  <p className="text-neutral-gray leading-relaxed">{story.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/heroes">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary-teal">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of Our Impact</h2>
            <p className="text-xl opacity-90 mb-8">
              Join us in creating lasting change and expanding access to justice across Tanzania.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Support Our Work
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90">
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Impact;
