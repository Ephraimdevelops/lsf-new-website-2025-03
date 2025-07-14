import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Typography from '@/components/shared/Typography';
import { ArrowRight, Heart, Scale, Users } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      title: "Empowering Rural Women Through Legal Knowledge",
      summary: "How our legal literacy program transformed lives in remote villages",
      impact: "500+ women empowered",
      category: "Gender Justice",
      image: "/lovable-uploads/2fad14c5-c506-4c5b-8fd7-3e97e956e966.png",
      icon: Heart,
      location: "Mwanza Region"
    },
    {
      id: 2,
      title: "Fighting for Fair Land Rights",
      summary: "Community mobilization leads to landmark policy changes",
      impact: "1,200 families protected",
      category: "Land Rights",
      image: "/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png",
      icon: Scale,
      location: "Dodoma Region"
    },
    {
      id: 3,
      title: "Access to Justice for All",
      summary: "Mobile legal clinics bring services to underserved communities",
      impact: "3,000+ cases resolved",
      category: "Legal Aid",
      image: "/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png",
      icon: Users,
      location: "Dar es Salaam"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Typography variant="h1" className="mb-6">
                Stories of Change
              </Typography>
              <Typography variant="body" className="text-muted-foreground">
                Real impact, real stories. See how our work transforms communities
                and advances justice across Tanzania.
              </Typography>
            </div>
          </div>
        </section>

        {/* Success Stories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => {
                const IconComponent = story.icon;
                return (
                  <Card key={story.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-primary">
                          {story.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-primary/90 p-2 rounded-full">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <Typography variant="h3" className="mb-3 group-hover:text-primary transition-colors">
                        {story.title}
                      </Typography>
                      
                      <Typography variant="body" className="text-muted-foreground mb-4">
                        {story.summary}
                      </Typography>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Impact:</span>
                          <span className="text-sm font-medium text-primary">{story.impact}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Location:</span>
                          <span className="text-sm font-medium">{story.location}</span>
                        </div>
                      </div>
                      
                      <button className="flex items-center text-primary hover:text-primary/80 transition-colors group">
                        <span className="text-sm font-medium">Read Full Story</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <Typography variant="h2" className="mb-4">
              Share Your Story
            </Typography>
            <Typography variant="body" className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have you been impacted by our work? We'd love to hear from you and share your story.
            </Typography>
            <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SuccessStories;