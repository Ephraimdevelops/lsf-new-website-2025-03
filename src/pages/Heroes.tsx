
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Users, ArrowRight, Quote, MapPin, Calendar, Heart, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Card } from '@/components/ui/card';

interface Story {
  id: string;
  name: string;
  location: string;
  image: string;
  quote: string;
  category: string;
  brief: string;
  date: string;
}

const featuredStories: Story[] = [
  {
    id: "mariam-hassan",
    name: "Mariam Hassan",
    location: "Dar es Salaam",
    image: "https://images.unsplash.com/photo-1539701938214-0d9d0e8ab606?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "With LSF's paralegal support, I reclaimed my family land that was illegally taken after my husband passed away.",
    category: "Land Rights",
    brief: "After Mariam's husband died, her in-laws attempted to evict her from her home. With support from a local paralegal trained by LSF, she was able to assert her legal rights and maintain ownership of her family's property.",
    date: "March 2024"
  },
  {
    id: "joseph-mkwawa",
    name: "Joseph Mkwawa",
    location: "Mbeya",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "The mobile legal clinic in our village helped me understand my rights as a small business owner and resolve a longstanding dispute.",
    category: "Business Rights",
    brief: "Joseph's small carpentry workshop was threatened when a local official demanded illegal payments. With guidance from an LSF-supported legal aid provider, Joseph learned about business regulations and successfully challenged the corrupt demands.",
    date: "February 2024"
  },
  {
    id: "neema-urio",
    name: "Neema Urio",
    location: "Arusha",
    image: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "After attending legal education sessions, I now lead a women's group that advocates for our community's rights and supports other women.",
    category: "Women's Empowerment",
    brief: "Inspired by LSF's legal empowerment workshops, Neema formed a women's advocacy group in her community. The group provides peer support and connects women with paralegals when they face legal challenges.",
    date: "January 2024"
  }
];

const allStories: Story[] = [
  ...featuredStories,
  {
    id: "emmanuel-masaki",
    name: "Emmanuel Masaki",
    location: "Dodoma",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "The Haki Yangu app helped me find a paralegal who resolved my employment dispute without having to travel to the city.",
    category: "Labor Rights",
    brief: "When Emmanuel was unfairly dismissed without severance pay, he used the Haki Yangu app to connect with a paralegal who mediated the dispute, resulting in fair compensation from his former employer.",
    date: "December 2023"
  },
  {
    id: "grace-mwenda",
    name: "Grace Mwenda",
    location: "Mwanza",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "Legal education helped me understand my inheritance rights and secure my children's future.",
    category: "Legal Empowerment",
    brief: "Grace was able to claim her rightful inheritance after her husband's death, ensuring her children could continue their education.",
    date: "November 2023"
  },
  {
    id: "daniel-kibwana",
    name: "Daniel Kibwana",
    location: "Kigoma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quote: "Community mediation helped resolve our village's water rights dispute peacefully.",
    category: "Community Resolution",
    brief: "A long-standing water access dispute between two villages was resolved through community mediation facilitated by LSF-trained paralegals.",
    date: "October 2023"
  }
];

const storyCategories = [
  { name: "All Stories", value: "all" },
  { name: "Land Rights", value: "Land Rights" },
  { name: "Women's Empowerment", value: "Women's Empowerment" },
  { name: "Business Rights", value: "Business Rights" },
  { name: "Labor Rights", value: "Labor Rights" },
  { name: "Legal Empowerment", value: "Legal Empowerment" },
  { name: "Community Resolution", value: "Community Resolution" }
];

