
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { Users, ArrowRight, Quote, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

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

const Heroes = () => {
  const [activeTab, setActiveTab] = useState('featured');

  return (
    <Layout>
      <HeroSection
        icon={<Users className="h-12 w-12" />}
        badge="Success Stories"
        title="Our Heroes"
        description="Meet the inspiring individuals whose lives have been transformed through our legal empowerment programs"
      />
      
      {/* Featured Stories Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-panton">Featured Stories</h2>
            <p className="text-xl text-neutral-gray font-calibri max-w-2xl mx-auto">
              Discover how legal empowerment is changing lives across Tanzania
            </p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {featuredStories.map((story) => (
                <CarouselItem key={story.id}>
                  <Link to={`/heroes/${story.id}`} className="block group">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                      <div className="h-80 lg:h-96 overflow-hidden">
                        <img 
                          src={story.image} 
                          alt={story.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-4">
                          <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full font-calibri">
                            {story.category}
                          </span>
                          <div className="flex items-center mt-2 text-neutral-gray text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            {story.date}
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-4 font-panton text-neutral-dark">
                          {story.name}
                        </h3>
                        <div className="flex items-center mb-4 text-neutral-gray">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="font-calibri">{story.location}</span>
                        </div>
                        <div className="flex items-start mb-6">
                          <Quote className="h-6 w-6 text-primary/30 mr-3 flex-shrink-0 mt-1" />
                          <p className="text-lg italic text-neutral-dark font-calibri leading-relaxed">
                            "{story.quote}"
                          </p>
                        </div>
                        <span className="inline-flex items-center text-primary font-medium font-calibri group-hover:underline">
                          Read Full Story
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2" />
            <CarouselNext className="absolute right-4 top-1/2" />
          </Carousel>
        </div>
      </section>

      {/* All Stories Grid */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 font-panton">All Success Stories</h2>
            <p className="text-xl text-neutral-gray font-calibri">
              Every story represents a life transformed through access to justice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allStories.map((story) => (
              <Link 
                key={story.id}
                to={`/heroes/${story.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="relative h-64">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                        {story.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <h3 className="font-bold text-xl text-white font-panton">{story.name}</h3>
                      <div className="flex items-center text-white/80 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <Quote className="h-6 w-6 text-primary/20 mr-2 flex-shrink-0 mt-1" />
                      <p className="text-neutral-dark italic font-calibri">"{story.quote}"</p>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <span className="text-primary font-medium group-hover:underline flex items-center font-calibri">
                        Read Full Story
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 font-panton">Be Part of the Change</h2>
          <p className="text-xl mb-8 font-calibri max-w-2xl mx-auto">
            Every story you've read started with someone taking the first step. 
            If you need legal help, we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/legal-help">
              <Button className="bg-white text-primary hover:bg-neutral-light font-calibri text-lg px-8 py-6 h-auto">
                Get Legal Help
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-calibri text-lg px-8 py-6 h-auto">
                Support Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Heroes;
