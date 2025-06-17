
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, MapPin, Calendar } from 'lucide-react';
import Typography from '@/components/shared/Typography';
import Section from '@/components/shared/Section';
import Container from '@/components/shared/Container';
import Card from '@/components/shared/Card';
import { Button } from '@/components/ui/button';

const SuccessStoriesSection = () => {
  const successStories = [
    {
      title: "Maria's Land Rights Victory",
      location: "Mwanza Region",
      date: "2024",
      story: "Through our paralegal training program, Maria successfully defended her land rights against illegal seizure, setting a precedent for women's property rights in her community.",
      impact: "200+ women in the community now have secure land tenure",
      category: "Land Rights",
      image: "https://images.unsplash.com/photo-1594736797933-d0301ba94442?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-orange to-secondary-orange/80"
    },
    {
      title: "Community Legal Aid Center Success",
      location: "Dodoma Region",
      date: "2023-2024",
      story: "Our capacity building support helped establish a community legal aid center that has resolved over 500 cases in its first year of operation.",
      impact: "78% case resolution rate, serving 5 villages",
      category: "Capacity Building",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=faces",
      color: "from-secondary-teal to-secondary-teal/80"
    },
    {
      title: "Legal Aid Act Implementation",
      location: "National Level",
      date: "2017-2024",
      story: "LSF led advocacy efforts resulted in the Legal Aid Act becoming law, establishing a framework for coordinated legal aid services across Tanzania.",
      impact: "National legal aid framework benefiting millions",
      category: "Policy Advocacy",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces",
      color: "from-primary to-primary-dark"
    }
  ];

  return (
    <Section variant="default" padding="xl">
      <Container size="xl">
        <div className="text-center mb-16">
          <Typography variant="overline" className="text-primary font-bold mb-4">
            SUCCESS STORIES
          </Typography>
          <Typography variant="h2" className="mb-6">
            Real Impact,
            <span className="block text-primary">Real Lives Changed</span>
          </Typography>
          <Typography variant="body" className="text-neutral-gray max-w-3xl mx-auto">
            Every statistic represents a life transformed, a community empowered, and justice served. 
            Here are some of the stories that drive our mission forward.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {successStories.map((story, index) => (
            <Card key={index} variant="elevated" hover className="group overflow-hidden">
              <div className="relative">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-48 object-cover rounded-t-2xl -m-8 mb-6"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${story.color} opacity-80 rounded-t-2xl -m-8 mb-6`}></div>
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Typography variant="small" className="text-white font-medium">
                    {story.category}
                  </Typography>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-neutral-gray">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {story.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {story.date}
                  </div>
                </div>
                
                <Typography variant="h4" className="group-hover:text-primary transition-colors">
                  {story.title}
                </Typography>
                
                <div className="relative">
                  <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
                  <Typography variant="body" className="text-neutral-gray italic pl-6">
                    {story.story}
                  </Typography>
                </div>
                
                <div className="bg-gradient-to-r from-primary/5 to-secondary-teal/5 rounded-lg p-4">
                  <Typography variant="bodySmall" className="font-semibold text-primary mb-1">
                    Impact Achieved:
                  </Typography>
                  <Typography variant="bodySmall" className="text-neutral-gray">
                    {story.impact}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/impact">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All Success Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default SuccessStoriesSection;