const Heroes = () => {
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredStories = selectedCategory === "all" 
    ? allStories 
    : allStories.filter(story => story.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section with Background */}
      <HeroSection
        icon={<Heart className="h-8 w-8" />}
        badge="Impact Stories"
        title="Success Stories"
        description="Discover how access to justice transforms lives across Tanzania. Every story represents hope, resilience, and positive change."
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Category Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <Container>
          <div className="py-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <Typography variant="h4" className="text-lg font-semibold text-neutral-900">
                Filter by Category
              </Typography>
            </div>
            <div className="flex flex-wrap gap-2">
              {storyCategories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? "bg-primary text-white hover:bg-primary-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Media Centre Banner */}
      <section className="bg-neutral-50 py-12 border-b border-gray-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <Typography variant="body" className="text-neutral-900 font-medium mb-4 md:mb-0">
              EVERY STORY REPRESENTS A LIFE TRANSFORMED THROUGH ACCESS TO JUSTICE.
            </Typography>
            <Link to="/legal-help">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-wide font-medium rounded-none"
              >
                GET LEGAL HELP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Featured Story */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="w-12 h-1 bg-primary mb-4"></div>
              <Typography variant="h1" className="text-4xl font-bold text-neutral-900 uppercase tracking-wide">
                FEATURED STORY
              </Typography>
            </div>
          </div>
          
          <Card className="overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className="lg:col-span-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={featuredStories[currentFeatured].image} 
                    alt={featuredStories[currentFeatured].name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              
              <div className="lg:col-span-2 p-8 space-y-6">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">{featuredStories[currentFeatured].date}</span>
                  <span className="bg-primary text-white px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full">
                    {featuredStories[currentFeatured].category}
                  </span>
                </div>
                
                <Typography 
                  variant="h2" 
                  className="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight uppercase"
                >
                  {featuredStories[currentFeatured].name}
                </Typography>
                
                <div className="flex items-center text-neutral-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{featuredStories[currentFeatured].location}</span>
                </div>
                
                <blockquote className="border-l-4 border-primary pl-6 bg-gray-50 py-4 rounded-r-lg">
                  <Typography variant="body" className="text-lg italic text-neutral-800 leading-relaxed">
                    "{featuredStories[currentFeatured].quote}"
                  </Typography>
                </blockquote>
                
                <Typography variant="body" className="text-neutral-700 leading-relaxed">
                  {featuredStories[currentFeatured].brief}
                </Typography>
                
                <Link to={`/heroes/${featuredStories[currentFeatured].id}`}>
                  <Button 
                    className="bg-primary hover:bg-primary-600 text-white uppercase tracking-wide font-medium rounded-none"
                  >
                    READ FULL STORY
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      {/* All Stories Grid */}
      <section className="py-16 bg-neutral-50">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="w-12 h-1 bg-primary mb-4"></div>
              <Typography variant="h2" className="text-3xl font-bold text-neutral-900 uppercase tracking-wide">
                {selectedCategory === "all" ? "ALL SUCCESS STORIES" : `${selectedCategory.toUpperCase()} STORIES`}
              </Typography>
              <Typography variant="body" className="text-gray-600 mt-2">
                Showing {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
              </Typography>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story, index) => (
              <Link key={story.id} to={`/heroes/${story.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-90"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full">
                        {story.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Typography variant="h3" className="text-white font-bold text-xl mb-1">
                        {story.name}
                      </Typography>
                      <div className="flex items-center text-white/80 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {story.date}
                    </div>
                    
                    <blockquote className="flex items-start">
                      <Quote className="h-5 w-5 text-primary/30 mr-2 flex-shrink-0 mt-1" />
                      <Typography variant="body" className="italic text-neutral-700 text-sm leading-relaxed">
                        "{story.quote}"
                      </Typography>
                    </blockquote>
                    
                    <div className="flex items-center text-primary font-medium uppercase tracking-wide text-sm group-hover:underline pt-2">
                      READ FULL STORY
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <Typography variant="h3" className="text-gray-500 mb-4">
                No stories found in this category
              </Typography>
              <Button 
                onClick={() => setSelectedCategory("all")}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                View All Stories
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <Container>
          <div className="text-center">
            <Typography variant="h2" className="text-3xl font-bold mb-6 uppercase tracking-wide">
              BE PART OF THE CHANGE
            </Typography>
            <Typography variant="body" className="text-xl mb-8 max-w-2xl mx-auto">
              Every story you've read started with someone taking the first step. 
              If you need legal help, we're here for you.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/legal-help">
                <Button className="bg-white text-primary hover:bg-neutral-100 font-medium px-8 py-3 rounded-none uppercase tracking-wide">
                  GET LEGAL HELP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary font-medium px-8 py-3 rounded-none uppercase tracking-wide"
                >
                  SUPPORT OUR WORK
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default Heroes;
