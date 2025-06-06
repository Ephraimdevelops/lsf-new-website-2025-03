
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/shared/HeroSection';
import { ArrowRight, Award, Users, Globe, Landmark, Info, Eye, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InteractiveTimeline from '../components/about/InteractiveTimeline';
import AnimatedStats from '../components/about/AnimatedStats';
import TestimonialCarousel from '../components/about/TestimonialCarousel';
import ImpactHighlight from '../components/home/ImpactHighlight';

interface BoardMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
}

const boardMembers: BoardMember[] = [
  {
    id: '1',
    name: 'Hon. Justice Mary Kimani',
    position: 'Board Chairperson',
    bio: 'Former High Court Judge with 25 years of experience in the judiciary and a strong advocate for access to justice.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    name: 'Prof. David Mwalimu',
    position: 'Vice Chairperson',
    bio: 'Law Professor at University of Dar es Salaam, specializing in human rights law and legal empowerment.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    name: 'Ms. Sarah Ndugu',
    position: 'Secretary',
    bio: 'Civil society leader with extensive experience in community development and women\'s rights advocacy.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '4',
    name: 'Mr. James Mwenda',
    position: 'Treasurer',
    bio: 'Financial expert with 20 years in development finance and organizational management.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section with Background */}
      <HeroSection
        icon={<Info className="h-8 w-8" />}
        badge="Who We Are"
        title="About LSF"
        description="Learn about our mission to increase access to justice for all, in particular for women, through a legal empowerment approach across Tanzania"
        backgroundImage="/lovable-uploads/background with mother umage .png"
      />

      {/* Vision & Mission Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
                Our Foundation
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
                Vision & Mission
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-teal mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group">
                <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-l-8 border-primary">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Eye className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold mb-6 text-neutral-dark">Our Vision</h3>
                    <p className="text-lg text-neutral-gray leading-relaxed">
                      A society that is just, equal, accountable and respects the dignity and rights of all people, particularly women.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-l-8 border-secondary-teal">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-teal/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-secondary-teal/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-8 w-8 text-secondary-teal" />
                    </div>
                    <h3 className="text-3xl font-bold mb-6 text-neutral-dark">Our Mission</h3>
                    <p className="text-lg text-neutral-gray leading-relaxed">
                      To provide financial and technical support to civil society organizations in Tanzania towards increasing access to justice for all, in particular for women through legal empowerment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* Interactive Timeline */}
      <InteractiveTimeline />

      {/* Board Members Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Leadership Excellence
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Board of Directors
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-teal mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-neutral-gray">
              Our board provides strategic oversight and governance, ensuring LSF remains accountable to our mission and stakeholders.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {boardMembers.map((member) => (
              <Link key={member.id} to={`/board/${member.id}`} className="group block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30 group-hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-neutral-dark group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.position}</p>
                    <p className="text-neutral-gray text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                    <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-medium">View Profile</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/board">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary-teal hover:from-primary-dark hover:to-secondary-teal-dark">
                View Full Board
              </Button>
            </Link>
          </div>
        </div>
      </section>

       <ImpactHighlight />

      {/* Animated Stats Section */}
      <AnimatedStats />

      {/* Testimonial Carousel */}
      <TestimonialCarousel />

      {/* Core Values Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Our Core Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
              Guiding Principles
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary-teal mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-neutral-gray">
              At LSF, our work is guided by a set of core values that define our approach to increasing access to justice for all Tanzanians
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/30 group-hover:-translate-y-2">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-dark">Integrity</h3>
                <p className="text-neutral-gray leading-relaxed">
                  We are committed to the highest standards of honesty, transparency, and ethical behavior in all our work.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-secondary-teal/30 group-hover:-translate-y-2">
                <div className="bg-gradient-to-br from-secondary-teal/10 to-secondary-teal/5 p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-secondary-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-dark">Inclusion</h3>
                <p className="text-neutral-gray leading-relaxed">
                  We believe in equal rights and opportunities for all, particularly focusing on marginalized groups and women.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-secondary-orange/30 group-hover:-translate-y-2">
                <div className="bg-gradient-to-br from-secondary-orange/10 to-secondary-orange/5 p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Landmark className="h-8 w-8 text-secondary-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-dark">Accountability</h3>
                <p className="text-neutral-gray leading-relaxed">
                  We take responsibility for our actions and decisions, and maintain transparent processes in all our operations.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-secondary-yellow/30 group-hover:-translate-y-2">
                <div className="bg-gradient-to-br from-secondary-yellow/10 to-secondary-yellow/5 p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-secondary-yellow" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-dark">Innovation</h3>
                <p className="text-neutral-gray leading-relaxed">
                  We embrace creative approaches and innovative solutions to overcome barriers to justice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-secondary-teal relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Join Us in Our Mission</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Together, we can build a more just society where everyone has access to justice. Support our work through donations, partnerships, or by spreading awareness.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/donate">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                  Make a Donation
                </Button>
              </Link>
              <Link to="/partners">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl">
                  Become a Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
